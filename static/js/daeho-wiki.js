/* ═══════════════════════════════════════════════════════════════════════
   THE CHRONICLE OF DAEHO · themed wiki (client-seeded)
   Lore gathered by the Ice Flower Library. Written to breathe with the
   realm's palette — ice/cyan in Winter, ember/gold under the Fire theme.
   ═══════════════════════════════════════════════════════════════════════ */

window.DAEHO_WIKI = {
  categories: [
    { id: "realm",   label: "Realms & Places", korean: "강토", glyph: "◈" },
    { id: "arts",    label: "Arts & Alchemy",  korean: "술법", glyph: "✧" },
    { id: "souls",   label: "Souls & Beasts",  korean: "혼",   glyph: "❖" },
    { id: "houses",  label: "Houses & People", korean: "집안", glyph: "❦" },
    { id: "objects", label: "Objects of Power",korean: "영물", glyph: "❂" }
  ],
  entries: [
    /* ── Realms & Places ───────────────────────────────────────────── */
    {
      id: "daeho", category: "realm", title: "Daeho", korean: "대호",
      excerpt: "A realm where water argues with fire, and every soul is a coin in transit.",
      body: [
        "Daeho is the heartland of the world — a land of great rivers and colder mountains, where the two great disciplines of water and fire are not merely practised but argued over with blade and brush alike. Its nine provinces are stitched together by law, rumour, and the ceaseless movement of souls between hands.",
        "It is said that no one truly leaves Daeho. Those who vanish from one ledger simply appear, rewritten, in another — sharper, or emptier, depending on who held them last."
      ],
      tags: ["realm", "water", "fire"]
    },
    {
      id: "jinyowon", category: "realm", title: "Jinyowon", korean: "진원",
      excerpt: "The House of the Ice Stone — a keep that keeps what it is forbidden to learn.",
      body: [
        "Jinyowon, the mystic institute standing at the realm's coldest edge, guards the forbidden arts — chief among them the shifting of souls. Its halls are quieter than they should be, and its gate is colder than any winter the nine provinces can name.",
        "Those accepted into its hidden circle find that the Ice Stone is less a treasure to be kept than a hunger to be fed. Jinyowon does not ask what you came to learn; it asks what you are willing to become."
      ],
      tags: ["jinyowon", "ice stone", "mages"]
    },
    {
      id: "cheonbugwan", category: "realm", title: "Cheonbugwan", korean: "천부관",
      excerpt: "The royal pavilion of records, where edicts and souls are filed side by side.",
      body: [
        "Cheonbugwan is the realm's great archive — the pavilion where royal edicts, tax ledgers, and whispered genealogies are kept under one roof against the cold. Courtiers call it the memory of Daeho.",
        "It is an open secret that the lowest shelves hold more than ink: names that were meant to be forgotten are filed here too, waiting for someone curious enough to pull them loose."
      ],
      tags: ["archive", "records", "royal"]
    },
    /* ── Arts & Alchemy ─────────────────────────────────────────────── */
    {
      id: "alchemy-of-souls", category: "arts", title: "Alchemy of Souls", korean: "환혼수",
      excerpt: "The shifty art of housing one soul in another's body — and the cost of the key.",
      body: [
        "Alchemy of Souls is the art of transferring a spirit from one vessel to another, and the crown jewel of every forbidden list Jinyowon keeps. Practised carelessly it is a cruelty; practised well, it is barely distinguishable from survival.",
        "Every shift rattles both parties. The art's true price is never the body traded, but the boundary thinned — each exchange teaches the soul a little more of how easily it can be moved, and a little less of how to stay."
      ],
      tags: ["alchemy", "soul", "forbidden", "hwan"]
    },
    {
      id: "energy-shift", category: "arts", title: "The Energy Shift", korean: "수리수",
      excerpt: "The quiet discipline of gathering one's ki — the foundation under every art.",
      body: [
        "Before any mage of Daeho learns to shape water or kindle fire, they learn the Energy Shift — the patient art of drawing one's own life-force up from the well and keeping it steady. It is unglamorous, unrecorded in songs, and utterly indispensable.",
        "Masters say a strong shift is not loud. Like a deep river it moves without arguing, which is why those who truly command it rarely need to raise their voice — or their hand."
      ],
      tags: ["ki", "discipline", "mages"]
    },
    {
      id: "water-and-fire", category: "arts", title: "Water & Fire Arts", korean: "수화법",
      excerpt: "The twin disciplines whose quarrel keeps the realm honest.",
      body: [
        "Water and fire are not merely elements in Daeho — they are the two oldest arguments, and the two schools of combat that carry that argument into every generation. One cools, holds, and reflects; the other burns, remakes, and refuses to be contained.",
        "The greatest duelists learn that victory comes not from choosing a side in the argument, but from knowing when the realm does not want a victor at all."
      ],
      tags: ["water", "fire", "combat"]
    },
    /* ── Souls & Beasts ─────────────────────────────────────────────── */
    {
      id: "the-ice-stone", category: "souls", title: "The Ice Stone", korean: "빙석",
      excerpt: "A cold relic that holds souls the way a mirror holds a face.",
      body: [
        "The Ice Stone is the sigil and secret of Jinyowon — a relic of staggering power that stores souls within its frozen heart, keeping them suspended, unchanged, unaging. To hold it is to hold an infinite patience.",
        "But a thing that keeps souls keeps them jealously. Those who carry the Ice Stone long enough discover that it is not they who choose, in the end, whose name is written into it."
      ],
      tags: ["ice stone", "soul", "relic"]
    },
    {
      id: "souls", category: "souls", title: "Souls in Transit", korean: "혼",
      excerpt: "The realm's truest currency — changing hands like coins, never truly lost.",
      body: [
        "In Daeho, a soul is not an abstraction. It is a weight a body carries, a measure that can be shifted, kept, traded, or — in the cruelest arts — paid out on a debt. Books of the realm keep souls in the same ledgers as land and gold.",
        "The archive's quiet belief is that no soul is ever destroyed. They only travel, and the task of a library like this one is to give them somewhere honest to rest."
      ],
      tags: ["soul", "currency", "hwansu"]
    },
    /* ── Houses & People ────────────────────────────────────────────── */
    {
      id: "jang-family", category: "houses", title: "The Jang Family", korean: "장씨",
      excerpt: "A noble house bound to fire, and wearied by the Ice Stone's rumour.",
      body: [
        "The Jang have long been one of Daeho's great houses — name-knit to the fire arts and, by inheritance, to the secrets of the Ice Stone that made Jinowon what it is. Their name is spoken with both respect and wariness.",
        "Fire runs hot in the Jang blood, and with it a restlessness the family has spent generations trying to trim into discipline. Their heirs are renowned for brilliance, impatience, and the occasional great blaze."
      ],
      tags: ["house", "fire", "nobility"]
    },
    {
      id: "crown-prince", category: "houses", title: "The Crown Prince", korean: "세자",
      excerpt: "The realm's sharpest blade and loneliest heir.",
      body: [
        "The Crown Prince of Daeho is the sword the realm keeps drawn at all times — brilliant, fierce, and utterly alone at the centre of court. Every lesson he was given taught him to win; none taught him how to rest afterward.",
        "Those close to the throne whisper that the prince's sharpness is armour first and talent second: a boy taught to read betrayal in every bow, who never learned to read tenderness in a held silence."
      ],
      tags: ["royal", "prince", "court"]
    },
    /* ── Objects of Power ───────────────────────────────────────────── */
    {
      id: "jinyowon-bell", category: "objects", title: "The Bell of Jinyowon", korean: "진원종",
      excerpt: "It tolls only when souls are unquiet — and no one has heard it in years.",
      body: [
        "Suspended in the cold heart of Jinyowon hangs a bell that does not toll on the hour. It moves no more often than the realm's hidden griefs do — ringing only when a soul has been shifted against its will, when a debt of spirit comes due.",
        "The keepers swear it has been silent for longer than the oldest of them can remember. They do not agree on whether that is mercy, or simply that the bell has learned not to waste its voice."
      ],
      tags: ["bell", "jinyowon", "sign"]
    }
  ]
};

