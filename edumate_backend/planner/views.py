# planner/views.py
from rest_framework import viewsets, permissions, status, generics
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from django.http import JsonResponse
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import date, timedelta

import pdfplumber
from PIL import Image
import pytesseract
import io
import re
import math
from collections import Counter, defaultdict

# Models & Serializers
from .models import Subject, Task, Notification, Profile
from .serializers import (
    SubjectSerializer,
    TaskSerializer,
    NotificationSerializer,
    ChangePasswordSerializer,
    ProfileSerializer,
   
)


# set tesseract path if windows (edit if installed elsewhere)
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

# ---------- Utilities ----------

# Replace your old summarise_text and related functions with these:
def extract_text_from_pdf_fileobj(file_obj):
    text = ""
    try:
        with pdfplumber.open(file_obj) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
    except Exception:
        # pdfplumber may fail for some scanned PDFs — try OCR per page
        file_obj.seek(0)
        try:
            from pdf2image import convert_from_bytes
            images = convert_from_bytes(file_obj.read())
            for img in images:
                text += pytesseract.image_to_string(img, lang="eng+hin") + "\n"
        except Exception:
            pass
    return text

def extract_text_from_image_fileobj(file_obj):
    file_obj.seek(0)
    img = Image.open(file_obj).convert("RGB")
    return pytesseract.image_to_string(img, lang="eng+hin")


def clean_text(text):
    """Clean and normalize text"""
    text = re.sub(r'\s+', ' ', text).strip()
    text = re.sub(r'[^\w\s.!?,-]', '', text)
    return text

def split_sentences(text):
    """Split text into sentences"""
    sentences = re.split(r'(?<=[.!?])\s+', text)
    return [s.strip() for s in sentences if len(s.strip()) > 20]

def get_word_frequencies(text):
    """Calculate word frequencies excluding stopwords"""
    stopwords = set([
        "the", "and", "is", "in", "to", "of", "a", "for", "on", "with", "that", 
        "this", "as", "are", "it", "by", "an", "be", "or", "from", "at", "was", 
        "which", "we", "they", "their", "have", "has", "had", "been", "will", 
        "would", "could", "should", "may", "might", "can", "about", "into", 
        "through", "during", "before", "after", "above", "below", "up", "down",
        "out", "off", "over", "under", "again", "further", "then", "once"
    ])
    
    words = re.findall(r'\b[a-z]{3,}\b', text.lower())
    freqs = {}
    for w in words:
        if w not in stopwords:
            freqs[w] = freqs.get(w, 0) + 1
    
    # Normalize frequencies
    max_freq = max(freqs.values()) if freqs else 1
    for word in freqs:
        freqs[word] = freqs[word] / max_freq
    
    return freqs

def calculate_sentence_score(sentence, word_freqs):
    """Score a sentence based on word frequencies and other factors"""
    words = re.findall(r'\b[a-z]+\b', sentence.lower())
    
    if len(words) < 5:
        return 0
    
    # Base score from word frequencies
    base_score = sum(word_freqs.get(w, 0) for w in words) / len(words)
    
    # Length bonus (optimal length sentences)
    word_count = len(words)
    if 10 <= word_count <= 25:
        length_bonus = 0.2
    elif 25 < word_count <= 35:
        length_bonus = 0.1
    else:
        length_bonus = 0
    
    # Keyword bonus (contains important indicators)
    keyword_patterns = [
        r'\b(important|significant|key|essential|critical|main|primary|fundamental)\b',
        r'\b(conclude|conclusion|summary|result|finding)\b',
        r'\b(therefore|thus|hence|consequently)\b'
    ]
    keyword_bonus = 0.3 if any(re.search(p, sentence.lower()) for p in keyword_patterns) else 0
    
    return base_score + length_bonus + keyword_bonus

def extract_key_points(text, word_freqs, num_points=6):
    """Extract key points from text"""
    sentences = split_sentences(text)
    
    # Score sentences
    scored_sentences = []
    for i, sentence in enumerate(sentences):
        score = calculate_sentence_score(sentence, word_freqs)
        
        # Add position weight (early sentences often contain key info)
        if i < len(sentences) * 0.2:  # First 20% of text
            score += 0.15
        
        scored_sentences.append((score, sentence, i))
    
    # Get top sentences
    scored_sentences.sort(key=lambda x: x[0], reverse=True)
    
    # Select diverse key points (avoid very similar sentences)
    key_points = []
    
    for score, sentence, idx in scored_sentences:
        if len(key_points) >= num_points:
            break
        
        # Check if this sentence is too similar to already selected ones
        is_diverse = True
        sentence_words = set(re.findall(r'\b[a-z]+\b', sentence.lower()))
        
        for existing_point in key_points:
            existing_words = set(re.findall(r'\b[a-z]+\b', existing_point.lower()))
            if len(sentence_words) > 0 and len(existing_words) > 0:
                overlap = len(sentence_words & existing_words) / len(sentence_words | existing_words)
                if overlap > 0.6:  # Too similar
                    is_diverse = False
                    break
        
        if is_diverse:
            # Clean up the sentence
            clean_sentence = sentence.strip()
            if not clean_sentence.endswith('.'):
                clean_sentence += '.'
            key_points.append(clean_sentence)
    
    return key_points

