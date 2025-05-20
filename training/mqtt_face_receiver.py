import paho.mqtt.client as mqtt
import base64
import cv2
import numpy as np
import pickle
import os
from datetime import datetime


# MQTT Setup  
BROKER = '192.168.247.251'
PORT = 1883
TOPIC = 'attendance/image'
SAVE_DIR = 'received_images'

# Load face recognition model
face_recognizer = cv2.face.LBPHFaceRecognizer_create()
face_recognizer.read("training/face_model.yml")

# Load encodings and label map
with open("training/encodings.pkl", "rb") as f:
    data = pickle.load(f)
    label_map = {v: k for k, v in data["label_map"].items()}

# Load face detector
face_detector = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

# Face recognition logic
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

os.makedirs(SAVE_DIR, exist_ok=True)

# Callback when connected to MQTT broker
def on_connect(client, userdata, flags, rc):
    if rc == 0:
        print("[MQTT] Connected successfully")
        client.subscribe(TOPIC)
        print(f"[MQTT] Subscribed to topic: {TOPIC}")
    else:
        print(f"[MQTT] Connection failed with code {rc}")
# MQTT Callback: Connected


# MQTT Callback: Message Received

# def on_message(client, userdata, msg):
#     try:
#         print(f"[MQTT] Received message on topic {msg.topic}")

#         # Decode base64 image
#         image_data = base64.b64decode(msg.payload)

#         # Create a unique filename with timestamp
#         timestamp = datetime.now().strftime("%Y%m%d_%H%M%S_%f")
#         filename = os.path.join(SAVE_DIR, f"frame_{timestamp}.jpg")

#         # Write to file
#         with open(filename, 'wb') as f:
#             f.write(image_data)

#         print(f"[Saved] Image saved to {filename}")

#     except Exception as e:
#         print(f"[Error] Failed to process image: {e}")

def on_message(client, userdata, msg):
    print("📩 Message received on topic:", msg.topic)

    try:
        # Decode base64 image directly (no JSON parsing)
        img_data = base64.b64decode(msg.payload)

        # Save image to disk with timestamped filename
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S_%f")
        filename = os.path.join(SAVE_DIR, f"frame_{timestamp}.jpg")
        with open(filename, 'wb') as f:
            f.write(img_data)

        print(f"[Saved] Image saved to {filename}")

        # Convert to OpenCV image for processing
        nparr = np.frombuffer(img_data, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if img is not None:
            results = recognize_face(img)
            print("🎯 Attendance Result:", results)

            # Save results to a log file
            with open("attendance_results.txt", "a") as f:
                log_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                for result in results:
                    f.write(f"[{log_time}] {result['name']} - Confidence: {result['confidence']:.2f}\n")
        else:
            print("⚠️ Could not decode image")

    except Exception as e:
        print("🚨 Error while processing message:", e)


# MQTT Setup
client = mqtt.Client()
client.on_connect = on_connect
client.on_message = on_message

print(f"[System] Connecting to MQTT broker at {BROKER}:{PORT}")
client.connect(BROKER, PORT, 60)

# Start listening loop
client.loop_forever()



















import paho.mqtt.client as mqtt
import os
import base64
from datetime import datetime

# Configuration


# Ensure the output directory exists


# Callback when a message is received


