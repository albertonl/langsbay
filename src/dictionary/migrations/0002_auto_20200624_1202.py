# Generated by Django 3.0.7 on 2020-06-24 10:02

import datetime
from django.db import migrations, models
from django.utils.timezone import utc
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('dictionary', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='dictionaryterm',
            name='added_date',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='translation',
            name='added_date',
            field=models.DateTimeField(auto_now_add=True, default=datetime.datetime(2020, 6, 24, 10, 2, 33, 509051, tzinfo=utc)),
            preserve_default=False,
        ),
    ]
