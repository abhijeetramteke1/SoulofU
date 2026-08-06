from django.http import JsonResponse
from django.shortcuts import render

from .models import Category, Poem, SiteMedia


def index(request):
    site = SiteMedia.get()
    ctx = {
        "audio_url": site.audio_file.url if site.audio_file else "",
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