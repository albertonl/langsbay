from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User

from django.http import JsonResponse, HttpResponseRedirect, HttpResponseBadRequest
from django.views.decorators.csrf import ensure_csrf_cookie
from django.shortcuts import render, get_object_or_404
from django.utils.html import escape
from django.urls import reverse

from accounts.models import UserConfiguration
from learning.models import Language, LearningLanguage, LanguageLevel, LanguageLevelCEFR
from .models import DictionaryTerm, Translation, DictionaryReport, TranslationReport

@login_required
def index_view(request):
    return render(request, "dictionary/index.html", {})

@login_required
@ensure_csrf_cookie
def dictionary_language_view(request, lang):
    if request.GET.get("q"):
        response = None
        q = request.GET.get("q")
        try:
            response = DictionaryTerm.objects.get(language=get_object_or_404(Language, code=lang),lemma=q)
        except DictionaryTerm.DoesNotExist:
            try:
                response = DictionaryTerm.objects.filter(lemma__icontains=q)[:10]
                if len(response) == 0:
                    raise DictionaryTerm.DoesNotExist
            except DictionaryTerm.DoesNotExist:
                return render(request, "dictionary/dictionary_results.html", {
                    "status": "no_results",
                    "message": "Your query did not return any results.",
                    "query": escape(q),
                    "language": get_object_or_404(Language, code=lang)
                })
            return render(request, "dictionary/dictionary_results.html", {
                "status": "found_results",
                "terms": response,
                "query": escape(q),
                "language": get_object_or_404(Language, code=lang)
            })
        return HttpResponseRedirect(reverse("dictionary_term", kwargs={'lang': lang, 'id': response.id}))

    return render(request, "dictionary/dictionary_lang.html", {
        "language": get_object_or_404(Language, code=lang)
    })

@login_required
@ensure_csrf_cookie
def dictionary_term_view(request, lang, id):
    return render(request, "dictionary/dictionary_term.html", {
        "term": get_object_or_404(DictionaryTerm, language=get_object_or_404(Language, code=lang), id=id)
    })

@login_required
def dictionary_add_view(request):
    if not request.method == "POST":
        return render(request, "dictionary/dictionary_add.html", {})
    data = {
        "language": None,
        "lemma": None,
        "definition": None,
        "etymology": None,
        "example_sent1": None,
        "example_sent2": None,
        "translation": None
    }

    data["language"] = escape(request.POST["language"])
    data["lemma"] = escape(request.POST["lemma"])
    data["definition"] = escape(request.POST["definition"])

    for key in data:
        if key in ["language", "lemma", "definition"]:
            continue
        try:
            data[key] = escape(request.POST[key]) if not key == "translation" else int(escape(request.POST[key])) if escape(request.POST[key]) != '' else None
        except KeyError:
            data[key] = None

    term = DictionaryTerm.objects.create(
        user = request.user,
        lemma = data["lemma"],
        language = get_object_or_404(Language, code=data["language"]),
        definition = data["definition"],
        etymology = data["etymology"],
        example_sent1 = data["example_sent1"],
        example_sent2 = data["example_sent2"]
    )

    if data["translation"] is not None:
        translation = get_object_or_404(DictionaryTerm, pk=data["translation"])

        if translation.language == term.language:
            return HttpResponseBadRequest("You cannot submit a translation in the same language as the lemma. The lemma has been saved without the translation.")
        if not translation.translations.all():
            tgroup = Translation()
            tgroup.save()
            tgroup.terms.add(term.id,translation.id)
            tgroup.save()
        else:
            for t in translation.translations.all():
                t.terms.add(term)
                t.save()

    # Add points to user
    request.user.settings.dcontrib += 1
    request.user.settings.points += 1000
    for key in data:
        if data[key] is not None:
            request.user.settings.points += 100
    request.user.settings.save()

    return HttpResponseRedirect(reverse("dictionary_term", kwargs={"lang": term.language.code, "id": term.id}))

""" API """

