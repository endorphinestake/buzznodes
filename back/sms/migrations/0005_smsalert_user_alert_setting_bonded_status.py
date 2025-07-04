# Generated by Django 5.1.4 on 2025-02-07 00:24

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('alerts', '0007_alertsettingbondedstatus_and_more'),
        ('sms', '0004_alter_smsalert_status_alter_smsconfirm_code_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='smsalert',
            name='user_alert_setting_bonded_status',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='user_alert_setting_bonded_status_sms', to='alerts.useralertsettingbondedstatus', verbose_name='User Alert Setting Bonded Status'),
        ),
    ]
