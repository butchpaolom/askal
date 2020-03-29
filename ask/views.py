from django.shortcuts import render

from rest_framework import permissions
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from rest_framework import exceptions
from rest_framework.views import APIView

from .serializers import *
from .models import *
from .threader import *




# Create your views here.
class ProfileSelfView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = ProfileSerializer(Profile.objects.get(id=self.request.user.profile.id))
        return Response(serializer.data)

class ValidateToken(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        return Response({'detail':True})

class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializerList

    def get_serializer_class(self):
        if self.action == 'list':
            return QuestionSerializerList
        if self.action == 'create':
            return QuestionSerializerCreate
        return serializers.Default

    def get_permissions(self):
        if self.action == 'create':
            permission_classes = [permissions.AllowAny]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]

    def create(self, request, *args, **kwargs):
        print(request.data)
        serializer = QuestionSerializerCreate(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        if serializer.validated_data['anonymous'] == False:
            if request.user.id == None:
                raise exceptions.NotAuthenticated
            else:
                question_object = serializer.save()
                question_object.asker = Profile.objects.get(id=request.user.profile.id)
                question_object.save()
    
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def list(self, request, *args, **kwargs):
        aprint(dir(request.user))
        user = Profile.objects.get(id=request.user.profile.id).following.all()
        questions = Question.objects.filter(asked__user__profile__in=user).exclude(answer='')
        print(questions)
        queryset = self.filter_queryset(questions)
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(data=request.data)
            return self.get_paginated_response(serializer.data)

        serializer = QuestionSerializerList(queryset, many=True)

        return Response(serializer.data)

def aprint(string):
    for each in string:
        print(each)