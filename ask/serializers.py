from rest_framework import serializers
from .models import *

class QuestionSerializerCreate(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ['question','anonymous','asked']


class QuestionSerializerList(serializers.ModelSerializer):
    asker = serializers.CharField(source='asker.user.username')
    asked = serializers.CharField(source='asked.user.username')
    class Meta:
        model = Question
        fields = ['question','anonymous','answer','asker','asked']

class ProfileSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(source='user.first_name')
    last_name = serializers.CharField(source='user.last_name')
    username = serializers.CharField(source='user.username')
    class Meta:
        model = Profile
        fields = ['first_name', 'last_name', 'username', 'icon', 'background']



