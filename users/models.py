from django.db import models
from django.contrib.auth.models import User
from PIL import Image
import uuid
# Create your models here.

class Profile(models.Model):
    user = models.OneToOneField(User,  related_name='profile', on_delete=models.CASCADE)
    icon = models.ImageField(default='default.jpg')
    background = models.ImageField(default='background.jpg')
    following = models.ManyToManyField("self", blank=True, symmetrical=False)

    def save(self, *args, **kwargs):
        super(Profile, self).save(*args, **kwargs)

        icon = Image.open(self.icon.path)

        if icon.height > 300 or icon.width > 300:
            output_size = (300, 300)
            icon.thumbnail(output_size)
            icon.save(self.icon.path)
    
    def __str__(self):
        return str(self.user)
