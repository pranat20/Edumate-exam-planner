# 📘 EduMate – Smart Study Planner & Exam Preparation Assistant

EduMate is a **smart study planner web app** that helps students manage their subjects, track progress, and stay prepared for exams.  
It automatically generates study schedules, sends reminders, and provides detailed progress reports — all in one place.

---

## ✨ Features

- 📝 **Subject & Exam Setup** – Add subjects, exam dates, and units/chapters.  
- ⏳ **Auto Task Generation** – Creates study tasks automatically based on exam date & units.  
- 📅 **Weekly Timetable** – Visual calendar view of tasks and units.  
- 📊 **Progress Tracking** – Subject-wise progress + overall completion report.  
- 🔔 **Smart Notifications** – Exam reminders, task updates, and achievements.  
- 👤 **User Profiles** – Personal & academic info, profile picture, and password change.  
- 🔐 **Authentication** – Secure login/signup with JWT tokens.  
- 🎨 **Polished Frontend UI** – Responsive, modern design with animations.  

---

## 🛠️ Tech Stack

### Frontend
- ⚛️ **React + Vite** (Fast build & modern React setup)  
- 🎨 **Tailwind CSS** (Responsive UI, modern styling)  
- 🖼️ **Lucide React Icons** (Clean vector icons)  
- 🎭 **Framer Motion** (Animations & transitions)  
- 📊 **Chart.js (react-chartjs-2)** (Progress charts & reports)  

### Backend
- 🐍 **Django + Django REST Framework (DRF)** (Robust backend & APIs)  
- 🔑 **JWT Authentication** (Secure user auth & tokens)  
- 🗄️ **SQLite / PostgreSQL** (Database for subjects, tasks, users)  

---

## 🚀 Getting Started

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/Edumate_Prototype_Advanced.git
cd Edumate_Prototype_Advanced


## 📦 Project Setup

### 1. Backend (Django)
```bash
# Go to backend folder
cd edumate_backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate   # (Windows)
source venv/bin/activate  # (Mac/Linux)

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Start server
python manage.py runserver
