# Generated by Django 5.1.4 on 2025-02-18 10:34

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('alerts', '0015_alertsettingbondedstatus_template_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='alertsettingbondedstatus',
            name='template_decraease',
        ),
        migrations.RemoveField(
            model_name='alertsettingbondedstatus',
            name='template_increase',
        ),
        migrations.RemoveField(
            model_name='alertsettingcomission',
            name='template_decraease',
        ),
        migrations.RemoveField(
            model_name='alertsettingcomission',
            name='template_increase',
        ),
        migrations.RemoveField(
            model_name='alertsettingjailedstatus',
            name='template_decraease',
        ),
        migrations.RemoveField(
            model_name='alertsettingjailedstatus',
            name='template_increase',
        ),
        migrations.RemoveField(
            model_name='alertsettingtombstonedstatus',
            name='template_decraease',
        ),
        migrations.RemoveField(
            model_name='alertsettingtombstonedstatus',
            name='template_increase',
        ),
        migrations.RemoveField(
            model_name='alertsettinguptime',
            name='template_decraease',
        ),
        migrations.RemoveField(
            model_name='alertsettinguptime',
            name='template_increase',
        ),
        migrations.RemoveField(
            model_name='alertsettingvotingpower',
            name='template_decraease',
        ),
        migrations.RemoveField(
            model_name='alertsettingvotingpower',
            name='template_increase',
        ),
    ]
