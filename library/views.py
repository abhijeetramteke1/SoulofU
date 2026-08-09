import os

from django.conf import settings
from django.http import JsonResponse
from django.shortcuts import render
from django.templatetags.static import static

from .models import Category, Poem, SiteMedia

# Bundled ambient tracks (shipped via static/, served by WhiteNoise in prod).
# The first one present wins when the admin hasn't uploaded an audio file.
_BUNDLED_AUDIO = ("ambient.mp3", "ambient.ogg", "ambient.webm")


def bundled_audio_url():
    """Return a static URL to a bundled track, or "" if none ships in the build."""
    static_dir = settings.STATICFILES_DIRS[0] if settings.STATICFILES_DIRS else None
    if not static_dir:
        return ""
    for name in _BUNDLED_AUDIO:
        if os.path.exists(os.path.join(static_dir, "audio", name)):
            return static(f"audio/{name}")
    return ""


def index(request):
    site = SiteMedia.get()
    ctx = {
        "audio_url": site.audio_file.url if site.audio_file else bundled_audio_url(),
        "audio_label": site.audio_label,
    }
    return render(request, "index.html", ctx)


def poems_json(request):
    """JSON API consumed by the frontend — same shape as the old static data.js."""
    categories = [
        {
            "id": c.slug,
            "label": c.label,
            "korean": c.korean,
        }
        for c in Category.objects.all()
    ]
    poems = []
    for p in Poem.objects.filter(is_published=True).select_related("category").prefetch_related("images"):
        poems.append({
            "id": p.id,
            "title": p.title,
            "korean": p.korean,
            "category": p.category.slug if p.category else "daeho-chronicles",
            "date": p.date_label,
            "tags": p.tag_list,
            "excerpt": p.excerpt,
            "art": p.art.url if p.art else "",
            "images": [img.image.url for img in p.images.all()],
            "stanzas": p.stanzas or [],
        })
    return JsonResponse({"categories": categories, "poems": poems})