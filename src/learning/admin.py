from django.contrib import admin

from .models import Language, LanguageLevel, LanguageLevelCEFR, LearningLanguage

admin.site.register(Language)
admin.site.register(LanguageLevel)
admin.site.register(LanguageLevelCEFR)
admin.site.register(LearningLanguage)
