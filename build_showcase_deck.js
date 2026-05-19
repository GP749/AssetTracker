// Asset Tracker — portfolio showcase deck
// Dark/modern aesthetic mirroring the app's UI.
//
// Run from the project root:
//   npm i -D pptxgenjs
//   node build_showcase_deck.js
//
// Outputs:  Asset_Tracker_Showcase.pptx  (next to this file)

const pptxgen = require("pptxgenjs");

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.3" x 7.5"
pres.title = "Asset Tracker — Portfolio Showcase";
pres.author = "Prakash Gurung";

// ───────────────────────── PALETTE (from app's globals.css) ─────────────────────────
const C = {
  base: "08080A",
  surface: "111114",
  surface2: "16161A",
  surface3: "1C1C22",
  line: "26272D",
  line2: "33343B",
  fg: "FAFAFA",
  fgDim: "C9CAD1",
  mute: "8A8A93",
  mute2: "5A5B63",
  accent: "3B82F6",
  accentBright: "60A5FA",
  accentDim: "1E3A8A",
  emerald: "10B981",
  amber: "F59E0B",
  red: "EF4444",
  zinc: "71717A",
};

const MONO = "Consolas";
const SANS = "Calibri";

// ───────────────────────── HELPERS ─────────────────────────
function darkBg(slide) {
  slide.background = { color: C.base };
}

function panel(slide, x, y, w, h, opts = {}) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x, y, w, h,
    fill: { color: opts.fill || C.surface },
    line: { color: opts.border || C.line, width: 0.75 },
  });
}

function kicker(slide, x, y, w, text, color = C.accentBright) {
  slide.addText(text, {
    x, y, w, h: 0.28,
    fontFace: MONO, fontSize: 9, charSpacing: 5,
    color, bold: false, margin: 0, valign: "top",
  });
}

function statusDot(slide, x, y, color = C.accent, size = 0.12) {
  slide.addShape(pres.shapes.OVAL, {
    x, y, w: size, h: size,
    fill: { color },
    line: { color, width: 0 },
  });
}

function chip(slide, x, y, w, label, value, dotColor) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x, y, w, h: 0.42,
    fill: { color: C.surface2 },
    line: { color: C.line, width: 0.75 },
  });
  statusDot(slide, x + 0.12, y + 0.15, dotColor, 0.12);
  slide.addText([
    { text: value, options: { color: C.fg, fontSize: 13, bold: true, fontFace: MONO } },
    { text: "  " + label.toUpperCase(), options: { color: C.mute, fontSize: 9, fontFace: MONO, charSpacing: 3 } },
  ], { x: x + 0.32, y, w: w - 0.32, h: 0.42, valign: "middle", margin: 0 });
}

function bgGlow(slide) {
  slide.addShape(pres.shapes.OVAL, {
    x: 3.5, y: -4.2, w: 6.5, h: 6.5,
    fill: { color: C.accent, transparency: 88 },
    line: { color: C.accent, width: 0 },
  });
  slide.addShape(pres.shapes.OVAL, {
    x: 8.5, y: -4.8, w: 5.0, h: 5.0,
    fill: { color: "6366F1", transparency: 92 },
    line: { color: "6366F1", width: 0 },
  });
}

function brandMark(slide, x, y, size = 0.4) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x, y, w: size, h: size,
    fill: { color: C.accentDim, transparency: 75 },
    line: { color: C.accent, width: 1.25 },
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: x + size * 0.33, y: y + size * 0.33, w: size * 0.34, h: size * 0.34,
    fill: { color: C.accentBright },
    line: { color: C.accentBright, width: 0 },
  });
}

function pageHeader(slide, kickerText, title) {
  brandMark(slide, 0.5, 0.4, 0.35);
  slide.addText([
    { text: "Asset", options: { color: C.fg, fontSize: 11, bold: true, fontFace: SANS } },
    { text: "·", options: { color: C.accentBright, fontSize: 11, bold: true, fontFace: SANS } },
    { text: "Tracker", options: { color: C.fg, fontSize: 11, bold: true, fontFace: SANS } },
  ], { x: 0.95, y: 0.4, w: 4, h: 0.35, valign: "middle", margin: 0 });

  kicker(slide, 0.5, 1.05, 8, kickerText);
  slide.addText(title, {
    x: 0.5, y: 1.32, w: 12.3, h: 0.7,
    fontFace: SANS, fontSize: 30, bold: true, color: C.fg, margin: 0,
  });
}

