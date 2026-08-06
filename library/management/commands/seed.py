"""Seed the library database: categories + site-media row + superuser.
Poems are only loaded when --demo is passed (the library starts empty by default)."""
import json
import shutil
from pathlib import Path

from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
from django.db import transaction

from library.models import Category, Poem, SiteMedia

SEED_FILE = Path(__file__).resolve().parent.parent.parent.parent / "scripts" / "seed_poems.json"


class Command(BaseCommand):
    help = "Sets up categories, site-media row, superuser. Use --demo to also load the 12 demo poems."

    def add_arguments(self, parser):
        parser.add_argument("--demo", action="store_true",
                            help="Also seed the 12 demo poems (off by default — library stays empty).")

    @transaction.atomic
    def handle(self, *args, **options):
        if not SEED_FILE.exists():
            self.stderr.write(f"Missing {SEED_FILE} — run: node scripts/export-seed.js")
            return

        data = json.loads(SEED_FILE.read_text())

        # ── categories (structure is always seeded) ──
        cat_map = {}
        for i, c in enumerate(data["categories"]):
            obj, _ = Category.objects.update_or_create(
                slug=c["slug"], defaults={"label": c["label"], "korean": c["korean"], "order": i}
            )
            cat_map[c["slug"]] = obj
        self.stdout.write(f"✓ {len(cat_map)} categories")

        # ── poems: only with --demo ──
        if options.get("demo"):
            art_dir = settings.MEDIA_ROOT / "art"
            art_dir.mkdir(parents=True, exist_ok=True)
            created = updated = 0
            for i, p in enumerate(data["poems"]):
                defaults = {
                    "korean": p["korean"],
                    "category": cat_map.get(p["category"]),
                    "date_label": p["date_label"],
                    "tags": p["tags"],
                    "excerpt": p["excerpt"],
                    "stanzas": p["stanzas"],
                    "order": i,
                    "is_published": True,
                }
                obj, was_created = Poem.objects.update_or_create(title=p["title"], defaults=defaults)
                art_rel = p.get("art", "")
                if art_rel:
                    fname = art_rel.split("/")[-1]
                    src = settings.BASE_DIR / "static" / "art" / fname
                    if src.exists() and not obj.art:
                        dest = art_dir / fname
                        shutil.copy2(src, dest)
                        obj.art = f"art/{fname}"
                        obj.save(update_fields=["art"])
                created += was_created
                updated += not was_created
            self.stdout.write(f"✓ --demo: {created} created, {updated} kept")
        else:
            self.stdout.write("○ demo poems NOT loaded (pass --demo to seed them)")

        # ── singleton site media ──
        SiteMedia.get()
        self.stdout.write("✓ site media row ready")

        # ── superuser ──
        User = get_user_model()
        if not User.objects.filter(is_superuser=True).exists():
            User.objects.create_superuser("admin", "admin@example.com", "iceflower2026")
            self.stdout.write("✓ superuser created → admin / iceflower2026  (CHANGE ME)")
        else:
            self.stdout.write("✓ superuser already exists")