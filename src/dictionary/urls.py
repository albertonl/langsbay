from django.urls import path

from . import views

urlpatterns = [
    path("", views.index_view, name="dictionary"),
    path("add/", views.dictionary_add_view, name="dictionary_add"),

    # API
    path("autocomplete/", views.api_dictionary_autocomplete, name="dictionary_autocomplete"),
    path("check/lemma/", views.api_check_lemma_view, name="check_lemma"),
    path("update_term/", views.api_update_term_view, name="update_term"),
    path("report/", views.api_report_view, name="report_term"),

    # LANG
    path("<str:lang>/", views.dictionary_language_view, name="dictionary_lang"),
    path("<str:lang>/term/<int:id>/", views.dictionary_term_view, name="dictionary_term"),
]
