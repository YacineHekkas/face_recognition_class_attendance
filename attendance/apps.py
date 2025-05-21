from django.apps import AppConfig
import threading
import subprocess
import os

class AttendanceConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'attendance'

    
    def ready(self):
        def run_mqtt():
            os.system("python training/mqtt_face_receiver.py")  # Adjust if path differs

        threading.Thread(target=run_mqtt, daemon=True).start()