def generate_short_summary(text, word_freqs, max_sentences=6):
    """Generate a concise summary"""
    sentences = split_sentences(text)
    
    if len(sentences) <= max_sentences:
        return " ".join(sentences)
    
    # Score sentences
    scored_sentences = []
    for i, sentence in enumerate(sentences):
        score = calculate_sentence_score(sentence, word_freqs)
        
        # Give extra weight to first and last paragraphs
        if i < 3 or i >= len(sentences) - 3:
            score += 0.2
        
        scored_sentences.append((score, sentence, i))
    
    # Get top sentences and maintain order
    scored_sentences.sort(key=lambda x: x[0], reverse=True)
    top_sentences = scored_sentences[:max_sentences]
    top_sentences.sort(key=lambda x: x[2])  # Sort by original position
    
    summary_text = " ".join([sent[1] for sent in top_sentences])
    return summary_text

def summarize_pdf_enhanced(text, short_summary_sentences=7, num_key_points=10):
    """
    Main function to create enhanced summary with structure
    
    Returns dict with:
    - short_summary: Brief overview (4-5 sentences)
    - key_points: List of important points (7-8 items)
    - word_count: Original document word count
    """
    text = clean_text(text)
    
    if not text or len(text) < 100:
        return {
            "short_summary": text,
            "key_points": [],
            "word_count": len(text.split())
        }
    
    # Calculate word frequencies
    word_freqs = get_word_frequencies(text)
    
    # Generate short summary
    short_summary = generate_short_summary(text, word_freqs, max_sentences=short_summary_sentences)
    
    # Extract key points
    key_points = extract_key_points(text, word_freqs, num_points=num_key_points)
    
    # Get word count
    word_count = len(text.split())
    
    return {
        "short_summary": short_summary,
        "key_points": key_points,
        "word_count": word_count
    }

# Mock question generator (naive)
def generate_mock_questions_from_text(text, n=5):
    sentences = split_sentences(text)
    # pick sentences with a named entity like 'is', 'was', 'are', or contain proper nouns (capitalized)
    candidates = [s for s in sentences if len(s.split()) > 6]
    questions = []
    used = set()
    i = 0
    for s in candidates:
        if i >= n:
            break
        # transform statement to question by simple heuristics
        if " is " in s or " was " in s or " are " in s or " were " in s:
            q = re.sub(r'\b(is|was|are|were)\b', '?', s, count=1).strip()
            # better: move verb to front — keep simple demo:
            q = s.strip()
            q = "Q: " + q + " (Explain/short answer)"
            if q not in used:
                questions.append(q)
                used.add(q)
                i += 1
    # fallback: truncation-based questions
    j = 0
    while i < n and j < len(sentences):
        s = sentences[j]
        if s not in used and len(s.split()) > 6:
            questions.append("Q: " + s.strip() + " (Short answer)")
            used.add(s)
            i += 1
        j += 1
    return questions[:n]

# MCQ generator (naive cloze + distractors)
def generate_mcq_from_text(text, n=5):
    sentences = split_sentences(text)
    mcqs = []
    nouns = re.findall(r'\b[A-Z][a-zA-Z]{2,}\b', text)  # naive proper nouns
    for s in sentences:
        if len(mcqs) >= n:
            break
        words = s.split()
        # pick a candidate word to hide (long noun)
        candidate = None
        for w in reversed(words):
            wclean = re.sub(r'[^A-Za-z0-9]', '', w)
            if len(wclean) > 4 and wclean.lower() not in ("which","where","there","their"):
                candidate = wclean
                break
        if not candidate:
            continue
        question_text = s.replace(candidate, "_____")
        # build options: correct + 3 distractors from nouns or random words
        distractors = []
        pool = list(set([n for n in nouns if n.lower() != candidate.lower()]))
        # add some lowercase words as fallback
        pool += list(set([w for w in re.findall(r'\w+', text) if len(w) > 4 and w.lower() != candidate.lower()]))
        # pick up to 3 distractors
        import random
        random.shuffle(pool)
        for p in pool[:3]:
            distractors.append(p)
        options = [candidate] + distractors
        random.shuffle(options)
        mcqs.append({
            "question": question_text.strip(),
            "options": options,
            "answer": candidate  # we return answer for dev/demo; frontend can hide it if needed
        })
    return mcqs[:n]

