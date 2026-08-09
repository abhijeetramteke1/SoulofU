/* ═══════════════════════════════════════════════════════════════════════
   THE SHRINE OF DAEHO · app.js
   A fan shrine to the realm — character gallery, reader, favorites,
   element fate, procedural audio, ink-seal share cards, chronicle.
   ═══════════════════════════════════════════════════════════════════════ */
(() => {
  "use strict";

  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const SITE = window.SITE || { audioUrl: "", audioLabel: "" };

  /* ── theme: apply saved choice before first paint ── */
  const THEMES = ["ice", "fire", "neon"];
  let theme = "ice";
  try { const s = localStorage.getItem("ifl-theme"); if (THEMES.includes(s)) theme = s; } catch (e) {}

  const ThemeBtn = $("#theme-toggle");
  const Veil = $("#veil");

  const VEIL_C = { ice: "rgba(0,229,255,0.6)", fire: "rgba(255,107,53,0.6)", neon: "rgba(255,46,176,0.6)" };

  function setTheme(t, animate) {
    theme = t;
    document.documentElement.setAttribute("data-theme", t);
    try { localStorage.setItem("ifl-theme", t); } catch (e) {}
    ThemeBtn.setAttribute("aria-pressed", String(t === "fire" || t === "neon"));
    ThemeBtn.setAttribute("aria-label", "Switch theme");
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
    const next = THEMES[(THEMES.indexOf(theme) + 1) % THEMES.length];   // ice -> fire -> neon -> ice
    Veil.style.setProperty("--veil-c", VEIL_C[next]);
    Veil.classList.remove("run"); void Veil.offsetWidth;
    Veil.classList.add("run");
    setTheme(next, true);
    try { AudioEngine.setRegime(next === "neon" ? "ice" : next); } catch (e) {}
    setTimeout(() => { setTheme(next, false); }, 300);
    setTimeout(() => { Veil.classList.remove("run"); castBusy = false; }, 1020);
  });

  /* ════════════  CHARACTER DATA  ════════════ */
  const DATA = window.DAEHO || { filters: [], characters: [] };
  let CHARS = (DATA.characters || [])
    .map((c, i) => ({ ...c, _index: i, popularity: c.popularity || 50 }))
    .sort((a, b) => b.popularity - a.popularity)   // most-loved first
    .map((c, i) => ({ ...c, _index: i }));
  const FILTERS = DATA.filters || [];
  const FILTERS_MAP = {};
  FILTERS.forEach(f => (FILTERS_MAP[f.id] = f));
  const state = { activeFilter: "all", currentIndex: 0 };

  /* ════════════  FAVORITES  (the shrine's ledger)  ════════════ */
  let faves = [];
  try { faves = JSON.parse(localStorage.getItem("ifl-faves") || "[]"); } catch (e) { faves = []; }
  const isFave = (c) => faves.includes(c.id);
  function saveFaves() { try { localStorage.setItem("ifl-faves", JSON.stringify(faves)); } catch (e) {} }
  function toggleFave(c) {
    faves = isFave(c) ? faves.filter(x => x !== c.id) : [...faves, c.id];
    saveFaves();
    updateFavStat();
    $$(".fav-heart", gallery).forEach(b => {
      if (b.dataset.fav === c.id) {
        const on = isFave(c);
        b.classList.toggle("on", on);
        b.setAttribute("aria-pressed", String(on));
        b.setAttribute("aria-label", (on ? "Remove adoration from " : "Adore ") + c.name);
      }
    });
    $$(".adore-pill", gallery).forEach(b => {
      if (b.dataset.id === c.id) {
        const on = isFave(c);
        b.classList.toggle("on", on);
        b.setAttribute("aria-pressed", String(on));
        b.querySelector("span").textContent = on ? "Adored" : "Adore";
        b.setAttribute("aria-label", (on ? "Remove adoration from " : "Adore ") + c.name);
      }
    });
  }
  function updateFavStat() {
    const el = $("#stat-read");
    if (el) el.textContent = faves.length + " / " + CHARS.length;
  }

  /* ════════════  ELEMENT FATE (identity, for flavour + crests)  ════════════ */
  const SOUL = {
    ice:   { name: "Soul of the Ice Stone",     glyph: "❆", master: "You keep what the realm forgets — stillness is your blade." },
    fire:  { name: "Child of the Hwansu Flame", glyph: "❖", master: "Bound to the fire that remakes what it touches — you arrive already changed." },
    still: { name: "Bound to Still Water",      glyph: "◈", master: "The observer between water and fire — you see both, and choose the shrine." }
  };
  let soulKey = "still";
  try { soulKey = localStorage.getItem("ifl-soul"); } catch (e) {}
  if (!SOUL[soulKey]) soulKey = "still";
  document.documentElement.dataset.soul = soulKey;
  function renderFateLabel() {
    const label = $("#fate-label");
    if (!label) return;
    label.textContent = soulKey === "still" ? "Fate" : "Fate · " + SOUL[soulKey].name.split(" ").slice(-2).join(" ");
  }

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

  /* ════════════  CRESTS  ════════════ */
  function crestURI(c) {
    const fire = c.element === "fire";
    const c1 = fire ? "#ff7a45" : "#00e5ff";
    const c2 = fire ? "#fbbf24" : "#38bdf8";
    const svg =
      `<svg xmlns='http://www.w3.org/2000/svg' width='720' height='900' viewBox='0 0 720 900'>` +
      `<defs><radialGradient id='g' cx='50%' cy='42%' r='75%'>` +
      `<stop offset='0%' stop-color='${fire ? "#2a120b" : "#0a1d2e"}'/>` +
      `<stop offset='100%' stop-color='${fire ? "#120a07" : "#060a12"}'/>` +
      `</radialGradient></defs>` +
      `<rect width='720' height='900' fill='url(#g)'/>` +
      `<circle cx='360' cy='400' r='242' fill='none' stroke='${c1}' stroke-opacity='.32' stroke-width='2'/>` +
      `<circle cx='360' cy='400' r='202' fill='none' stroke='${c1}' stroke-opacity='.55' stroke-width='1.4' stroke-dasharray='3 7'/>` +
      `<circle cx='360' cy='400' r='122' fill='none' stroke='${c2}' stroke-opacity='.5' stroke-width='1.5'/>` +
      `<text x='360' y='445' text-anchor='middle' font-family='serif' font-size='160' fill='${c1}' opacity='.92'>${c.glyph}</text>` +
      `<text x='360' y='672' text-anchor='middle' font-family='serif' font-size='30' letter-spacing='12' fill='#e8eef5' opacity='.85'>${c.house.toUpperCase()}</text>` +
      `<text x='360' y='742' text-anchor='middle' font-family='sans-serif' font-size='21' letter-spacing='9' fill='#94a3b8'>${c.name.toUpperCase()}</text>` +
      `</svg>`;
    return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
  }
  const coverOf = (c) => c.art || crestURI(c);

  /* ════════════  FILTERS  ════════════ */
  function buildFilters() {
    filterBar.innerHTML = "";
    FILTERS.forEach(f => {
      const b = document.createElement("button");
      b.className = "filter-btn" + (f.id === "all" ? " active" : "");
      b.dataset.cat = f.id;
      b.innerHTML = `${f.label}<span class="kr">${f.korean}</span>`;
      b.addEventListener("click", () => setFilter(f.id));
      filterBar.appendChild(b);
    });
  }
  function setFilter(id) {
    state.activeFilter = id;
    $$(".filter-btn", filterBar).forEach(b => b.classList.toggle("active", b.dataset.cat === id));
    const f = FILTERS_MAP[id] || { label: "All Souls", korean: "전체" };
    $("#gallery-head h2").textContent = f.label;
    $("#gallery-head .kr").textContent = f.korean;
    renderGallery();
  }
  function visibleCharacters() {
    const f = state.activeFilter;
    if (f === "faves") return CHARS.filter(isFave);
    if (f === "fire" || f === "water") return CHARS.filter(c => c.element === f);
    return CHARS.slice();
  }

  /* ════════════  GALLERY  ════════════ */
  function cardFor(c) {
    const art = document.createElement("article");
    art.className = "art-card" + (isFave(c) ? " is-read" : "");
    art.dataset.index = c._index;
    art.dataset.elem = c.element || "mystic";
    art.setAttribute("aria-label", `${c.name} — open the shrine`);
    art.setAttribute("tabindex", "0");

    const img = `<img loading="lazy" decoding="async" src="${coverOf(c)}" alt="Portrait for ${c.name}"${c.fallback ? ` onerror="this.onerror=null;this.src='${c.fallback}';"` : ""}>`;
    art.innerHTML = `
      <div class="art-card__frame">
        ${img}
        <div class="art-card__overlay">
          <span class="rule"></span>
          <p>“${c.excerpt || ""}”</p>
          <span class="more">Adore · ${c.role}</span>
        </div>
        <button class="fav-heart${isFave(c) ? " on" : ""}" data-fav="${c.id}" aria-label="${isFave(c) ? "Remove adoration from " : "Adore "}${c.name}" aria-pressed="${isFave(c)}">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20s-7-4.6-9.2-9A5.2 5.2 0 0 1 12 6.2 5.2 5.2 0 0 1 21.2 11C19 15.4 12 20 12 20z"/></svg>
        </button>
      </div>
      <div class="art-card__meta">
        <span class="dot"></span>
        <div class="art-card__title">${c.name}<small>${c.korean || ""}</small></div>
        <button class="adore-pill${isFave(c) ? " on" : ""}" data-id="${c.id}" aria-pressed="${isFave(c)}" aria-label="${isFave(c) ? "Remove adoration from " : "Adore "}${c.name}">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20s-7-4.6-9.2-9A5.2 5.2 0 0 1 12 6.2 5.2 5.2 0 0 1 21.2 11C19 15.4 12 20 12 20z"/></svg>
          <span>${isFave(c) ? "Adored" : "Adore"}</span>
        </button>
      </div>`;

    art.querySelector(".fav-heart").addEventListener("click", (e) => {
      e.preventDefault(); e.stopPropagation();
      toggleFave(c);
    });
    art.querySelector(".fav-heart").addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); e.stopPropagation(); toggleFave(c); }
    });
    const adoreBt = art.querySelector(".adore-pill");
    adoreBt.addEventListener("click", (e) => { e.preventDefault(); e.stopPropagation(); toggleFave(c); });
    adoreBt.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); e.stopPropagation(); toggleFave(c); }
    });

    const frame = $(".art-card__frame", art);
    frame.addEventListener("mousemove", (e) => {
      const r = frame.getBoundingClientRect();
      frame.style.setProperty("--mx", (((e.clientX - r.left) / r.width) * 100).toFixed(1) + "%");
      frame.style.setProperty("--my", (((e.clientY - r.top) / r.height) * 100).toFixed(1) + "%");
    });

    const open = (ev) => { ev.preventDefault(); openReader(c._index); };
    art.addEventListener("click", open);
    art.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openReader(c._index); }
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
    const chars = visibleCharacters();
    if (!chars.length) {
      gallery.innerHTML =
        '<div class="gallery-empty">' +
          '<span class="glyph">❦</span>' +
          '<h3>No souls here yet</h3>' +
          '<p>' + (state.activeFilter === "faves"
            ? "You have not adored anyone yet. Tap the heart on a soul you love."
            : "The shrine is still gathering its souls. Return when they have been written in.") + '</p>' +
        '</div>';
      return;
    }
    chars.forEach((c, i) => {
      const art = cardFor(c);
      art.style.transitionDelay = `${Math.min(i, 9) * 45}ms`;
      gallery.appendChild(art);
    });
    requestAnimationFrame(observeReveal);
  }

  /* ════════════  READER / MODAL  ════════════ */
  let bodyScroll = 0;
  function openReader(index) {
    const list = visibleCharacters();
    let pidx = list.findIndex(c => c._index === index);
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
  function renderReader(c) {
    const num = c._index + 1;
    const elemLabel = (FILTERS_MAP[c.element] && FILTERS_MAP[c.element].label) || "Soul";
    catEl.innerHTML = `${num < 10 ? "0" : ""}${num} · ${c.role} <span class="kr">${c.korean || ""}</span>`;
    titleEl.textContent = c.name;
    krEl.textContent = c.korean || "";
    metaEl.innerHTML = `<span class="tag">${c.house}</span>` +
      `<span class="tag ${c.element === "fire" ? "fire" : "cyan"}">${elemLabel}</span>` +
      `<span class="tag loc">◈ ${c.location || "Daeho"}</span>` +
      (c.tags || []).map(t => `<span class="tag cyan">${t}</span>`).join("");

    stanzasEl.innerHTML = "";
    // the chronicle of the soul
    const bio = document.createElement("div");
    bio.className = "reader-sec";
    bio.innerHTML = `<h4 class="reader-sec__title">Chronicle</h4>`;
    (c.bio || []).forEach(p => {
      const para = document.createElement("p");
      para.className = "bio-p";
      para.textContent = p;
      bio.appendChild(para);
    });
    stanzasEl.appendChild(bio);
    // utterances — iconic lines
    if ((c.lines || []).length) {
      const ut = document.createElement("div");
      ut.className = "reader-sec";
      ut.innerHTML = `<h4 class="reader-sec__title">Utterances</h4>`;
      (c.lines || []).forEach(line => {
        const stanza = document.createElement("div");
        stanza.className = "stanza";
        const span = document.createElement("span");
        span.className = "verse-line";
        span.textContent = line;
        stanza.appendChild(span);
        ut.appendChild(stanza);
      });
      stanzasEl.appendChild(ut);
    }
    // bonds
    if ((c.relationships || []).length) {
      const bonds = document.createElement("div");
      bonds.className = "reader-sec";
      bonds.innerHTML = `<h4 class="reader-sec__title">Bonds</h4>`;
      (c.relationships || []).forEach(r => {
        const row = document.createElement("div");
        row.className = "bond";
        row.innerHTML = `<b>${r.name}</b><span>— ${r.note}</span>`;
        bonds.appendChild(row);
      });
      stanzasEl.appendChild(bonds);
    }

    // crest stage (wiki still -> ink fallback if hotlink dies)
    stageImg.setAttribute("src", coverOf(c));
    if (c.fallback) stageImg.onerror = () => { stageImg.onerror = null; stageImg.src = c.fallback; };
    stageImg.alt = `Portrait — ${c.name}`;
    const thumbsEl = $("#reader-thumbs");
    thumbsEl.hidden = true;
    thumbsEl.innerHTML = "";

    // adore toggle inside the reader
    const adore = $("#reader-adore");
    const on = isFave(c);
    adore.setAttribute("aria-pressed", String(on));
    adore.classList.toggle("on", on);
    adore.querySelector("span").textContent = on ? "Adored" : "Adore";

    resetZoom();
    verseEl.scrollTop = 0;
    requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(() => {
      $$(".verse-line, .bio-p, .bond", stanzasEl).forEach(l => l.classList.add("entered"));
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
    const list = visibleCharacters();
    let idx = list.findIndex(c => c._index === state.currentIndex);
    idx = (idx + dir + list.length) % list.length;
    state.currentIndex = list[idx]._index;
    renderReader(list[idx]);
  }
  $("#reader-prev").addEventListener("click", (e) => { e.stopPropagation(); step(-1); });
  $("#reader-next").addEventListener("click", (e) => { e.stopPropagation(); step(1); });
  $("#reader-close").addEventListener("click", closeReader);
  $(".reader__backdrop").addEventListener("click", closeReader);
  $("#reader-adore").addEventListener("click", () => {
    const list = visibleCharacters();
    const c = list.find(x => x._index === state.currentIndex);
    if (c) toggleFave(c);
  });
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
      const interactive = e.target.closest("a, button, .filter-btn, .art-card, .reader, .audio-toggle, .fav-heart");
      document.body.classList.toggle("cursor-interactive", !!interactive);
    });
  } else {
    dot.style.display = ring.style.display = "none";
  }

  /* ════════════  AUDIO  ════════════
     1) An uploaded file plays when present (loop).
     2) Otherwise the procedural WebAudio shrine-sound runs, with two
        regimes — ice (water + silk) and fire (embers + crackle). */
  const ambientAudio = SITE.audioUrl ? new Audio(SITE.audioUrl) : null;
  if (ambientAudio) { ambientAudio.loop = true; ambientAudio.volume = 0.55; }

  const AudioEngine = (() => {
    let ctx = null, master = null, playing = false, timer = null;
    let regime = theme;   // 'ice' | 'fire' — the procedural timbre adapts to the realm
    const REGIMES = {
      ice:  { dropBase: 620, dropSpan: 420, dropMult: 1.6, dropFall: 0.9, pluckScale: [196, 220, 261.6, 293.7, 329.6, 392] },
      fire: { dropBase: 300, dropSpan: 260, dropMult: 1.5, dropFall: 0.85, pluckScale: [174.6, 196, 220, 261.6, 293.7] }
    };
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
      const R = REGIMES[regime];
      const warm = regime === "fire";
      const o = c.createOscillator(), g = c.createGain();
      o.type = warm ? "triangle" : "sine";
      const freq = R.dropBase + Math.random() * R.dropSpan;
      o.frequency.setValueAtTime(freq * R.dropMult, t);
      o.frequency.exponentialRampToValueAtTime(freq * R.dropFall, t + 0.05);
      o.frequency.exponentialRampToValueAtTime(freq * 0.7, t + 0.45);
      o.connect(g); g.connect(master); env(g, t, warm ? 0.085 : 0.10, 0.75);
      o.start(t); o.stop(t + 0.95);
      if (warm && Math.random() < 0.5) crackle(t, c);   // ember sparks
      const len = Math.floor(c.sampleRate * 0.08);
      const buf = c.createBuffer(1, len, c.sampleRate);
      const d = buf.getChannelData(0); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
      const src = c.createBufferSource(); src.buffer = buf;
      const bp = c.createBiquadFilter(); bp.type = "bandpass";
      bp.frequency.setValueAtTime(1800, t); bp.frequency.exponentialRampToValueAtTime(500, t + 0.3); bp.Q.value = 2.5;
      const g2 = c.createGain(); src.connect(bp); bp.connect(g2); g2.connect(master); env(g2, t, 0.05, 0.4);
      src.start(t);
    }
    function crackle(t, c) {
      const ct = Math.max(t + 0.01, c.currentTime + 0.01);
      for (let i = 0; i < 5; i++) {
        const nt = ct + Math.random() * 0.18;
        const len = Math.floor(c.sampleRate * (0.004 + Math.random() * 0.012));
        const buf = c.createBuffer(1, len, c.sampleRate);
        const d = buf.getChannelData(0); for (let j = 0; j < len; j++) d[j] = (Math.random() * 2 - 1) * (1 - j / len);
        const s = c.createBufferSource(); s.buffer = buf;
        const hp = c.createBiquadFilter(); hp.type = "highpass"; hp.frequency.value = 2200;
        const g = c.createGain(); s.connect(hp); hp.connect(g); g.connect(master);
        g.gain.setValueAtTime(0.0001, nt);
        g.gain.exponentialRampToValueAtTime(0.05, nt + 0.002);
        g.gain.exponentialRampToValueAtTime(0.0001, nt + 0.025);
        s.start(nt);
      }
    }
    function pluck(t) {
      const c = ac();
      const R = REGIMES[regime];
      const f = R.pluckScale[Math.floor(Math.random() * R.pluckScale.length)];
      const len = Math.max(2, Math.ceil(c.sampleRate / f));
      const buf = c.createBuffer(1, len, c.sampleRate);
      const d = buf.getChannelData(0); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * 0.24;
      const src = c.createBufferSource(); src.buffer = buf; src.loop = true;
      const comb = c.createBiquadFilter(); comb.type = "allpass"; comb.frequency.value = f; comb.Q.value = 8;
      const lp = c.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = regime === "fire" ? 1800 : 2600;
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
      setRegime(t) { if (REGIMES[t]) regime = t; },
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
  // persist the visitor's sound preference (silent vs. on) across visits.
  // NOTE: the browser still forbids auto-starting audio on load — so this
  // preference is honored on the next user gesture, not on render.
  let audioPref = "on";
  try { audioPref = localStorage.getItem("ifl-audio") === "off" ? "off" : "on"; } catch (e) {}

  function setAudioUI(on) {
    audioOn = on;
    try { localStorage.setItem("ifl-audio", on ? "on" : "off"); } catch (e) {}
    AudioBtn.classList.toggle("on", on);
    AudioBtn.setAttribute("aria-pressed", String(on));
    if (on) { if (hint) hint.classList.add("gone"); detachKick(); }
  }

  // start audio; resolves true only if sound is actually audible now.
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
    const label = ambientAudio ? (SITE.audioLabel || "shrine music") : "water and silk strings";
    AudioBtn.setAttribute("aria-label", `Toggle ambient sound (${label})`);
  });

  /* ── autoplay: browsers block sound until a real gesture ── */
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
    if (e.target && e.target.closest && e.target.closest(".audio-toggle")) return;
    autoplayNow();
  }
  function autoplayNow() {
    if (audioPref !== "on") return Promise.resolve(false);   // visitor chose silence
    return startAudio().then(ok => {
      if (ok) { hint.classList.add("gone"); detachKick(); }
      return ok;
    });
  }
  ["pointerdown", "keydown", "touchstart", "click"].forEach(ev =>
    window.addEventListener(ev, onGesture, { capture: true }));

  autoplayNow().then(ok => {
    if (ok) return;
    if (audioPref !== "on") return;              // they asked for silence — no nudge
    setTimeout(() => { if (!audioOn) hint.classList.add("show"); }, 1200);
  });

  /* ════════════  FATE CONSULT — the element quiz  ════════════ */
  const FATE_Q = [
    { q: "Dawn breaks over the lake. What calls to you first?", ice: "The stillness of the water", fire: "The warmth behind the light" },
    { q: "A soul is shaken loose and drifts between hands. You —", ice: "Hold it steady and read it", fire: "Let it burn and be reborn" },
    { q: "Snow falls on Daeho. Your instinct is to —", ice: "Record its shape before it melts", fire: "Walk into it and let it change you" },
    { q: "Jinyowon's gate stands before you. Behind it:", ice: "A library of every remembered soul", fire: "A furnace that refines what it consumes" },
    { q: "Choose an heirloom worth carrying:", ice: "A brittle petal of the ice flower", fire: "An ember that never quite dies" }
  ];
  const Fate = {
    el: $("#fate"), view: $("#fate-view"),
    q: 0, answers: { ice: 0, fire: 0 },
    open() {
      this.q = 0; this.answers.ice = 0; this.answers.fire = 0;
      this.el.classList.add("open"); this.el.setAttribute("aria-hidden", "false");
      this.renderQ();
      document.body.style.overflow = "hidden";
    },
    close() {
      this.el.classList.remove("open"); this.el.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    },
    renderQ() {
      const item = FATE_Q[this.q];
      if (!item) return this.renderResult();
      const w = this.q / FATE_Q.length;
      this.view.innerHTML = `
        <p class="fate__eyebrow">The Fate Counsel · ${this.q + 1} of ${FATE_Q.length}</p>
        <h2 id="fate-title" class="fate__q">“${item.q}”</h2>
        <div class="fate__options">
          <button class="fate__opt" data-k="ice">${item.ice}<span class="kr">氷</span></button>
          <button class="fate__opt fire" data-k="fire">${item.fire}<span class="kr">火</span></button>
        </div>
        <div class="fate__track"><i style="width:${w * 100}%"></i></div>`;
      $$(".fate__opt", this.view).forEach(b => b.addEventListener("click", (e) => {
        this.answers[e.currentTarget.dataset.k] += 1;
        this.q += 1; this.renderQ();
      }));
    },
    renderResult() {
      const a = this.answers;
      const key = a.fire > a.ice ? "fire" : (a.ice > a.fire ? "ice" : "still");
      const s = SOUL[key];
      adoptSoul(key);
      const tint = key === "fire" ? "#ff7a45" : (key === "ice" ? "#00e5ff" : "#e2e8f0");
      this.view.innerHTML = `
        <p class="fate__eyebrow">The counsel has spoken</p>
        <div class="fate__glyph" style="color:${tint}">${s.glyph}</div>
        <h2 id="fate-title" class="fate__name">${s.name}</h2>
        <p class="fate__master">“${s.master}”</p>
        <p class="fate__note">A soul to seek, then: <em>${elementHerald(key)}</em> — open their shrine and see if they feel like yours.</p>
        <div class="fate__options fate__actions">
          <button class="btn-primary" id="fate-done">Adopt this fate</button>
          <button class="btn-ghost" id="fate-again">Consult again</button>
        </div>`;
      $("#fate-done").addEventListener("click", () => this.close());
      $("#fate-again").addEventListener("click", () => { this.q = 0; this.answers.ice = 0; this.answers.fire = 0; this.renderQ(); });
    }
  };
  function elementHerald(key) {
    const list = CHARS.filter(c => (key === "fire" ? c.element === "fire" : c.element !== "fire"));
    return list.length ? list[0].name : "no soul yet written";
  }
  function adoptSoul(key) {
    soulKey = key;
    try { localStorage.setItem("ifl-soul", key); } catch (e) {}
    document.documentElement.dataset.soul = key;
    renderFateLabel();
  }
  $("#fate-toggle").addEventListener("click", () => Fate.open());
  $("#fate-close").addEventListener("click", () => Fate.close());
  $(".fate__backdrop") && $(".fate__backdrop").addEventListener("click", () => Fate.close());
  document.addEventListener("keydown", (e) => {
    if (Fate.el.classList.contains("open") && e.key === "Escape") Fate.close();
  });

  /* ════════════  INK-SEAL SHARE CARDS  ════════════ */
  const Seal = {
    el: $("#seal"), canvas: $("#seal-canvas"),
    open() { this.el.classList.add("open"); this.el.setAttribute("aria-hidden", "false"); },
    close() { this.el.classList.remove("open"); this.el.setAttribute("aria-hidden", "true"); }
  };
  function wrapFit(ctx, text, x, y, maxW, lh) {
    ctx.textAlign = "center";
    const words = text.split(/\s+/); let line = "", i = 0;
    while (i < words.length) {
      const test = line ? line + " " + words[i] : words[i];
      if (ctx.measureText(test).width > maxW && line) { ctx.fillText(line, x, y); line = words[i]; y += lh; }
      else line = test;
      i++;
    }
    ctx.fillText(line, x, y);
    return y;
  }
  function wrapBlock(ctx, lines, x, y, maxW, lh) {
    ctx.textAlign = "center";
    for (let li = 0; li < lines.length; li++) {
      const ln = lines[li]; let cur = "";
      for (let i = 0; i < ln.length; i++) {
        const test = cur + ln[i];
        if (ctx.measureText(test).width > maxW && cur) { ctx.fillText(cur, x, y); cur = ln[i]; y += lh; }
        else cur = test;
      }
      ctx.fillText(cur, x, y); y += lh;
    }
    return y;
  }
  function buildSeal(c) {
    const canvas = Seal.canvas, ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;
    const fire = c.element === "fire" || theme === "fire";
    const tint = fire ? "#ff7a45" : "#00e5ff";
    const g = ctx.createLinearGradient(0, 0, W, H);
    if (fire) { g.addColorStop(0, "#1c0d09"); g.addColorStop(.5, "#3a140c"); g.addColorStop(1, "#120a08"); }
    else      { g.addColorStop(0, "#08121c"); g.addColorStop(.5, "#0a1d2e"); g.addColorStop(1, "#060a12"); }
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = fire ? "rgba(255,122,69,.18)" : "rgba(0,229,255,.16)";
    ctx.lineWidth = 1;
    for (let r = 240; r < 620; r += 90) { ctx.beginPath(); ctx.arc(W / 2, H / 2, r, 0, Math.PI * 2); ctx.stroke(); }
    const pad = 64, accent = fire ? "rgba(217,119,6,.55)" : "rgba(0,229,255,.4)";
    ctx.strokeStyle = accent; ctx.lineWidth = 2; ctx.strokeRect(pad, pad, W - pad * 2, H - pad * 2);
    ctx.lineWidth = 1; ctx.strokeRect(pad + 14, pad + 14, W - (pad + 14) * 2, H - (pad + 14) * 2);
    const cx = W / 2;
    ctx.fillStyle = "#e8eef5";
    ctx.font = "700 68px 'Cormorant Garamond', 'Noto Serif KR', serif";
    let y = wrapFit(ctx, c.name, cx, 240, W - 320, 76);
    ctx.fillStyle = tint;
    ctx.font = "400 40px 'Noto Serif KR', serif";
    if (c.korean) { ctx.fillText(c.korean, cx, (y += 46)); }
    ctx.fillStyle = "rgba(148,163,184,.85)";
    ctx.font = "500 24px 'Cinzel', 'Noto Serif KR', serif";
    ctx.fillText((c.role || c.house || "").toUpperCase(), cx, (y += 44));
    y += 26;
    // the soul's words
    ctx.fillStyle = "#d6dfe9";
    ctx.font = "400 38px 'Lora', 'Noto Serif KR', serif";
    const lines = [];
    if (c.excerpt) lines.push(c.excerpt);
    (c.lines || []).forEach(l => lines.push(l.replace(/^“|”$/g, "")));
    y = wrapBlock(ctx, lines, cx, y, W - 380, 58);
    // glyph
    ctx.fillStyle = tint;
    ctx.font = "46px 'Cinzel', serif";
    ctx.fillText(c.glyph, cx, H - 160);
    ctx.fillStyle = "rgba(148,163,184,.75)";
    ctx.font = "600 22px 'Cinzel', 'Noto Serif KR', serif";
    ctx.fillText("THE SHRINE OF DAEHO · SOUL BOUND ARCHIVES", cx, H - 96);
    Seal.open();
  }
  $("#seal-btn").addEventListener("click", () => {
    const list = visibleCharacters();
    const c = list.find(x => x._index === state.currentIndex) || list[0];
    if (c) buildSeal(c);
  });
  $("#seal-download").addEventListener("click", () => {
    const a = document.createElement("a");
    a.download = "daeho-shrine-seal.png";
    a.href = Seal.canvas.toDataURL("image/png");
    a.click();
  });
  $("#seal-close").addEventListener("click", () => Seal.close());
  $(".seal__backdrop") && $(".seal__backdrop").addEventListener("click", () => Seal.close());
  document.addEventListener("keydown", (e) => {
    if (Seal.el.classList.contains("open") && e.key === "Escape") Seal.close();
  });

  renderFateLabel();

  /* ════════════  INIT  ════════════ */
  function load() {
    $("#stat-pieces").textContent = CHARS.length;
    updateFavStat();
    countEl.textContent = CHARS.length + " souls";
    buildFilters();
    renderGallery();
  }
  load();
})();