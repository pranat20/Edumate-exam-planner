from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Subject, Task, Notification, Profile, NoteSummary, MotivationQuote


# -------------------------
# User Profile Serializer
# -------------------------
class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "first_name", "last_name", "email"]
        read_only_fields = ["id", "username"]


# -------------------------
# Task & Subject Serializers
# -------------------------
class TaskSerializer(serializers.ModelSerializer):
    subject_name = serializers.CharField(source="subject.name", read_only=True)

    class Meta:
        model = Task
        fields = [
            "id",
            "subject",
            "subject_name",
            "unit_number",
            "topic",
            "study_date",
            "completed",
        ]


class SubjectSerializer(serializers.ModelSerializer):
    tasks = TaskSerializer(many=True, read_only=True)
    progress_percent = serializers.FloatField(read_only=True)

    class Meta:
        model = Subject
        fields = [
            "id",
            "name",
            "exam_date",
            "total_units",
            "completed_units",
            "progress_percent",
            "category",
            "tasks",
        ]


# -------------------------
# Notification Serializer
# -------------------------
class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ["id", "message", "created_at", "is_read"]
        read_only_fields = ["id", "created_at"]


# -------------------------
# Profile Serializer
# -------------------------
class ProfileSerializer(serializers.ModelSerializer):
    user = UserProfileSerializer()

    class Meta:
        model = Profile
        fields = ["id", "user", "bio", "institution", "grade_or_year", "profile_pic"]

    def update(self, instance, validated_data):
        user_data = validated_data.pop("user", None)
        if user_data:
            user = instance.user
            for attr, value in user_data.items():
                setattr(user, attr, value)
            user.save()
        return super().update(instance, validated_data)


# -------------------------
# NoteSummary Serializer (Desk Tools)
# -------------------------
class NoteSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = NoteSummary
        fields = [
            "id",
            "subject_name",
            "unit_number",
            "file",
            "output",       # ✅ replaced "summary" with "output"
            "tool_type",
            "created_at",
        ]
        read_only_fields = ["id", "output", "created_at"]


# -------------------------
# Motivation Quote Serializer
# -------------------------
class MotivationQuoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = MotivationQuote
        fields = ["id", "text", "created_at"]
        read_only_fields = ["id", "created_at"]


# -------------------------
# Change Password Serializer
# -------------------------
class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)

    def validate_old_password(self, value):
        user = self.context["request"].user
        if not user.check_password(value):
            raise serializers.ValidationError("Old password is incorrect.")
        return value