function footer(slide, pageNo, total) {
  slide.addShape(pres.shapes.LINE, {
    x: 0.5, y: 0.95, w: 12.3, h: 0,
    line: { color: C.line, width: 0.5 },
  });
  slide.addText("asset-tracker · portfolio showcase", {
    x: 0.5, y: 7.05, w: 6, h: 0.3,
    fontFace: MONO, fontSize: 8, color: C.mute2, charSpacing: 3, margin: 0,
  });
  slide.addText(`${String(pageNo).padStart(2, "0")} / ${String(total).padStart(2, "0")}`, {
    x: 11.3, y: 7.05, w: 1.5, h: 0.3,
    fontFace: MONO, fontSize: 8, color: C.mute2, align: "right", margin: 0,
  });
}

const TOTAL = 10;

// ───────────────────────── SLIDE 1 — COVER ─────────────────────────
{
  const s = pres.addSlide();
  darkBg(s);
  bgGlow(s);

  brandMark(s, 0.6, 0.55, 0.55);
  s.addText([
    { text: "Asset", options: { color: C.fg, fontSize: 16, bold: true, fontFace: SANS } },
    { text: "·", options: { color: C.accentBright, fontSize: 16, bold: true, fontFace: SANS } },
    { text: "Tracker", options: { color: C.fg, fontSize: 16, bold: true, fontFace: SANS } },
  ], { x: 1.3, y: 0.55, w: 5, h: 0.55, valign: "middle", margin: 0 });

  s.addText("v0.1 · portfolio build", {
    x: 9.5, y: 0.7, w: 3.3, h: 0.3,
    fontFace: MONO, fontSize: 9, color: C.mute, align: "right", charSpacing: 3, margin: 0,
  });

  kicker(s, 0.6, 2.4, 6, "project.showcase");

  s.addText("Asset Tracker.", {
    x: 0.55, y: 2.7, w: 12, h: 1.5,
    fontFace: SANS, fontSize: 90, bold: true, color: C.fg, margin: 0, charSpacing: -2,
  });

  s.addText("Local-first check-in / check-out for the tools, gear and gadgets your team actually shares.", {
    x: 0.6, y: 4.35, w: 10.5, h: 0.9,
    fontFace: SANS, fontSize: 19, color: C.fgDim, margin: 0,
  });

  const baseY = 5.7;
  chip(s, 0.6, baseY, 2.2, "available", "42", C.emerald);
  chip(s, 2.9, baseY, 2.2, "loaned", "7", C.amber);
  chip(s, 5.2, baseY, 2.2, "maintenance", "2", C.zinc);
  chip(s, 7.5, baseY, 2.2, "overdue", "1", C.red);

  s.addText([
    { text: "BUILT WITH ", options: { color: C.mute2, fontSize: 9, charSpacing: 3, fontFace: MONO } },
    { text: "Next.js 16  ·  React 19  ·  Prisma 7  ·  SQLite  ·  Tailwind v4  ·  Recharts", options: { color: C.mute, fontSize: 9, fontFace: MONO } },
  ], { x: 0.6, y: 6.6, w: 12, h: 0.3, valign: "middle", margin: 0 });

  s.addText("kash_1749@hotmail.com  ·  2026", {
    x: 7, y: 7.1, w: 5.8, h: 0.3,
    fontFace: MONO, fontSize: 8, color: C.mute2, align: "right", charSpacing: 3, margin: 0,
  });
}

// ───────────────────────── SLIDE 2 — THE PROBLEM ─────────────────────────
{
  const s = pres.addSlide();
  darkBg(s);
  pageHeader(s, "01 · the problem", "Where did the drill go?");
  footer(s, 2, TOTAL);

  s.addText(
    "Workshops, maker spaces and small teams share dozens of expensive tools across a handful of people. Spreadsheets get stale, sticky notes vanish, and “I thought you had it” becomes the daily standup.",
    {
      x: 0.5, y: 2.4, w: 5.8, h: 2.6,
      fontFace: SANS, fontSize: 16, color: C.fgDim, paraSpaceAfter: 8, margin: 0,
    }
  );

  const items = [
    { label: "tracking", title: "Lost & stale inventory", body: "No one knows what’s in the cabinet vs. someone’s truck." },
    { label: "accountability", title: "Who has it right now?", body: "When the saw goes missing, the trail goes cold." },
    { label: "overdue", title: "Silent overdues", body: "Tools sit out for weeks before anyone notices." },
  ];
  const rx = 6.8, rw = 6.0;
  items.forEach((it, i) => {
    const ry = 2.3 + i * 1.45;
    panel(s, rx, ry, rw, 1.25, { fill: C.surface, border: C.line });
    s.addShape(pres.shapes.RECTANGLE, {
      x: rx, y: ry, w: 0.06, h: 1.25,
      fill: { color: i === 2 ? C.red : C.accent },
      line: { color: i === 2 ? C.red : C.accent, width: 0 },
    });
    kicker(s, rx + 0.3, ry + 0.18, 3, it.label);
    s.addText(it.title, {
      x: rx + 0.3, y: ry + 0.42, w: rw - 0.5, h: 0.4,
      fontFace: SANS, fontSize: 16, bold: true, color: C.fg, margin: 0,
    });
    s.addText(it.body, {
      x: rx + 0.3, y: ry + 0.82, w: rw - 0.5, h: 0.4,
      fontFace: SANS, fontSize: 12, color: C.mute, margin: 0,
    });
  });

  s.addText("80%", {
    x: 0.5, y: 5.2, w: 3, h: 1.4,
    fontFace: SANS, fontSize: 96, bold: true, color: C.accentBright, margin: 0, charSpacing: -3,
  });
  s.addText("of small workshops still track shared tools on paper or spreadsheets.", {
    x: 0.5, y: 6.55, w: 5.8, h: 0.5,
    fontFace: MONO, fontSize: 10, color: C.mute, charSpacing: 1, margin: 0,
  });
}

