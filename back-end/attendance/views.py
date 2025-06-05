import os
import json
import sys

from django.conf import settings
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
import subprocess
from .models import StudentPhoto
from attendance_check.models import Student, Classe  # ✅ Import Classe properly
from .serializers import StudentSerializer, StudentPhotoSerializer, StudentPhotoWithStudentSerializer


class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer


class StudentPhotoViewSet(viewsets.ModelViewSet):
    queryset = StudentPhoto.objects.select_related('student').all()
    serializer_class = StudentPhotoWithStudentSerializer
    parser_classes = (MultiPartParser, FormParser)

    def create(self, request, *args, **kwargs):
        student_id = request.data.get('student')
        images = request.FILES.getlist('images')

        if not student_id or not images:
            return Response({"error": "Student ID and images are required."}, status=400)

        student = Student.objects.filter(id=student_id).first()
        if not student:
            return Response({"error": "Student not found."}, status=404)


        created_photos = []

        for image in images:
            photo = StudentPhoto(student=student, image=image)
            photo.save()
            created_photos.append(StudentPhotoWithStudentSerializer(photo, context={'request': request}).data)

        # Now gather all students and their image paths for retraining
        training_inputs = []

        all_students = Student.objects.prefetch_related('photos').all()
        for stu in all_students:
            photo_paths = [photo.image.path for photo in stu.photos.all() if photo.image]
            if photo_paths:
                training_inputs.append({
                    "name": f"{stu.first_name} {stu.last_name}",
                    "images": photo_paths
                })

        # Call training script with all students' data
        script_path = os.path.join(settings.BASE_DIR, "train.py")
        subprocess.Popen([sys.executable, script_path, json.dumps(training_inputs)])

        return Response(created_photos, status=201)


class StudentImagesListView(APIView):
    def get(self, request):
        data = []
        for student in Student.objects.all():
            photo_urls = [photo.image.url for photo in student.photos.all()]
            full_name = f"{student.first_name} {student.last_name}"  # 👈 construct manually
            entry = [full_name] + photo_urls
            data.append(entry)
        return Response(data)
