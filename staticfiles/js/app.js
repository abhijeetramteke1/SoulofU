/* ═══════════════════════════════════════════════════════════════════════
   THE ICE FLOWER LIBRARY · app.js
   Vanilla JS — loads data from the Django API, renders gallery, filtering,
   reader modal, cursor, audio (uploaded file OR procedural), zoom.
   ═══════════════════════════════════════════════════════════════════════ */
(() => {
  "use strict";

  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const SITE = window.SITE || { audioUrl: "", audioLabel: "" };

  /* ── theme: apply saved choice before first paint ── */
  let theme = "ice";
  try { theme = localStorage.getItem("ifl-theme") === "fire" ? "fire" : "ice"; } catch (e) {}

  const ThemeBtn = $("#theme-toggle");
  const Veil = $("#veil");

  function setTheme(t, animate) {
    theme = t;
    document.documentElement.setAttribute("data-theme", t);
    try { localStorage.setItem("ifl-theme", t); } catch (e) {}
    ThemeBtn.setAttribute("aria-pressed", String(t === "fire"));
    ThemeBtn.setAttribute("aria-label", t === "ice"
      ? "Switch to the Fire theme"
      : "Switch to the Ice theme");
    if (animate) {
      ThemeBtn.classList.remove("casting"); void ThemeBtn.offsetWidth;
      ThemeBtn.classList.add("casting");
    }
  }
  setTheme(theme, false);

  /* — cast the sigil + sweep the soul-shift veil, swap theme mid-bloom — */
  let castBusy = false;
  ThemeBtn.addEventListener("click", () => {
    if (castBusy) return;
    castBusy = true;
    const next = theme === "ice" ? "fire" : "ice";
    // the storm wears the accent of where it is going
    Veil.style.setProperty("--veil-c",
      next === "fire" ? "rgba(255,107,53,0.6)" : "rgba(0,229,255,0.6)");
    Veil.classList.remove("run"); void Veil.offsetWidth;
    Veil.classList.add("run");
    // conjure within the button
    setTheme(next, true);
    // swap the realm while the veil covers the screen
    setTimeout(() => { setTheme(next, false); }, 300);
    setTimeout(() => { Veil.classList.remove("run"); castBusy = false; }, 1020);
  });

  let POEMS = [];      // populated from API
  const state = { activeFilter: "all", currentIndex: 0 };

  /* ════════════  DOM REFS  ════════════ */
  const gallery   = $("#gallery");
  const countEl   = $("#count");
  const filterBar = $("#filter-bar");
  const reader    = $("#reader");
  const stage     = $("#reader-stage");
  const stageImg  = $("#reader-img");
  const verseEl   = $("#reader-verse");
  const catEl     = $("#reader-cat");
  const titleEl   = $("#reader-title");
  const krEl      = $("#reader-kr");
  const metaEl    = $("#reader-meta");
  const stanzasEl = $("#reader-stanzas");
  const AudioBtn  = $("#audio-toggle");
  const dot       = $("#ember-cursor");
  const ring      = $("#ember-ring");

  /* ════════════  DATA LOAD  ════════════ */
  async function load() {
    const res = await fetch("/api/poems.json");
    if (!res.ok) throw new Error("API " + res.status);
    const data = await res.json();
    POEMS = data.poems || [];
    CATEGORIES = data.categories || [];
    POEMS.forEach((p, i) => (p._index = i));
    $("#stat-pieces").textContent = POEMS.length;
    $("#stat-archives").textContent = (data.categories || []).length;
    countEl.textContent = POEMS.length + " pieces";
    buildFilters();
    renderGallery();
  }

  /* ════════════  FILTERS  ════════════ */
  let CATEGORIES = [];
  function buildFilters() {
    filterBar.innerHTML = "";
    const list = [{ id: "all", label: "All Works", korean: "전체" }, ...CATEGORIES];
    list.forEach(cat => {
      const b = document.createElement("button");
      b.className = "filter-btn" + (cat.id === "all" ? " active" : "");
      b.dataset.cat = cat.id;
      b.innerHTML = `${cat.label}<span class="kr">${cat.korean}</span>`;
      b.addEventListener("click", () => setFilter(cat.id));
      filterBar.appendChild(b);
    });
    CATEGORIES.forEach(c => (CATEGORIES_MAP[c.id] = c));
  }
  const CATEGORIES_MAP = {};

  function setFilter(id) {
    state.activeFilter = id;
    $$(".filter-btn", filterBar).forEach(b => b.classList.toggle("active", b.dataset.cat === id));
    const label = CATEGORIES_MAP[id] || { label: "All Works", korean: "전체" };
    $("#gallery-head h2").textContent = label.label;
    $("#gallery-head .kr").textContent = label.korean;
    renderGallery();
  }

  function visiblePoems() {
    if (state.activeFilter === "all") return POEMS.slice();
    return POEMS.filter(p => p.category === state.activeFilter);
  }
  const catLabel = (id) => (CATEGORIES_MAP[id] && CATEGORIES_MAP[id].label) || "";

  /* ════════════  GALLERY  ════════════ */
  function cardFor(p) {
    const art = document.createElement("article");
    art.className = "art-card";
    art.setAttribute("tabindex", "0");
    art.dataset.index = p._index;
    art.setAttribute("aria-label", `${p.title} — open the poem`);

    const seal = `<svg class="art-card__seal" viewBox="0 0 24 24" fill="none" aria-hidden="true">` +
      `<rect x="6" y="6" width="12" height="12" rx="1.5" stroke="currentColor"/>` +
      `<path d="M12 9v6M9 12h6" stroke="currentColor"/></svg>`;

    const cover = p.art || (p.images && p.images[0]) || "";
    const img = cover
      ? `<img loading="lazy" decoding="async" src="${cover}" alt="Ink artwork for ${p.title}">`
      : `<div class="art-card__placeholder" aria-hidden="true"></div>`;

    art.innerHTML = `
      <div class="art-card__frame">
        ${img}
        ${seal}
        <div class="art-card__overlay">
          <span class="rule"></span>
          <p>“${p.excerpt || ""}”</p>
          <span class="more">Open · ${catLabel(p.category)}</span>
        </div>
      </div>
      <div class="art-card__meta">
        <span class="dot"></span>
        <span class="art-card__title">${p.title}<small>${p.korean || ""}</small></span>
        <span class="art-card__date">${p.date || ""}</span>
      </div>`;

    const frame = $(".art-card__frame", art);
    frame.addEventListener("mousemove", (e) => {
      const r = frame.getBoundingClientRect();
      frame.style.setProperty("--mx", (((e.clientX - r.left) / r.width) * 100).toFixed(1) + "%");
      frame.style.setProperty("--my", (((e.clientY - r.top) / r.height) * 100).toFixed(1) + "%");
    });

    const open = (ev) => { ev.preventDefault(); openReader(p._index); };
    art.addEventListener("click", open);
    art.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openReader(p._index); }
    });
    return art;
  }

  let revealObserver = null;
  function observeReveal() {
    const cards = $$(".art-card", gallery);
    if (!("IntersectionObserver" in window)) { cards.forEach(c => c.classList.add("revealed")); return; }
    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (en.isIntersecting) { en.target.classList.add("revealed"); revealObserver.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -6% 0px", threshold: 0.08 });
    cards.forEach(c => revealObserver.observe(c));
  }

  function renderGallery() {
    if (revealObserver) { revealObserver.disconnect(); revealObserver = null; }
    gallery.innerHTML = "";
    const poems = visiblePoems();
    if (!poems.length) {
      gallery.innerHTML =
        '<div class="gallery-empty">' +
          '<span class="glyph">❖</span>' +
          '<h3>The pages are still blank</h3>' +
          '<p>No poems have been archived yet. Return when the first piece has been written into the ledger.</p>' +
        '</div>';
      return;
    }
    poems.forEach((p, i) => {
      const art = cardFor(p);
      art.style.transitionDelay = `${Math.min(i, 9) * 45}ms`;
      gallery.appendChild(art);
    });
    requestAnimationFrame(observeReveal);
  }

  /* ════════════  READER / MODAL  ════════════ */
  let bodyScroll = 0;
  function openReader(index) {
    const list = visiblePoems();
    let pidx = list.findIndex(p => p._index === index);
    if (pidx < 0) pidx = 0;
    state.currentIndex = list[pidx]._index;
    bodyScroll = window.scrollY;
    document.body.style.overflow = "hidden";
    reader.classList.add("open");
    reader.setAttribute("aria-hidden", "false");
    renderReader(list[pidx]);
  }
  function closeReader() {
    reader.classList.remove("open");
    reader.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    resetZoom();
    window.scrollTo({ top: bodyScroll, behavior: "auto" });
  }
  function renderReader(p) {
    const num = p._index + 1;
    catEl.innerHTML = `${num < 10 ? "0" : ""}${num} · ${catLabel(p.category)} <span class="kr">${(CATEGORIES_MAP[p.category] && CATEGORIES_MAP[p.category].korean) || ""}</span>`;
    titleEl.textContent = p.title;
    krEl.textContent = p.korean || "";
    metaEl.innerHTML = (p.date ? `<span class="tag">${p.date.split("·")[0].trim()}</span>` : "") +
      (p.tags || []).map(t => `<span class="tag cyan">${t}</span>`).join("");

    stanzasEl.innerHTML = "";
    const delay = 90;
    (p.stanzas || []).forEach((stanza, si) => {
      const div = document.createElement("div");
      div.className = "stanza";
      stanza.forEach((line, li) => {
        const span = document.createElement("span");
        span.className = "verse-line";
        span.textContent = line;
        div.appendChild(span);
      });
      stanzasEl.appendChild(div);
    });

    // ── images: cover (art) + any additional uploaded images ──
    const thumbsEl = $("#reader-thumbs");
    const imgs = [];
    if (p.art) imgs.push(p.art);
    (p.images || []).forEach(u => { if (!imgs.includes(u)) imgs.push(u); });

    const setStage = (src) => {
      stageImg.src = src;
      stageImg.alt = `Ink artwork — ${p.title}`;
      resetZoom();
    };

    if (imgs.length) setStage(imgs[0]);
    else setStage("");

    // build thumbnail strip for multi-image pieces
    if (imgs.length > 1) {
      thumbsEl.hidden = false;
      thumbsEl.innerHTML = imgs.map((u, i) =>
        `<button class="${i === 0 ? "active" : ""}" data-idx="${i}" aria-label="Image ${i + 1} of ${imgs.length}">` +
          `<img loading="lazy" src="${u}" alt=""></button>`).join("");
      thumbsEl.querySelectorAll("button").forEach(b => {
        b.addEventListener("click", () => {
          const i = +b.dataset.idx;
          setStage(imgs[i]);
          thumbsEl.querySelectorAll("button").forEach(x => x.classList.toggle("active", x === b));
        });
      });
    } else {
      thumbsEl.hidden = true;
      thumbsEl.innerHTML = "";
    }

    resetZoom();
    verseEl.scrollTop = 0;
    requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(() => {
      $$(".verse-line", stanzasEl).forEach(l => l.classList.add("entered"));
    }, 140)));
  }

  /* ── zoom ── */
  const MIN = 1, MAX = 3.2;
  let zoom = 1;
  function resetZoom() {
    zoom = 1;
    stage.classList.remove("zoomed", "dragging");
    stageImg.style.transform = "";
  }
  stage.addEventListener("click", (e) => {
    if (stage.classList.contains("zoomed")) { resetZoom(); return; }
    const r = stage.getBoundingClientRect();
    const ox = ((e.clientX - r.left) / r.width) * 100;
    const oy = ((e.clientY - r.top) / r.height) * 100;
    zoom = 2;
    stageImg.style.setProperty("--ox", ox + "%");
    stageImg.style.setProperty("--oy", oy + "%");
    stage.classList.add("zoomed");
    stageImg.style.transform = `scale(${zoom})`;
  });
  stage.addEventListener("wheel", (e) => {
    if (!stage.classList.contains("zoomed")) return;
    e.preventDefault();
    zoom = Math.min(MAX, Math.max(MIN, zoom + (e.deltaY < 0 ? 0.18 : -0.18)));
    stageImg.style.transform = `scale(${zoom})`;
  }, { passive: false });

  /* ── nav + keyboard ── */
  function step(dir) {
    const list = visiblePoems();
    let idx = list.findIndex(p => p._index === state.currentIndex);
    idx = (idx + dir + list.length) % list.length;
    state.currentIndex = list[idx]._index;
    renderReader(list[idx]);
  }
  $("#reader-prev").addEventListener("click", (e) => { e.stopPropagation(); step(-1); });
  $("#reader-next").addEventListener("click", (e) => { e.stopPropagation(); step(1); });
  $("#reader-close").addEventListener("click", closeReader);
  $(".reader__backdrop").addEventListener("click", closeReader);
  document.addEventListener("keydown", (e) => {
    if (!reader.classList.contains("open")) return;
    if (e.key === "Escape") closeReader();
    if (e.key === "ArrowRight") step(1);
    if (e.key === "ArrowLeft") step(-1);
  });

  /* ════════════  CUSTOM CURSOR  ════════════ */
  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
    (function cursorLoop() {
      rx += (mx - rx) * 0.16; ry += (my - ry) * 0.16;
      dot.style.transform = `translate(${mx}px, ${my}px)`;
      ring.style.transform = `translate(${rx}px, ${ry}px)`;
      requestAnimationFrame(cursorLoop);
    })();
    window.addEventListener("mousemove", (e) => { mx = e.clientX; my = e.clientY; });
    document.addEventListener("mouseover", (e) => {
      const interactive = e.target.closest("a, button, .filter-btn, .art-card, .reader, .audio-toggle");
      document.body.classList.toggle("cursor-interactive", !!interactive);
    });
  } else {
    dot.style.display = ring.style.display = "none";
  }

  /* ════════════  AUDIO  ════════════
     1) If an admin-uploaded audio file exists → play it (loop).
     2) Otherwise → built-in procedural WebAudio (water + silk strings). */
  const ambientAudio = SITE.audioUrl ? new Audio(SITE.audioUrl) : null;
  if (ambientAudio) { ambientAudio.loop = true; ambientAudio.volume = 0.55; }

  const AudioEngine = (() => {
    let ctx = null, master = null, playing = false, timer = null;
    function ac() {
      if (!ctx) {
        ctx = new (window.AudioContext || window.webkitAudioContext)();
        master = ctx.createGain(); master.gain.value = 0;
        const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 3200; lp.Q.value = 0.4;
        master.connect(lp); lp.connect(ctx.destination);
      }
      return ctx;
    }
    function env(g, t, peak, decay) {
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(peak, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t + decay);
    }
    function drop(t) {
      const c = ac();
      const o = c.createOscillator(), g = c.createGain();
      o.type = "sine"; const freq = 620 + Math.random() * 420;
      o.frequency.setValueAtTime(freq * 1.6, t);
      o.frequency.exponentialRampToValueAtTime(freq * 0.9, t + 0.05);
      o.frequency.exponentialRampToValueAtTime(freq * 0.7, t + 0.45);
      o.connect(g); g.connect(master); env(g, t, 0.10, 0.75);
      o.start(t); o.stop(t + 0.95);
      const len = Math.floor(c.sampleRate * 0.08);
      const buf = c.createBuffer(1, len, c.sampleRate);
      const d = buf.getChannelData(0); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
      const src = c.createBufferSource(); src.buffer = buf;
      const bp = c.createBiquadFilter(); bp.type = "bandpass";
      bp.frequency.setValueAtTime(1800, t); bp.frequency.exponentialRampToValueAtTime(500, t + 0.3); bp.Q.value = 2.5;
      const g2 = c.createGain(); src.connect(bp); bp.connect(g2); g2.connect(master); env(g2, t, 0.05, 0.4);
      src.start(t);
    }
    const SCALE = [196, 220, 261.6, 293.7, 329.6, 392];
    function pluck(t) {
      const c = ac();
      const f = SCALE[Math.floor(Math.random() * SCALE.length)];
      const len = Math.max(2, Math.ceil(c.sampleRate / f));
      const buf = c.createBuffer(1, len, c.sampleRate);
      const d = buf.getChannelData(0); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * 0.24;
      const src = c.createBufferSource(); src.buffer = buf; src.loop = true;
      const comb = c.createBiquadFilter(); comb.type = "allpass"; comb.frequency.value = f; comb.Q.value = 8;
      const lp = c.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 2600;
      const g = c.createGain();
      src.connect(comb); comb.connect(lp); lp.connect(g); g.connect(master); env(g, t, 0.06, 2.8);
      src.start(t); src.stop(t + 3.0);
    }
    function schedule() {
      if (!playing) return;
      const t = ac().currentTime + 0.02;
      drop(t); if (Math.random() < 0.5) pluck(t + 0.35);
      timer = setTimeout(schedule, 3600 + Math.random() * 3600);
    }
    return {
      async start() {
        if (playing) return true;
        const c = ac();
        // Browsers create AudioContext in a "suspended" state until a user
        // gesture. Sound only plays once it's running — resume is async, so
        // await it instead of bailing out as we used to.
        if (c.state && c.state !== "running") {
          try { await c.resume(); } catch (e) { return false; }
        }
        if (playing) return true;   // another call started while we waited
        playing = true; clearTimeout(timer);
        const t = c.currentTime + 0.02;
        master.gain.cancelScheduledValues(t);
        master.gain.setValueAtTime(master.gain.value, t);
        master.gain.linearRampToValueAtTime(0.85, t + 0.9);
        schedule();
        return true;
      },
      resume() {
        if (ctx && ctx.state === "suspended") { try { ctx.resume(); } catch (e) {} }
      },
      stop() { playing = false; clearTimeout(timer); fadeOut(); },
    };
    function fadeOut() {
      if (!master) return;
      const t = (ctx || ac()).currentTime + 0.02;
      master.gain.cancelScheduledValues(t);
      master.gain.setValueAtTime(master.gain.value, t);
      master.gain.linearRampToValueAtTime(0, t + 0.9);
    }
  })();

  let audioOn = false;

  function setAudioUI(on) {
    audioOn = on;
    AudioBtn.classList.toggle("on", on);
    AudioBtn.setAttribute("aria-pressed", String(on));
    if (on) { if (hint) hint.classList.add("gone"); detachKick(); }
  }

  // start audio; resolves true only if sound is actually audible now.
  // Tries the file first, then falls back to the procedural engine.
  async function startAudio() {
    if (audioOn) return true;
    if (ambientAudio) {
      try {
        await ambientAudio.play();
        setAudioUI(true);
        return true;
      } catch (e) { /* 404 / bad codec / blocked -> fall through */ }
    }
    const ok = await AudioEngine.start();
    if (ok) setAudioUI(true);
    return ok;
  }

  function stopAudio() {
    if (!audioOn) return;
    if (ambientAudio) ambientAudio.pause();
    else AudioEngine.stop();
    setAudioUI(false);
  }

  AudioBtn.addEventListener("click", () => {
    if (audioOn) stopAudio(); else startAudio();
    const label = ambientAudio ? (SITE.audioLabel || "uploaded ambient") : "water and silk strings";
    AudioBtn.setAttribute("aria-label", `Toggle ambient sound (${label})`);
  });

  /* ── autoplay: browsers block sound until a real user gesture, so try on
         load, then keep listening on the first interaction until the sound
         is actually audible. Show a hint while it isn't (honest UX — true
         gesture-less autoplay is impossible on the web). ── */
  const hint = document.createElement("div");
  hint.id = "audio-hint";
  hint.setAttribute("role", "status");
  hint.textContent = "Tap anywhere to awaken the sound";
  document.body.appendChild(hint);

  function detachKick() {
    ["pointerdown", "keydown", "touchstart", "click"].forEach(ev =>
      window.removeEventListener(ev, onGesture, true));
  }
  function onGesture(e) {
    if (audioOn) return detachKick();
    // the audio toggle has its own click handler — don't double-fire it
    if (e.target && e.target.closest && e.target.closest(".audio-toggle")) return;
    autoplayNow();
  }
  function autoplayNow() {
    return startAudio().then(ok => {
      if (ok) { hint.classList.add("gone"); detachKick(); }
      return ok;
    });
  }
  ["pointerdown", "keydown", "touchstart", "click"].forEach(ev =>
    window.addEventListener(ev, onGesture, { capture: true }));

  // try immediately (a fresh same-origin activation may grant sound straight
  // away); reveal the hint only after a beat if it still hasn't started
  autoplayNow().then(ok => {
    if (ok) return;
    setTimeout(() => { if (!audioOn) hint.classList.add("show"); }, 1200);
  });

  /* ════════════  INIT  ════════════ */
  load().catch(err => {
    console.error("Failed to load the library:", err);
    $("#gallery").innerHTML = '<p style="grid-column:1/-1;color:var(--mist-dim);padding:40px;text-align:center">The library could not be reached.<br>Is the Django server running?</p>';
  });
})();