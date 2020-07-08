from django.contrib.auth.models import User
from django.db import models

from learning.models import Language, LearningLanguage

class UserConfiguration(models.Model):
    """Additional settings for a given user."""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="settings")
    dcontrib = models.IntegerField(default=0, verbose_name="Dictionary contributions") # Dictionary contributions (additions, edits...)
    rcontrib = models.IntegerField(default=0, verbose_name="Resource contributions") # Resource contributions (additions, edits...)
    points = models.IntegerField(default=0) # Popularity? -- Same as Reddit's karma points.
    native_language = models.ForeignKey(Language, on_delete=models.PROTECT, related_name="natives")
    learning_language = models.ForeignKey(LearningLanguage, on_delete=models.PROTECT, related_name="learners")

    def __str__(self):
        return f"Configuration for {self.user.username}"
