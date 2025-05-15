from rest_framework import serializers
from .models import Student, StudentPhoto

class StudentPhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentPhoto
        fields = ['id', 'image', 'thumbnail', 'uploaded_at']
        read_only_fields = ['thumbnail', 'uploaded_at']

class StudentSerializer(serializers.ModelSerializer):
    photos = StudentPhotoSerializer(many=True, read_only=True)

    class Meta:
        model = Student
        fields = ['id', 'full_name', 'last_name', 'matricule', 'photos']

class StudentPhotoWithStudentSerializer(serializers.ModelSerializer):
    student = serializers.StringRelatedField()  # or use a nested serializer

    class Meta:
        model = StudentPhoto
        fields = ['id', 'image', 'thumbnail', 'uploaded_at', 'student']
