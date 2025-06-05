from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from attendance_check.models import Classe, Student, Attendance
from .serializers import (
    ClasseSerializer,
    StudentSerializer,
    AttendanceSerializer,
    MarkAttendanceSerializer,
    BatchRecognizeSerializer,
)
from django.shortcuts import get_object_or_404
from datetime import datetime

class ClasseViewSet(viewsets.ModelViewSet):
    queryset = Classe.objects.all()
    serializer_class = ClasseSerializer

class StudentViewSet(viewsets.ModelViewSet):
    serializer_class = StudentSerializer
    queryset = Student.objects.all()
    
    def get_queryset(self):
        queryset = super().get_queryset()
        classe_id = self.request.query_params.get('classe_id')
        if classe_id:
            queryset = queryset.filter(classe_id=classe_id)
        return queryset

class AttendanceViewSet(viewsets.ModelViewSet):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer

    @action(detail=False, methods=['post'])
    def mark(self, request):
        serializer = MarkAttendanceSerializer(data=request.data)
        if serializer.is_valid():
            first_name = serializer.validated_data['first_name']
            last_name = serializer.validated_data['last_name']

            try:
                student = Student.objects.get(first_name__iexact=first_name, last_name__iexact=last_name)
            except Student.DoesNotExist:
                return Response({"error": "Student not found."}, status=status.HTTP_404_NOT_FOUND)

            attendance, _ = Attendance.objects.get_or_create(student=student)
            now = datetime.now()
            new_entry = {
                "status": "present",
                "date": now.date().isoformat(),
                "time": now.time().strftime("%H:%M:%S"),
            }
            attendance.history.append(new_entry)
            attendance.save()

            student_data = StudentSerializer(student).data
            response_data = {
                "message": "Attendance marked successfully",
                "attendance": {
                    "id": attendance.id,
                    "student_details": student_data,
                    "date": new_entry["date"],
                    "time": new_entry["time"],
                    "status": new_entry["status"],
                    "history": attendance.history  # full JSONField list
                }
            }
            return Response(response_data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




    @action(detail=False, methods=['post'])
    def batch_recognize(self, request):
        serializer = BatchRecognizeSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        students = serializer.validated_data['students']
        marked = 0
        errors = []

        for student_data in students:
            first_name = student_data['first_name']
            last_name = student_data['last_name']

            try:
                student = Student.objects.get(first_name__iexact=first_name, last_name__iexact=last_name)
                attendance, created = Attendance.objects.get_or_create(student=student)
                now = datetime.now()
                attendance.history.append({
                    "status": "present",
                    "date": now.date().isoformat(),
                    "time": now.time().strftime("%H:%M:%S"),
                })
                attendance.save()
                marked += 1
            except Student.DoesNotExist:
                errors.append({
                    "error": "Student not found",
                    "first_name": first_name,
                    "last_name": last_name
                })

        return Response({
            "message": f"Marked attendance for {marked} students.",
            "errors": errors
        }, status=status.HTTP_200_OK)
