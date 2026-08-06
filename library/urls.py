from django.urls import path

from . import views

app_name = "library"

urlpatterns = [
    path("", views.index, name="index"),
    path("api/poems.json", views.poems_json, name="poems_json"),
]
