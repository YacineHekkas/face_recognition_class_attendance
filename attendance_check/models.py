from django.db import models

class Classe(models.Model):
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=20, unique=True)
    
    def __str__(self):
        return f"{self.code} - {self.name}"

class Student(models.Model):
    matricule = models.CharField(max_length=20, unique=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    classe = models.ForeignKey(Classe, on_delete=models.CASCADE)
    
    def __str__(self):
        return f"{self.matricule} - {self.first_name} {self.last_name}"

class Attendance(models.Model):
    STATUS_CHOICES = [
        ('present', 'Present'),
        ('absent', 'Absent'),
    ]
    
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    date = models.DateField()
    time = models.TimeField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='absent')
    
    class Meta:
        unique_together = ('student', 'date', 'time')
    
    def __str__(self):
        return f"{self.student} - {self.date} {self.time} - {self.status}"