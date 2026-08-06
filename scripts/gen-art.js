// Generates procedural ink-wash / soul-energy SVG artwork for the gallery.
// Daeho aesthetic: layered mist, ridged mountains, drifting energy orbs,
// blurred ice-flower seal — all on the lake-obsidian void.
const fs = require("fs");
const path = require("path");

const OUT = path.join(__dirname, "..", "assets", "art");
fs.mkdirSync(OUT, { recursive: true });

const RNG = (n) => {
  let s = n % 2147483647 || 1;
  return () => ((s = (s * 16807) % 2147483647) / 2147483647);
};

// viewBox 0 0 500 560 (portrait ~4:5 "scroll")
function buildSvg(seed) {
  const r = RNG(seed);
  const hue = Math.floor(180 + r() * 140); // cyan -> steel blue / warm
  const light = `hsl(${hue}, 70%, 62%)`;
  const mid   = `hsl(${hue}, 40%, 34%)`;
  const dark  = `hsl(${hue}, 35%, 20%)`;

  function ridgeY(t, peaks) {
    let v = 0;
    for (const p of peaks) v += p.a * Math.sin(t * p.f + p.p);
    return v;
  }
  function ridgePts(g) {
    const t = [], pts = [`M0 ${g.base.toFixed(1)}`];
    for (let i = 0; i <= 30; i++) {
      const x = i / 30;
      pts.push(`L ${(x * 500).toFixed(1)} ${(g.base + ridgeY(x, g.peaks) * g.amp + (r() - 0.5) * 8).toFixed(1)}`);
    }
    pts.push(`L 500 680 L 0 680 Z`);
    return pts.join(" ");
  }

  const P = [];
  P.push(`<rect width="500" height="700" fill="#0a0e15"/>`);

  // mist blobs (blurred)
  for (let i = 0; i < 4; i++) {
    const cx = r() * 500, cy = 80 + r() * 420, w = 200 + r() * 260;
    P.push(`<ellipse cx="${cx.toFixed(0)}" cy="${cy.toFixed(0)}" rx="${(w / 2).toFixed(0)}" ry="${(w / 2.8).toFixed(0)}" fill="${dark}" opacity="${(0.25 + r() * 0.3).toFixed(2)}" filter="url(#blurBig)"/>`);
  }

  // ridgelines, back to front
  const layers = [
    { base: 240, amp: 60,  op: 0.30, peaks: [{ a: 1, f: 2.1, p: 1 }, { a: .5, f: 5.3, p: 3 }] },
    { base: 300, amp: 95,  op: 0.46, peaks: [{ a: 1, f: 2.4, p: 2 }, { a: .7, f: 4.1, p: .5 }] },
    { base: 380, amp: 140, op: 0.72, peaks: [{ a: 1, f: 1.7, p: .2 }, { a: .6, f: 7,   p: 4 }] },
  ];
  layers.forEach((L, i) => {
    P.push(`<path d="${ridgePts(L)}" fill="url(#ridg${i})" opacity="${L.op}"/>`);
  });
  // foreground dark wash pooling at bottom
  P.push(`<path d="M0 600 Q 120 560 260 585 T 500 610 L500 700 L0 700 Z" fill="#06090f"/>`);

  // drifting energy orbs
  for (let i = 0; i < 14; i++) {
    const cx = r() * 500, cy = 40 + r() * 560, rad = 1.5 + r() * 7;
    P.push(`<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${rad.toFixed(1)}" fill="${light}" opacity="${(0.2 + r() * 0.6).toFixed(2)}" filter="url(#glow)"/>`);
  }
  // bloom cartouche lower-left
  const bx = 70 + r() * 90, by = 420 + r() * 90, br = 16 + (seed % 12);
  P.push(`<circle cx="${bx.toFixed(0)}" cy="${by.toFixed(0)}" r="${br}" fill="none" stroke="${light}" stroke-width="1.2" opacity="0.85" filter="url(#glow)"/>`);
  P.push(`<circle cx="${bx.toFixed(0)}" cy="${by.toFixed(0)}" r="${br * 0.55}" fill="none" stroke="${light}" stroke-width="0.7" opacity="0.6" filter="url(#glow)"/>`);

  const defs = [
    `<filter id="blurBig" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="26"/></filter>`,
    `<filter id="glow" x="-200%" y="-200%" width="500%" height="500%"><feGaussianBlur stdDeviation="3.2" result="g"/><feMerge><feMergeNode in="g"/><feMergeNode in="SourceGraphic"/></feMerge></filter>`,
    `<linearGradient id="h0" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mid}"/><stop offset="1" stop-color="${dark}"/></linearGradient>`,
    `<linearGradient id="h1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mid}"/><stop offset="1" stop-color="${dark}"/></linearGradient>`,
    `<linearGradient id="h2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${dark}"/><stop offset="1" stop-color="#06090c"/></linearGradient>`,
  ];

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 700" preserveAspectRatio="xMidYMid slice">
<defs>${defs.join("")}</defs>
${P.join("")}
</svg>`;
}

const pieces = [
  { id: "ice-flower-scroll",      seed: 11 },
  { id: "water-fire-n1",           seed: 40 },
  { id: "shifting-soul-knot",    seed: 73 },
  { id: "shadow-gate",           seed: 91 },
  { id: "daeho-west-chronicle",  seed: 130 },
  { id: "water-and-fire",        seed: 177 },
  { id: "jin-awakening",        seed: 201 },
  { id: "ice-bloom-morn",        seed: 260 },
  { id: "ember-soul",           seed: 300 },
  { id: "mist-gate",            seed: 330 },
  { id: "winter-scarsal",       seed: 380 },
  { id: "night-willow",         seed: 410 },
];

pieces.forEach((p) => {
  fs.writeFileSync(path.join(OUT, `${p.id}.svg`), buildSvg(p.seed));
});
console.log("Generated", pieces.length, "SVG pieces.");