# train_faces.py
import sys
import os
import cv2
import pickle
import numpy as np
import json

from pathlib import Path

# Args: JSON list [{"name": "Full Name", "images": ["/path/image1.jpg", ...]}, ...]
if len(sys.argv) < 2:
    print("Usage: python train_faces.py '<json_list>'")
    exit(1)

students_data = json.loads(sys.argv[1])  # list of { name, images }

ENCODINGS_FILE = "training/encodings.pkl"
MODEL_FILE = "training/face_model.yml"
os.makedirs(os.path.dirname(ENCODINGS_FILE), exist_ok=True)

face_detector = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
face_recognizer = cv2.face.LBPHFaceRecognizer_create()

known_faces = []
known_labels = []
label_map = {}
label_counter = 0

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

# Process each student and their images
for student in students_data:
    student_name = student['name']
    image_paths = student['images']
    
    if student_name not in label_map:
        label_map[student_name] = label_counter
        label_counter += 1
    
    print(f"\n📦 Processing {len(image_paths)} images for: {student_name}")
    processed = 0
    for path in image_paths:
        face = process_image(path)
        if face is not None:
            known_faces.append(face)
            known_labels.append(label_map[student_name])
            print(f"[+] {os.path.basename(path)} processed")
            processed += 1
        else:
            print(f"[!] Face not found in {os.path.basename(path)}")
    
    if processed == 0:
        print(f"⚠️ No usable faces for {student_name}")

# Train and save model
if known_faces:
    face_recognizer.train(known_faces, np.array(known_labels))
    face_recognizer.write(MODEL_FILE)

    with open(ENCODINGS_FILE, "wb") as f:
        pickle.dump({"label_map": label_map}, f)

    print("\n✅ Training complete")
    print(f"🧠 Trained on {len(label_map)} students with {len(known_faces)} faces.")
else:
    print("\n❌ No faces were processed, training aborted.")
