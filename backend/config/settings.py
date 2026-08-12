from pathlib import Path
from datetime import timedelta
from decouple import config, Csv
import dj_database_url
BASE_DIR = Path(__file__).resolve().parent.parent
SECRET_KEY = config('SECRET_KEY', default='dev-only-change-me')
DEBUG = config('DEBUG', default=True, cast=bool)
ALLOWED_HOSTS = config('ALLOWED_HOSTS', default='localhost,127.0.0.1', cast=Csv())
INSTALLED_APPS = [
 'django.contrib.admin','django.contrib.auth','django.contrib.contenttypes','django.contrib.sessions','django.contrib.messages','django.contrib.staticfiles','django.contrib.sitemaps',
 'rest_framework','rest_framework_simplejwt','django_filters','corsheaders','drf_spectacular',
 'apps.common','apps.categories','apps.brands','apps.products','apps.banners','apps.blog','apps.accounts','apps.cart','apps.orders','apps.payments','apps.shipping','apps.seo','apps.search','apps.importer']
MIDDLEWARE = ['corsheaders.middleware.CorsMiddleware','django.middleware.security.SecurityMiddleware','django.contrib.sessions.middleware.SessionMiddleware','django.middleware.common.CommonMiddleware','django.middleware.csrf.CsrfViewMiddleware','django.contrib.auth.middleware.AuthenticationMiddleware','django.contrib.messages.middleware.MessageMiddleware','django.middleware.clickjacking.XFrameOptionsMiddleware']
ROOT_URLCONF='config.urls'; WSGI_APPLICATION='config.wsgi.application'; ASGI_APPLICATION='config.asgi.application'
DATABASES={'default': dj_database_url.config(default=config('DATABASE_URL', default=f'sqlite:///{BASE_DIR / "db.sqlite3"}'), conn_max_age=600)}
LANGUAGE_CODE='fa-ir'; TIME_ZONE='Asia/Tehran'; USE_I18N=True; USE_TZ=True
STATIC_URL='static/'; STATIC_ROOT=BASE_DIR/'staticfiles'; MEDIA_URL=config('MEDIA_URL', default='/media/'); MEDIA_ROOT=config('MEDIA_ROOT', default=str(BASE_DIR/'media'))
DEFAULT_AUTO_FIELD='django.db.models.BigAutoField'
AUTH_USER_MODEL='accounts.User'
CORS_ALLOWED_ORIGINS=config('CORS_ALLOWED_ORIGINS', default='http://localhost:3000,http://127.0.0.1:3000', cast=Csv())
REST_FRAMEWORK={'DEFAULT_SCHEMA_CLASS':'drf_spectacular.openapi.AutoSchema','DEFAULT_AUTHENTICATION_CLASSES':['rest_framework_simplejwt.authentication.JWTAuthentication','rest_framework.authentication.SessionAuthentication'],'DEFAULT_FILTER_BACKENDS':['django_filters.rest_framework.DjangoFilterBackend','rest_framework.filters.SearchFilter','rest_framework.filters.OrderingFilter'],'DEFAULT_PAGINATION_CLASS':'apps.common.pagination.StandardResultsSetPagination','PAGE_SIZE':12}
SIMPLE_JWT={'ACCESS_TOKEN_LIFETIME':timedelta(minutes=config('JWT_ACCESS_MINUTES', default=60, cast=int)),'REFRESH_TOKEN_LIFETIME':timedelta(days=config('JWT_REFRESH_DAYS', default=14, cast=int))}
SPECTACULAR_SETTINGS={'TITLE':'NozhaShop API','DESCRIPTION':'Django REST API for Persian RTL pharmacy storefront','VERSION':'1.0.0'}
CACHES={'default': {'BACKEND': config('CACHE_BACKEND', default='django.core.cache.backends.locmem.LocMemCache'), 'LOCATION': config('REDIS_URL', default='unique-nozha')}}
SITE_DOMAIN=config('SITE_DOMAIN', default='https://nozhashop.com')
SMS_PROVIDER=config('SMS_PROVIDER', default='console'); PAYMENT_PROVIDER=config('PAYMENT_PROVIDER', default='abstract'); SHIPPING_PROVIDER=config('SHIPPING_PROVIDER', default='abstract')
TEMPLATES=[{'BACKEND':'django.template.backends.django.DjangoTemplates','DIRS':[],'APP_DIRS':True,'OPTIONS':{'context_processors':['django.template.context_processors.request','django.contrib.auth.context_processors.auth','django.contrib.messages.context_processors.messages']}}]
AUTH_PASSWORD_VALIDATORS=[]
