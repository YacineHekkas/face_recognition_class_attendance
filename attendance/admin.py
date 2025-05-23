from django.contrib import admin

# Register your models here.
from .models import Student, StudentPhoto

class StudentPhotoInline(admin.TabularInline):
    model = StudentPhoto
    extra = 1

@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ['full_name', 'matricule']

    def full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}"
    
@admin.register(StudentPhoto)
class StudentPhotoAdmin(admin.ModelAdmin):
    list_display = ('student', 'uploaded_at')