// ───────────────────────── SLIDE 3 — WHAT IT DOES ─────────────────────────
{
  const s = pres.addSlide();
  darkBg(s);
  pageHeader(s, "02 · what it does", "Six things, done well.");
  footer(s, 3, TOTAL);

  const features = [
    { tag: "inventory", title: "Live tool catalog", body: "Photos, categories, locations and live status badges across every item.", color: C.accent },
    { tag: "scan.qr",   title: "Phone-camera scan", body: "Print a QR sticker, point a phone, jump to that tool’s page instantly.", color: C.accentBright },
    { tag: "checkout",  title: "One-tap check-out", body: "Pick a member, add a note, hit borrow. Returns capture damage + condition.", color: C.emerald },
    { tag: "overdue",   title: "Overdue radar", body: "Anything out longer than the cutoff lights up red across the app.", color: C.red },
    { tag: "insights",  title: "Stock & loan analytics", body: "KPIs, status donut, category stack, daily activity and top borrowers.", color: C.amber },
    { tag: "team",      title: "Lightweight members", body: "No auth ceremony — just a member picker and a cookie. Friction-free.", color: C.zinc },
  ];

  const cols = 3, gap = 0.25;
  const cardW = (12.3 - gap * 2) / 3;
  const cardH = 1.85;
  const startX = 0.5, startY = 2.3;

  features.forEach((f, i) => {
    const cx = startX + (i % cols) * (cardW + gap);
    const cy = startY + Math.floor(i / cols) * (cardH + gap);
    panel(s, cx, cy, cardW, cardH, { fill: C.surface });

    s.addShape(pres.shapes.RECTANGLE, {
      x: cx + 0.35, y: cy + 0.32, w: 0.55, h: 0.55,
      fill: { color: f.color, transparency: 82 },
      line: { color: f.color, width: 1 },
    });
    s.addShape(pres.shapes.OVAL, {
      x: cx + 0.535, y: cy + 0.505, w: 0.18, h: 0.18,
      fill: { color: f.color }, line: { color: f.color, width: 0 },
    });

    kicker(s, cx + 1.05, cy + 0.36, cardW - 1.2, f.tag, f.color);
    s.addText(f.title, {
      x: cx + 1.05, y: cy + 0.6, w: cardW - 1.2, h: 0.4,
      fontFace: SANS, fontSize: 15, bold: true, color: C.fg, margin: 0,
    });
    s.addText(f.body, {
      x: cx + 0.35, y: cy + 1.05, w: cardW - 0.6, h: 0.75,
      fontFace: SANS, fontSize: 11.5, color: C.mute, margin: 0,
    });
  });
}

