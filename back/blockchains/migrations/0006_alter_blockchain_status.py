# Generated by Django 5.1.4 on 2025-01-11 20:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('blockchains', '0005_blockchainurl_name'),
    ]

    operations = [
        migrations.AlterField(
            model_name='blockchain',
            name='status',
            field=models.BooleanField(db_index=True, default=True, verbose_name='Status'),
        ),
    ]
