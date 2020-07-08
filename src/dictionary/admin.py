from django.contrib import admin

from .models import DictionaryTerm, Translation, DictionaryReport, TranslationReport

class TranslationInline(admin.StackedInline):
    model = Translation.terms.through

class DictionaryTermAdmin(admin.ModelAdmin):
    inlines = [TranslationInline]

admin.site.register(DictionaryTerm, DictionaryTermAdmin)
admin.site.register(Translation)
admin.site.register(DictionaryReport)
admin.site.register(TranslationReport)
