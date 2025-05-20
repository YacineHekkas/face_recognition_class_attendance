from rest_framework import serializers
from attendance_check.models import Classe, Student, Attendance
from datetime import datetime

class ClasseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Classe
        fields = '__all__'

class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = '__all__'

class AttendanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attendance
        fields = ['id', 'student', 'history']

class HistoryEntrySerializer(serializers.Serializer):
    status = serializers.CharField()
    date = serializers.DateField()
    time = serializers.TimeField()

class MarkAttendanceSerializer(serializers.Serializer):
    first_name = serializers.CharField()
    last_name = serializers.CharField()

class StudentNameSerializer(serializers.Serializer):
    first_name = serializers.CharField()
    last_name = serializers.CharField()

class BatchRecognizeSerializer(serializers.Serializer):
    students = StudentNameSerializer(many=True)
