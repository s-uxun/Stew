from django.db import models
from django.conf import settings

# Create your models here.
class StateEdit(models.Model):
    content = models.CharField(max_length=50, blank=True)
    emoji = models.TextField(blank = True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE
                             , related_name='states') 
    
    def __str__(self):
        return f"{self.content}, {self.emoji}"
