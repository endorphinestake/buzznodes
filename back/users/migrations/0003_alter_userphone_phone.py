# Generated by Django 5.1.4 on 2025-02-04 21:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0002_userphone'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userphone',
            name='phone',
            field=models.CharField(db_index=True, max_length=15, verbose_name='Phone Number'),
        ),
    ]