// ───────────────────────── SLIDE 4 — USER FLOW ─────────────────────────
{
  const s = pres.addSlide();
  darkBg(s);
  pageHeader(s, "03 · user flow", "Borrow → return, in four taps.");
  footer(s, 4, TOTAL);

  const steps = [
    { n: "01", title: "Scan", body: "Point camera at the QR sticker on the tool.", color: C.accentBright },
    { n: "02", title: "Borrow", body: "Pick yourself, add an optional note, confirm.", color: C.emerald },
    { n: "03", title: "Use it", body: "Status flips to CHECKED_OUT for the whole team.", color: C.amber },
    { n: "04", title: "Return", body: "Tap return, note condition, flag damage if any.", color: C.accent },
  ];

  const sw = 2.8, sh = 2.6, gap = 0.3;
  const totalW = sw * 4 + gap * 3;
  const sx = (13.3 - totalW) / 2;
  const sy = 2.65;

  steps.forEach((st, i) => {
    const x = sx + i * (sw + gap);
    panel(s, x, sy, sw, sh, { fill: C.surface });
    s.addText(st.n, {
      x: x + 0.25, y: sy + 0.2, w: sw, h: 1.1,
      fontFace: SANS, fontSize: 56, bold: true, color: st.color, charSpacing: -2, margin: 0,
    });
    kicker(s, x + 0.3, sy + 1.32, sw - 0.5, "step." + (i + 1), st.color);
    s.addText(st.title, {
      x: x + 0.3, y: sy + 1.58, w: sw - 0.5, h: 0.4,
      fontFace: SANS, fontSize: 18, bold: true, color: C.fg, margin: 0,
    });
    s.addText(st.body, {
      x: x + 0.3, y: sy + 2.0, w: sw - 0.5, h: 0.5,
      fontFace: SANS, fontSize: 11.5, color: C.mute, margin: 0,
    });

    if (i < steps.length - 1) {
      const ax = x + sw + 0.02;
      const ay = sy + sh / 2 - 0.07;
      s.addShape(pres.shapes.LINE, {
        x: ax, y: ay + 0.07, w: gap - 0.04, h: 0,
        line: { color: C.line2, width: 1 },
      });
      s.addShape(pres.shapes.RIGHT_TRIANGLE, {
        x: ax + gap - 0.16, y: ay - 0.03, w: 0.18, h: 0.18,
        fill: { color: C.line2 }, line: { color: C.line2, width: 0 }, rotate: 90,
      });
    }
  });

  s.addText("Average: ~12 seconds end-to-end on a phone. No login wall, no install.", {
    x: 0.5, y: 6.0, w: 12.3, h: 0.4,
    fontFace: MONO, fontSize: 10, color: C.mute, align: "center", charSpacing: 2, margin: 0,
  });
}

// ───────────────────────── SLIDE 5 — DATA MODEL ─────────────────────────
{
  const s = pres.addSlide();
  darkBg(s);
  pageHeader(s, "04 · data model", "Three tables. That’s the whole app.");
  footer(s, 5, TOTAL);

  const cardY = 2.55, cardH = 3.6, cardW = 3.7, gap = 0.55;
  const totalW = cardW * 3 + gap * 2;
  const startX = (13.3 - totalW) / 2;

  function entity(x, name, kicker_, color, fields) {
    panel(s, x, cardY, cardW, cardH, { fill: C.surface });
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: cardY, w: cardW, h: 0.08,
      fill: { color }, line: { color, width: 0 },
    });
    kicker(s, x + 0.3, cardY + 0.25, cardW - 0.5, kicker_, color);
    s.addText(name, {
      x: x + 0.3, y: cardY + 0.5, w: cardW - 0.6, h: 0.5,
      fontFace: MONO, fontSize: 22, bold: true, color: C.fg, margin: 0,
    });
    s.addShape(pres.shapes.LINE, {
      x: x + 0.3, y: cardY + 1.07, w: cardW - 0.6, h: 0,
      line: { color: C.line, width: 0.5 },
    });
    let fy = cardY + 1.2;
    fields.forEach(([fname, ftype, note]) => {
      s.addText([
        { text: fname, options: { color: C.fg, fontSize: 11, fontFace: MONO, bold: true } },
      ], { x: x + 0.3, y: fy, w: cardW - 0.6, h: 0.22, margin: 0, valign: "top" });
      s.addText([
        { text: ftype + (note ? "   " : ""), options: { color: C.accentBright, fontSize: 9, fontFace: MONO } },
        { text: note || "", options: { color: C.mute2, fontSize: 9, fontFace: MONO, italic: true } },
      ], { x: x + 0.3, y: fy + 0.22, w: cardW - 0.6, h: 0.22, margin: 0, valign: "top" });
      fy += 0.55;
    });
  }

  entity(startX, "Tool", "table.tool", C.accentBright, [
    ["id", "String", "cuid"],
    ["name · category", "String", ""],
    ["status", "Enum", "AVAILABLE · CHECKED_OUT · MAINTENANCE"],
    ["photoUrl · location", "String?", ""],
  ]);

  entity(startX + cardW + gap, "Checkout", "table.checkout", C.amber, [
    ["id", "String", "cuid"],
    ["toolId → memberId", "FK", "joins both sides"],
    ["checkedOutAt · returnedAt", "DateTime", ""],
    ["damageReported · returnCondition", "Bool · String?", ""],
  ]);

  entity(startX + (cardW + gap) * 2, "Member", "table.member", C.emerald, [
    ["id", "String", "cuid"],
    ["name", "String", ""],
    ["createdAt", "DateTime", ""],
    ["checkouts[]", "1 → many", "history per person"],
  ]);

  const lineY = cardY + cardH + 0.15;
  s.addShape(pres.shapes.LINE, {
    x: startX + cardW * 0.5, y: lineY,
    w: cardW + gap, h: 0,
    line: { color: C.accent, width: 1, dashType: "dash" },
  });
  s.addText("1  :  many", {
    x: startX + cardW * 0.5, y: lineY + 0.08, w: cardW + gap, h: 0.3,
    fontFace: MONO, fontSize: 9, color: C.accentBright, align: "center", charSpacing: 3, margin: 0,
  });
  s.addShape(pres.shapes.LINE, {
    x: startX + cardW * 1.5 + gap, y: lineY,
    w: cardW + gap, h: 0,
    line: { color: C.emerald, width: 1, dashType: "dash" },
  });
  s.addText("many  :  1", {
    x: startX + cardW * 1.5 + gap, y: lineY + 0.08, w: cardW + gap, h: 0.3,
    fontFace: MONO, fontSize: 9, color: C.emerald, align: "center", charSpacing: 3, margin: 0,
  });
}

