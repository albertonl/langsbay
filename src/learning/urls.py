from django.urls import path

from . import views

urlpatterns = [
    path("", views.index_view, name="index"),
    path("browse/", views.browse_view, name="browse"),
    path("settings/", views.settings_view, name="settings"),
    path("u/<str:username>/", views.profile_view, name="user"),
    path("vuetest/", views.vuetest_view, name="vuetest"),

    # API
    path("get/languages/", views.api_get_languages_view, name="getlangs"),
    path("api/browse_data/", views.api_browse_data_view, name="browse_data"),
    path("api/user/", views.api_user_view, name="user_data")
]