import re
from collections import Counter

def extract_important_from_pyqs(file_objs):
    all_questions = []

    for f in file_objs:
        text = ""
        fname = getattr(f, "name", "")
        if fname.lower().endswith(".pdf"):
            text = extract_text_from_pdf_fileobj(f)
        else:
            text = extract_text_from_image_fileobj(f)

        # Split by new lines
        lines = text.split("\n")

        # Keep only question-like lines
        for line in lines:
            line = line.strip()
            if not line:
                continue
            if (
                "?" in line
                or re.match(r"^(Q\.?|Question\s?\d*|[0-9]+\.)", line, re.I)
            ):
                # Clean up numbering and extra spaces
                cleaned = re.sub(r"^(Q\.?|Question\s?\d*|[0-9]+\.)\s*", "", line, flags=re.I)
                all_questions.append(cleaned)

    # Normalize (lowercase, remove punctuation)
    normalized = [re.sub(r"\W+", " ", q).strip().lower() for q in all_questions]

    # Count frequencies
    cnt = Counter(normalized)

    # Only keep repeated questions (appearing in 2+ papers)
    common_norms = [q for q, freq in cnt.items() if freq > 1]

    # Map back to original questions
    common_questions = []
    for norm in common_norms:
        for q in all_questions:
            if re.sub(r"\W+", " ", q).strip().lower() == norm:
                common_questions.append(q)
                break

    # Fallback: if no common, still return top 10 unique
    if not common_questions:
        common_questions = [q for q, _ in cnt.most_common(10)]

    return common_questions


# ---------- API Views ----------

# NOW UPDATE YOUR SummarizerAPIView CLASS:

class SummarizerAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, format=None):
        f = request.FILES.get("file")
        if not f:
            return Response({"error": "file required"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Extract text
        text = ""
        name = f.name.lower()
        try:
            if name.endswith(".pdf"):
                text = extract_text_from_pdf_fileobj(f)
            else:
                text = extract_text_from_image_fileobj(f)
        except Exception as e:
            return Response({"error": f"extraction failed: {str(e)}"}, status=400)
        
        if not text.strip():
            return Response({"error": "no readable text found"}, status=400)
        
        # Use enhanced summarizer
        result = summarize_pdf_enhanced(
            text, 
            short_summary_sentences=3,
            num_key_points=6
        )
        
        return Response({
            "short_summary": result["short_summary"],
            "key_points": result["key_points"],
            "word_count": result["word_count"],
            "summary_stats": {
                "original_words": result["word_count"],
                "key_points_count": len(result["key_points"])
            }
        })
class MockQuestionsAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, format=None):
        f = request.FILES.get("file")
        if not f:
            return Response({"error":"file required"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            if f.name.lower().endswith(".pdf"):
                text = extract_text_from_pdf_fileobj(f)
            else:
                text = extract_text_from_image_fileobj(f)
        except Exception as e:
            return Response({"error": f"extraction failed: {str(e)}"}, status=400)
        if not text.strip():
            return Response({"error":"no readable text found"}, status=400)
        qs = generate_mock_questions_from_text(text, n=7)
        return Response({"questions": qs})

class MCQGeneratorAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, format=None):
        f = request.FILES.get("file")
        if not f:
            return Response({"error":"file required"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            if f.name.lower().endswith(".pdf"):
                text = extract_text_from_pdf_fileobj(f)
            else:
                text = extract_text_from_image_fileobj(f)
        except Exception as e:
            return Response({"error": f"extraction failed: {str(e)}"}, status=400)
        if not text.strip():
            return Response({"error":"no readable text found"}, status=400)
        mcqs = generate_mcq_from_text(text, n=7)
        return Response({"mcqs": mcqs})

class PYQAnalyzeAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, format=None):
        files = request.FILES.getlist("files")
        if not files:
            return Response({"error":"upload up to 5 PDF files"}, status=status.HTTP_400_BAD_REQUEST)
        if len(files) > 5:
            return Response({"error":"max 5 files allowed"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            top = extract_important_from_pyqs(files)
        except Exception as e:
            return Response({"error": f"analysis failed: {str(e)}"}, status=500)
        return Response({"important": top})


# edumate_backend/edumate_backend/
# -------------------------
# Subject API
# -------------------------
class SubjectViewSet(viewsets.ModelViewSet):
    serializer_class = SubjectSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Subject.objects.filter(user=self.request.user).order_by("exam_date")

    def perform_create(self, serializer):
        subject = serializer.save(user=self.request.user)

        if subject.total_units > 0:
            today = timezone.now().date()
            days_left = (subject.exam_date - today).days - 1
            if days_left <= 0:
                return

            interval = max(1, days_left // subject.total_units)
            tasks = []
            for i in range(subject.total_units):
                study_date = today + timedelta(days=i * interval)
                if study_date >= subject.exam_date:
                    study_date = subject.exam_date - timedelta(days=1)

                tasks.append(
                    Task(
                        subject=subject,
                        unit_number=i + 1,
                        topic=f"Unit {i+1}",
                        study_date=study_date,
                    )
                )
            Task.objects.bulk_create(tasks)

        Notification.objects.create(
            user=self.request.user,
            message=f"📚 Study plan for '{subject.name}' created with {subject.total_units} units."
        )

    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated])
    def complete_unit(self, request, pk=None):
        subject = self.get_object()
        unit_number = request.data.get("unit")

        if not unit_number:
            return Response({"error": "Unit number required"}, status=400)

        try:
            task = Task.objects.get(subject=subject, unit_number=unit_number)
            if not task.completed:
                task.completed = True
                task.save()

                subject.completed_units = subject.tasks.filter(completed=True).count()
                subject.save()

                Notification.objects.create(
                    user=request.user,
                    message=f"🎉 You completed Unit {unit_number} of {subject.name}."
                )
            return Response({"message": f"Unit {unit_number} marked as complete ✅"})
        except Task.DoesNotExist:
            return Response({"error": "Unit not found"}, status=404)


# -------------------------
# Task API
# -------------------------
class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Task.objects.filter(subject__user=self.request.user).order_by("study_date")

    def perform_update(self, serializer):
        task = serializer.save()
        subject = task.subject
        subject.completed_units = subject.tasks.filter(completed=True).count()
        subject.save()

        if task.completed:
            Notification.objects.create(
                user=self.request.user,
                message=f"🎉 Completed Unit {task.unit_number} of {subject.name}."
            )


# -------------------------
# Progress Report API
# -------------------------
@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def progress_report(request):
    subjects = Subject.objects.filter(user=request.user)
    report = []
    total_tasks = 0
    total_completed = 0

    for subject in subjects:
        tasks = subject.tasks.all()
        total = tasks.count()
        completed = tasks.filter(completed=True).count()
        progress = (completed / total * 100) if total > 0 else 0

        report.append({
            "subject": subject.name,
            "category": subject.category,
            "exam_date": subject.exam_date,
            "total_tasks": total,
            "completed_tasks": completed,
            "progress_percent": round(progress, 2),
        })

        total_tasks += total
        total_completed += completed

    overall_progress = (total_completed / total_tasks * 100) if total_tasks > 0 else 0

    return Response({
        "subjects": report,
        "overall_progress": round(overall_progress, 2)
    })


# -------------------------
# Signup API
# -------------------------
@api_view(['POST'])
@permission_classes([AllowAny])
def signup(request):
    username = request.data.get("username")
    email = request.data.get("email")
    password = request.data.get("password")

    if not username or not password:
        return Response({"error": "Username and password required"}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(username=username).exists():
        return Response({"error": "Username already taken"}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create_user(username=username, email=email, password=password)

    Notification.objects.create(
        user=user,
        message="🎉 Welcome to EduMate! Start by adding your subjects and exams."
    )

    return Response({"message": "User created successfully", "username": user.username})


# -------------------------
# Notifications API
# -------------------------
class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        subjects = Subject.objects.filter(user=user)

        for subj in subjects:
            days_left = (subj.exam_date - date.today()).days
            if 0 < days_left <= 3:
                exists = Notification.objects.filter(
                    user=user,
                    message__icontains=f"{subj.name} exam"
                ).exists()
                if not exists:
                    Notification.objects.create(
                        user=user,
                        message=f"📢 Reminder: {subj.name} exam in {days_left} days!"
                    )

        return Notification.objects.filter(user=user).order_by("-created_at")


# -------------------------
# Profile APIs
# -------------------------
class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        profile, created = Profile.objects.get_or_create(user=self.request.user)
        return profile

    
class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, *args, **kwargs):
        serializer = ChangePasswordSerializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            user = request.user
            user.set_password(serializer.validated_data["new_password"])
            user.save()
            return Response({"message": "Password updated successfully ✅"})
        return Response(serializer.errors, status=400)





# -------------------------
# Home (Ping Test)
# -------------------------
def home(request):
    return JsonResponse({"message": "Welcome to EduMate API 🚀"})
