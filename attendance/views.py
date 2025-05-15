from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Student, StudentPhoto
from .serializers import StudentSerializer, StudentPhotoSerializer,StudentPhotoWithStudentSerializer


class StudentViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer

class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer

class StudentPhotoViewSet(viewsets.ModelViewSet):
    queryset = StudentPhoto.objects.all()
    serializer_class = StudentPhotoSerializer
    queryset = StudentPhoto.objects.select_related('student').all()
    serializer_class = StudentPhotoWithStudentSerializer


    def perform_create(self, serializer):
        # Get student ID from request data (you must send it from frontend)
        student_id = self.request.data.get('student')

        # Fetch student instance
        student = Student.objects.get(id=student_id)

        # Now assign it before saving, so upload_to works correctly
        serializer.save(student=student)

class StudentImagesListView(APIView):
    def get(self, request):
        data = []
        for student in Student.objects.all():
            photo_urls = [photo.image.url for photo in student.photos.all()]
            entry = [student.full_name] + photo_urls
            data.append(entry)
        return Response(data)