// ───────────────────────── SLIDE 6 — INSIGHTS DASHBOARD ─────────────────────────
{
  const s = pres.addSlide();
  darkBg(s);
  pageHeader(s, "05 · insights", "Stock & loan analytics.");
  footer(s, 6, TOTAL);

  const kpis = [
    { label: "total stock", value: "52", color: C.fg, dot: null },
    { label: "available", value: "42", color: C.emerald, dot: C.emerald },
    { label: "loaned out", value: "7", color: C.amber, dot: C.amber },
    { label: "maintenance", value: "2", color: C.fgDim, dot: C.zinc },
    { label: "overdue · >7d", value: "1", color: C.red, dot: C.red },
    { label: "total checkouts", value: "168", color: C.accentBright, dot: C.accent },
  ];
  const kw = (12.3 - 0.18 * 5) / 6, kh = 0.95;
  kpis.forEach((k, i) => {
    const kx = 0.5 + i * (kw + 0.18);
    panel(s, kx, 2.35, kw, kh, { fill: C.surface });
    if (k.dot) statusDot(s, kx + 0.2, 2.5, k.dot, 0.1);
    s.addText(k.label.toUpperCase(), {
      x: kx + (k.dot ? 0.36 : 0.2), y: 2.4, w: kw - 0.3, h: 0.25,
      fontFace: MONO, fontSize: 8, color: C.mute, charSpacing: 2, margin: 0,
    });
    s.addText(k.value, {
      x: kx + 0.2, y: 2.65, w: kw - 0.2, h: 0.6,
      fontFace: SANS, fontSize: 28, bold: true, color: k.color, margin: 0,
    });
  });

  panel(s, 0.5, 3.55, 4.5, 3.3, { fill: C.surface });
  kicker(s, 0.7, 3.7, 3, "status.breakdown");
  s.addText("Current inventory by status", {
    x: 0.7, y: 3.92, w: 4, h: 0.3,
    fontFace: SANS, fontSize: 10, color: C.mute, margin: 0,
  });
  s.addChart(pres.charts.DOUGHNUT, [{
    name: "Status",
    labels: ["Available", "Loaned", "Maintenance"],
    values: [42, 7, 2],
  }], {
    x: 0.6, y: 4.2, w: 4.3, h: 2.55,
    chartColors: [C.emerald, C.amber, C.zinc],
    chartArea: { fill: { color: C.surface } },
    plotArea:  { fill: { color: C.surface } },
    showLegend: true, legendPos: "b",
    legendFontFace: MONO, legendFontSize: 8, legendColor: C.mute,
    showPercent: false, showValue: true,
    dataLabelColor: C.fg, dataLabelFontFace: MONO, dataLabelFontSize: 9,
    holeSize: 60,
  });

  panel(s, 5.15, 3.55, 7.65, 3.3, { fill: C.surface });
  kicker(s, 5.35, 3.7, 4, "activity.daily");
  s.addText("Checkouts opened per day · last 14d", {
    x: 5.35, y: 3.92, w: 6, h: 0.3,
    fontFace: SANS, fontSize: 10, color: C.mute, margin: 0,
  });
  const days = ["D-13","D-12","D-11","D-10","D-9","D-8","D-7","D-6","D-5","D-4","D-3","D-2","D-1","Today"];
  const vals = [3, 5, 2, 6, 4, 7, 5, 8, 6, 9, 7, 11, 8, 6];
  s.addChart(pres.charts.LINE, [{ name: "Checkouts", labels: days, values: vals }], {
    x: 5.2, y: 4.2, w: 7.55, h: 2.55,
    chartColors: [C.accentBright],
    chartArea: { fill: { color: C.surface } },
    plotArea:  { fill: { color: C.surface } },
    lineSize: 2.5, lineSmooth: true,
    showLegend: false,
    catAxisLabelColor: C.mute, valAxisLabelColor: C.mute,
    catAxisLabelFontFace: MONO, valAxisLabelFontFace: MONO,
    catAxisLabelFontSize: 8, valAxisLabelFontSize: 8,
    valGridLine: { color: C.line, size: 0.5, style: "solid" },
    catGridLine: { style: "none" },
    showValue: false,
  });
}

