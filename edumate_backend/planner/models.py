from django.db import models
from django.contrib.auth.models import User


# -------------------------
# Subject (Exam + Units)
# -------------------------
class Subject(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    exam_date = models.DateField()
    total_units = models.IntegerField(default=0)
    completed_units = models.IntegerField(default=0)
    category = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return self.name


# -------------------------
# Task (Per-Unit Study Task)
# -------------------------
class Task(models.Model):
    subject = models.ForeignKey(Subject, related_name="tasks", on_delete=models.CASCADE)
    unit_number = models.IntegerField()
    topic = models.CharField(max_length=200, blank=True, null=True)
    study_date = models.DateField()
    completed = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.subject.name} - Unit {self.unit_number}"


# -------------------------
# Notification
# -------------------------
class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user.username} - {self.message[:20]}"


# -------------------------
# User Profile (Extended)
# -------------------------
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    bio = models.TextField(blank=True, null=True)
    institution = models.CharField(max_length=200, blank=True, null=True)
    grade_or_year = models.CharField(max_length=100, blank=True, null=True)
    profile_pic = models.ImageField(upload_to="profiles/", blank=True, null=True)

    def __str__(self):
        return self.user.username


# -------------------------
# NoteSummary (Desk Tools)
# -------------------------
class NoteSummary(models.Model):
    TOOL_CHOICES = [
        ("summary", "AI Summary"),
        ("mock", "Mock Questions"),
        ("mcq", "MCQ Quiz"),
        ("pyq", "PYQ Analysis"),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notes")
    subject_name = models.CharField(max_length=200, blank=True, null=True)
    unit_number = models.CharField(max_length=50, blank=True, null=True)
    file = models.FileField(upload_to="notes/", blank=True, null=True)
    output = models.TextField(blank=True, null=True)  # renamed from summary → generic output
    tool_type = models.CharField(max_length=20, choices=TOOL_CHOICES, default="summary")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.subject_name or 'Notes'} ({self.tool_type})"


# -------------------------
# Motivation Quotes (for Stress Relief Tool)
# -------------------------
class MotivationQuote(models.Model):
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.text[:50]
