// Brush-pen JS mark (05C geometry, stroke style D) as an SVG string.
// The brush is drawn as a filled outline whose width follows pen pressure:
// heavy on downstrokes, light on upstrokes, lifting off at the end of the S.

// Same geometry as design/older-logo/build.mjs (the monoline version).
const FULL = "M42 16 L42 62 C42 78 24 82 20 70 C17 60 32 56 46 54 C58 52 70 42 74 34 C70 26 58 26 55 34 C52 42 74 48 74 60 C73 72 60 78 50 72";
const CROSS = [[42, 55], [64, 46]];
// Segment indices of FULL: 0 stem, 1 J hook, 2-3 loop + rising line, 4-6 the S.
const STROKES = [[0, 1, 2, 3], [4, 5, 6]]; // the pen turns sharply at 74,34, so it is drawn as two strokes
const OVER = [[2, 3], [4, 5, 6]]; // loop over stem, S over rising line
const OFFSET = "translate(3.5 2)";
const GAP = 2.4;

// Two optical cuts: regular for >= 48px, small (heavier, less contrast) for favicons and tiny UI.
const CUTS = {
  regular: { width: (w) => w, clip: 7 },
  small: { width: (w) => w * 1.25 + 1.6, clip: 9 },
};

// ---- path sampling (absolute M / L / C only) ----
function segments(d) {
  const t = d.match(/[MLC]|-?\d*\.?\d+/g);
  const segs = [];
  let i = 0, cur = null;
  while (i < t.length) {
    const cmd = t[i++];
    const n = () => parseFloat(t[i++]);
    if (cmd === "M") cur = [n(), n()];
    else if (cmd === "L") { const p = [n(), n()]; segs.push([cur, p]); cur = p; }
    else if (cmd === "C") { const p = [[n(), n()], [n(), n()], [n(), n()]]; segs.push([cur, ...p]); cur = p[2]; }
  }
  return segs;
}
function at(p, u) {
  if (p.length === 2) return [p[0][0] + (p[1][0] - p[0][0]) * u, p[0][1] + (p[1][1] - p[0][1]) * u];
  const a = (1 - u) ** 3, b = 3 * (1 - u) ** 2 * u, c = 3 * (1 - u) * u ** 2, e = u ** 3;
  return [0, 1].map((k) => a * p[0][k] + b * p[1][k] + c * p[2][k] + e * p[3][k]);
}
// Evenly spaced samples by arc length: position, unit tangent, segment index, s in [0,1].
function sample(d, ds = 0.25) {
  const fine = [];
  segments(d).forEach((seg, si) => {
    for (let k = 0; k <= 400; k++) if (!(k === 0 && si > 0)) fine.push({ p: at(seg, k / 400), seg: si });
  });
  let L = 0;
  fine.forEach((f, k) => { if (k) L += Math.hypot(f.p[0] - fine[k - 1].p[0], f.p[1] - fine[k - 1].p[1]); f.l = L; });
  const out = [];
  let j = 0;
  for (let l = 0; l <= L; l += ds) {
    while (fine[j + 1] && fine[j + 1].l < l) j++;
    const f = fine[j], g = fine[Math.min(j + 1, fine.length - 1)];
    const tx = g.p[0] - f.p[0], ty = g.p[1] - f.p[1], tl = Math.hypot(tx, ty) || 1;
    out.push({ x: f.p[0], y: f.p[1], tx: tx / tl, ty: ty / tl, seg: f.seg, s: l / L });
  }
  return out;
}

const smoothstep = (r) => r * r * (3 - 2 * r);
const ramp = (d, len, min) => min + (1 - min) * smoothstep(Math.min(1, d / len));
const blur = (ws, radius = 12) => ws.map((_, i) => {
  let sum = 0, n = 0;
  for (let k = Math.max(0, i - radius); k <= Math.min(ws.length - 1, i + radius); k++) { sum += ws[k]; n++; }
  return sum / n;
});

const SAMPLES = sample(FULL);

// Pen pressure: downstrokes (ty > 0) get heavier. The J starts at full width (cut at an angle
// in ribbon()); the end of the S lifts off with a taper.
const BASE_W = blur(SAMPLES.map((p) => ramp(1 - p.s, 0.06, 0.3) * (1.9 + 3.2 * Math.max(0, p.ty) ** 1.5)));

