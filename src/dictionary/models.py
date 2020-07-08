from django.db import models
from django.contrib.auth.models import User

from learning.models import Language

class DictionaryTerm(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    lemma = models.CharField(max_length=120)
    language = models.ForeignKey(Language, on_delete=models.CASCADE)
    definition = models.TextField()
    etymology = models.TextField(null=True, blank=True)
    example_sent1 = models.CharField(max_length=500, verbose_name="Example Sentence 1", null=True, blank=True)
    example_sent2 = models.CharField(max_length=500, verbose_name="Example Sentence 2", null=True, blank=True)
    added_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.lemma} ({self.language.code})"

class Translation(models.Model):
    # A translation group usually spans throughout terms in several languages,
    # while a given term may have different translations, therefore, may belong
    # to several translation groups.
    terms = models.ManyToManyField(DictionaryTerm, related_name="translations")
    added_date = models.DateTimeField(auto_now_add=True)

class DictionaryReport(models.Model):
    PART_CHOICES = (
        ("lemma", "Term lemma"),
        ("definition", "Term definition"),
        ("etymology", "Term etymology"),
        ("example_sent1", "Example Sentence 1"),
        ("example_sent2", "Example Sentence 2")
    )

    REASON_CHOICES = (
        ("content_incorrect", "The content is incorrect."),
        ("content_inappropriate", "The content is inappropriate or NSFW."),
        ("content_spam", "The content is spam or misleading."),
        ("content_mistake", "The content contains grammatical/orthographic errors."),
        ("content_ambiguous", "The content is ambiguous"),
        ("content_other", "Other (custom).")
    )

    user = models.ForeignKey(User, on_delete=models.SET_NULL, related_name="dictionary_reports", null=True, blank=True)
    reason = models.CharField(max_length=50, choices=REASON_CHOICES)
    term = models.ForeignKey(DictionaryTerm, on_delete=models.CASCADE, related_name="reports")
    part = models.CharField(max_length=15, choices=PART_CHOICES)
    custom = models.TextField(null=True, blank=True)
    details = models.TextField(null=True, blank=True)
    submitted_time = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Dictionary Report by {self.user.username} ({self.submitted_time.strftime('%m/%d/%Y %H:%M')})"

class TranslationReport(models.Model):
    REASON_CHOICES = (
        ("content_incorrect", "The content is incorrect."),
        ("content_inappropriate", "The content is inappropriate or NSFW."),
        ("content_spam", "The content is spam or misleading."),
        ("content_mistake", "The content contains grammatical/orthographic errors."),
        ("content_ambiguous", "The content is ambiguous"),
        ("content_other", "Other (custom).")
    )

    user = models.ForeignKey(User, on_delete=models.SET_NULL, related_name="translation_reports", null=True, blank=True)
    reason = models.CharField(max_length=50, choices=REASON_CHOICES)
    custom = models.TextField(null=True, blank=True)
    details = models.TextField(null=True, blank=True)

    # Base Term and Translation Group separately, as a given term may point to
    # different translation groups, and in the same way, a translation group may
    # point to different terms.
    base_term = models.ForeignKey(DictionaryTerm, on_delete=models.SET_NULL, related_name="translation_reports", null=True, blank=True)
    target_term = models.ForeignKey(DictionaryTerm, on_delete=models.CASCADE, related_name="reported_translation")
    translation_group = models.ForeignKey(Translation, on_delete=models.CASCADE)

    submitted_time = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Translation Report by {self.user.username} ({self.submitted_time.strftime('%m/%d/%Y %H:%M')})"
