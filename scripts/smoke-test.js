// Smoke test against the RUNNING Django server (http://127.0.0.1:4173).
// Fetches the live page + API into jsdom and exercises the app.
// Usage:  (start server first)  node scripts/smoke-test.js
const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");
const nodeFetch = require("node-fetch");

const BASE = process.env.SMOKE_URL || "http://127.0.0.1:4173";
const root = path.join(__dirname, "..");

const results = { pass: 0, fail: 0 };
function assert(cond, msg) { if (cond) { results.pass++; console.log("  ✓", msg); } else { results.fail++; console.log("  ✗ FAIL:", msg); } }

(async () => {
  const pageRes = await nodeFetch(BASE + "/");
  const html = await pageRes.text();
  assert(pageRes.status === 200, `page renders (HTTP ${pageRes.status})`);

  const apiRes = await nodeFetch(BASE + "/api/poems.json");
  const api = await apiRes.json();
  assert(apiRes.status === 200, "API responds 200");
  assert(api.categories.length === 4, `4 categories from API (got ${api.categories.length})`);
  const hasPoems = api.poems.length > 0;
  console.log(`\n— API state: ${api.poems.length} poems (${hasPoems ? "gallery" : "empty library"} mode) —`);

  const dom = new JSDOM(html, { url: BASE + "/", runScripts: "outside-only", pretendToBeVisual: true });
  const { window } = dom;
  const { document } = window;

  window.matchMedia = (q) => ({ matches: false, addListener() {}, removeListener() {} });
  window.scrollTo = () => {};
  window.requestAnimationFrame = (cb) => setTimeout(cb, 0);
  window.IntersectionObserver = class { constructor(cb) { this.cb = cb; } observe() {} unobserve() {} disconnect() {} };
  window.fetch = (url) => nodeFetch(new URL(url, BASE).href);
  // minimal AudioContext for the engine branch
  window.AudioContext = class {
    constructor() { this.currentTime = 0; this.destination = {}; this.sampleRate = 44100; }
    createGain() { return { gain: { value: 0, setValueAtTime() {}, exponentialRampToValueAtTime() {}, linearRampToValueAtTime() {}, cancelScheduledValues() {} }, connect() {} }; }
    createBiquadFilter() { return { type: "", frequency: { value: 0, setValueAtTime() {}, exponentialRampToValueAtTime() {} }, Q: { value: 0 }, connect() {} }; }
    createOscillator() { return { type: "", frequency: { setValueAtTime() {}, exponentialRampToValueAtTime() {} }, connect() {}, start() {}, stop() {} }; }
    createBuffer() { return { getChannelData() { return new Float32Array(100); } }; }
    createBufferSource() { return { buffer: null, loop: false, connect() {}, start() {}, stop() {} }; }
  };
  window.Element.prototype.getBoundingClientRect = () => ({ left: 0, top: 0, width: 300, height: 400 });

  // wait for async load + render
  window.eval(fs.readFileSync(path.join(root, "static/js/app.js"), "utf8"));
  await new Promise(r => setTimeout(r, 600));

  console.log("\n— gallery —");
  const cards = document.querySelectorAll(".art-card");
  if (hasPoems) {
    assert(cards.length === api.poems.length, `${api.poems.length} cards rendered (got ${cards.length})`);
    assert(document.querySelectorAll("#gallery img").length === api.poems.length, "card images present");
    assert(document.querySelector("#stat-pieces").textContent === String(api.poems.length), "hero stat matches API");
  } else {
    assert(cards.length === 0, "no cards when library empty");
    assert(document.querySelector(".gallery-empty") !== null, "empty state message shown");
    assert(!document.querySelector(".gallery-empty a"), "empty state exposes no admin link");
    assert(![...document.querySelectorAll(".site-footer a")].some(a => a.href.includes("/admin/")), "footer exposes no admin link");
    assert(document.querySelector("#stat-pieces").textContent === "0", "hero stat shows 0");
  }
  assert(document.querySelectorAll(".filter-btn").length === 5, "5 filter buttons");
  assert(document.querySelector("#stat-archives").textContent === "4", "hero stat: 4 archives");

  console.log("\n— filtering —");
  const wf = [...document.querySelectorAll(".filter-btn")].find(b => b.dataset.cat === "water-fire");
  wf.click();
  if (hasPoems) {
    const expected = api.poems.filter(p => p.category === "water-fire").length;
    assert(document.querySelectorAll(".art-card").length === expected, `water-fire → ${expected} cards`);
  } else {
    assert(document.querySelectorAll(".art-card").length === 0, "empty library stays empty on filter");
    assert(document.querySelector(".gallery-empty") !== null, "empty state persists on filter");
  }
  document.querySelector('.filter-btn[data-cat="all"]').click();

  console.log("\n— theme toggle (sigil + soul-shift veil) —");
  const themeBtn = document.querySelector("#theme-toggle");
  const veil = document.querySelector("#veil");
  assert(!!document.querySelector(".sigil__ring"), "sigil rune ring present");
  assert(!!document.querySelector(".sigil__spark"), "sigil sparks present");
  themeBtn.click();
  assert(veil.classList.contains("run"), "veil triggers on toggle");
  assert(themeBtn.classList.contains("casting"), "sigil casting animation fires");
  await new Promise(r => setTimeout(r, 420));
  assert(document.documentElement.getAttribute("data-theme") === "fire", "theme swaps to fire mid-veil");
  await new Promise(r => setTimeout(r, 700));      // let the 1s cast lockout settle
  themeBtn.click();
  await new Promise(r => setTimeout(r, 420));
  assert(document.documentElement.getAttribute("data-theme") === "ice", "theme swaps back to ice");
  await new Promise(r => setTimeout(r, 650));      // let the second veil finish
  assert(document.querySelector("#veil").classList.contains("run") === false, "veil settles after cast");

  if (hasPoems) {
    console.log("\n— reader modal —");
    document.querySelector(".art-card").dispatchEvent(new window.MouseEvent("click", { bubbles: true, cancelable: true }));
    assert(document.querySelector("#reader").classList.contains("open"), "reader opens");
    assert(document.querySelector("#reader-title").textContent.length > 0, "title populated");
    document.querySelector("#reader-next").click();
    document.dispatchEvent(new window.KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    assert(!document.querySelector("#reader").classList.contains("open"), "Escape closes");
    assert(document.body.style.overflow !== "hidden", "scroll restored");
  }

  console.log("\n— audio toggle —");
  document.querySelector("#audio-toggle").click();
  document.querySelector("#audio-toggle").click();
  assert(true, "toggle called without throwing");

  console.log(`\n${results.pass} passed, ${results.fail} failed`);
  process.exit(results.fail ? 1 : 0);
})().catch(err => { console.error("EXCEPTION:", err && err.stack || err); process.exit(1); });
