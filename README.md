# The Ice Flower Library · Soul Bound Archives

A poetry & visual-art showcase themed around the K-drama *Alchemy of Souls* — Daeho
realm elegance rendered as a dark-fantasy ink-wash web experience. Now backed by **Django**
with a full **admin panel** for managing poems, artwork and ambient audio.

## Stack
- **Backend:** Django 6 (SQLite) — models, admin, JSON API
- **Frontend:** HTML5 · Tailwind (CDN) · vanilla JS (fetch-driven, any server)
- **Type:** Stellar Oracle (Helotype) display serif + Cinzel / Cormorant Garamond / Noto Serif KR / Lora / Inter

## Run it

```bash
pip install -r requirements.txt
python3 manage.py migrate
python3 manage.py seed            # loads the 12 demo poems + art + superuser
python3 manage.py runserver 0.0.0.0:8000
```

- **Site:**  http://127.0.0.1:4173/
- **Admin:** http://127.0.0.1:4173/admin/  — `admin` / `iceflower2026`  **(change this!)**

## Admin panel (`/admin/`)

**Poems** — add, edit, delete, reorder, publish/unpublish. Stanzas are edited in a
human-friendly flat format: verses split by ` / `, stanzas by a blank line. **Images**
are uploaded inline on the same form — add as many per poem as you like; they appear
as a thumbnail strip in the reader. Existing images are kept on edit (no re-upload).

**Categories** — add/rename themes, set order, slugs auto-filled.

**Site media & ambient audio** — upload an MP3/OGG/WAV here; it replaces the
built-in procedural sound and is injected into the page automatically. Clear it to
revert to the procedural water + silk-string engine (WebAudio, zero files).

## Features

- **Library starts empty** — the gallery shows a blank-pages state until poems are added
  from the admin (`python3 manage.py seed --demo` reloads the 12 demo poems if wanted)
- **Two themes** — Ice (cyan soul energy, default) and Fire (ember/cinnabar). Toggle in
  the header, persisted in `localStorage`; the ink artwork itself warms under Fire
- **Multi-image poems** — several images per poem, switched via a thumbnail strip in the reader
- Masonry gallery, lazy-loaded art, cyan soul-energy hover aura
- Full-screen reader: zoomable artwork, staggered verse entrance, prev/next, Esc
- Custom cursor (soul ember + trailing ring)
- **Mobile-optimized**: swipeable filter strip, 2-col masonry on phones, larger touch targets, landscape handling
- Scroll-reveal, ink-mist/grain atmosphere, reduced-motion support
- Ambient audio toggle: uploaded file **or** built-in procedural WebAudio

## Tests

```bash
npm install --no-save jsdom node-fetch@2      # once, for the frontend harness
# start the server, then:
SMOKE_URL=http://127.0.0.1:4173 node scripts/smoke-test.js   # gallery/empty/theme checks
python3 scripts/test-admin.py                                 # admin CRUD + images + audio checks
node scripts/gen-art.js          # regenerate the 12 ink artworks
```

## Project layout

```
ifl/            Django project (settings, urls)
library/        app: models (Poem, Category, SiteMedia), admin, views
templates/      index.html (Django template + inline SITE config)
static/         css/style.css · js/app.js · fonts/stellar-oracle.ttf · art/*.svg
media/          user uploads (artwork, audio) — gitignored
scripts/        gen-art.js · export-seed.js · seed.py (management cmd) · smoke-test.js
```

Original verses, ink rendered by hand, silence curated by WebAudio.