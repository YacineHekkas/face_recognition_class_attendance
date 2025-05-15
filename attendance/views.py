from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Student, StudentPhoto
from .serializers import StudentSerializer, StudentPhotoSerializer,StudentPhotoWithStudentSerializer


class StudentViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer

class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer

class StudentPhotoViewSet(viewsets.ModelViewSet):
    queryset = StudentPhoto.objects.select_related('student').all()
    serializer_class = StudentPhotoWithStudentSerializer
    parser_classes = (MultiPartParser, FormParser)

    def create(self, request, *args, **kwargs):
        student_id = request.data.get('student')

        if not student_id:
            return Response({"error": "Student ID is required."}, status=status.HTTP_400_BAD_REQUEST)

        # Get the list of images (either one or many)
        images = request.FILES.getlist('images')
        if not images:
            return Response({"error": "No images provided."}, status=status.HTTP_400_BAD_REQUEST)

        student = Student.objects.filter(id=student_id).first()
        if not student:
            return Response({"error": "Student not found."}, status=status.HTTP_404_NOT_FOUND)

        created_photos = []

        for image in images:
            photo = StudentPhoto(student=student, image=image)
            photo.save()
            created_photos.append(StudentPhotoWithStudentSerializer(photo, context={'request': request}).data)

        return Response(created_photos, status=status.HTTP_201_CREATED)

class StudentImagesListView(APIView):
    def get(self, request):
        data = []
        for student in Student.objects.all():
            photo_urls = [photo.image.url for photo in student.photos.all()]
            entry = [student.full_name] + photo_urls
            data.append(entry)
        return Response(data)