// ───────────────────────── SLIDE 7 — TECH STACK ─────────────────────────
{
  const s = pres.addSlide();
  darkBg(s);
  pageHeader(s, "06 · stack", "Modern, minimal, local-first.");
  footer(s, 7, TOTAL);

  const stack = [
    { tag: "FRAMEWORK",  name: "Next.js 16",        note: "App Router, server actions, async params, route handlers." },
    { tag: "UI",         name: "React 19",          note: "Server components, transitions, the new use() hook." },
    { tag: "STYLING",    name: "Tailwind v4",       note: "@theme inline tokens, dark variant, mono numerics." },
    { tag: "DATABASE",   name: "Prisma 7 + SQLite", note: "better-sqlite3 adapter, single-file DB, fast migrations." },
    { tag: "CHARTS",     name: "Recharts",          note: "Donut, stacked bar, daily activity, top borrowers." },
    { tag: "QR",         name: "html5-qrcode + qrcode", note: "In-browser camera scanning + label generation." },
    { tag: "PERSISTENCE", name: "Local-first",      note: "Single dev.db file. No external services. Owns its data." },
    { tag: "TS",         name: "TypeScript 5",      note: "Strict mode, generated Prisma types." },
  ];

  const cols = 4, rows = 2;
  const gap = 0.22;
  const cardW = (12.3 - gap * (cols - 1)) / cols;
  const cardH = (5.2 - gap * (rows - 1)) / rows;
  const sx = 0.5, sy = 2.3;

  stack.forEach((t, i) => {
    const cx = sx + (i % cols) * (cardW + gap);
    const cy = sy + Math.floor(i / cols) * (cardH + gap);
    panel(s, cx, cy, cardW, cardH, { fill: C.surface });
    s.addShape(pres.shapes.RECTANGLE, {
      x: cx, y: cy, w: 0.5, h: 0.04,
      fill: { color: C.accent }, line: { color: C.accent, width: 0 },
    });
    kicker(s, cx + 0.25, cy + 0.25, cardW - 0.4, t.tag);
    s.addText(t.name, {
      x: cx + 0.25, y: cy + 0.55, w: cardW - 0.5, h: 0.55,
      fontFace: SANS, fontSize: 17, bold: true, color: C.fg, margin: 0,
    });
    s.addText(t.note, {
      x: cx + 0.25, y: cy + 1.2, w: cardW - 0.5, h: cardH - 1.3,
      fontFace: SANS, fontSize: 10.5, color: C.mute, margin: 0,
    });
  });
}