@login_required
def api_dictionary_autocomplete(request):
    lang = request.GET.get('lang');
    term = request.GET.get('term');

    payload = []
    response = None
    try:
        response = DictionaryTerm.objects.filter(language=Language.objects.get(code=lang), lemma__icontains=term)[:5]
    except Language.DoesNotExist:
        return JsonResponse({"success": False, "error": f"Language {lang} does not exist."})
    except DictionaryTerm.DoesNotExist:
        pass

    for item in response:
        payload.append(item.lemma)

    return JsonResponse(payload, safe=False)

@login_required
def api_check_lemma_view(request):
    if not request.method == "POST":
        return HttpResponseRedirect(reverse("dictionary_add"))
    lang = escape(request.POST["lang"])
    term = escape(request.POST["term"])

    lemma = None
    try:
        lemma = DictionaryTerm.objects.get(language=get_object_or_404(Language, code=lang), lemma=term)
    except DictionaryTerm.DoesNotExist:
        return JsonResponse({
            "status": "term_available"
        })
    return JsonResponse({
        "status": "term_exists",
        "id": lemma.id,
        "lemma": lemma.lemma,
        "language": lemma.language.code,
        "language_name": lemma.language.name,
        "flag_filename": lemma.language.flag_filename()
    })

@login_required
def api_update_term_view(request):
    if not request.method == "POST":
        return HttpResponseRedirect(reverse("dictionary"))
    try:
        id = int(escape(request.POST["id"]))
        part = escape(request.POST["part"])
        new = escape(request.POST["new"])
    except KeyError:
        return JsonResponse({"success": False})

    try:
        term = DictionaryTerm.objects.get(pk=id)
    except DictionaryTerm.DoesNotExist:
        return JsonResponse({"success": False})

    if part == "lemma":
        term.lemma = new
    elif part == "definition":
        term.definition = new
    elif part == "etymology":
        term.etymology = new
    elif part == "example_sent1":
        term.example_sent1 = new
    elif part == "example_sent2":
        term.example_sent2 = new
    elif part == "translation":
        try:
            old = int(escape(request.POST["old"]))
            lang = request.POST["lang"]
        except KeyError:
            return JsonResponse({"success": False})
        try:
            o = DictionaryTerm.objects.get(pk=old)
            n = DictionaryTerm.objects.get(language=Language.objects.get(code=lang), lemma=new)
        except DictionaryTerm.DoesNotExist:
            return JsonResponse({"success": False})
        except Language.DoesNotExist:
            return JsonResponse({"success": False})
        for t in term.translations.all():
            t.terms.remove(o)
            t.terms.add(n)
            t.save()
            break

    request.user.settings.points += 50
    request.user.settings.save()
    term.save()

    return JsonResponse({"success": True})

@login_required
def api_report_view(request):
    if not request.method == "POST":
        return HttpResponseRedirect(reverse("dictionary"))
    try:
        id = int(escape(request.POST["id"]))
        part = escape(request.POST["part"])
        reason = escape(request.POST["reason"])
    except KeyError:
        return JsonResponse({"success": False})
    try:
        details = escape(request.POST["details"]) if escape(request.POST["details"]) != "" else None
    except KeyError:
        details = None
    custom = None

    if reason == "content_other":
        try:
            custom = escape(request.POST["custom"])
        except KeyError:
            return JsonResponse({"success": False})

    if part != "translation":
        try:
            DictionaryReport.objects.create(
                user = request.user,
                reason = reason,
                term = DictionaryTerm.objects.get(pk=id),
                part = part,
                custom = custom,
                details = details
            )
        except DictionaryTerm.DoesNotExist:
            return JsonResponse({"success": False})
    else:
        try:
            target = int(escape(request.POST["target"]))
            base_term = DictionaryTerm.objects.get(pk=id)
            target_term = DictionaryTerm.objects.get(pk=target)
            tgroup = None
            for base_t in base_term.translations.all():
                for target_t in target_term.translations.all():
                    if base_t == target_t:
                        tgroup = base_t
                    else:
                        raise RuntimeError('Translation groups not co-related.')
                    break
                break

            TranslationReport.objects.create(
                user = request.user,
                reason = reason,
                custom = custom,
                details = details,
                base_term = base_term,
                target_term = target_term,
                translation_group = tgroup
            )
        except:
            return JsonResponse({"success": False})

    # Add points to user and return {"success": True}
    request.user.settings.points += 100
    request.user.settings.save()
    return JsonResponse({"success": True})
