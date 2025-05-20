import paho.mqtt.client as mqtt
import base64
import cv2
import numpy as np
import pickle
import requests
from datetime import datetime
import json
import threading
import time

BROKER = '192.168.247.251'
PORT = 1883
TOPIC = 'attendance/image'
API_URL = 'http://127.0.0.1:8000/api/attendance/batch_recognize/'

face_recognizer = cv2.face.LBPHFaceRecognizer_create()
face_recognizer.read("training/face_model.yml")
face_detector = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

with open("training/encodings.pkl", "rb") as f:
    data = pickle.load(f)
    label_map = {v: k for k, v in data["label_map"].items()}

current_session = set()
SESSION_TIMEOUT = 30 * 60
last_detection_time = datetime.now()

def reset_session():
    global current_session, last_detection_time
    if current_session:
        print(f"⏰ Session timeout, sending batch with {len(current_session)} students...")
        send_attendance_batch()
    current_session = set()
    last_detection_time = datetime.now()

def check_session_timeout():
    if (datetime.now() - last_detection_time).total_seconds() > SESSION_TIMEOUT:
        reset_session()

def send_attendance_batch():
    if not current_session:
        return

    students = []
    for full_name in current_session:
        first_name, last_name = (full_name.split(' ', 1) + [''])[:2]
        students.append({
            "first_name": first_name,
            "last_name": last_name
        })

    try:
        response = requests.post(
            API_URL,
            json={"students": students},
            headers={'Content-Type': 'application/json'},
            timeout=5
        )
        print(f"✅ Sent batch: {len(students)} records | Status: {response.status_code}")
    except Exception as e:
        print(f"❌ Failed to send batch: {str(e)}")

def recognize_face(image):
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    faces = face_detector.detectMultiScale(gray, 1.1, 5)

    results = []
    for (x, y, w, h) in faces:
        face_img = gray[y:y + h, x:x + w]
        face_img = cv2.resize(face_img, (100, 100))

        label, confidence = face_recognizer.predict(face_img)
        name = label_map.get(label, "Unknown")
        print(f"🧠 Prediction: {name} (confidence: {confidence:.2f})")
        results.append({"name": name, "confidence": float(confidence)})
    return results


def on_message(client, userdata, msg):
    global last_detection_time
    
    try:
        check_session_timeout()
        last_detection_time = datetime.now()
        
        img_data = base64.b64decode(msg.payload)
        nparr = np.frombuffer(img_data, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if img is not None:
            results = recognize_face(img)
            for result in results:
                name = result["name"]
                if name != "Unknown":
                    current_session.add(name)
                    print(f"👤 Added to session: {name} (Confidence: {result['confidence']:.2f})")
            
            print(f"Session size: {len(current_session)} students")
        else:
            print("⚠️ Could not decode image")

    except Exception as e:
        print(f"🚨 Error processing message: {str(e)}")

client = mqtt.Client()
client.on_message = on_message
client.connect(BROKER, PORT, 60)
client.subscribe(TOPIC)

def session_watchdog():
    while True:
        check_session_timeout()
        time.sleep(60)

threading.Thread(target=session_watchdog, daemon=True).start()

print("🚀 MQTT Attendance Tracker Started")
client.loop_forever()