// ───────────────────────── SLIDE 8 — DESIGN LANGUAGE ─────────────────────────
{
  const s = pres.addSlide();
  darkBg(s);
  pageHeader(s, "07 · design", "A dark, quiet, instrument-panel UI.");
  footer(s, 8, TOTAL);

  panel(s, 0.5, 2.4, 6.2, 4.4, { fill: C.surface });
  kicker(s, 0.7, 2.55, 4, "palette.semantic");
  s.addText("Tuned for low-light workshops and quick scanning.", {
    x: 0.7, y: 2.78, w: 5.8, h: 0.3,
    fontFace: SANS, fontSize: 10.5, color: C.mute, margin: 0,
  });

  const swatches = [
    { name: "base",    hex: "#08080A", c: C.base,    txt: C.fg },
    { name: "surface", hex: "#16161A", c: C.surface2, txt: C.fg },
    { name: "line",    hex: "#26272D", c: C.line,     txt: C.fg },
    { name: "accent",  hex: "#3B82F6", c: C.accent,   txt: C.fg },
    { name: "emerald", hex: "#10B981", c: C.emerald,  txt: C.base },
    { name: "amber",   hex: "#F59E0B", c: C.amber,    txt: C.base },
    { name: "red",     hex: "#EF4444", c: C.red,      txt: C.fg },
    { name: "mute",    hex: "#8A8A93", c: C.mute,     txt: C.base },
  ];
  const sCols = 4, sw = 1.32, sh = 1.55, sg = 0.12;
  const startX = 0.7, startY = 3.2;
  swatches.forEach((sw_, i) => {
    const sx = startX + (i % sCols) * (sw + sg);
    const sy = startY + Math.floor(i / sCols) * (sh + sg);
    s.addShape(pres.shapes.RECTANGLE, {
      x: sx, y: sy, w: sw, h: sh,
      fill: { color: sw_.c }, line: { color: C.line2, width: 0.5 },
    });
    s.addText(sw_.name, {
      x: sx + 0.12, y: sy + sh - 0.7, w: sw - 0.2, h: 0.3,
      fontFace: MONO, fontSize: 9, color: sw_.txt, charSpacing: 2, margin: 0, bold: true,
    });
    s.addText(sw_.hex, {
      x: sx + 0.12, y: sy + sh - 0.42, w: sw - 0.2, h: 0.3,
      fontFace: MONO, fontSize: 8, color: sw_.txt, margin: 0,
    });
  });

  panel(s, 6.9, 2.4, 5.9, 4.4, { fill: C.surface });
  kicker(s, 7.1, 2.55, 5, "typography & motifs");
  s.addText("Geist Sans + Geist Mono. Status dots. Mono kickers.", {
    x: 7.1, y: 2.78, w: 5.6, h: 0.3,
    fontFace: SANS, fontSize: 10.5, color: C.mute, margin: 0,
  });

  s.addText("Inventory", {
    x: 7.1, y: 3.2, w: 5.5, h: 0.7,
    fontFace: SANS, fontSize: 36, bold: true, color: C.fg, margin: 0,
  });
  s.addText("tools.list  ·  H1 / Geist Sans 30", {
    x: 7.1, y: 3.92, w: 5.5, h: 0.3,
    fontFace: MONO, fontSize: 9, color: C.accentBright, charSpacing: 3, margin: 0,
  });

  s.addText("DeWalt 20V Cordless Drill", {
    x: 7.1, y: 4.3, w: 5.5, h: 0.4,
    fontFace: SANS, fontSize: 16, bold: true, color: C.fg, margin: 0,
  });
  s.addText("Power Tools  ·  Cabinet B1", {
    x: 7.1, y: 4.65, w: 5.5, h: 0.3,
    fontFace: MONO, fontSize: 10, color: C.mute, charSpacing: 1, margin: 0,
  });

  const py = 5.15;
  function uiChip(x, label, value, dotColor) {
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: py, w: 1.55, h: 0.4,
      fill: { color: C.surface2 }, line: { color: C.line, width: 0.6 },
    });
    statusDot(s, x + 0.12, py + 0.14, dotColor, 0.12);
    s.addText([
      { text: value, options: { color: C.fg, fontSize: 12, bold: true, fontFace: MONO } },
      { text: " " + label, options: { color: C.mute, fontSize: 9, fontFace: MONO, charSpacing: 2 } },
    ], { x: x + 0.3, y: py, w: 1.3, h: 0.4, valign: "middle", margin: 0 });
  }
  uiChip(7.1, "AVAIL", "42", C.emerald);
  uiChip(8.75, "OUT", "7", C.amber);
  uiChip(10.4, "MAINT", "2", C.zinc);

  s.addText("“Reads like an instrument panel, not a CRM.”", {
    x: 7.1, y: 5.85, w: 5.5, h: 0.7,
    fontFace: SANS, fontSize: 13, italic: true, color: C.fgDim, margin: 0,
  });
}

