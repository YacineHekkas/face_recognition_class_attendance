
# 🧠 Real-Time Face Recognition Class Attendance System

A complete cloud-based solution for automated student attendance using AI-driven facial recognition. This real-time system captures faces using a Raspberry Pi camera and processes them via cloud-hosted services. Attendance records are displayed through a modern React-based web interface.

---

## 📌 Table of Contents

* [🧠 Overview](#-overview)
* [🚀 Features](#-features)
* [🛠 Technologies Used](#-technologies-used)
* [🗂 Project Structure](#-project-structure)
* [⚙️ Installation Guide](#-installation-guide)
* [🖥️ System Architecture](#-system-architecture)
* [📸 Raspberry Pi Setup](#-raspberry-pi-setup)

---

## 🧠 Overview

This project was developed as part of the 4th-year Embedded Systems coursework at **École Supérieure en Informatique (ESI SBA)**. It addresses the challenge of managing classroom attendance using face recognition powered by **OpenCV**, **TensorFlow**, and **cloud-based processing**.

Key features include:

* Real-time face recognition
* Live communication via WebSockets
* Raspberry Pi to cloud via MQTT (Mosquitto)
* Cloud-based Django backend
* React-based frontend interface

---

## 🚀 Features

* 📷 Face recognition using TensorFlow + OpenCV
* 🌩 Cloud-based processing (not edge computing)
* 💬 MQTT messaging with Mosquitto for Raspberry Pi
* 🌐 REST API + WebSocket with Django backend
* 📊 Real-time web dashboard with React + Tailwind CSS
* 📁 Stores attendance logs in the backend database

---

## 🛠 Technologies Used

**Hardware:**

* Raspberry Pi + Pi Camera

**Backend:**

* Python 3
* Django
* OpenCV
* TensorFlow
* PostgreSQL
* Paho MQTT
* Django Channels (for WebSocket support)

**Frontend:**

* React.js
* Tailwind CSS
* Axios
* WebSocket integration

---

## 🗂 Project Structure

```
FACE_RECOGNITION_ATTENDANCE/
├── back-end/                    # Django Backend
│   ├── attendance/              
│   ├── attendance_check/        
│   ├── face_recognition_attendance/  
│   ├── training/                # Model training scripts/data
│   ├── manage.py
│   ├── requirements.txt
│   └── attendance_results.txt
│
├── front-end/                   # React Frontend
│   ├── public/
│   ├── src/                    
│   ├── package.json
│   ├── tailwind.config.js
│   └── postcss.config.js
```

---

## ⚙️ Installation Guide

### 🔧 Backend (Django)

```bash
cd back-end
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

> Make sure Mosquitto is installed and running locally or on your server.

### 🌐 Frontend (React)

```bash
cd front-end
npm install
npm run dev 
```

---

## 🖥️ System Architecture

```
+----------------+      MQTT       +------------------+     WebSocket     +----------------+
| Raspberry Pi   | --------------> | Django Backend   | <---------------> | React Frontend |
| (Camera + MQTT)|                | (Face Recognition)|                   | (Live UI)      |
+----------------+                +------------------+                   +----------------+
```

---

## 📸 Raspberry Pi Setup

* Capture frames via Pi Camera
* Encode and publish images using Paho MQTT
* Send messages to Mosquitto broker subscribed by Django backend

---

## 📚 Academic Context

* 🎓 **Institution**: ESI Sidi Bel Abbès (École Supérieure en Informatique)
* 🧑‍🏫 **Module**: Embedded Systems
* 📅 **Academic Year**: 2024–2025


---
