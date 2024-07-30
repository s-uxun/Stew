# Generated by Django 5.0.7 on 2024-07-24 13:52

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('state', '0002_alter_stateedit_content_alter_stateedit_emoji'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AlterField(
            model_name='stateedit',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='states', to=settings.AUTH_USER_MODEL),
        ),
    ]