// ───────────────────────── SLIDE 9 — ROADMAP ─────────────────────────
{
  const s = pres.addSlide();
  darkBg(s);
  pageHeader(s, "08 · roadmap", "What’s next on the bench.");
  footer(s, 9, TOTAL);

  const cols = [
    {
      title: "Now",
      kicker: "shipped",
      color: C.emerald,
      items: [
        "Inventory + photos + filters",
        "QR labels and phone scanner",
        "Checkout / return + overdue logic",
        "Insights dashboard with 4 charts",
        "Lightweight member picker",
      ],
    },
    {
      title: "Next",
      kicker: "in-flight",
      color: C.amber,
      items: [
        "Maintenance scheduler with reminders",
        "Per-tool history timeline",
        "CSV export for inventory & history",
        "Notifications when overdue",
      ],
    },
    {
      title: "Later",
      kicker: "exploring",
      color: C.accentBright,
      items: [
        "Multi-site / locations",
        "Self-host bundle + auth",
        "Mobile-first PWA",
        "Webhook integrations",
      ],
    },
  ];

  const colW = 4.0, colH = 4.5, gap = 0.3;
  const totalW = colW * 3 + gap * 2;
  const sx = (13.3 - totalW) / 2;
  const sy = 2.4;

  cols.forEach((col, i) => {
    const cx = sx + i * (colW + gap);
    panel(s, cx, sy, colW, colH, { fill: C.surface });
    s.addShape(pres.shapes.RECTANGLE, {
      x: cx, y: sy, w: colW, h: 0.08,
      fill: { color: col.color }, line: { color: col.color, width: 0 },
    });
    kicker(s, cx + 0.3, sy + 0.25, colW - 0.5, col.kicker, col.color);
    s.addText(col.title, {
      x: cx + 0.3, y: sy + 0.5, w: colW - 0.6, h: 0.55,
      fontFace: SANS, fontSize: 24, bold: true, color: C.fg, margin: 0,
    });
    s.addShape(pres.shapes.LINE, {
      x: cx + 0.3, y: sy + 1.12, w: colW - 0.6, h: 0,
      line: { color: C.line, width: 0.5 },
    });
    let iy = sy + 1.3;
    col.items.forEach((it) => {
      s.addShape(pres.shapes.RECTANGLE, {
        x: cx + 0.35, y: iy + 0.12, w: 0.08, h: 0.08,
        fill: { color: col.color }, line: { color: col.color, width: 0 },
      });
      s.addText(it, {
        x: cx + 0.55, y: iy, w: colW - 0.8, h: 0.45,
        fontFace: SANS, fontSize: 12, color: C.fgDim, margin: 0,
      });
      iy += 0.5;
    });
  });
}

// ───────────────────────── SLIDE 10 — CLOSING ─────────────────────────
{
  const s = pres.addSlide();
  darkBg(s);
  bgGlow(s);

  brandMark(s, 6.45, 1.8, 0.5);

  s.addText("thanks for looking.", {
    x: 0, y: 2.55, w: 13.3, h: 0.4,
    fontFace: MONO, fontSize: 11, color: C.accentBright, charSpacing: 6, align: "center", margin: 0,
  });

  s.addText("Asset Tracker.", {
    x: 0, y: 3.05, w: 13.3, h: 1.4,
    fontFace: SANS, fontSize: 80, bold: true, color: C.fg, align: "center", charSpacing: -2, margin: 0,
  });
  s.addText("A local-first inventory app that respects your shop, your data and your time.", {
    x: 1, y: 4.6, w: 11.3, h: 0.6,
    fontFace: SANS, fontSize: 16, color: C.fgDim, align: "center", margin: 0,
  });

  const ctaY = 5.7;
  const cta = [
    { l: "code", v: "/Asset Tracking", c: C.accentBright },
    { l: "stack", v: "Next.js · Prisma · SQLite", c: C.emerald },
    { l: "license", v: "MIT", c: C.amber },
  ];
  const cw = 3.4, cg = 0.25;
  const ctotal = cw * cta.length + cg * (cta.length - 1);
  const csx = (13.3 - ctotal) / 2;
  cta.forEach((t, i) => {
    const cx = csx + i * (cw + cg);
    panel(s, cx, ctaY, cw, 0.7, { fill: C.surface });
    statusDot(s, cx + 0.22, ctaY + 0.27, t.c, 0.16);
    s.addText([
      { text: t.l.toUpperCase() + "  ", options: { color: C.mute, fontSize: 9, fontFace: MONO, charSpacing: 3 } },
      { text: t.v, options: { color: C.fg, fontSize: 12, fontFace: MONO, bold: true } },
    ], { x: cx + 0.5, y: ctaY, w: cw - 0.6, h: 0.7, valign: "middle", margin: 0 });
  });

  s.addText("Prakash Gurung  ·  kash_1749@hotmail.com  ·  2026", {
    x: 0, y: 6.85, w: 13.3, h: 0.35,
    fontFace: MONO, fontSize: 9, color: C.mute2, align: "center", charSpacing: 3, margin: 0,
  });
}

// ───────────────────────── WRITE ─────────────────────────
pres.writeFile({ fileName: "Asset_Tracker_Showcase.pptx" })
  .then((f) => console.log("Wrote:", f))
  .catch((e) => { console.error(e); process.exit(1); });
