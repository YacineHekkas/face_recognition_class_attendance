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
    student = models.OneToOneField(
        'Student',
        on_delete=models.CASCADE,
        related_name='attendance_check'
    )
    history = models.JSONField(
        default=list,
        blank=True,
        help_text="List of attendance records: [{'status': 'present', 'date': 'YYYY-MM-DD', 'time': 'HH:MM:SS'}]"
    )

    def add_session_records(self, records):
        """Add multiple records at once"""
        self.history.extend(records)
        self.save()

    class Meta:
        verbose_name_plural = "Attendance Checks"