const f2 = (v) => Math.round(v * 100) / 100;
// Filled outline of one stroke: one side forward, end cap, other side back, start cap.
// startCut: "round", or "angled" (chisel cut, like a brush pressed down at a slant).
function ribbon(segs, widths, { extra = 0, step = 3, startCut = "round" } = {}) {
  const idx = SAMPLES.map((p, i) => (segs.includes(p.seg) ? i : -1)).filter((i) => i >= 0);
  const pick = idx.filter((_, k) => k % step === 0 || k === idx.length - 1);
  const side = (i, sign) => {
    const p = SAMPLES[i], r = widths[i] / 2 + extra;
    return [f2(p.x - p.ty * r * sign), f2(p.y + p.tx * r * sign)];
  };
  const left = pick.map((i) => side(i, 1));
  const right = pick.map((i) => side(i, -1)).reverse();
  if (startCut === "angled") {
    // Slide the two start corners along the stroke in opposite directions to slant the cut.
    const p = SAMPLES[pick[0]], k = widths[pick[0]] * 0.45;
    left[0] = [f2(left[0][0] - p.tx * k), f2(left[0][1] - p.ty * k)];
    right[right.length - 1] = [f2(right[right.length - 1][0] + p.tx * k), f2(right[right.length - 1][1] + p.ty * k)];
  }
  const r0 = f2(widths[pick[0]] / 2 + extra), r1 = f2(widths[pick[pick.length - 1]] / 2 + extra);
  const startCap = startCut === "angled" ? "" : `A${r0} ${r0} 0 0 0 ${left[0].join(" ")}`;
  return `M${left.map((q) => q.join(" ")).join("L")}A${r1} ${r1} 0 0 0 ${right[0].join(" ")}L${right.map((q) => q.join(" ")).join("L")}${startCap}Z`;
}

// The mark's parts, for callers that build their own SVG (e.g. the website's Monogram component):
// strokes are filled, drawn masked by halos (each clipped to a gap circle), then over strands are
// redrawn clipped to their crossing circles. Gap circles are 1 unit smaller than crossing circles
// so the edges overlap (no anti-alias seams).
export function markShapes(cut = "regular") {
  const c = CUTS[cut];
  const ws = BASE_W.map(c.width);
  return {
    offset: OFFSET,
    crossings: CROSS.map(([cx, cy]) => ({ cx, cy, clip: c.clip, gap: c.clip - 1 })),
    strokes: STROKES.map((segs, k) => ribbon(segs, ws, { startCut: k === 0 ? "angled" : "round" })),
    halos: OVER.map((segs) => ribbon(segs, ws, { extra: GAP })),
    over: OVER.map((segs) => ribbon(segs, ws)),
  };
}

export function markSvg({ cut = "regular", color = "currentColor", size = 512, bg = null, scale = 1, style = "", viewBox = "0 0 100 100" }) {
  const m = markShapes(cut);
  const fit = scale === 1 ? "" : `translate(50 50) scale(${scale}) translate(-50 -50) `;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="${size}" height="${size}" role="img" aria-label="JS">
${style ? `  <style>${style}</style>\n` : ""}  <defs>
${m.crossings.map(({ cx, cy, clip, gap }, i) => `    <clipPath id="c${i}"><circle cx="${cx}" cy="${cy}" r="${clip}"/></clipPath>
    <clipPath id="g${i}"><circle cx="${cx}" cy="${cy}" r="${gap}"/></clipPath>`).join("\n")}
    <mask id="gaps" maskUnits="userSpaceOnUse" x="-10" y="-10" width="120" height="120">
      <rect x="-10" y="-10" width="120" height="120" fill="#fff"/>
${m.halos.map((d, i) => `      <path fill="#000" clip-path="url(#g${i})" d="${d}"/>`).join("\n")}
    </mask>
  </defs>
${bg ? `  <rect width="100" height="100" fill="${bg}"/>\n` : ""}  <g class="ink" transform="${fit}${m.offset}" fill="${color}">
    <g mask="url(#gaps)">
${m.strokes.map((d) => `      <path d="${d}"/>`).join("\n")}
    </g>
${m.over.map((d, i) => `    <path clip-path="url(#c${i})" d="${d}"/>`).join("\n")}
  </g>
</svg>
`;
}
