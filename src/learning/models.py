import os

from django.contrib.auth.models import User
from django.db import models

class Language(models.Model):
    name = models.CharField(max_length=70)
    code = models.CharField(max_length=2, verbose_name="ISO 639-1 code", help_text="Language codes must use the ISO 639-1 standard for two-letter language codes (e.g. 'en' for English).")
    native_speakers = models.IntegerField(default=0)
    learning_users = models.IntegerField(default=0)
    flag = models.FileField(upload_to='learning/static/learning/img/flags/', help_text="Images must be in SVG format and, if possible, under the filename CODE.svg, where CODE represents the corresponding ISO 639-1 code.")

    def flag_filename(self):
        return os.path.basename(self.flag.name)

    def __str__(self):
        return f"{self.name} ({self.code})"

class LanguageLevel(models.Model):
    LEVEL_CHOICES = (
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced')
    )

    level = models.CharField(max_length=15, choices=LEVEL_CHOICES)

    def __str__(self):
        return self.level.capitalize()

class LanguageLevelCEFR(models.Model):
    CEFR_CHOICES = (
        ('A1', 'A1'),
        ('A2', 'A2'),
        ('B1', 'B1'),
        ('B2', 'B2'),
        ('C1', 'C1'),
        ('C2', 'C2')
    )

    level = models.CharField(max_length=2, choices=CEFR_CHOICES)

    def __str__(self):
        return self.level.upper()

class LearningLanguage(models.Model):
    language = models.ForeignKey(Language, on_delete=models.PROTECT, related_name="learning")
    level = models.ForeignKey(LanguageLevel, on_delete=models.PROTECT, related_name="applied_in")
    level_cefr = models.ForeignKey(LanguageLevelCEFR, on_delete=models.PROTECT, related_name="applied_in", null=True, blank=True)
    show_cefr = models.BooleanField()

    def __str__(self):
        return f"{self.language.name} ({self.level_cefr.level + ' ' if self.level_cefr is not None else ''}{self.level})"
