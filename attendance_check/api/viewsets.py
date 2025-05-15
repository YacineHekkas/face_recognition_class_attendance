from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from attendance_check.models import Classe, Student, Attendance
from .serializers import (
    ClasseSerializer,
    StudentSerializer,
    AttendanceSerializer,
    MarkAttendanceSerializer,
    TextRecognitionSerializer
)
from django.shortcuts import get_object_or_404

class ClasseViewSet(viewsets.ModelViewSet):
    queryset = Classe.objects.all()  # Required for basename
    serializer_class = ClasseSerializer

class StudentViewSet(viewsets.ModelViewSet):
    serializer_class = StudentSerializer
    queryset = Student.objects.all()  # Required for basename
    
    def get_queryset(self):
        queryset = super().get_queryset()  # Now uses the class queryset
        classe_id = self.request.query_params.get('classe_id')
        if classe_id:
            queryset = queryset.filter(classe_id=classe_id)
        return queryset

class AttendanceViewSet(viewsets.ModelViewSet):
    serializer_class = AttendanceSerializer
    queryset = Attendance.objects.select_related('student__classe')  # Required for basename
    
    def get_queryset(self):
        queryset = super().get_queryset()  # Now uses the class queryset
        date = self.request.query_params.get('date')
        classe_id = self.request.query_params.get('classe_id')
        
        if date:
            queryset = queryset.filter(date=date)
        if classe_id:
            queryset = queryset.filter(student__classe_id=classe_id)
            
        return queryset
    
    @action(detail=False, methods=['post'])
    def mark_attendance(self, request):
        """Endpoint for manual attendance marking with matricule"""
        serializer = MarkAttendanceSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        student = get_object_or_404(Student, matricule=serializer.validated_data['matricule'])
        
        attendance, _ = Attendance.objects.update_or_create(
            student=student,
            date=serializer.validated_data['date'],
            time=serializer.validated_data['time'],
            defaults={'status': serializer.validated_data['status']}
        )
        
        return Response({
            'message': 'Attendance marked successfully',
            'attendance': AttendanceSerializer(attendance).data
        }, status=status.HTTP_201_CREATED)
    
    @action(detail=False, methods=['post'])
    def recognize(self, request):
        """Endpoint for name-based attendance recognition"""
        serializer = TextRecognitionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        try:
            student = get_object_or_404(
                Student,
                first_name__iexact=serializer.validated_data['first_name'],
                last_name__iexact=serializer.validated_data['last_name']
            )
            
            attendance, _ = Attendance.objects.update_or_create(
                student=student,
                date=serializer.validated_data['date'],
                time=serializer.validated_data['time'],
                defaults={'status': 'present'}
            )
            
            return Response({
                "message": "Attendance marked successfully",
                "student": StudentSerializer(student).data,
                "attendance": AttendanceSerializer(attendance).data
            })
            
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )