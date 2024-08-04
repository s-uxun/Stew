# Generated by Django 5.0.7 on 2024-07-28 03:21

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0003_alter_interest_tag'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.RemoveField(
            model_name='hashtag',
            name='created_at',
        ),
        migrations.RemoveField(
            model_name='hashtag',
            name='user_id',
        ),
        migrations.AlterField(
            model_name='hashtag',
            name='hashtag',
            field=models.TextField(unique=True),
        ),
        migrations.AlterField(
            model_name='interest',
            name='created_at',
            field=models.DateField(verbose_name='date published'),
        ),
        migrations.CreateModel(
            name='WeekHashTag',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateField(verbose_name='date published')),
                ('hashtag', models.ManyToManyField(related_name='weekHashTag', to='home.hashtag')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='hashtags', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AlterField(
            model_name='interest',
            name='tag',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='tag_interests', to='home.weekhashtag'),
        ),
    ]