/* ── renderer ─────────────────────────────────────────────────────────── */
(() => {
  "use strict";
  if (!window.DAEHO_WIKI) return;
  const W = window.DAEHO_WIKI;
  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const C = {};

  W.categories.forEach(c => (C[c.id] = c));
  const catOf = (id) => C[id] || { label: "Lore", korean: "", glyph: "◈" };

  const overlay = $("#chronicle");
  const chipsEl = $("#chronicle-chips");
  const gridEl  = $("#chronicle-grid");
  if (!overlay || !gridEl) return;

  let activeCat = "all";

  function chipBtn(id, label, kr) {
    const b = document.createElement("button");
    b.className = "chronicle__chip" + (id === "all" ? " active" : "");
    b.dataset.cat = id;
    b.innerHTML = `${label}<span class="kr">${kr}</span>`;
    return b;
  }

  function renderChips() {
    chipsEl.innerHTML = "";
    chipsEl.appendChild(chipBtn("all", "All Records", "전체"));
    W.categories.forEach(c => chipsEl.appendChild(chipBtn(c.id, c.label, c.korean)));
    $$(".chronicle__chip", chipsEl).forEach(b => b.addEventListener("click", () => {
      activeCat = b.dataset.cat;
      $$(".chronicle__chip", chipsEl).forEach(x => x.classList.toggle("active", x === b));
      renderGrid();
    }));
  }

  function entryCard(e) {
    const c = catOf(e.category);
    const art = document.createElement("article");
    art.className = "wiki-card" + (activeCat !== "all" && e.category !== activeCat ? " hidden" : "");
    art.dataset.cat = e.category;
    art.innerHTML = `
      <button class="wiki-card__head" aria-expanded="false" aria-controls="wiki-${e.id}">
        <span class="wiki-card__glyph">${c.glyph}</span>
        <span class="wiki-card__titles"><b>${e.title}</b><small>${e.korean || ""}</small></span>
        <span class="wiki-card__cat">${c.label}</span>
        <span class="wiki-card__chev" aria-hidden="true"></span>
      </button>
      <div class="wiki-card__reveal" id="wiki-${e.id}" hidden>
        <p class="wiki-card__excerpt">“${e.excerpt}”</p>
        ${e.body.map(p => `<p>${p}</p>`).join("")}
        ${(e.tags || []).length ? `<div class="wiki-card__tags">${e.tags.map(t => `<span>${t}</span>`).join("")}</div>` : ""}
      </div>`;
    art.querySelector(".wiki-card__head").addEventListener("click", () => {
      const head = art.querySelector(".wiki-card__head");
      const revealed = art.querySelector(".wiki-card__reveal");
      const open = head.getAttribute("aria-expanded") === "true";
      head.setAttribute("aria-expanded", String(!open));
      revealed.hidden = open;
      art.classList.toggle("open", !open);
    });
    return art;
  }

  function renderGrid() {
    gridEl.innerHTML = "";
    const list = W.entries.filter(e => activeCat === "all" || e.category === activeCat);
    list.forEach((e, i) => {
      const card = entryCard(e);
      card.style.setProperty("--stagger", `${Math.min(i, 8) * 40}ms`);
      gridEl.appendChild(card);
    });
  }

  function open() {
    overlay.classList.add("open");
    overlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
  function close() {
    overlay.classList.remove("open");
    overlay.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  $("#chronicle-toggle").addEventListener("click", open);
  $("#footer-chronicle").addEventListener("click", (e) => { e.preventDefault(); open(); });
  $("#chronicle-close").addEventListener("click", close);
  $(".chronicle__backdrop") && $(".chronicle__backdrop").addEventListener("click", close);
  document.addEventListener("keydown", (e) => {
    if (overlay.classList.contains("open") && e.key === "Escape") close();
  });

  renderChips();
  renderGrid();

  // surface the record count in the hero stat (characters+records both feed it)
  const records = $("#stat-archives");
  if (records) records.textContent = (W.entries || []).length;
})();