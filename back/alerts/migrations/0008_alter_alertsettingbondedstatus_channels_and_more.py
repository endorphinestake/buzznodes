# Generated by Django 5.1.4 on 2025-02-07 04:22

import multiselectfield.db.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('alerts', '0007_alertsettingbondedstatus_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='alertsettingbondedstatus',
            name='channels',
            field=multiselectfield.db.fields.MultiSelectField(blank=True, choices=[('SMS', 'SMS'), ('VOICE', 'Voice')], max_length=10, null=True, verbose_name='Alert Channels'),
        ),
        migrations.AlterField(
            model_name='alertsettingbondedstatus',
            name='template_decraease',
            field=models.TextField(blank=True, null=True, verbose_name='Text Template for decrease (True to False)'),
        ),
        migrations.AlterField(
            model_name='alertsettingbondedstatus',
            name='template_increase',
            field=models.TextField(blank=True, null=True, verbose_name='Text Template for increase (False to True)'),
        ),
        migrations.AlterField(
            model_name='alertsettingcomission',
            name='channels',
            field=multiselectfield.db.fields.MultiSelectField(blank=True, choices=[('SMS', 'SMS'), ('VOICE', 'Voice')], max_length=10, null=True, verbose_name='Alert Channels'),
        ),
        migrations.AlterField(
            model_name='alertsettingcomission',
            name='template_decraease',
            field=models.TextField(blank=True, null=True, verbose_name='Text Template for decrease (True to False)'),
        ),
        migrations.AlterField(
            model_name='alertsettingcomission',
            name='template_increase',
            field=models.TextField(blank=True, null=True, verbose_name='Text Template for increase (False to True)'),
        ),
        migrations.AlterField(
            model_name='alertsettingjailedstatus',
            name='channels',
            field=multiselectfield.db.fields.MultiSelectField(blank=True, choices=[('SMS', 'SMS'), ('VOICE', 'Voice')], max_length=10, null=True, verbose_name='Alert Channels'),
        ),
        migrations.AlterField(
            model_name='alertsettingjailedstatus',
            name='template_decraease',
            field=models.TextField(blank=True, null=True, verbose_name='Text Template for decrease (True to False)'),
        ),
        migrations.AlterField(
            model_name='alertsettingjailedstatus',
            name='template_increase',
            field=models.TextField(blank=True, null=True, verbose_name='Text Template for increase (False to True)'),
        ),
        migrations.AlterField(
            model_name='alertsettingtombstonedstatus',
            name='channels',
            field=multiselectfield.db.fields.MultiSelectField(blank=True, choices=[('SMS', 'SMS'), ('VOICE', 'Voice')], max_length=10, null=True, verbose_name='Alert Channels'),
        ),
        migrations.AlterField(
            model_name='alertsettingtombstonedstatus',
            name='template_decraease',
            field=models.TextField(blank=True, null=True, verbose_name='Text Template for decrease (True to False)'),
        ),
        migrations.AlterField(
            model_name='alertsettingtombstonedstatus',
            name='template_increase',
            field=models.TextField(blank=True, null=True, verbose_name='Text Template for increase (False to True)'),
        ),
        migrations.AlterField(
            model_name='alertsettinguptime',
            name='channels',
            field=multiselectfield.db.fields.MultiSelectField(blank=True, choices=[('SMS', 'SMS'), ('VOICE', 'Voice')], max_length=10, null=True, verbose_name='Alert Channels'),
        ),
        migrations.AlterField(
            model_name='alertsettinguptime',
            name='template_decraease',
            field=models.TextField(blank=True, null=True, verbose_name='Text Template for decrease (True to False)'),
        ),
        migrations.AlterField(
            model_name='alertsettinguptime',
            name='template_increase',
            field=models.TextField(blank=True, null=True, verbose_name='Text Template for increase (False to True)'),
        ),
        migrations.AlterField(
            model_name='alertsettingvotingpower',
            name='channels',
            field=multiselectfield.db.fields.MultiSelectField(blank=True, choices=[('SMS', 'SMS'), ('VOICE', 'Voice')], max_length=10, null=True, verbose_name='Alert Channels'),
        ),
        migrations.AlterField(
            model_name='alertsettingvotingpower',
            name='template_decraease',
            field=models.TextField(blank=True, null=True, verbose_name='Text Template for decrease (True to False)'),
        ),
        migrations.AlterField(
            model_name='alertsettingvotingpower',
            name='template_increase',
            field=models.TextField(blank=True, null=True, verbose_name='Text Template for increase (False to True)'),
        ),
    ]
