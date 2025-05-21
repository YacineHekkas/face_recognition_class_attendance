from django.db import models
from django.utils import timezone
from PIL import Image
import os

# ✅ Import Student model from the other app
from attendance_check.models import Student



def student_image_upload_path(instance, filename):
    student_id = getattr(instance.student, 'id', None)
    return f'student_images/{student_id}/{filename}'


class StudentPhoto(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='photos')
    image = models.ImageField(upload_to=student_image_upload_path)
    thumbnail = models.ImageField(upload_to='thumbnails/', blank=True, null=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        # Detect if instance is new to save normally first and get an ID for student relation
        is_new = self._state.adding

        # Save instance normally first to ensure student relation is set and file is saved
        super().save(*args, **kwargs)

        # Generate thumbnail only after saving and if it doesn't exist yet
        if self.image and not self.thumbnail:
            self.generate_thumbnail()
            # Save again to update thumbnail field
            super().save(update_fields=['thumbnail'])

    def generate_thumbnail(self):
        from io import BytesIO
        from django.core.files.base import ContentFile

        size = (150, 150)
        image = Image.open(self.image)
        image = image.convert('RGB')  # ensure RGB mode
        image.thumbnail(size)

        thumb_io = BytesIO()
        image.save(thumb_io, format='JPEG', quality=85)

        thumb_name = os.path.splitext(self.image.name)[0] + "_thumb.jpg"
        self.thumbnail.save(thumb_name, ContentFile(thumb_io.getvalue()), save=False)
