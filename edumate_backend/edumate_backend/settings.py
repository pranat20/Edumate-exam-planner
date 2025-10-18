"""
Django settings for edumate_backend project.
Replace this file in your project with the contents below.
⚠️ Remember: this configuration is tuned for development. Before deploying to production,
    make these changes:
     - DEBUG = False
     - Replace SECRET_KEY with an env variable
     - Lock down ALLOWED_HOSTS
     - Lock down CORS settings
     - Use a production-ready database (Postgres/MySQL)
     - Configure static/media serving (CDN or webserver)
"""

from pathlib import Path
from datetime import timedelta
import os

# -------------------------
# Base Setup
# -------------------------
BASE_DIR = Path(__file__).resolve().parent.parent

# dev secret key (replace in production via env var)
SECRET_KEY = os.environ.get("DJANGO_SECRET_KEY", "django-insecure-_o7=rx&ns+g^$$^7cv8=19_$b(vv45j#k@mm2%qro5t9^q59oa")

DEBUG = True  # ⚠️ Set to False in production
ALLOWED_HOSTS = ["*"]  # Change to specific hosts in production

# -------------------------
# Installed Apps
# -------------------------
INSTALLED_APPS = [
    # Third-party
    "corsheaders",                 # handles CORS
    "rest_framework",
    "rest_framework_simplejwt",

    # Local apps
    "planner",

    # Django built-ins
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
]


# -------------------------
# Middleware
# -------------------------
MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    'whitenoise.middleware.WhiteNoiseMiddleware',

    # CORS (must be placed before CommonMiddleware)
    "corsheaders.middleware.CorsMiddleware",

    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware", 
]

ROOT_URLCONF = "edumate_backend.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [], 
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "edumate_backend.wsgi.application"

# -------------------------
# Database (SQLite for dev)
# -------------------------
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}

# -------------------------
# Password validation
# -------------------------
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

# -------------------------
# Internationalization
# -------------------------
LANGUAGE_CODE = "en-us"
TIME_ZONE = "Asia/Kolkata"
USE_I18N = True
USE_TZ = True

# -------------------------
# Static & Media Files
# -------------------------
STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"   # useful when running collectstatic for production
STATICFILES_DIRS = [os.path.join(BASE_DIR, 'static')]

MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# -------------------------
# REST Framework + JWT
# -------------------------
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
        "rest_framework.authentication.SessionAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": (
        "rest_framework.permissions.IsAuthenticated",
    ),
}

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=60),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=1),
    "AUTH_HEADER_TYPES": ("Bearer",),
}


CORS_ALLOW_ALL_ORIGINS = True
# Optional: allow cookies/auth headers
CORS_ALLOW_CREDENTIALS = True

