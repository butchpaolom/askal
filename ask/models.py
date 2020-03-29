from django.db import models
from users.models import Profile
# Create your models here.



#For Question-Post request, the asked id is included in the Client side code
class Question(models.Model):
    question = models.TextField(blank=False)
    anonymous = models.BooleanField(default=True)
    asker = models.ForeignKey(Profile, on_delete=models.CASCADE, null=True, related_name='asker')
    asked = models.ForeignKey(Profile, on_delete=models.CASCADE, null=True, related_name='asked')
    answer = models.TextField(blank=True)

    def __str__(self):
        return str(self.id)




