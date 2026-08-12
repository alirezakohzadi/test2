from django.contrib import admin
from .models import BlogCategory,Article
admin.site.register(BlogCategory)
@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin): list_display=('title','category','author','is_published','published_at'); list_filter=('is_published','category'); search_fields=('title','slug','summary'); autocomplete_fields=('author','category')
