from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User

from django.http import HttpResponseRedirect, HttpResponseBadRequest
from django.views.decorators.csrf import ensure_csrf_cookie
from django.shortcuts import render, get_object_or_404
from django.urls import reverse

from .models import UserConfiguration
from learning.models import Language, LearningLanguage, LanguageLevel, LanguageLevelCEFR

def login_view(request):
    """
    Logs the user in, or renders the login template.
    """
    if request.user.is_authenticated:
        return HttpResponseRedirect(reverse("index"))
    if request.method == "POST":
        username = request.POST["username"]
        password = request.POST["password"]

        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            try:
                next = request.session.pop("next", "")
                if next == "":
                    return HttpResponseRedirect(reverse("index"))
                return HttpResponseRedirect(next)
            except KeyError:
                return HttpResponseRedirect(reverse("menu"))
        return render(request, "accounts/login.html", {"message": "Invalid credentials. Please, try again."})
    next = request.GET.get("next", "")
    if not next == "":
        request.session["next"] = next
    return render(request, "accounts/login.html", {})

@ensure_csrf_cookie
def signup_view(request):
    """
    Signs the user up, given their desired credentials, or renders the signup template.
    """
    if request.user.is_authenticated:
        return HttpResponseRedirect(reverse("menu"))
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]
        password = request.POST["password"]
        password_confirm = request.POST["password_confirm"]

        native_language = request.POST["native_language"]
        learning_language = request.POST["learning_language"]
        learning_language_level = None
        learning_language_level_cefr = None
        show_cefr = None

        if native_language == learning_language:
            return HttpResponseBadRequest("You cannot select the same language in both fields.")

        if "learning_language_level" in request.POST and request.POST["use_level"] == "regular":
            if request.POST["learning_language_level"] in ["beginner", "intermediate", "advanced"]:
                learning_language_level = request.POST["learning_language_level"].lower()
                show_cefr = False
            else:
                return HttpResponseBadRequest("You submitted an unknown language level.")
        elif "learning_language_level_cefr" in request.POST and request.POST["use_level"] == "cefr":
            learning_language_level_cefr = request.POST["learning_language_level_cefr"]
            show_cefr = True
            if learning_language_level_cefr in ["A1", "A2", "a1", "a2"]:
                learning_language_level = "beginner"
            elif learning_language_level_cefr in ["B1", "B2", "b1", "b2"]:
                learning_language_level = "intermediate"
            elif learning_language_level_cefr in ["C1", "C2", "c1", "c2"]:
                learning_language_level = "advanced"
            else:
                return HttpResponseBadRequest("You submitted an unknown CEFR level.")
        else:
            return HttpResponseBadRequest("We couldn't process your request.")

        context = {
            "message": [],
        }
        username_check = None
        email_check = None

        # Check username
        try:
            username_check = User.objects.get(username=username)
        except User.DoesNotExist:
            username_check = None
        if username_check is not None:
            context["message"].append("Username already in use.")

        # Check email
        try:
            email_check = User.objects.get(email=email)
        except User.DoesNotExist:
            email_check = None
        if email_check is not None:
            context["message"].append("Email address already in use.")

        # Check password
        if not password == password_confirm:
            context["message"].append("The passwords don't match.")

        # Return message
        if context["message"] != []:
            return render(request, "accounts/signup.html", context)

        user = User.objects.create_user(username, email, password)
        settings = UserConfiguration.objects.create(
            user = user,
            native_language = get_object_or_404(Language, code=native_language),
            learning_language = LearningLanguage.objects.create(
                language = get_object_or_404(Language, code=learning_language),
                level = get_object_or_404(LanguageLevel, level=learning_language_level),
                level_cefr = get_object_or_404(LanguageLevelCEFR, level=learning_language_level_cefr) if learning_language_level_cefr is not None else None,
                show_cefr = show_cefr
            )
        )
        native_language = get_object_or_404(Language, code=native_language)
        learning_language = get_object_or_404(Language, code=learning_language)
        native_language.native_speakers += 1
        learning_language.learning_users += 1


        # Directly authenticated on signup to avoid annoying redirects to
        # the login page.
        u = authenticate(request, username=username, password=password)
        if u is not None:
            login(request, u)
            try:
                next = request.session.pop("next", "")
                if next == "":
                    return HttpResponseRedirect(reverse("index"))
                return HttpResponseRedirect(reverse(next))
            except KeyError:
                return HttpResponseRedirect(reverse("index"))
        return HttpResponseRedirect(reverse("login"))
    next = request.GET.get("next", "")
    if not next == "":
        request.session["next"] = next
    return render(request, "accounts/signup.html", {})

@login_required
def logout_view(request):
    """
    Logs the currently authenticated user out.
    """
    logout(request)
    return HttpResponseRedirect(reverse("index"))
