# Generated by Django 5.1.4 on 2025-02-01 00:31

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('alerts', '0002_alter_alertsettingcomission_options_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='alertsettingvotingpower',
            name='value_to',
            field=models.IntegerField(blank=True, null=True, validators=[django.core.validators.MinValueValidator(100000), django.core.validators.MaxValueValidator(5000000)], verbose_name='Value to'),
        ),
    ]
