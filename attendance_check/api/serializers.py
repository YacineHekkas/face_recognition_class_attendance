from rest_framework import serializers
from attendance_check.models import Classe, Student, Attendance

class ClasseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Classe
        fields = '__all__'

class StudentSerializer(serializers.ModelSerializer):
    class_name = serializers.CharField(source='classe.name', read_only=True)
    
    class Meta:
        model = Student
        fields = ['id', 'matricule', 'first_name', 'last_name', 'classe', 'class_name']

class AttendanceSerializer(serializers.ModelSerializer):
    student_details = StudentSerializer(source='student', read_only=True)
    
    class Meta:
        model = Attendance
        fields = ['id', 'student', 'student_details', 'date', 'time', 'status']
        extra_kwargs = {
            'student': {'write_only': True}
        }

class MarkAttendanceSerializer(serializers.Serializer):
    matricule = serializers.CharField(max_length=20)
    date = serializers.DateField()
    time = serializers.TimeField()
    status = serializers.ChoiceField(choices=['present', 'absent'])

class TextRecognitionSerializer(serializers.Serializer):
    first_name = serializers.CharField(max_length=100)
    last_name = serializers.CharField(max_length=100)
    date = serializers.DateField()
    time = serializers.TimeField()