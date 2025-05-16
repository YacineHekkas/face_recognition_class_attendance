# train_faces.py
import sys
import os
import cv2
import pickle
import numpy as np
import json

from pathlib import Path

# Args: JSON with {"name": "Full Name", "images": ["/path/image1.jpg", ...]}
if len(sys.argv) < 2:
    print("Usage: python train_faces.py '<json_string>'")
    exit(1)

data = json.loads(sys.argv[1])
student_name = data['name']
image_paths = data['images']

ENCODINGS_FILE = "training/encodings.pkl"
os.makedirs(os.path.dirname(ENCODINGS_FILE), exist_ok=True)

face_detector = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
face_recognizer = cv2.face.LBPHFaceRecognizer_create()

known_faces = []
known_names = []

def process_image(image_path):
    image = cv2.imread(image_path)
    if image is None:
        return None

    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    height, width = gray.shape[:2]
    if width > 1000:
        gray = cv2.resize(gray, (0, 0), fx=1000 / width, fy=1000 / width)

    faces = face_detector.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))
    if len(faces) == 0:
        return None

    x, y, w, h = faces[0]
    face_img = gray[y:y+h, x:x+w]
    face_img = cv2.resize(face_img, (100, 100))
    return face_img

print(f"📦 Processing {len(image_paths)} images for student: {student_name}")

processed = 0
for path in image_paths:
    face = process_image(path)
    if face is not None:
        known_faces.append(face)
        known_names.append(student_name)
        print(f"[+] {os.path.basename(path)} processed")
        processed += 1
    else:
        print(f"[!] Face not found in {os.path.basename(path)}")

if processed > 0:
    unique_names = list(set(known_names))
    name_to_label = {name: i for i, name in enumerate(unique_names)}
    labels = [name_to_label[name] for name in known_names]

    face_recognizer.train(known_faces, np.array(labels))
    model_path = os.path.join(os.path.dirname(ENCODINGS_FILE), "face_model.yml")
    face_recognizer.write(model_path)

    with open(ENCODINGS_FILE, "wb") as f:
        pickle.dump({"names": unique_names}, f)

    print("✅ Training complete")
else:
    print("⚠️ No faces processed")

