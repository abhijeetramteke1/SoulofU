from django.db import models


class Category(models.Model):
    label = models.CharField("Display label", max_length=60)
    slug = models.SlugField(unique=True, help_text="e.g. shadow-light")
    korean = models.CharField("Korean title", max_length=60, blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "label"]
        verbose_name_plural = "Categories"

    def __str__(self):
        return self.label


class Poem(models.Model):
    title = models.CharField(max_length=120)
    korean = models.CharField("Korean title", max_length=120, blank=True)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True, related_name="poems")
    date_label = models.CharField("Date", max_length=120, blank=True,
                                  help_text='e.g. "Winter of the 22nd Year · Daeho"')
    tags = models.CharField(max_length=255, blank=True,
                            help_text="Comma-separated themes, e.g. ice stone, jinyowon")
    excerpt = models.CharField(max_length=255, blank=True,
                               help_text="Short line shown on hover — displayed in quotation marks")
    art = models.FileField("Artwork", upload_to="art/", blank=True,
                           help_text="Upload SVG, PNG or JPG. Leave empty to use the generated default.")
    # Stanzas are stored as JSON: a list of stanzas, each a list of verse lines.
    stanzas = models.JSONField(default=list, blank=True)

    is_published = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return self.title

    # ── admin-friendly flat edit helpers (~/. one stanza per line, verses split by " / ") ──
    def stanzas_as_text(self):
        out = []
        for stanza in self.stanzas or []:
            out.append(" / ".join(stanza))
        return "\n\n".join(out)

    @staticmethod
    def stanzas_from_text(text):
        stanzas = []
        for block in (text or "").split("\n\n"):
            block = block.strip()
            if block:
                stanzas.append([ln.strip() for ln in block.split(" / ") if ln.strip()])
        return stanzas

    @property
    def tag_list(self):
        return [t.strip() for t in self.tags.split(",") if t.strip()]


class PoemImage(models.Model):
    """Multiple images per poem — uploaded inline when adding/editing a poem."""
    poem = models.ForeignKey(Poem, on_delete=models.CASCADE, related_name="images")
    image = models.FileField("Image", upload_to="art/", blank=True,
                             help_text="SVG, PNG or JPG Image for this piece. Leave empty to keep the current one.")
    caption = models.CharField("Caption", max_length=160, blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return self.caption or self.image.name


class SiteMedia(models.Model):
    """Singleton — site-wide ambient audio uploaded by the admin."""
    audio_file = models.FileField("Ambient audio", upload_to="audio/", blank=True,
                                  help_text="Upload an audio file (mp3, ogg, wav). It will replace the "
                                            "built-in procedural sound once uploaded.")
    audio_label = models.CharField(max_length=120, blank=True, default="Sacred stillness",
                                help_text="Short label shown on the audio toggle (optional)")
    replace_procedural = models.BooleanField(default=False,
        help_text="If off, the audio toggle plays the uploaded file when present, else falls back to the built-in procedural sound.")

    class Meta:
        verbose_name = "Site media & ambient audio"
        verbose_name_plural = "Site media & ambient audio"

    def save(self, *args, **kwargs):
        # singleton
        self.pk = 1
        super().save(*args, **kwargs)

    @classmethod
    def get(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj

    def __str__(self):
        return self.audio_label or "Site audio settings"