from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User

from django.http import JsonResponse, HttpResponseRedirect, HttpResponseBadRequest
from django.views.decorators.csrf import ensure_csrf_cookie
from django.shortcuts import render, get_object_or_404
from django.urls import reverse

from accounts.models import UserConfiguration
from dictionary.models import DictionaryTerm
# from resources.models import Resource
from .models import Language, LearningLanguage, LanguageLevel, LanguageLevelCEFR

def index_view(request):
    if request.user.is_authenticated:
        return HttpResponseRedirect(reverse("browse"))
    return render(request, "learning/index.html", {"language_count": Language.objects.count()})

@ensure_csrf_cookie
@login_required
def browse_view(request):
    if not request.user.is_authenticated:
        return HttpResponseRedirect(reverse("index"))
    context = {
        "terms": DictionaryTerm.objects.filter(language=request.user.settings.learning_language.language).order_by('-added_date')[:5],
        # resources: Resource.objects.filter(language=request.user.settings.learning_language.language).order_by('-added_date')[:5],
    }
    return render(request, "learning/browse.html", context)

def profile_view(request, username):
    user = get_object_or_404(User, username=username)
    context = {
        "profile": user,
        "its_me": user == request.user
    }
    return render(request, "learning/profile.html", context)

@ensure_csrf_cookie
@login_required
def settings_view(request):
    if not request.method == "POST":
        if not request.user.is_authenticated:
            return HttpResponseRedirect(reverse("index"))
        return render(request, "learning/settings.html", {})
    email = None
    native_language = None
    learning_language = None
    try:
        email = request.POST["email"]
        native_language = request.POST["native_language"]
        learning_language = request.POST["learning_language"]
    except KeyError:
        return HttpResponseBadRequest("Nope.")

    if request.user.email != email: # Email cannot be changed (by now)
        return JsonResponse({"response": "emailchanged"})
    if native_language == learning_language: # Native language and learning language cannot be the same
        return JsonResponse({"response": "samelanguage"})
    if (request.user.email == email and
        request.user.settings.native_language.code == native_language and
        request.user.settings.learning_language.language.code == learning_language): # Nothing changed here!
        return JsonResponse({"response": "nochange"})

    if request.user.settings.native_language.code != native_language:
        request.user.settings.native_language = get_object_or_404(Language, code=native_language)
    if request.user.settings.learning_language.language.code != learning_language:
        request.user.settings.learning_language.language = get_object_or_404(Language, code=learning_language)
    request.user.save()
    request.user.settings.save()
    request.user.settings.learning_language.save()
    return JsonResponse({"response": "success"})

""" API STUFF """
# TEMP: API views will be moved into an 'api' app.

def api_get_languages_view(request):
    if not request.method == "POST":
        return HttpResponseRedirect(reverse("index"))
    languages = Language.objects.order_by('name').all()
    payload = []
    for language in languages:
        payload.append({
            'name': language.name,
            'code': language.code,
            'filename': language.flag_filename()
        })
    return JsonResponse(payload, safe=False)

def api_browse_data_view(request):
    if not request.method == "POST":
        return HttpResponseRedirect(reverse("index"))
    if not request.user.is_authenticated:
        return JsonResponse({
            "success": False,
            "noauth": True
        })
    try:
        payload = {
            "success": True,
            "username": request.user.username,
            "learning_language": {
                "code": request.user.settings.learning_language.language.code,
                "name": request.user.settings.learning_language.language.name,
                "filename": request.user.settings.learning_language.language.flag_filename()
            },
            "native_language": {
                "code": request.user.settings.native_language.code,
                "name": request.user.settings.native_language.name,
                "filename": request.user.settings.native_language.flag_filename()
            },
            "terms": []
        }

        terms = DictionaryTerm.objects.filter(language=request.user.settings.learning_language.language).order_by('-added_date')[:5]
        for term in terms:
            payload["terms"].append({
                "id": term.id,
                "lemma": term.lemma,
                "added_date": term.added_date
            })
    except:
        return JsonResponse({
            "success": False,
            "error_code": 500,
            "error_message": "Internal Server Error"
        })

    return JsonResponse(payload)

def api_user_view(request):
    if not request.method == "POST":
        return HttpResponseRedirect(reverse("index"))

    user = None
    try:
        username = request.POST["u"]
        user = User.objects.get(username=username)
    except KeyError:
        if not request.user.is_authenticated:
            return JsonResponse({
                "success": False,
                "noauth": True
            })
        user = request.user
    try:
        payload = {
            "success": True,
            "self": request.user == user,
            "id": user.id,
            "username": user.username,
            "date_joined": user.date_joined.strftime('%m/%d/%Y %H:%M'),
            "settings": {
                "points": user.settings.points,
                "dcontrib": user.settings.dcontrib,
                "rcontrib": user.settings.rcontrib,
                "learning_language": {
                    "code": user.settings.learning_language.language.code,
                    "name": user.settings.learning_language.language.name,
                    "filename": user.settings.learning_language.language.flag_filename(),
                    "level": user.settings.learning_language.level.level,
                    "level_cefr": user.settings.learning_language.level_cefr.level if user.settings.learning_language.show_cefr else None
                },
                "native_language": {
                    "code": user.settings.native_language.code,
                    "name": user.settings.native_language.name,
                    "filename": user.settings.native_language.flag_filename()
                }
            }
        }
        if payload["self"]:
            payload["email"] = user.email
    except User.DoesNotExist:
        return JsonResponse({
            "success": False,
            "error_code": 404,
            "error_message": f"User '{username}' was not found."
        })
    except:
        return JsonResponse({
            "success": False,
            "error_code": 500,
            "error_message": "Internal Server Error"
        })

    return JsonResponse(payload)
