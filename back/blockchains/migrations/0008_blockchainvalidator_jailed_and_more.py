# Generated by Django 5.1.4 on 2025-01-15 16:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('blockchains', '0007_blockchainvalidator_status'),
    ]

    operations = [
        migrations.AddField(
            model_name='blockchainvalidator',
            name='jailed',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='blockchainvalidator',
            name='pubkey_key',
            field=models.CharField(default='', max_length=255, verbose_name='Consensus pubkey key'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='blockchainvalidator',
            name='pubkey_type',
            field=models.CharField(default='', max_length=255, verbose_name='Consensus pubkey @type'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='blockchainvalidator',
            name='status',
            field=models.SlugField(choices=[('BOND_STATUS_UNSPECIFIED', 'BOND_STATUS_UNSPECIFIED'), ('BOND_STATUS_BONDED', 'BOND_STATUS_BONDED'), ('BOND_STATUS_UNBONDED', 'BOND_STATUS_UNBONDED'), ('BOND_STATUS_UNBONDING', 'BOND_STATUS_UNBONDING')], default='BOND_STATUS_BONDED', max_length=25),
        ),
    ]
