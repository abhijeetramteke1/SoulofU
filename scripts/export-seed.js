// Export static/js/data.js (window.POEMS + CATEGORIES) to scripts/seed_poems.json
// for the Django seed command. Run: node scripts/export-seed.js
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const dataSrc = fs.readFileSync(path.join(__dirname, "..", "static", "js", "data.js"), "utf8");
const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(dataSrc, sandbox);

const poems = (sandbox.window.POEMS || []).map(p => ({
  title: p.title,
  korean: p.korean,
  category: p.category,
  date_label: p.date,
  tags: p.tags.join(", "),
  excerpt: p.excerpt,
  art: p.art,
  stanzas: p.stanzas,
}));
const categories = sandbox.window.CATEGORIES.filter(c => c.id !== "all").map(c => ({
  label: c.label,
  slug: c.id,
  korean: c.korean,
}));

const out = { categories, poems };
fs.writeFileSync(path.join(__dirname, "seed_poems.json"), JSON.stringify(out, null, 2));
console.log(`Exported ${categories.length} categories, ${poems.length} poems → scripts/seed_poems.json`);