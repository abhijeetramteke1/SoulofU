"""Functional test of the admin: login, add poem, edit stanzas, upload audio, unpublish, delete."""
import os
import sys
import tempfile
from io import BytesIO

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "ifl.settings")
import django
django.setup()
django.setup()

from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import Client

from library.models import Category, Poem, SiteMedia

ok = lambda c, m: (print("  ✓", m) if c else print("  ✗ FAIL:", m)) or c
fails = [0]

def check(c, m):
    if not ok(c, m):
        fails[0] += 1

client = Client()
User = get_user_model()
u = User.objects.get(username="admin")

print("— admin login —")
r = client.login(username="admin", password="iceflower2026")
check(r, "login as admin / iceflower2026")
client.force_login(u)

print("\n— add a new poem via admin (with 2 inline images) —")
cat = Category.objects.get(slug="water-fire")
# simulate the flat stanzas format: blank-line separated stanzas, " / " inside
img1 = SimpleUploadedFile("first-wash.svg", b"<svg/>", content_type="image/svg+xml")
img2 = SimpleUploadedFile("second-wash.svg", b"<svg/>", content_type="image/svg+xml")
poem_data = {
    "title": "A Test Verse for the Gate",
    "korean": "시험의 시",
    "category": str(cat.pk),
    "date_label": "Test Hour · Daeho",
    "tags": "test, gate",
    "excerpt": "A temporary verse to prove the gate opens both ways.",
    "stanzas_text": "I came to the gate with a question / the gate replied with silence\n\nI came to the gate with silence / the gate replied with a question",
    "order": "99",
    "is_published": "on",
    "stanzas": "[]",  # ignored; form derives stanzas from stanzas_text
    # inline PoemImage formset: two image uploads (prefix = related_name "images")
    "images-TOTAL_FORMS": "2",
    "images-INITIAL_FORMS": "0",
    "images-MIN_NUM_FORMS": "0",
    "images-MAX_NUM_FORMS": "1000",
    "images-0-id": "", "images-0-poem": "", "images-0-order": "0",
    "images-0-caption": "First wash", "images-0-image": img1,
    "images-1-id": "", "images-1-poem": "", "images-1-order": "1",
    "images-1-caption": "Second wash", "images-1-image": img2,
}
r = client.post("/admin/library/poem/add/", poem_data)
if r.status_code == 400:
    print("    form errors:", r.context["adminform"].form.errors.as_data() if r.context else r.content[:400])
check(r.status_code in (200, 302), f"POST add → {r.status_code}")
p = Poem.objects.filter(title="A Test Verse for the Gate").first()
check(p is not None, "poem row created")
check(p.stanzas == [["I came to the gate with a question", "the gate replied with silence"],
                    ["I came to the gate with silence", "the gate replied with a question"]],
      "stanzas parsed correctly from flat text")
check(p.tag_list == ["test", "gate"], f"tags parsed: {p.tag_list}")
check(p.art.name == "", "no cover art upload → art empty (uses placeholder on site)")
from library.models import PoemImage as _PI
check(_PI.objects.filter(poem=p).count() == 2, "2 inline images stored")
check(all(i.image.name.startswith("art/") for i in _PI.objects.filter(poem=p)), "images saved under media/art/")
r = client.get("/api/poems.json")
imgs = [x for x in r.json()["poems"] if x["title"] == "A Test Verse for the Gate"][0]["images"]
check(len(imgs) == 2, f"API exposes both image URLs (got {len(imgs)})")
check(all(u.startswith("/media/art/") for u in imgs), "API image URLs are media paths")

print("\n— upload audio via admin —")
fake_audio = BytesIO(b"\x00" * 4096)  # placeholder bytes (real uploads will be mp3/ogg)
fake_audio.name = "daeho-mist.mp3"
up = SimpleUploadedFile("daeho-mist.mp3", b"\x00" * 4096, content_type="audio/mpeg")
r = client.post("/admin/library/sitemedia/1/change/", {
    "audio_label": "Mist over Jinyowon",
    "audio_file": up,
    "replace_procedural": "on",
})
check(r.status_code in (200, 302), f"POST audio upload → {r.status_code}")
sm = SiteMedia.get()
check(bool(sm.audio_file), f"audio file stored: {sm.audio_file.name}")
check(sm.audio_file.url.startswith("/media/audio/"), f"served at {sm.audio_file.url}")
# does the public page now expose it?
r = client.get("/")
check('audioUrl: "/media/audio/daeho-mist.mp3' in r.content.decode(), "index template injects audio URL")

print("\n— unpublish then verify API hides it —")
# editing must NOT force re-uploading existing images (blank image field keeps them)
p.refresh_from_db()
imgs = list(p.images.all())
edit_data = {
    "title": p.title, "korean": p.korean, "category": str(p.category_id or ""),
    "date_label": p.date_label, "tags": p.tags, "excerpt": p.excerpt,
    "stanzas_text": p.stanzas_as_text(), "order": "99", "is_published": "",
    "stanzas": "[]",
    "images-TOTAL_FORMS": "2", "images-INITIAL_FORMS": "2",
    "images-MIN_NUM_FORMS": "0", "images-MAX_NUM_FORMS": "1000",
}
for i, im in enumerate(imgs):
    edit_data.update({
        f"images-{i}-id": str(im.pk), f"images-{i}-poem": str(p.pk),
        f"images-{i}-order": str(im.order), f"images-{i}-caption": im.caption,
        f"images-{i}-image": "", f"images-{i}-DELETE": "",
    })
r = client.post(f"/admin/library/poem/{p.pk}/change/", edit_data)
check(r.status_code in (200, 302), f"POST unpublish (no re-upload) → {r.status_code}")
p.refresh_from_db()
check(p.images.count() == 2, "images kept after edit without re-upload")
check(not p.is_published, "poem is unpublished")
r = client.get("/api/poems.json")
titles = [x["title"] for x in r.json()["poems"]]
check("A Test Verse for the Gate" not in titles, "unpublished poem hidden from API")

print("\n— delete poem via admin —")
r = client.post(f"/admin/library/poem/{p.pk}/delete/", {"post": "yes", "confirm": "yes"})
check(r.status_code in (200, 302), f"POST delete → {r.status_code}")
check(not Poem.objects.filter(pk=p.pk).exists(), "poem row deleted")

print("\n— cleanup: remove test audio, keep demo site pristine —")
sm = SiteMedia.get()
sm.audio_file.delete(save=False)
sm.audio_file = None
sm.save()

print(f"\n{'ALL ADMIN CHECKS PASSED' if not fails[0] else str(fails[0]) + ' FAILURES'}")
raise SystemExit(1 if fails[0] else 0)
