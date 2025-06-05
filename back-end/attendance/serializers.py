from rest_framework import serializers
from .models import Student, StudentPhoto
from attendance_check.models import Classe  # ✅ Needed for nested class if you want it

class StudentPhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentPhoto
        fields = ['id', 'image', 'thumbnail', 'uploaded_at']
        read_only_fields = ['thumbnail', 'uploaded_at']


class StudentSerializer(serializers.ModelSerializer):
    photos = StudentPhotoSerializer(many=True, read_only=True)

    class Meta:
        model = Student
        fields = ['id', 'first_name', 'last_name', 'full_name', 'matricule', 'classe', 'photos']
        read_only_fields = ['full_name']  # ✅ full_name is likely a @property in model


class StudentPhotoWithStudentSerializer(serializers.ModelSerializer):
    student = serializers.PrimaryKeyRelatedField(queryset=Student.objects.all())  # ✅ allows referencing by ID

    class Meta:
        model = StudentPhoto
        fields = ['id', 'image', 'thumbnail', 'uploaded_at', 'student']
        read_only_fields = ['thumbnail', 'uploaded_at']
