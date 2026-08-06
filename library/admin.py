from django import forms
from django.contrib import admin
from django.utils.html import format_html

from .models import Category, Poem, PoemImage, SiteMedia


class PoemAdminForm(forms.ModelForm):
    # Flat, human-friendly stanza editing:
    #   lines within a stanza are separated by " / "
    #   stanzas are separated by a blank line
    stanzas_text = forms.CharField(
        required=False,
        widget=forms.Textarea(attrs={"rows": 12, "style": "font-family:monospace;white-space:pre;width:100%"}),
        label="Stanzas",
        help_text="One stanza per paragraph. Inside a stanza, separate verse lines with <code> / </code>. "
                  "Blank line = new stanza. Example:<br>"
                  "In the lake of frozen vows / Jinyowon keeps what the sun forgets<br>"
                  "&nbsp;&nbsp;(blank line)<br>Every winter it pretends to sleep",
    )

    class Meta:
        model = Poem
        fields = ["title", "korean", "category", "date_label", "tags", "excerpt",
                  "art", "stanzas_text", "order", "is_published"]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.instance and self.instance.pk:
            self.fields["stanzas_text"].initial = self.instance.stanzas_as_text()

    def clean(self):
        cleaned = super().clean()
        text = cleaned.get("stanzas_text", "")
        cleaned["stanzas"] = Poem.stanzas_from_text(text)
        del cleaned["stanzas_text"]
        # tidy JSON on disk
        self.instance.stanzas = cleaned["stanzas"]
        return cleaned


class PoemImageInline(admin.TabularInline):
    model = PoemImage
    extra = 1
    fields = ("image", "caption", "order")
    verbose_name = "Image"
    verbose_name_plural = "Images (add as many as you like)"

    def get_extra(self, request, obj=None, **kwargs):
        return 0 if obj else 1


@admin.register(Poem)
class PoemAdmin(admin.ModelAdmin):
    form = PoemAdminForm
    inlines = [PoemImageInline]
    list_display = ("order", "title", "category", "date_label", "is_published", "thumb")
    list_display_links = ("title",)
    list_editable = ("order", "is_published")
    list_filter = ("category", "is_published")
    search_fields = ("title", "korean", "excerpt", "tags")
    readonly_fields = ("id",)
    actions = ("publish_selected", "unpublish_selected")

    def thumb(self, obj):
        img = obj.art or (obj.images.first().image if obj.images.exists() else None)
        if not img:
            return "—"
        return format_html('<img src="{}" width="60" style="border-radius:3px;border:1px solid #eee" />',
                           img.url)
    thumb.short_description = "Art"

    @admin.action(description="Publish selected")
    def publish_selected(self, request, qs):
        n = qs.update(is_published=True)
        self.message_user(request, f"{n} poem(s) published.")

    @admin.action(description="Unpublish selected (hide from site)")
    def unpublish_selected(self, request, qs):
        n = qs.update(is_published=False)
        self.message_user(request, f"{n} poem(s) unpublished. Hidden from the gallery.")


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("order", "label", "slug", "korean")
    list_display_links = ("label",)
    list_editable = ("order",)
    prepopulated_fields = {"slug": ("label",)}


@admin.register(SiteMedia)
class SiteMediaAdmin(admin.ModelAdmin):
    def has_add_permission(self, request):
        # singleton — only one settings row
        return not SiteMedia.objects.exists()