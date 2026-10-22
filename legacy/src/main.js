(() => {
  const NS = "http://www.w3.org/2000/svg";
  const S = 140, C = 350, LIM = 2.5;
  const u = x => C + x * S, v = y => C - y * S;
  const $ = id => document.getElementById(id);
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const LANGS = ["es", "ca", "en", "fr", "de", "it", "pt", "ro", "ru"].filter(c => window.I18N && I18N[c]);

  /* ================= idioma ================= */
  let lang = "es";
  try { const sv = localStorage.getItem("trig-lang"); if (LANGS.includes(sv)) lang = sv; } catch {}
  const Dct = () => I18N[lang];
  const getPath = (o, p) => p.split(".").reduce((a, k) => a == null ? a : a[k], o);
  const L = s => String(s).replace(/§([a-z]+)/g, (m, n) => Dct().not[n] ?? Dct().w[n] ?? I18N.es.not[n] ?? I18N.es.w[n] ?? m);
  function t(p, params) {
    let x = getPath(Dct(), p); if (x == null) x = getPath(I18N.es, p); if (x == null) return p;
    if (typeof x !== "string") return x;
    x = L(x);
    return params ? x.replace(/\{(\w+)\}/g, (m, k) => params[k] ?? m) : x;
  }
  const N = k => Dct().not[k];
  function nv(k_, p) { const d = (window.NAV && (NAV[lang] || NAV.es)) || {}; let x = d[k_] ?? NAV.es[k_] ?? k_; return p ? x.replace(/\{(\w+)\}/g, (mm, kk) => p[kk] ?? mm) : x; }
  const loc = () => Dct().meta.locale;

  /* ================= utilidades ================= */
  const el = (tag, attrs = {}, parent) => { const e = document.createElementNS(NS, tag); for (const a in attrs) e.setAttribute(a, attrs[a]); if (parent) parent.appendChild(e); return e; };
  const minus = s => s.replace(/-/g, "−");
  const fmt = (x, d = 4) => { if (Math.abs(x) < 5 * 10 ** -(d + 1)) x = 0; return minus(x.toLocaleString(loc(), { minimumFractionDigits: d, maximumFractionDigits: d, useGrouping: false })); };
  const fmtP = x => { const s = fmt(x); return s.startsWith("−") ? `(${s})` : s; };
  const fmtDeg = d => { const r = Math.round(d * 10) / 10; return minus(Number.isInteger(r) ? String(r) : r.toLocaleString(loc(), { maximumFractionDigits: 1, useGrouping: false })); };
  const gcd = (a, b) => b ? gcd(b, a % b) : a;
  const clamp = x => Math.max(-60, Math.min(60, x));
  const signedDeg = d => d > 180 ? d - 360 : d;
  const isInt = d => Math.abs(d - Math.round(d)) < 1e-6;
  const setL = (e, x1, y1, x2, y2) => { e.setAttribute("x1", u(x1)); e.setAttribute("y1", v(y1)); e.setAttribute("x2", u(x2)); e.setAttribute("y2", v(y2)); };
  const vis = (e, on) => e.style.display = on ? "" : "none";
  const rad = d => d * Math.PI / 180;
  function piFrac(n) {
    if (n === 0) return "0";
    const g = gcd(Math.abs(n), 180), num = n / g, den = 180 / g;
    const s = num === 1 ? "π" : num === -1 ? "−π" : minus(num + "π");
    return den > 1 ? s + "/" + den : s;
  }
  const wrapDeg = d => { if (Math.abs(d - 360) < 1e-9) return 360; const w = ((d % 360) + 360) % 360; return Math.abs(w - 360) < 1e-9 ? 0 : w; };
  const norm = d => { const w = ((d % 360) + 360) % 360; return Math.abs(w - 360) < 1e-9 ? 0 : w; };

  const EX = {
    0:  { sin:"0", cos:"1", tan:"0", cot:null, sec:"1", csc:null },
    15: { sin:"(√6−√2)/4", cos:"(√6+√2)/4", tan:"2−√3", cot:"2+√3", sec:"√6−√2", csc:"√6+√2" },
    30: { sin:"1/2", cos:"√3/2", tan:"√3/3", cot:"√3", sec:"2√3/3", csc:"2" },
    45: { sin:"√2/2", cos:"√2/2", tan:"1", cot:"1", sec:"√2", csc:"√2" },
    60: { sin:"√3/2", cos:"1/2", tan:"√3", cot:"√3/3", sec:"2", csc:"2√3/3" },
    75: { sin:"(√6+√2)/4", cos:"(√6−√2)/4", tan:"2+√3", cot:"2−√3", sec:"√6+√2", csc:"√6−√2" },
    90: { sin:"1", cos:"0", tan:null, cot:"0", sec:null, csc:"1" },
  };
  const neg = s => (s.startsWith("(") || !/[+−]/.test(s)) ? "−" + s : "−(" + s + ")";
  function exact(d) {
    if (!isInt(d)) return null;
    const n = ((Math.round(d) % 360) + 360) % 360;
    if (n % 15) return null;
    let r, sx, sy;
    if (n <= 90) { r = n; sx = 1; sy = 1; }
    else if (n <= 180) { r = 180 - n; sx = -1; sy = 1; }
    else if (n <= 270) { r = n - 180; sx = -1; sy = -1; }
    else { r = 360 - n; sx = 1; sy = -1; }
    const b = EX[r], sg = { sin:sy, cos:sx, tan:sx*sy, cot:sx*sy, sec:sx, csc:sy }, out = {};
    for (const k in b) out[k] = b[k] === null ? null : (b[k] !== "0" && sg[k] < 0 ? neg(b[k]) : b[k]);
    return out;
  }
  const P = s => s.startsWith("−") ? `(${s})` : (/[+−]/.test(s) && !s.startsWith("(") ? `(${s})` : s);
  function compute(d) {
    let c = Math.cos(rad(d)), s = Math.sin(rad(d));
    if (Math.abs(c) < 1e-12) c = 0; if (Math.abs(s) < 1e-12) s = 0;
    return { c, s, sin:s, cos:c, tan: c === 0 ? null : s / c, cot: s === 0 ? null : c / s, sec: c === 0 ? null : 1 / c, csc: s === 0 ? null : 1 / s };
  }
  function quadrant(d) {
    const n = norm(d);
    if ([0, 90, 180, 270].some(a => Math.abs(n - a) < 1e-9)) return 0;
    return n < 90 ? 1 : n < 180 ? 2 : n < 270 ? 3 : 4;
  }
  function refAngle(d) { const n = norm(d); return n <= 90 ? n : n <= 180 ? 180 - n : n <= 270 ? n - 180 : 360 - n; }
  function parseAngle(str) {
    let t = str.trim().toLowerCase().replace(/,/g, ".").replace(/−/g, "-").replace(/°|º|deg|rad|рад/g, "");
    const hasPi = /π|pi/.test(t);
    t = t.replace(/π|pi/g, "(P)").replace(/(\d|\))\s*\(/g, "$1*(");
    if (!t || !/^[0-9.+\-*/()P\s]+$/.test(t)) return null;
    try { const val = Function("P", `"use strict";return (${t})`)(Math.PI); return Number.isFinite(val) ? { val, hasPi } : null; } catch { return null; }
  }
  function angleText(d, unit) {
    if (unit === "deg") return fmtDeg(d).replace("−", "-");
    const sd = signedDeg(d);
    return isInt(sd) ? piFrac(Math.round(sd)) : rad(sd).toFixed(4);
  }
  function arcPath(r, a0, a1, wedge) {
    const d = a1 - a0; if (Math.abs(d) < 1e-9) return "";
    const R = r * S, p = a => [u(r * Math.cos(rad(a))), v(r * Math.sin(rad(a)))];
    const [x0, y0] = p(a0);
    if (Math.abs(d) >= 359.999) { const [xm, ym] = p(a0 + 180); return `M${x0} ${y0} A${R} ${R} 0 1 0 ${xm} ${ym} A${R} ${R} 0 1 0 ${x0} ${y0}`; }
    const [x1, y1] = p(a1), arc = `A${R} ${R} 0 ${Math.abs(d) > 180 ? 1 : 0} ${d > 0 ? 0 : 1} ${x1} ${y1}`;
    return wedge ? `M${C} ${C} L${x0} ${y0} ${arc} Z` : `M${x0} ${y0} ${arc}`;
  }
  function pointerDeg(svg, e) {
    const pt = new DOMPoint(e.clientX, e.clientY).matrixTransform(svg.getScreenCTM().inverse());
    const x = (pt.x - C) / S, y = (C - pt.y) / S;
    if (Math.hypot(x, y) < 0.02) return null;
    let d = Math.atan2(y, x) * 180 / Math.PI; return d < 0 ? d + 360 : d;
  }
  function snap(d, on) {
    if (on) { d = Math.round(d); const n = Math.round(d / 15) * 15; if (Math.abs(d - n) <= 3) d = n; }
    else d = Math.round(d * 10) / 10;
    return d >= 360 ? 0 : d;
  }
  const angDist = (a, b) => { const x = Math.abs(norm(a) - norm(b)); return Math.min(x, 360 - x); };

  function buildStatic(gs) {
    for (let i = -2; i <= 2; i += 0.5) {
      el("line", { x1:u(i), y1:0, x2:u(i), y2:700, stroke:"var(--grid)", "stroke-width":1 }, gs);
      el("line", { x1:0, y1:v(i), x2:700, y2:v(i), stroke:"var(--grid)", "stroke-width":1 }, gs);
    }
    el("line", { x1:u(1), y1:0, x2:u(1), y2:700, stroke:"var(--muted)", "stroke-width":1, "stroke-dasharray":"2 5", opacity:.8 }, gs);
    el("line", { x1:0, y1:v(1), x2:700, y2:v(1), stroke:"var(--muted)", "stroke-width":1, "stroke-dasharray":"2 5", opacity:.8 }, gs);
    el("line", { x1:8, y1:C, x2:692, y2:C, stroke:"var(--axis)", "stroke-width":1.4 }, gs);
    el("line", { x1:C, y1:692, x2:C, y2:8, stroke:"var(--axis)", "stroke-width":1.4 }, gs);
    el("path", { d:`M692 ${C} l-10 -5 v10 z`, fill:"var(--axis)" }, gs);
    el("path", { d:`M${C} 8 l-5 10 h10 z`, fill:"var(--axis)" }, gs);
    el("text", { x:684, y:C - 12, "text-anchor":"end", fill:"var(--muted)", "font-size":18, "font-style":"italic" }, gs).textContent = "x";
    el("text", { x:C + 12, y:24, fill:"var(--muted)", "font-size":18, "font-style":"italic" }, gs).textContent = "y";
    for (let i = -2; i <= 2; i += 0.5) {
      if (i === 0) continue;
      el("line", { x1:u(i), y1:C - 4, x2:u(i), y2:C + 4, stroke:"var(--axis)", "stroke-width":1 }, gs);
      el("line", { x1:C - 4, y1:v(i), x2:C + 4, y2:v(i), stroke:"var(--axis)", "stroke-width":1 }, gs);
      if (Math.abs(i) === 2) {
        el("text", { x:u(i), y:C + 20, "text-anchor":"middle", fill:"var(--muted)", "font-size":14 }, gs).textContent = minus(String(i));
        el("text", { x:C - 10, y:v(i) + 5, "text-anchor":"end", fill:"var(--muted)", "font-size":14 }, gs).textContent = minus(String(i));
      }
    }
    el("circle", { cx:C, cy:C, r:S, fill:"none", stroke:"var(--axis)", "stroke-width":1.3, opacity:.7 }, gs);
    for (let a = 0; a < 360; a += 15) {
      if (a % 30 && a % 45) continue;
      el("circle", { cx:u(Math.cos(rad(a))), cy:v(Math.sin(rad(a))), r:2.6, fill:"var(--muted)" }, gs);
    }
    const axisLbl = [
      { x:u(1) + 8, y:C + 24, a:"start" }, { x:C + 10, y:v(1) - 10, a:"start" },
      { x:u(-1) - 8, y:C - 10, a:"end" }, { x:C + 10, y:v(-1) + 26, a:"start" },
    ].map(p => el("text", { x:p.x, y:p.y, "text-anchor":p.a, fill:"var(--fg)", "font-size":20, "font-weight":600 }, gs));
    ["(1, 0)","(0, 1)","(−1, 0)","(0, −1)"].forEach((tx, i) => {
      const p = [[u(1)+8, C+42, "start"], [C-10, v(1)-10, "end"], [u(-1)-8, C+22, "end"], [C-10, v(-1)+26, "end"]][i];
      el("text", { x:p[0], y:p[1], "text-anchor":p[2], fill:"var(--muted)", "font-size":13 }, gs).textContent = tx;
    });
    el("circle", { cx:C, cy:C, r:4, fill:"var(--axis)" }, gs);
    return axisLbl;
  }
  const AXIS = { deg:["0° · 360°", "90°", "180°", "270°"], rad:["0", "π/2", "±π", "−π/2"] };

  function bindAngle(inp, slider, field, getUnit, getDeg, setDeg) {
    inp.addEventListener("input", () => {
      const p = parseAngle(inp.value);
      if (!p) { field.classList.add("bad"); return; }
      field.classList.remove("bad");
      setDeg(wrapDeg((getUnit() === "rad" || p.hasPi) ? p.val * 180 / Math.PI : p.val), "text");
    });
    inp.addEventListener("blur", () => { field.classList.remove("bad"); inp.value = angleText(getDeg(), getUnit()); });
    inp.addEventListener("keydown", e => { if (e.key === "Enter") inp.blur(); });
    slider.addEventListener("input", () => { const x = +slider.value; setDeg(getUnit() === "deg" ? x : wrapDeg(x * 180 / Math.PI), "slider"); });
    return {
      range(un) { if (un === "deg") { slider.min = 0; slider.max = 360; slider.step = 0.1; } else { slider.min = (-Math.PI).toFixed(4); slider.max = Math.PI.toFixed(4); slider.step = 0.001; } },
      sync(from) {
        const d = getDeg(), un = getUnit();
        if (from !== "text") inp.value = angleText(d, un);
        if (from !== "slider") slider.value = un === "deg" ? d : rad(signedDeg(d));
      }
    };
  }
  const chipTexts = [];
  function mkChip(box, id, textFn, color, checked, on) {
    const lab = document.createElement("label"); lab.className = "chip"; if (color) lab.style.setProperty("--sw", `var(${color})`);
    lab.innerHTML = `<input type="checkbox" id="${id}" ${checked ? "checked" : ""}><span class="sw"></span><span class="ct"></span>`;
    lab.querySelector("input").addEventListener("change", e => on(e.target.checked));
    chipTexts.push([lab.querySelector(".ct"), textFn]);
    box.appendChild(lab);
  }

  /* ================= fórmulas compartidas (notación con §) ================= */
  const fr = (a, b) => `<span class="fr"><span>${a}</span><span>${b}</span></span>`;
  const k = x => `<span class="k">${x}</span>`;
  const th = "<i>θ</i>", al = "<i>α</i>", be = "<i>β</i>";
  const RATIOS = [
    { k:"sin", col:"--c-sin", f:`§sin ${th} = <i>y</i>` },
    { k:"cos", col:"--c-cos", f:`§cos ${th} = <i>x</i>` },
    { k:"tan", col:"--c-tan", f:`§tan ${th} = §sin ${th} / §cos ${th}` },
    { k:"cot", col:"--c-cot", f:`§cot ${th} = §cos ${th} / §sin ${th}` },
    { k:"sec", col:"--c-sec", f:`§sec ${th} = 1 / §cos ${th}` },
    { k:"csc", col:"--c-csc", f:`§csc ${th} = 1 / §sin ${th}` },
  ];
  const FORM = {
    sin: { fig:"sin", stmt:`§sin ${th} = <i>y</i>`, f:[
      `<i>P</i> = (<i>x</i>, <i>y</i>)`, `§hyp = ${k("1")}`, `§sin ${th} = ${fr("§opp", "§hyp")}`, `§sin ${th} = ${fr(k("<i>y</i>"), k("1"))}`, `§sin ${th} = <i>y</i>`] },
    cos: { fig:"cos", stmt:`§cos ${th} = <i>x</i>`, f:[
      `<i>P</i> = (<i>x</i>, <i>y</i>)`, `§hyp = ${k("1")}`, `§cos ${th} = ${fr("§adj", "§hyp")}`, `§cos ${th} = ${fr(k("<i>x</i>"), k("1"))} = <i>x</i>`] },
    tan: { fig:"tan", stmt:`§tan ${th} = ${fr(`§sin ${th}`, `§cos ${th}`)} = <i>t</i>`, f:[
      `§tan ${th} = ${fr("§opp", "§adj")} = ${fr("<i>y</i>", "<i>x</i>")}`, `△(<i>x</i>, <i>y</i>)  ∼  △(${k("1")}, ${k("<i>t</i>")})`, `${fr("<i>t</i>", "1")} = ${fr("<i>y</i>", "<i>x</i>")}`, `<i>t</i> = ${fr("<i>y</i>", "<i>x</i>")} = §tan ${th}`] },
    cot: { fig:"cot", stmt:`§cot ${th} = ${fr(`§cos ${th}`, `§sin ${th}`)} = <i>c</i>`, f:[
      `§cot ${th} = ${fr(`§cos ${th}`, `§sin ${th}`)} = ${fr("1", `§tan ${th}`)}`, `△ (0, 0), (0, 1), (<i>c</i>, 1)`, `∠(<i>c</i>, 1) = ${th}`, `§tan ${th} = ${fr(k("1"), k("<i>c</i>"))}`, `<i>c</i> = ${fr("1", `§tan ${th}`)} = §cot ${th}`] },
    sec: { fig:"sec", stmt:`§sec ${th} = ${fr("1", `§cos ${th}`)} = <i>h</i>`, f:[
      `△: 1, <i>t</i>, ${k("<i>h</i>")}`, `§cos ${th} = ${fr("§adj", "§hyp")} = ${fr("1", "<i>h</i>")}`, `<i>h</i> = ${fr("1", `§cos ${th}`)} = §sec ${th}`] },
    csc: { fig:"csc", stmt:`§csc ${th} = ${fr("1", `§sin ${th}`)} = <i>h</i>`, f:[
      `△: <i>c</i>, 1, ${k("<i>h</i>")}`, `§sin ${th} = ${fr("§opp", "§hyp")} = ${fr("1", "<i>h</i>")}`, `<i>h</i> = ${fr("1", `§sin ${th}`)} = §csc ${th}`] },
    rad: { fig:"rad", stmt:`${th}<sub>§rad</sub> = ${th}° · ${fr("π", "180")}`, f:[
      `<i>L</i> = 2π<i>r</i>`, `<i>r</i> = 1  →  <i>L</i> = 2π`, `1 §rad:  ⌒ = <i>r</i>`, `360° = 2π §rad  →  180° = π §rad`, `60° · ${fr("π", "180")} = ${fr("π", "3")} §rad`] },
    signs: { fig:"signs", stmt:`§sin ${th} = <i>y</i>  ·  §cos ${th} = <i>x</i>`, f:[
      `§sin ${th} = <i>y</i>,  §cos ${th} = <i>x</i>`, `I: <i>x</i> > 0, <i>y</i> > 0`, `II: <i>x</i> < 0, <i>y</i> > 0`, `III: <i>x</i> < 0, <i>y</i> < 0`, `IV: <i>x</i> > 0, <i>y</i> < 0`, `§sec ∼ §cos,  §csc ∼ §sin,  §cot ∼ §tan`] },
    notables: { fig:"notables", stmt:`§sin 30° = ${fr("1", "2")}  ·  §sin 45° = ${fr("√2", "2")}  ·  §sin 60° = ${fr("√3", "2")}`, f:[
      `45°: <i>a</i>² + <i>a</i>² = 1²`, `2<i>a</i>² = 1  →  <i>a</i> = ${fr("1", "√2")} = ${fr("√2", "2")}`, `§sin 45° = §cos 45° = ${fr("√2", "2")}`,
      `60° + 60° + 60° = 180°  →  30°, 60°, 90°`, `<i>b</i> = ${fr("1", "2")},  (${fr("1", "2")})² + <i>h</i>² = 1  →  <i>h</i> = ${fr("√3", "2")}`,
      `§sin 30° = ${fr("1", "2")},  §cos 30° = ${fr("√3", "2")},  §sin 60° = ${fr("√3", "2")},  §cos 60° = ${fr("1", "2")}`] },
    "rec-sin": { stmt:`§sin ${th} · §csc ${th} = 1`, f:[
      `§csc ${th} = ${fr("1", `§sin ${th}`)}`, `§sin ${th} · §csc ${th} = §sin ${th} · ${k(fr("1", `§sin ${th}`))}`, `= ${fr(`§sin ${th}`, `§sin ${th}`)} = 1`] },
    "rec-cos": { stmt:`§cos ${th} · §sec ${th} = 1`, f:[
      `§sec ${th} = ${fr("1", `§cos ${th}`)}`, `§cos ${th} · §sec ${th} = §cos ${th} · ${k(fr("1", `§cos ${th}`))}`, `= ${fr(`§cos ${th}`, `§cos ${th}`)} = 1`] },
    "rec-tan": { fig:"rectan", stmt:`§tan ${th} · §cot ${th} = 1`, f:[
      `§tan ${th} = ${fr(`§sin ${th}`, `§cos ${th}`)},  §cot ${th} = ${fr(`§cos ${th}`, `§sin ${th}`)}`, `§tan ${th} · §cot ${th} = ${fr(`§sin ${th}`, `§cos ${th}`)} · ${fr(`§cos ${th}`, `§sin ${th}`)}`, `= ${fr(`${k(`§sin ${th}`)} · §cos ${th}`, `§cos ${th} · ${k(`§sin ${th}`)}`)} = 1`] },
    "quot-tan": { fig:"pyth", stmt:`§tan ${th} = ${fr(`§sin ${th}`, `§cos ${th}`)}`, f:[
      `§tan ${th} = ${fr("§opp", "§adj")}`, `= ${fr("<i>y</i>", "<i>x</i>")}`, `= ${fr(k(`§sin ${th}`), k(`§cos ${th}`))}`] },
    "quot-cot": { fig:"pyth", stmt:`§cot ${th} = ${fr(`§cos ${th}`, `§sin ${th}`)}`, f:[
      `§cot ${th} = ${fr("§adj", "§opp")}`, `= ${fr("<i>x</i>", "<i>y</i>")}`, `= ${fr(k(`§cos ${th}`), k(`§sin ${th}`))}`] },
    pyth: { fig:"pyth", stmt:`§sin²${th} + §cos²${th} = 1`, f:[
      `<i>a</i>² + <i>b</i>² = <i>c</i>²`, `<i>a</i> = ${k("<i>x</i>")},  <i>b</i> = ${k("<i>y</i>")},  <i>c</i> = ${k("1")}`, `<i>x</i>² + <i>y</i>² = (1)²`, `(§cos ${th})² + (§sin ${th})² = 1`, `§cos²${th} + §sin²${th} = 1`, `§sin²${th} + §cos²${th} = 1`] },
    "pyth-tan": { fig:"pyth-tan", stmt:`1 + §tan²${th} = §sec²${th}`, f:[
      `§sin²${th} + §cos²${th} = 1`, `${fr(`§sin²${th}`, k(`§cos²${th}`))} + ${fr(`§cos²${th}`, k(`§cos²${th}`))} = ${fr("1", k(`§cos²${th}`))}`, `§tan²${th} + 1 = §sec²${th}`, `1 + §tan²${th} = §sec²${th}`] },
    "pyth-cot": { fig:"pyth-cot", stmt:`1 + §cot²${th} = §csc²${th}`, f:[
      `§sin²${th} + §cos²${th} = 1`, `${fr(`§sin²${th}`, k(`§sin²${th}`))} + ${fr(`§cos²${th}`, k(`§sin²${th}`))} = ${fr("1", k(`§sin²${th}`))}`, `1 + §cot²${th} = §csc²${th}`] },
    "sum-cos": { fig:"dist", stmt:`§cos(${al} ± ${be}) = §cos ${al} §cos ${be} ∓ §sin ${al} §sin ${be}`, f:[
      `<i>A</i> = (§cos ${al}, §sin ${al}),  <i>B</i> = (§cos ${be}, §sin ${be})`,
      `<i>d</i>² = (§cos ${al} − §cos ${be})² + (§sin ${al} − §sin ${be})²`,
      `= §cos²${al} − 2§cos ${al} §cos ${be} + §cos²${be} + §sin²${al} − 2§sin ${al} §sin ${be} + §sin²${be}`,
      `= ${k(`(§sin²${al} + §cos²${al})`)} + ${k(`(§sin²${be} + §cos²${be})`)} − 2(§cos ${al} §cos ${be} + §sin ${al} §sin ${be})`,
      `<i>d</i>² = 2 − 2(§cos ${al} §cos ${be} + §sin ${al} §sin ${be})`,
      `<i>A′</i> = (§cos(${al} − ${be}), §sin(${al} − ${be})),  <i>B′</i> = (1, 0)`,
      `<i>d</i>² = (§cos(${al} − ${be}) − 1)² + §sin²(${al} − ${be}) = 2 − 2§cos(${al} − ${be})`,
      `2 − 2${k(`§cos(${al} − ${be})`)} = 2 − 2${k(`(§cos ${al} §cos ${be} + §sin ${al} §sin ${be})`)}`,
      `§cos(${al} − ${be}) = §cos ${al} §cos ${be} + §sin ${al} §sin ${be}`,
      `§cos(${al} + ${be}) = §cos ${al} §cos(${k(`−${be}`)}) + §sin ${al} §sin(${k(`−${be}`)}) = §cos ${al} §cos ${be} − §sin ${al} §sin ${be}`] },
    "sum-sin": { fig:["sumsin", "comp"], stmt:`§sin(${al} ± ${be}) = §sin ${al} §cos ${be} ± §cos ${al} §sin ${be}`, f:[
      `§sin <i>x</i> = §cos(90° − <i>x</i>)`,
      `§sin(${al} + ${be}) = §cos(90° − (${al} + ${be})) = §cos(${k(`(90° − ${al})`)} − ${be})`,
      `= §cos(90° − ${al}) §cos ${be} + §sin(90° − ${al}) §sin ${be}`,
      `= ${k(`§sin ${al}`)} §cos ${be} + ${k(`§cos ${al}`)} §sin ${be}`,
      `§sin(${al} − ${be}) = §sin ${al} §cos ${be} − §cos ${al} §sin ${be}`] },
    "sum-tan": { fig:"sumtan", stmt:`§tan(${al} ± ${be}) = ${fr(`§tan ${al} ± §tan ${be}`, `1 ∓ §tan ${al} §tan ${be}`)}`, f:[
      `§tan(${al} ± ${be}) = ${fr(`§sin(${al} ± ${be})`, `§cos(${al} ± ${be})`)}`,
      `= ${fr(`§sin ${al} §cos ${be} ± §cos ${al} §sin ${be}`, `§cos ${al} §cos ${be} ∓ §sin ${al} §sin ${be}`)}`,
      `= ${fr(`${fr(`§sin ${al} §cos ${be}`, k(`§cos ${al} §cos ${be}`))} ± ${fr(`§cos ${al} §sin ${be}`, k(`§cos ${al} §cos ${be}`))}`, `${fr(`§cos ${al} §cos ${be}`, k(`§cos ${al} §cos ${be}`))} ∓ ${fr(`§sin ${al} §sin ${be}`, k(`§cos ${al} §cos ${be}`))}`)}`,
      `= ${fr(`§tan ${al} ± §tan ${be}`, `1 ∓ §tan ${al} §tan ${be}`)}`] },
    dbl: { fig:"dbl", stmt:`§sin 2${al} = 2 §sin ${al} §cos ${al}`, f:[
      `§sin(${al} + ${be}) = §sin ${al} §cos ${be} + §cos ${al} §sin ${be}`,
      `§sin(${al} + ${k(al)}) = §sin ${al} §cos ${k(al)} + §cos ${al} §sin ${k(al)}`,
      `§sin 2${al} = 2 §sin ${al} §cos ${al}`,
      `§cos 2${al} = §cos ${al} §cos ${al} − §sin ${al} §sin ${al} = §cos²${al} − §sin²${al}`,
      `§tan 2${al} = ${fr(`§tan ${al} + §tan ${al}`, `1 − §tan ${al} §tan ${al}`)} = ${fr(`2 §tan ${al}`, `1 − §tan²${al}`)}`] },
    dbl2: { fig:"dbl2", stmt:`§cos 2${al} = 2§cos²${al} − 1 = 1 − 2§sin²${al}`, f:[
      `§cos 2${al} = §cos²${al} − §sin²${al}`, `§sin²${al} = 1 − §cos²${al}`, `§cos 2${al} = §cos²${al} − ${k(`(1 − §cos²${al})`)} = 2§cos²${al} − 1`,
      `§cos²${al} = 1 − §sin²${al}`, `§cos 2${al} = ${k(`(1 − §sin²${al})`)} − §sin²${al} = 1 − 2§sin²${al}`] },
    half: { fig:"half", stmt:`§sin ${fr(al, "2")} = ±√${fr(`1 − §cos ${al}`, "2")}`, f:[
      `§cos 2<i>x</i> = 1 − 2§sin²<i>x</i>`, `<i>x</i> = ${fr(al, "2")}  →  §cos ${al} = 1 − 2§sin²${fr(al, "2")}`, `2§sin²${fr(al, "2")} = 1 − §cos ${al}`,
      `§sin ${fr(al, "2")} = ±√${fr(`1 − §cos ${al}`, "2")}`, `§cos ${fr(al, "2")} = ±√${fr(`1 + §cos ${al}`, "2")}`] },
    s2p: { fig:"s2p", stmt:`§sin ${al} + §sin ${be} = 2 §sin${fr(`${al} + ${be}`, "2")} §cos${fr(`${al} − ${be}`, "2")}`, f:[
      `§sin(<i>x</i> + <i>y</i>) = §sin <i>x</i> §cos <i>y</i> + §cos <i>x</i> §sin <i>y</i>`,
      `§sin(<i>x</i> − <i>y</i>) = §sin <i>x</i> §cos <i>y</i> − §cos <i>x</i> §sin <i>y</i>`,
      `§sin(<i>x</i> + <i>y</i>) + §sin(<i>x</i> − <i>y</i>) = 2 §sin <i>x</i> §cos <i>y</i>`,
      `${al} = <i>x</i> + <i>y</i>,  ${be} = <i>x</i> − <i>y</i>  →  <i>x</i> = ${fr(`${al} + ${be}`, "2")},  <i>y</i> = ${fr(`${al} − ${be}`, "2")}`,
      `§sin ${al} + §sin ${be} = 2 §sin${fr(`${al} + ${be}`, "2")} §cos${fr(`${al} − ${be}`, "2")}`] },
  };

  /* ================= guías (se regeneran al cambiar de idioma) ================= */
  const more = (key = "seeDemo") => `<span class="more">${t("ui." + key)}</span>`;
  const idCard = (demo, f, p, live) => `<div class="id demo" data-demo="${demo}" role="button" tabindex="0"><div class="f">${L(f)}</div><p>${p}</p><div class="live" id="${live}"></div>${more()}</div>`;
  const sec = (e, h, inner, lead) => `<section class="sec"><span class="eyebrow">${e}</span><h2>${h}</h2>${lead ? `<p class="lead">${lead}</p>` : ""}${inner}</section>`;
  const uses = arr => `<div class="uses">${arr.map(([a, b]) => `<div class="use"><b>${L(a)}</b><span>${L(b)}</span></div>`).join("")}</div>`;

  function renderGuide1() {
    const g = p => t("g1." + p);
    const defs = `<p>${g("s1p")}</p><div class="defs">
      <div class="def-item"><b>${g("d1t")}</b>${g("d1")}</div>
      <div class="def-item demo" data-demo="rad" role="button" tabindex="0"><b>${g("d2t")}</b>${g("d2")}<br>${more("seeWhere")}</div>
      <div class="def-item"><b>${g("d3t")}</b>${g("d3")}</div>
      <div class="def-item"><b>${g("d4t")}</b>${g("d4")}</div></div>`;
    const ratios = `<div class="grid3">${RATIOS.map(r => `<article class="ratio demo" data-demo="${r.k}" role="button" tabindex="0" style="--col:var(${r.col})"><h3><span class="mr">${N(r.k)}</span> ${g("names." + r.k)}</h3><div class="f">${L(r.f)}</div><p>${g("where." + r.k)}</p>${more("seeWhy")}</article>`).join("")}</div>`;
    const ids = `<h3 class="grp">${g("grpRec")}</h3><div class="ids">
        ${idCard("rec-sin", `§sin ${th} · §csc ${th} = 1`, g("r1"), "idR1")}${idCard("rec-cos", `§cos ${th} · §sec ${th} = 1`, g("r2"), "idR2")}${idCard("rec-tan", `§tan ${th} · §cot ${th} = 1`, g("r3"), "idR3")}</div>
      <h3 class="grp">${g("grpQuot")}</h3><div class="ids">
        ${idCard("quot-tan", `§tan ${th} = §sin ${th} / §cos ${th}`, g("q1"), "idQ1")}${idCard("quot-cot", `§cot ${th} = §cos ${th} / §sin ${th}`, g("q2"), "idQ2")}</div>
      <h3 class="grp">${g("grpPyth")}</h3><div class="ids">
        ${idCard("pyth", `§sin²${th} + §cos²${th} = 1`, g("p1"), "id1")}${idCard("pyth-tan", `1 + §tan²${th} = §sec²${th}`, g("p2"), "id2")}${idCard("pyth-cot", `1 + §cot²${th} = §csc²${th}`, g("p3"), "id3")}</div>`;
    const pos = t("g1.pos");
    const qd = q => `<div class="qd demo" data-q="${q}" data-demo="signs" role="button" tabindex="0"><b>${["", "I · 0°–90°", "II · 90°–180°", "III · 180°–270°", "IV · 270°–360°"][q]}</b><span>${L(pos[q - 1])}</span></div>`;
    const quads = `<div class="quads">${qd(2)}${qd(1)}${qd(3)}${qd(4)}</div>`;
    const ks = ["sin", "cos", "tan", "cot", "sec", "csc"];
    const table = `<div class="tablewrap"><table class="big" id="notable"><thead><tr><th>${t("ui.thDeg")}</th><th>${t("ui.thRad")}</th>${ks.map((kk, i) => `<th data-c style="--col:var(${RATIOS[i].col})">${N(kk)}</th>`).join("")}</tr></thead><tbody>${
      [0, 30, 45, 60, 90, 180, 270].map(n => { const e = exact(n); return `<tr data-d="${n}"><td>${n}°</td><td>${piFrac(n)}</td>${ks.map(kk => e[kk] === null ? `<td class="nd">∄</td>` : `<td>${e[kk]}</td>`).join("")}</tr>`; }).join("")
    }</tbody></table></div><button type="button" class="linkbtn" data-demo="notables">${t("ui.whereFrom")}</button>`;
    $("guide1").innerHTML =
      sec(g("s1e"), g("s1h"), defs) +
      sec(g("s2e"), g("s2h"), ratios, g("s2l")) +
      sec(g("s3e"), g("s3h"), ids, g("s3l")) +
      sec(g("s4e"), g("s4h"), quads, g("s4l")) +
      sec(g("s5e"), g("s5h"), table, g("s5l")) +
      sec(g("s6e"), g("s6h"), uses(t("g1.uses")));
    $("notable").querySelectorAll("tbody tr").forEach(tr => tr.addEventListener("click", () => { setDeg1(+tr.dataset.d); $("plot").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" }); }));
  }

  function renderGuide2() {
    const g = p => t("g2." + p);
    const cards = t("g2.cards"), cons = t("g2.cons"), steps = t("g2.steps");
    const cardF = [
      `§sin(${al} ± ${be}) = §sin ${al} §cos ${be} ± §cos ${al} §sin ${be}`,
      `§cos(${al} ± ${be}) = §cos ${al} §cos ${be} ∓ §sin ${al} §sin ${be}`,
      `§tan(${al} ± ${be}) = <span style="white-space:nowrap">(§tan ${al} ± §tan ${be})</span> / <span style="white-space:nowrap">(1 ∓ §tan ${al} §tan ${be})</span>`];
    const cardD = ["sum-sin", "sum-cos", "sum-tan"];
    const s2 = `<div class="ids">${cards.map(([h, p], i) => `<div class="id demo" data-demo="${cardD[i]}" role="button" tabindex="0"><h3>${L(h)}</h3><div class="f">${L(cardF[i])}</div><p>${L(p)}</p>${more()}</div>`).join("")}</div>`;
    const stepF = [`75° = 45° + 30°`, `§sin 75° = §sin 45° · §cos 30° + §cos 45° · §sin 30°`, `= (√2/2)(√3/2) + (√2/2)(1/2)`, `= √6/4 + √2/4 = (√6 + √2)/4 ≈ ${fmt(0.9659258)}`];
    const s3 = `<div class="steps">${steps.map((s, i) => `<div class="step"><span class="n">${i + 1}</span><span class="t">${L(s)}<span class="mr">${L(stepF[i])}</span></span></div>`).join("")}</div>`;
    const consF = [
      [`§sin 2${al} = 2 §sin ${al} §cos ${al}`, `§cos 2${al} = §cos²${al} − §sin²${al}`, `§tan 2${al} = 2 §tan ${al} / (1 − §tan²${al})`],
      [`§sin(${al}/2) = ±√((1 − §cos ${al})/2)`, `§cos(${al}/2) = ±√((1 + §cos ${al})/2)`],
      [`§cos 2${al} = 2§cos²${al} − 1`, `§cos 2${al} = 1 − 2§sin²${al}`],
      [`§sin ${al} + §sin ${be} = 2 §sin((${al}+${be})/2) §cos((${al}−${be})/2)`, `§cos ${al} + §cos ${be} = 2 §cos((${al}+${be})/2) §cos((${al}−${be})/2)`]];
    const consD = ["dbl", "half", "dbl2", "s2p"];
    const s4 = `<div class="ids">${cons.map(([h, p], i) => `<div class="id demo" data-demo="${consD[i]}" role="button" tabindex="0"><h3>${L(h)}</h3>${consF[i].map(f => `<div class="f">${L(f)}</div>`).join("")}<p>${L(p)}</p><div class="live" id="${consD[i]}"></div>${more()}</div>`).join("")}</div>`;
    const s1 = `<p>${g("s1p")}</p><div class="warn"><b>${g("warnT")}</b><span class="hint">${g("warn")}</span><div class="live" id="wrong"></div></div>`;
    $("guide2").innerHTML =
      sec(g("s1e"), g("s1h"), s1) +
      sec(g("s2e"), g("s2h"), s2, g("s2l")) +
      sec(g("s3e"), g("s3h"), s3, g("s3l")) +
      sec(g("s4e"), g("s4h"), s4, g("s4l")) +
      sec(g("s5e"), g("s5h"), uses(t("g2.uses")));
  }

  /* ================= VISTA 1 · un ángulo ================= */
  const st = { deg: 60, unit: "deg", show: {sin:1,cos:1,tan:1,cot:1,sec:1,csc:1}, labels: true, snap: true };
  const svg = $("plot");
  const axisLbl1 = buildStatic($("static"));
  const gd = $("dyn"), gl = $("labels"), gh = $("handleG");
  const ray = el("line", { stroke:"var(--muted)", "stroke-width":1, "stroke-dasharray":"1 6", "stroke-linecap":"round" }, gd);
  const arc = el("path", { fill:"color-mix(in srgb, var(--fg) 8%, transparent)", stroke:"var(--fg)", "stroke-width":1.4 }, gd);
  const Ls = {};
  Ls.csc = el("line", { stroke:"var(--c-csc)", "stroke-width":6, "stroke-dasharray":"14 10" }, gd);
  Ls.sec = el("line", { stroke:"var(--c-sec)", "stroke-width":6, "stroke-dasharray":"10 14", "stroke-dashoffset":"-14" }, gd);
  Ls.cot = el("line", { stroke:"var(--c-cot)", "stroke-width":6, "stroke-linecap":"round" }, gd);
  Ls.tan = el("line", { stroke:"var(--c-tan)", "stroke-width":6, "stroke-linecap":"round" }, gd);
  Ls.cos = el("line", { stroke:"var(--c-cos)", "stroke-width":6, "stroke-linecap":"round" }, gd);
  Ls.sin = el("line", { stroke:"var(--c-sin)", "stroke-width":6, "stroke-linecap":"round" }, gd);
  const radius = el("line", { stroke:"var(--fg)", "stroke-width":1.6, opacity:.85 }, gd);
  const Dt = { cosF: el("circle", { r:5.5, fill:"var(--c-cos)" }, gd), tanP: el("circle", { r:5.5, fill:"var(--c-tan)" }, gd), cotP: el("circle", { r:5.5, fill:"var(--c-cot)" }, gd) };
  const thetaLbl = el("text", { fill:"var(--fg)", "font-size":18, "font-style":"italic", "text-anchor":"middle" }, gl); thetaLbl.textContent = "θ";
  const T = {};
  RATIOS.forEach(r => { T[r.k] = el("text", { fill:`var(${r.col})`, "font-size":17, "font-weight":600, "paint-order":"stroke", stroke:"var(--surface)", "stroke-width":5, "stroke-linejoin":"round" }, gl); });
  const ring = el("circle", { r:17, fill:"color-mix(in srgb, var(--handle) 12%, transparent)", stroke:"var(--handle)", "stroke-width":2 }, gh);
  const dot = el("circle", { r:7, fill:"var(--handle)" }, gh);

  function place(tx, x, y, anchor, on, labels) {
    const ok = on && labels && Math.abs(x) < LIM - .05 && Math.abs(y) < LIM - .05;
    vis(tx, ok); if (!ok) return;
    tx.setAttribute("x", u(x)); tx.setAttribute("y", v(y) + 6); tx.setAttribute("text-anchor", anchor);
  }
  function draw1(d, V) {
    const { c, s } = V, sh = st.show;
    setL(ray, -4 * c, -4 * s, 4 * c, 4 * s);
    const a = arcPath(.27, 0, d, true); vis(arc, !!a); if (a) arc.setAttribute("d", a);
    const rr = d < 25 ? .52 : .42;
    thetaLbl.setAttribute("x", u(rr * Math.cos(rad(d / 2)))); thetaLbl.setAttribute("y", v(rr * Math.sin(rad(d / 2))) + 6);
    vis(thetaLbl, d > 6 && st.labels);
    setL(Ls.cos, 0, 0, c, 0); vis(Ls.cos, sh.cos && Math.abs(c) > 1e-9);
    setL(Ls.sin, c, 0, c, s); vis(Ls.sin, sh.sin && Math.abs(s) > 1e-9);
    const tn = V.tan === null ? null : clamp(V.tan), ct = V.cot === null ? null : clamp(V.cot);
    if (tn !== null) { setL(Ls.tan, 1, 0, 1, tn); setL(Ls.sec, 0, 0, 1, tn); Dt.tanP.setAttribute("cx", u(1)); Dt.tanP.setAttribute("cy", v(tn)); }
    vis(Ls.tan, sh.tan && tn !== null && Math.abs(tn) > 1e-9); vis(Ls.sec, sh.sec && tn !== null); vis(Dt.tanP, (sh.tan || sh.sec) && tn !== null && Math.abs(tn) < LIM);
    if (ct !== null) { setL(Ls.cot, 0, 1, ct, 1); setL(Ls.csc, 0, 0, ct, 1); Dt.cotP.setAttribute("cx", u(ct)); Dt.cotP.setAttribute("cy", v(1)); }
    vis(Ls.cot, sh.cot && ct !== null && Math.abs(ct) > 1e-9); vis(Ls.csc, sh.csc && ct !== null); vis(Dt.cotP, (sh.cot || sh.csc) && ct !== null && Math.abs(ct) < LIM);
    Dt.cosF.setAttribute("cx", u(c)); Dt.cosF.setAttribute("cy", C); vis(Dt.cosF, sh.cos || sh.sin);
    setL(radius, 0, 0, c, s);
    for (const e of [ring, dot]) { e.setAttribute("cx", u(c)); e.setAttribute("cy", v(s)); }
    const lb = st.labels;
    place(T.cos, c / 2, s >= 0 ? -.2 : .12, "middle", sh.cos && Math.abs(c) > .18, lb);
    place(T.sin, c + (c >= 0 ? .08 : -.08), s / 2, c >= 0 ? "start" : "end", sh.sin && Math.abs(s) > .18, lb);
    if (tn !== null) place(T.tan, 1.08, Math.max(-LIM + .2, Math.min(LIM - .2, tn / 2)), "start", sh.tan && Math.abs(tn) > .2, lb); else vis(T.tan, false);
    if (ct !== null) place(T.cot, Math.max(-LIM + .3, Math.min(LIM - .3, ct / 2)), 1.13, "middle", sh.cot && Math.abs(ct) > .25, lb); else vis(T.cot, false);
    const nx = -s, ny = c;
    if (tn !== null) { const kk = Math.min(.5, (LIM - .3) / Math.max(1, Math.abs(tn))); place(T.sec, kk - nx * .16, kk * tn - ny * .16, "middle", sh.sec && Math.abs(V.sec) > .3, lb); } else vis(T.sec, false);
    if (ct !== null) { const kk = Math.min(.5, (LIM - .3) / Math.max(1, Math.abs(ct))); place(T.csc, kk * ct + nx * .16, kk + ny * .16, "middle", sh.csc && Math.abs(V.csc) > .3, lb); } else vis(T.csc, false);
    gh.setAttribute("aria-valuenow", d.toFixed(1)); gh.setAttribute("aria-valuetext", fmtDeg(d) + "°");
  }

  const rows = {};
  RATIOS.forEach(r => {
    const row = document.createElement("div");
    row.className = "val"; row.style.setProperty("--col", `var(${r.col})`);
    row.innerHTML = `<span class="bar"></span><span class="name"></span><span class="exact"></span><span class="def"></span><span class="dec"></span>`;
    row.addEventListener("mouseenter", () => { Ls[r.k].setAttribute("stroke-width", 9); row.classList.add("hl"); });
    row.addEventListener("mouseleave", () => { Ls[r.k].setAttribute("stroke-width", 6); row.classList.remove("hl"); });
    $("vals").appendChild(row); rows[r.k] = row;
  });
  RATIOS.forEach(r => mkChip($("chips"), "show-" + r.k, () => N(r.k), r.col, true, val => { st.show[r.k] = val; render1(); }));
  mkChip($("chips"), "show-labels", () => t("ui.labels"), null, true, val => { st.labels = val; render1(); });
  mkChip($("chips"), "snap", () => t("ui.snap"), null, true, val => st.snap = val);

  const in1 = bindAngle($("angleIn"), $("slider"), $("fieldWrap"), () => st.unit, () => st.deg, (d, f) => setDeg1(d, f));
  function setUnit1(un) {
    st.unit = un;
    $("uDeg").setAttribute("aria-pressed", un === "deg"); $("uRad").setAttribute("aria-pressed", un === "rad");
    $("unitTag").textContent = un === "deg" ? "°" : L("§rad");
    $("hint").innerHTML = t(un === "deg" ? "ui.hintDeg" : "ui.hintRad"); in1.range(un);
    axisLbl1.forEach((tx, i) => tx.textContent = AXIS[un][i]);
    const list = un === "deg" ? [0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 270, 300, 315] : [-180, -135, -90, -60, -45, -30, 0, 30, 45, 60, 90, 120, 135, 150, 180];
    $("quick").innerHTML = list.map(n => `<button type="button" data-d="${n}">${un === "deg" ? n + "°" : piFrac(n)}</button>`).join("");
    $("quick").querySelectorAll("button").forEach(b => b.addEventListener("click", () => setDeg1(wrapDeg(+b.dataset.d))));
    render1();
  }
  $("uDeg").addEventListener("click", () => setUnit1("deg"));
  $("uRad").addEventListener("click", () => setUnit1("rad"));

  let drag1 = false;
  svg.addEventListener("pointerdown", e => { drag1 = true; svg.setPointerCapture(e.pointerId); const d = pointerDeg(svg, e); if (d !== null) setDeg1(snap(d, st.snap)); e.preventDefault(); });
  svg.addEventListener("pointermove", e => { if (!drag1) return; const d = pointerDeg(svg, e); if (d !== null) setDeg1(snap(d, st.snap)); });
  svg.addEventListener("pointerup", () => drag1 = false); svg.addEventListener("pointercancel", () => drag1 = false);
  gh.addEventListener("keydown", e => {
    const step = e.shiftKey ? 15 : 1;
    if (["ArrowRight","ArrowUp"].includes(e.key)) { setDeg1(norm(Math.round(st.deg) + step)); e.preventDefault(); }
    if (["ArrowLeft","ArrowDown"].includes(e.key)) { setDeg1(norm(Math.round(st.deg) - step)); e.preventDefault(); }
  });

  function setDeg1(d, from) { st.deg = d; render1(from); }
  const txt = (id, s) => { const e = $(id); if (e) e.textContent = s; };
  function render1(from) {
    const d = st.deg, V = compute(d), E = exact(d), sd = signedDeg(d), R_ = L("§rad");
    draw1(d, V);
    const radDec = fmt(rad(st.unit === "rad" ? sd : d));
    if (st.unit === "deg") {
      const rx = isInt(d) ? piFrac(Math.round(d)) : null;
      $("bigAngle").innerHTML = `<i>θ</i> = ${fmtDeg(d)}°`;
      $("subAngle").innerHTML = `= ${rx ? `<span class="mr">${rx}</span> ${R_} ≈ ` : "≈ "}<span class="num">${radDec}</span> ${R_}`;
    } else {
      const rx = isInt(sd) ? piFrac(Math.round(sd)) : null;
      $("bigAngle").innerHTML = `<i>θ</i> = ${rx || radDec} <span style="font-size:.5em;color:var(--muted)">${R_}</span>`;
      $("subAngle").innerHTML = `≈ <span class="num">${radDec}</span> ${R_} = ${fmtDeg(sd)}°`;
    }
    const q = quadrant(d);
    $("quadTag").textContent = q ? `${t("ui.quadrant")} ${["", "I", "II", "III", "IV"][q]} · ${t("ui.ref")} ${fmtDeg(refAngle(d))}°` : t("ui.onAxis");
    document.querySelectorAll(".qd").forEach(x => x.classList.toggle("on", +x.dataset.q === q));
    RATIOS.forEach(r => {
      const val = V[r.k], row = rows[r.k], und = val === null;
      row.classList.toggle("undef", und);
      row.querySelector(".exact").textContent = und ? t("ui.undef") : (E ? E[r.k] : fmt(val));
      row.querySelector(".dec").textContent = und ? L(r.k === "tan" || r.k === "sec" ? "§cos θ = 0" : "§sin θ = 0") : (E ? "≈ " + fmt(val) : "");
    });
    txt("idR1", V.csc === null ? t("ui.lcR1") : `${fmt(V.s)} · ${fmtP(V.csc)} = ${fmt(V.s * V.csc)}`);
    txt("idR2", V.sec === null ? t("ui.lcR2") : `${fmt(V.c)} · ${fmtP(V.sec)} = ${fmt(V.c * V.sec)}`);
    txt("idR3", (V.tan === null || V.cot === null) ? t("ui.lcR3") : `${fmt(V.tan)} · ${fmtP(V.cot)} = ${fmt(V.tan * V.cot)}`);
    txt("idQ1", V.tan === null ? t("ui.lcQ1") : `${fmt(V.s)} / ${fmtP(V.c)} = ${fmt(V.tan)}`);
    txt("idQ2", V.cot === null ? t("ui.lcQ2") : `${fmt(V.c)} / ${fmtP(V.s)} = ${fmt(V.cot)}`);
    const s2 = V.s * V.s, c2 = V.c * V.c;
    txt("id1", `${fmt(s2)} + ${fmt(c2)} = ${fmt(s2 + c2)}`);
    txt("id2", V.tan === null ? t("ui.lc2") : `1 + ${fmt(V.tan ** 2)} = ${fmt(1 + V.tan ** 2)} = ${fmtP(V.sec)}²`);
    txt("id3", V.cot === null ? t("ui.lc3") : `1 + ${fmt(V.cot ** 2)} = ${fmt(1 + V.cot ** 2)} = ${fmtP(V.csc)}²`);
    document.querySelectorAll("#notable tbody tr").forEach(tr => tr.classList.toggle("on", Math.abs(+tr.dataset.d - norm(d)) < 1e-6));
    in1.sync(from);
  }

  /* ================= VISTA 2 · suma de ángulos ================= */
  const st2 = { a: 45, b: 30, op: 1, unit: "deg", snap: true, labels: true, proj: true };
  const svg2 = $("plot2");
  const axisLbl2 = buildStatic($("static2"));
  const g2 = $("dyn2"), l2 = $("labels2"), hA = $("hA"), hB = $("hB");
  const arcA = el("path", { fill:"color-mix(in srgb, var(--c-a) 18%, transparent)", stroke:"var(--c-a)", "stroke-width":2 }, g2);
  const arcB = el("path", { fill:"none", stroke:"var(--c-b)", "stroke-width":3.5, "marker-end":"url(#arrB)" }, g2);
  const rayB = el("line", { stroke:"var(--c-b)", "stroke-width":1.6, "stroke-dasharray":"5 6", opacity:.85 }, g2);
  const rayA = el("line", { stroke:"var(--c-a)", "stroke-width":3 }, g2);
  const cosG = el("line", { stroke:"var(--c-cos)", "stroke-width":5, "stroke-linecap":"round" }, g2);
  const sinG = el("line", { stroke:"var(--c-sin)", "stroke-width":5, "stroke-linecap":"round" }, g2);
  const rayG = el("line", { stroke:"var(--c-g)", "stroke-width":3.5 }, g2);
  const ptG = el("circle", { r:9, fill:"var(--c-g)", stroke:"var(--surface)", "stroke-width":3 }, g2);
  const lblAttrs = col => ({ fill:col, "font-size":20, "font-style":"italic", "font-weight":600, "text-anchor":"middle", "paint-order":"stroke", stroke:"var(--surface)", "stroke-width":5 });
  const lA = el("text", lblAttrs("var(--c-a)"), l2); lA.textContent = "α";
  const lB = el("text", lblAttrs("var(--c-b)"), l2); lB.textContent = "β";
  const lG = el("text", lblAttrs("var(--c-g)"), l2);
  const ringA = el("circle", { r:15, fill:"color-mix(in srgb, var(--c-a) 18%, transparent)", stroke:"var(--c-a)", "stroke-width":2 }, hA);
  const dotA = el("circle", { r:6.5, fill:"var(--c-a)" }, hA);
  const ringB = el("circle", { r:13, fill:"color-mix(in srgb, var(--c-b) 14%, transparent)", stroke:"var(--c-b)", "stroke-width":2, "stroke-dasharray":"4 3" }, hB);
  const dotB = el("circle", { r:5.5, fill:"var(--c-b)" }, hB);

  mkChip($("chips2"), "proj2", () => t("ui.proj"), null, true, val => { st2.proj = val; render2(); });
  mkChip($("chips2"), "lab2", () => t("ui.labels"), null, true, val => { st2.labels = val; render2(); });
  mkChip($("chips2"), "snap2", () => t("ui.snap"), null, true, val => st2.snap = val);

  const inA = bindAngle($("inA"), $("slA"), $("fieldA"), () => st2.unit, () => st2.a, (d, f) => { st2.a = d; render2(f, "a"); });
  const inB = bindAngle($("inB"), $("slB"), $("fieldB"), () => st2.unit, () => st2.b, (d, f) => { st2.b = d; render2(f, "b"); });
  const PAIRS = [[45, 30], [60, 45], [45, 45], [90, 30], [120, 45], [135, 60], [180, 30], [30, 60]];
  function quick2() {
    const sym = st2.op > 0 ? "+" : "−", lbl = n => st2.unit === "deg" ? n + "°" : piFrac(n);
    $("quick2").innerHTML = PAIRS.map(([a, b]) => `<button type="button" data-a="${a}" data-b="${b}">${lbl(a)} ${sym} ${lbl(b)}</button>`).join("");
    $("quick2").querySelectorAll("button").forEach(btn => btn.addEventListener("click", () => { st2.a = +btn.dataset.a; st2.b = +btn.dataset.b; render2(); }));
  }
  function setUnit2(un) {
    st2.unit = un;
    $("u2Deg").setAttribute("aria-pressed", un === "deg"); $("u2Rad").setAttribute("aria-pressed", un === "rad");
    document.querySelectorAll(".u2").forEach(x => x.textContent = un === "deg" ? "°" : L("§rad"));
    $("hint2").innerHTML = t(un === "deg" ? "ui.hintDeg" : "ui.hintRad"); inA.range(un); inB.range(un);
    axisLbl2.forEach((tx, i) => tx.textContent = AXIS[un][i]);
    quick2(); render2();
  }
  function setOp(op) { st2.op = op; $("opPlus").setAttribute("aria-pressed", op > 0); $("opMinus").setAttribute("aria-pressed", op < 0); quick2(); render2(); }
  $("u2Deg").addEventListener("click", () => setUnit2("deg"));
  $("u2Rad").addEventListener("click", () => setUnit2("rad"));
  $("opPlus").addEventListener("click", () => setOp(1));
  $("opMinus").addEventListener("click", () => setOp(-1));

  let drag2 = null;
  const gRaw = () => st2.a + st2.op * st2.b;
  function move2(d) {
    d = snap(d, st2.snap);
    if (drag2 === "a") st2.a = d; else if (drag2 === "b") st2.b = d; else st2.b = norm(st2.op * (d - st2.a));
    render2(null, drag2 === "a" ? "a" : "b");
  }
  svg2.addEventListener("pointerdown", e => {
    const d = pointerDeg(svg2, e); if (d === null) return;
    const cand = [["a", angDist(d, st2.a)], ["g", angDist(d, gRaw())], ["b", angDist(d, st2.b)]].sort((x, y) => x[1] - y[1]);
    drag2 = cand[0][0]; svg2.setPointerCapture(e.pointerId); move2(d); e.preventDefault();
  });
  svg2.addEventListener("pointermove", e => { if (!drag2) return; const d = pointerDeg(svg2, e); if (d !== null) move2(d); });
  svg2.addEventListener("pointerup", () => drag2 = null); svg2.addEventListener("pointercancel", () => drag2 = null);
  [[hA, "a"], [hB, "b"]].forEach(([h, kk]) => h.addEventListener("keydown", e => {
    const step = e.shiftKey ? 15 : 1;
    if (["ArrowRight","ArrowUp"].includes(e.key)) { st2[kk] = norm(Math.round(st2[kk]) + step); render2(null, kk); e.preventDefault(); }
    if (["ArrowLeft","ArrowDown"].includes(e.key)) { st2[kk] = norm(Math.round(st2[kk]) - step); render2(null, kk); e.preventDefault(); }
  }));

  const dir = (d, r) => [r * Math.cos(rad(d)), r * Math.sin(rad(d))];
  function angleHTML(d) {
    if (st2.unit === "deg") return fmtDeg(d) + "°";
    const sd = signedDeg(norm(d));
    return isInt(sd) ? piFrac(Math.round(sd)) : fmt(rad(sd)) + " " + L("§rad");
  }
  const exOrPlain = (E, kk, val) => val === null ? null : (E ? E[kk] : fmt(val));

  function render2(from, which) {
    const { a, b, op } = st2, raw = gRaw(), g = norm(raw), R_ = L("§rad");
    const Va = compute(a), Vb = compute(b), Vg = compute(g);
    const Ea = exact(a), Eb = exact(b), Eg = exact(g);
    const sym = op > 0 ? "+" : "−", symInv = op > 0 ? "−" : "+";
    const gName = `α ${sym} β`;

    const pa = dir(a, 1), pb = dir(b, 1), pg = dir(g, 1);
    const aA = arcPath(.3, 0, a, true); vis(arcA, !!aA); if (aA) arcA.setAttribute("d", aA);
    const aB = arcPath(.46, a, a + op * b, false); vis(arcB, !!aB && b > 3); if (aB) arcB.setAttribute("d", aB);
    setL(rayA, 0, 0, ...pa); setL(rayB, 0, 0, ...pb); setL(rayG, 0, 0, ...pg);
    setL(cosG, 0, 0, Vg.c, 0); setL(sinG, Vg.c, 0, Vg.c, Vg.s);
    vis(cosG, st2.proj && Math.abs(Vg.c) > 1e-9); vis(sinG, st2.proj && Math.abs(Vg.s) > 1e-9);
    ptG.setAttribute("cx", u(pg[0])); ptG.setAttribute("cy", v(pg[1]));
    for (const e of [ringA, dotA]) { e.setAttribute("cx", u(pa[0])); e.setAttribute("cy", v(pa[1])); }
    for (const e of [ringB, dotB]) { e.setAttribute("cx", u(pb[0])); e.setAttribute("cy", v(pb[1])); }
    const tl = (tx, d, r) => { const [x, y] = dir(d, r); tx.setAttribute("x", u(x)); tx.setAttribute("y", v(y) + 7); vis(tx, st2.labels); };
    tl(lA, a, 1.2); tl(lB, b, 1.2); lG.textContent = gName; tl(lG, g, 1.42);
    hA.setAttribute("aria-valuenow", a.toFixed(1)); hB.setAttribute("aria-valuenow", b.toFixed(1));

    $("bigG").innerHTML = `<i>α</i> ${sym} <i>β</i> = <span class="ig">${angleHTML(g)}</span>`;
    let sub = st2.unit === "deg"
      ? (isInt(g) ? `= <span class="mr">${piFrac(Math.round(g))}</span> ${R_} ≈ ` : "≈ ") + `<span class="num">${fmt(rad(g))}</span> ${R_}`
      : `≈ <span class="num">${fmt(rad(signedDeg(g)))}</span> ${R_} = ${fmtDeg(signedDeg(g))}°`;
    if (Math.abs(raw - g) > 1e-9 && !(Math.abs(raw - 360) < 1e-9)) sub += ` · ${t("ui.equiv", { a: `${fmtDeg(a)}° ${sym} ${fmtDeg(b)}°`, b: fmtDeg(raw) + "°", c: fmtDeg(g) + "°" })}`;
    $("subG").innerHTML = sub;

    const cell = (E, V, kk) => V[kk] === null ? `<td class="nd">${t("ui.noExist")}</td>` : `<td>${exOrPlain(E, kk, V[kk])}</td>`;
    $("mini").innerHTML = `<thead><tr><th></th><th class="ca">α</th><th class="cb">β</th><th class="cg">${gName}</th></tr></thead><tbody>${
      ["sin", "cos", "tan"].map(kk => `<tr><td>${N(kk)}</td>${cell(Ea, Va, kk)}${cell(Eb, Vb, kk)}${cell(Eg, Vg, kk)}</tr>`).join("")
    }</tbody>`;

    const ex = Ea && Eb;
    const val = (E, V, kk) => ex ? P(E[kk]) : fmtP(V[kk]);
    const resTxt = (V, kk) => V[kk] === null ? t("ui.noExist") : (Eg ? Eg[kk] : fmt(V[kk])) + (Eg && Eg[kk] !== fmt(V[kk]) ? ` <span class="hint num">≈ ${fmt(V[kk])}</span>` : "");
    const A = `<i class="ia">α</i>`, B = `<i class="ib">β</i>`;
    const btn = id => `<button type="button" class="more" data-demo="${id}">${t("ui.seeDemo")}</button>`;
    let html = "";
    html += `<div class="fx"><div class="f">${L(`§sin(${A} ${sym} ${B}) = §sin ${A} · §cos ${B} ${sym} §cos ${A} · §sin ${B}`)}</div>
      <div class="s">= ${val(Ea, Va, "sin")} · ${val(Eb, Vb, "cos")} ${sym} ${val(Ea, Va, "cos")} · ${val(Eb, Vb, "sin")}</div>
      <div class="r"><span>= <span class="ig">${resTxt(Vg, "sin")}</span></span><span class="ok">${t("ui.matches", { x: `${N("sin")}(${angleHTML(g)})` })}</span></div>${btn("sum-sin")}</div>`;
    html += `<div class="fx"><div class="f">${L(`§cos(${A} ${sym} ${B}) = §cos ${A} · §cos ${B} ${symInv} §sin ${A} · §sin ${B}`)}</div>
      <div class="s">= ${val(Ea, Va, "cos")} · ${val(Eb, Vb, "cos")} ${symInv} ${val(Ea, Va, "sin")} · ${val(Eb, Vb, "sin")}</div>
      <div class="r"><span>= <span class="ig">${resTxt(Vg, "cos")}</span></span><span class="ok">${t("ui.matches", { x: `${N("cos")}(${angleHTML(g)})` })}</span></div>${btn("sum-cos")}</div>`;
    let tanS, tanR;
    if (Va.tan === null || Vb.tan === null) {
      tanS = t("ui.tanNo", { x: Va.tan === null ? A : B });
      tanR = Vg.tan === null ? `${N("tan")}(${gName}) — ${t("ui.noExist")}` : `${t("ui.useSinCos")} <span class="ig">${resTxt(Vg, "tan")}</span>`;
    } else {
      const den = 1 - op * Va.tan * Vb.tan;
      tanS = `= (${val(Ea, Va, "tan")} ${sym} ${val(Eb, Vb, "tan")}) / (1 ${symInv} ${val(Ea, Va, "tan")} · ${val(Eb, Vb, "tan")})`;
      tanR = Math.abs(den) < 1e-9 ? t("ui.denom0", { g: gName }) : `= <span class="ig">${resTxt(Vg, "tan")}</span>`;
    }
    html += `<div class="fx"><div class="f">${L(`§tan(${A} ${sym} ${B}) = (§tan ${A} ${sym} §tan ${B}) / (1 ${symInv} §tan ${A} · §tan ${B})`)}</div>
      <div class="s">${tanS}</div><div class="r"><span>${tanR}</span></div>${btn("sum-tan")}</div>`;
    $("fx").innerHTML = html;

    const sum = Va.s + op * Vb.s, SN = N("sin"), CN = N("cos"), TN = N("tan");
    const w = $("wrong");
    if (w) w.innerHTML = `${SN} ${angleHTML(a)} ${sym} ${SN} ${angleHTML(b)} = <span class="num">${fmt(sum)}</span> &nbsp;≠&nbsp; ${SN}(${angleHTML(g)}) = <span class="num">${fmt(Vg.s)}</span>`
      + (Math.abs(sum - Vg.s) < 1e-6 ? ` <span class="hint">${t("ui.luck")}</span>` : "");
    const s2a = 2 * Va.s * Va.c, c2a = Va.c ** 2 - Va.s ** 2, d2 = compute(2 * a);
    const t2den = 1 - (Va.tan ?? 0) ** 2;
    const t2 = Va.tan === null ? t("ui.noTanA") : Math.abs(t2den) < 1e-9 ? t("ui.noTan2A") : `${TN} 2α = ${fmt(2 * Va.tan / t2den)}`;
    const dr = t("ui.direct");
    txt("dbl", `α = ${fmtDeg(a)}° → 2α = ${fmtDeg(norm(2 * a))}°: ${SN} 2α = ${fmt(s2a)} (${dr} ${fmt(d2.s)}), ${CN} 2α = ${fmt(c2a)} (${dr} ${fmt(d2.c)}), ${t2}`);
    txt("dbl2", `2·${fmtP(Va.c)}² − 1 = ${fmt(2 * Va.c ** 2 - 1)} · 1 − 2·${fmtP(Va.s)}² = ${fmt(1 - 2 * Va.s ** 2)}`);
    const h = compute(a / 2);
    txt("half", `α/2 = ${fmtDeg(a / 2)}°: √((1 − ${fmtP(Va.c)})/2) = ${fmt(Math.sqrt(Math.max(0, (1 - Va.c) / 2)))} → ${SN} = ${fmt(h.s)}; √((1 + ${fmtP(Va.c)})/2) = ${fmt(Math.sqrt(Math.max(0, (1 + Va.c) / 2)))} → ${CN} = ${fmt(h.c)}`);
    const P1 = 2 * Math.sin(rad((a + b) / 2)) * Math.cos(rad((a - b) / 2)), P2 = 2 * Math.cos(rad((a + b) / 2)) * Math.cos(rad((a - b) / 2));
    txt("s2p", `${SN} α + ${SN} β = ${fmt(Va.s + Vb.s)} = ${fmt(P1)} · ${CN} α + ${CN} β = ${fmt(Va.c + Vb.c)} = ${fmt(P2)}`);

    if (which !== "b") inA.sync(which === "a" ? from : null);
    if (which !== "a") inB.sync(which === "b" ? from : null);
  }

  /* ================= figuras de las demostraciones ================= */
  function fig(kind) {
    if (kind === "dist") return figDist();
    if (kind === "notables") return figNot();
    if (kind === "comp") return figComp();
    if (kind === "signs") return figSigns();
    if (kind === "rad") return figRad();
    if (kind === "s2p") return figS2p();
    const px = x => 50 + x * 140, py = y => 190 - y * 140;
    const c = Math.cos(rad(40)), s = Math.sin(rad(40)), tn = s / c, ct = c / s;
    const Ln = (x1, y1, x2, y2, col, w = 3, dash) => `<line x1="${px(x1)}" y1="${py(y1)}" x2="${px(x2)}" y2="${py(y2)}" stroke="${col}" stroke-width="${w}" stroke-linecap="round"${dash ? ` stroke-dasharray="${dash}"` : ""}/>`;
    const Tx = (x, y, tx, col = "var(--fg)", a = "middle", it = true) => `<text x="${px(x)}" y="${py(y)}" fill="${col}" text-anchor="${a}" font-size="16"${it ? ' font-style="italic"' : ""} paint-order="stroke" stroke="var(--surface)" stroke-width="4" stroke-linejoin="round">${tx}</text>`;
    const RA = (x, y, dx, dy) => { const e = .075; return `<path d="M${px(x + dx * e)} ${py(y)} L${px(x + dx * e)} ${py(y + dy * e)} L${px(x)} ${py(y + dy * e)}" fill="none" stroke="var(--muted)" stroke-width="1.3"/>`; };
    const Dot = (x, y, col = "var(--fg)") => `<circle cx="${px(x)}" cy="${py(y)}" r="4.5" fill="${col}"/>`;
    const thA = `<path d="M${px(.2)} ${py(0)} A28 28 0 0 0 ${px(.2 * c)} ${py(.2 * s)}" fill="none" stroke="var(--fg)" stroke-width="1.4"/>` + Tx(.3 * Math.cos(rad(18)), .3 * Math.sin(rad(18)) - .04, "θ");
    let g = `<line x1="10" y1="190" x2="292" y2="190" stroke="var(--axis)" stroke-width="1.2"/><line x1="50" y1="222" x2="50" y2="8" stroke="var(--axis)" stroke-width="1.2"/>
      <circle cx="${px(0)}" cy="${py(0)}" r="140" fill="none" stroke="var(--muted)" stroke-width="1.3" opacity=".7"/>`;
    const small = (hc, vc, w = 3) => Ln(0, 0, c, s, "var(--fg)", 2) + Ln(0, 0, c, 0, hc, w) + Ln(c, 0, c, s, vc, w) + RA(c, 0, -1, 1);
    const tanFig = (hyp, vcol) => Ln(1, -.25, 1, 1.3, "var(--muted)", 1, "3 5") + Ln(0, 0, 1, 0, "var(--muted)", 2) + Ln(0, 0, 1, tn, hyp, hyp === "var(--fg)" ? 2 : 4) + Ln(1, 0, 1, tn, vcol, 4) + RA(1, 0, -1, 1) + Dot(1, tn, vcol);
    const cotFig = (hyp, hcol) => Ln(-.25, 1, 1.75, 1, "var(--muted)", 1, "3 5") + Ln(0, 0, 0, 1, "var(--muted)", 3) + Ln(0, 0, ct, 1, hyp, hyp === "var(--fg)" ? 2 : 4) + Ln(0, 1, ct, 1, hcol, 4) + RA(0, 1, 1, -1) + Dot(ct, 1, hcol);
    const SN = N("sin"), CN = N("cos"), TN = N("tan"), KN = N("cot"), EN = N("sec"), QN = N("csc");
    const P_ = d => [Math.cos(rad(d)), Math.sin(rad(d))];
    const arcD = (r, a0, a1, col, w = 2, fill = "none") => `<path d="${(fill !== "none" ? `M${px(0)} ${py(0)} L` : "M") + px(r * Math.cos(rad(a0)))} ${py(r * Math.sin(rad(a0)))} A${r * 140} ${r * 140} 0 0 0 ${px(r * Math.cos(rad(a1)))} ${py(r * Math.sin(rad(a1)))}${fill !== "none" ? " Z" : ""}" fill="${fill}" stroke="${col}" stroke-width="${w}"/>`;
    const at = (d, r, tx, col, a = "middle", it = true) => { const [x, y] = P_(d); return Tx(r * x, r * y - .04, tx, col, a, it); };
    const tint = col => `color-mix(in srgb, var(${col}) 18%, transparent)`;
    const NEW = {
      sumsin: () => { const a = 30, b = 25, gg = a + b, [ax, ay] = P_(a), [gx, gy] = P_(gg);
        return arcD(.24, 0, a, "var(--c-a)", 2, tint("--c-a")) + arcD(.36, a, gg, "var(--c-b)", 3) +
          Ln(gx, 0, gx, gy, "var(--c-sin)", 4) + Ln(gx, 0, 0, 0, "var(--c-cos)", 4) + RA(gx, 0, -1, 1) +
          Ln(0, 0, ax, ay, "var(--c-a)", 2.5) + Ln(0, 0, gx, gy, "var(--c-g)", 3.5) + Dot(ax, ay, "var(--c-a)") + Dot(gx, gy, "var(--c-g)") +
          at(a / 2, .32, "α", "var(--c-a)") + at(a + b / 2, .47, "β", "var(--c-b)") + at(gg, 1.12, "α + β", "var(--c-g)") +
          Tx(gx + .05, gy * .8, `${SN}(α+β)`, "var(--c-sin)", "start") + Tx(gx / 2, -.13, `${CN}(α+β)`, "var(--c-cos)"); },
      sumtan: () => { const a = 25, b = 20, gg = a + b, ta = Math.tan(rad(a)), tg = Math.tan(rad(gg));
        return Ln(1, -.25, 1, 1.3, "var(--muted)", 1, "3 5") + arcD(.24, 0, a, "var(--c-a)", 2, tint("--c-a")) + arcD(.36, a, gg, "var(--c-b)", 3) +
          Ln(0, 0, 1, ta, "var(--c-a)", 2.5) + Ln(0, 0, 1, tg, "var(--c-g)", 3) +
          Ln(1, 0, 1, tg, "var(--c-g)", 4) + Ln(1.06, 0, 1.06, ta, "var(--c-a)", 4) + Dot(1, tg, "var(--c-g)") + Dot(1.06, ta, "var(--c-a)") +
          at(a / 2, .32, "α", "var(--c-a)") + at(a + b / 2, .47, "β", "var(--c-b)") +
          Tx(1.12, ta / 2, `${TN} α`, "var(--c-a)", "start") + Tx(1.12, tg - .02, `${TN}(α+β)`, "var(--c-g)", "start") + Tx(1, -.13, "1", "var(--fg)", "middle", false); },
      dbl: () => { const a = 30, [ax, ay] = P_(a), [dx, dy] = P_(2 * a);
        return arcD(.22, 0, a, "var(--c-a)", 2, tint("--c-a")) + arcD(.34, a, 2 * a, "var(--c-a)", 2) +
          Ln(ax, 0, ax, ay, "var(--c-sin)", 3, "4 4") + Ln(dx, 0, dx, dy, "var(--c-sin)", 4.5) +
          Ln(0, 0, ax, ay, "var(--c-a)", 2.5) + Ln(0, 0, dx, dy, "var(--c-g)", 3.5) + Dot(ax, ay, "var(--c-a)") + Dot(dx, dy, "var(--c-g)") +
          at(a / 2, .3, "α", "var(--c-a)") + at(1.5 * a, .44, "α", "var(--c-a)") + at(a, 1.1, "α", "var(--c-a)") + at(2 * a, 1.1, "2α", "var(--c-g)") +
          Tx(ax + .05, ay / 2, `${SN} α`, "var(--c-sin)", "start") + Tx(dx - .05, dy / 2, `${SN} 2α`, "var(--c-sin)", "end"); },
      dbl2: () => { const a = 35, [ax, ay] = P_(a), [dx, dy] = P_(2 * a);
        return arcD(.22, 0, a, "var(--c-a)", 2, tint("--c-a")) + arcD(.34, a, 2 * a, "var(--c-a)", 2) +
          Ln(0, 0, ax, 0, "var(--c-cos)", 3, "4 4") + Ln(0, -.04, dx, -.04, "var(--c-cos)", 4.5) +
          Ln(0, 0, ax, ay, "var(--c-a)", 2.5) + Ln(0, 0, dx, dy, "var(--c-g)", 3.5) + Ln(dx, 0, dx, dy, "var(--muted)", 1.2, "3 4") + Ln(ax, 0, ax, ay, "var(--muted)", 1.2, "3 4") +
          Dot(ax, ay, "var(--c-a)") + Dot(dx, dy, "var(--c-g)") + at(a, 1.1, "α", "var(--c-a)") + at(2 * a, 1.1, "2α", "var(--c-g)") +
          Tx(ax, -.22, `${CN} α`, "var(--c-cos)") + Tx(dx / 2, -.24, `${CN} 2α`, "var(--c-cos)"); },
      half: () => { const a = 70, [ax, ay] = P_(a), [hx, hy] = P_(a / 2);
        return arcD(.25, 0, a / 2, "var(--c-b)", 2, tint("--c-b")) + arcD(.25, a / 2, a, "var(--c-b)", 2, tint("--c-b")) +
          Ln(0, 0, ax, ay, "var(--c-a)", 2.5) + Ln(0, 0, 1, 0, "var(--fg)", 2) + Ln(0, 0, hx, hy, "var(--muted)", 1.5, "4 4") +
          Ln(ax, 0, ax, ay, "var(--muted)", 1.2, "3 4") + Ln(ax, 0, 1, 0, "var(--c-cos)", 4.5) + Ln(ax, ay, 1, 0, "var(--c-g)", 3.5) +
          Dot(ax, ay, "var(--c-a)") + Dot(1, 0, "var(--fg)") +
          at(a / 4, .36, "α/2", "var(--c-b)") + at(3 * a / 4, .38, "α/2", "var(--c-b)") + at(a, 1.1, "α", "var(--c-a)") +
          Tx((ax + 1) / 2 + .05, ay / 2 + .03, `2 ${SN}(α/2)`, "var(--c-g)", "start") + Tx((ax + 1) / 2, -.14, `1 − ${CN} α`, "var(--c-cos)"); },
      rectan: () => { const a = 40, ta = Math.tan(rad(a)), ca = 1 / ta;
        return Ln(1, -.25, 1, 1.3, "var(--muted)", 1, "3 5") + Ln(-.25, 1, 1.75, 1, "var(--muted)", 1, "3 5") + Ln(0, 0, ca, 1, "var(--fg)", 2) +
          Ln(1, 0, 1, ta, "var(--c-tan)", 4) + Ln(0, 1, ca, 1, "var(--c-cot)", 4) + Dot(1, ta, "var(--c-tan)") + Dot(ca, 1, "var(--c-cot)") +
          Tx(1.05, ta / 2, `${TN} θ`, "var(--c-tan)", "start") + Tx(ca / 2, 1.07, `${KN} θ`, "var(--c-cot)") +
          Tx(1, -.13, "1", "var(--fg)", "middle", false) + Tx(-.05, 1, "1", "var(--fg)", "end", false) + at(a / 2, .3, "θ", "var(--fg)"); },
    };
    if (NEW[kind]) return `<svg class="mfig" viewBox="0 0 300 230" role="img">${g + NEW[kind]()}</svg>`;
    switch (kind) {
      case "sin": g += small("var(--muted)", "var(--c-sin)", 4) + Dot(c, s) + Tx(c / 2 - .07, s / 2 + .06, "1", "var(--fg)", "end", false) + Tx(c / 2, -.13, "x", "var(--muted)") + Tx(c + .05, s / 2, "y", "var(--c-sin)", "start") + Tx(c + .05, s + .05, "P", "var(--fg)", "start"); break;
      case "cos": g += small("var(--c-cos)", "var(--muted)", 4) + Dot(c, s) + Tx(c / 2 - .07, s / 2 + .06, "1", "var(--fg)", "end", false) + Tx(c / 2, -.13, "x", "var(--c-cos)") + Tx(c + .05, s / 2, "y", "var(--muted)", "start") + Tx(c + .05, s + .05, "P", "var(--fg)", "start"); break;
      case "pyth": g += small("var(--c-cos)", "var(--c-sin)", 4) + Dot(c, s) + Tx(c / 2 - .07, s / 2 + .06, "1", "var(--fg)", "end", false) + Tx(c / 2, -.13, `${CN} θ`, "var(--c-cos)") + Tx(c + .05, s / 2, `${SN} θ`, "var(--c-sin)", "start"); break;
      case "tan": g += tanFig("var(--fg)", "var(--c-tan)") + Ln(0, 0, c, 0, "var(--muted)", 3) + Ln(c, 0, c, s, "var(--muted)", 3) + Dot(c, s) + Tx(1.05, tn / 2, "t", "var(--c-tan)", "start") + Tx(c - .04, s / 2, "y", "var(--muted)", "end") + Tx(c / 2, -.13, "x", "var(--muted)") + Tx(1, -.13, "1", "var(--fg)", "middle", false); break;
      case "sec": g += tanFig("var(--c-sec)", "var(--c-tan)") + Tx(.5 - .06, tn / 2 + .07, "h", "var(--c-sec)", "end") + Tx(1.05, tn / 2, "t", "var(--c-tan)", "start") + Tx(.5, -.13, "1", "var(--fg)", "middle", false); break;
      case "pyth-tan": g += tanFig("var(--c-sec)", "var(--c-tan)") + Tx(.5 - .06, tn / 2 + .07, `${EN} θ`, "var(--c-sec)", "end") + Tx(1.05, tn / 2, `${TN} θ`, "var(--c-tan)", "start") + Tx(.5, -.13, "1", "var(--fg)", "middle", false); break;
      case "cot": g += cotFig("var(--fg)", "var(--c-cot)") + Tx(ct / 2, 1.07, "c", "var(--c-cot)") + Tx(-.05, .5, "1", "var(--fg)", "end", false) + Tx(ct - .2, .9, "θ"); break;
      case "csc": g += cotFig("var(--c-csc)", "var(--c-cot)") + Tx(ct / 2, 1.07, "c", "var(--c-cot)") + Tx(-.05, .5, "1", "var(--fg)", "end", false) + Tx(ct / 2 + .08, .44, "h", "var(--c-csc)", "start") + Tx(ct - .2, .9, "θ"); break;
      case "pyth-cot": g += cotFig("var(--c-csc)", "var(--c-cot)") + Tx(ct / 2, 1.07, `${KN} θ`, "var(--c-cot)") + Tx(-.05, .5, "1", "var(--fg)", "end", false) + Tx(ct / 2 + .08, .44, `${QN} θ`, "var(--c-csc)", "start") + Tx(ct - .2, .9, "θ"); break;
    }
    return `<svg class="mfig" viewBox="0 0 300 230" role="img">${g + thA}</svg>`;
  }
  function figDist() {
    const R0 = 92, a = 125, b = 25;
    const p = (cx, cy, d, r = R0) => [cx + r * Math.cos(rad(d)), cy - r * Math.sin(rad(d))];
    const Tt = (x, y, tx, col, it = true) => `<text x="${x}" y="${y}" fill="${col}" font-size="17" text-anchor="middle"${it ? ' font-style="italic"' : ""}>${tx}</text>`;
    const panel = (cx, cy, da, db, na, nb) => {
      const [ax, ay] = p(cx, cy, da), [bx, by] = p(cx, cy, db), [lax, lay] = p(cx, cy, da, R0 + 18), [lbx, lby] = p(cx, cy, db, R0 + 18);
      return `<line x1="${cx - 110}" y1="${cy}" x2="${cx + 110}" y2="${cy}" stroke="var(--axis)" stroke-width="1"/><line x1="${cx}" y1="${cy + 110}" x2="${cx}" y2="${cy - 110}" stroke="var(--axis)" stroke-width="1"/>
        <circle cx="${cx}" cy="${cy}" r="${R0}" fill="none" stroke="var(--muted)" stroke-width="1.3" opacity=".7"/>
        <line x1="${cx}" y1="${cy}" x2="${ax}" y2="${ay}" stroke="var(--muted)" stroke-width="1.5"/><line x1="${cx}" y1="${cy}" x2="${bx}" y2="${by}" stroke="var(--muted)" stroke-width="1.5"/>
        <line x1="${ax}" y1="${ay}" x2="${bx}" y2="${by}" stroke="var(--c-g)" stroke-width="3.5"/>
        <circle cx="${ax}" cy="${ay}" r="5" fill="var(--c-a)"/><circle cx="${bx}" cy="${by}" r="5" fill="var(--c-b)"/>
        ${Tt(lax, lay + 6, na, "var(--c-a)")}${Tt(lbx + 4, lby + 6, nb, "var(--c-b)")}`;
    };
    return `<svg class="mfig wide" viewBox="0 0 560 250" role="img">
      <defs><marker id="arrM" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="var(--muted)"/></marker></defs>
      ${panel(140, 130, a, b, "A", "B")}${panel(420, 130, a - b, 0, "A′", "B′")}
      ${Tt(280, 38, "−β", "var(--muted)")}<path d="M245 50 Q280 62 315 50" fill="none" stroke="var(--muted)" stroke-width="1.5" marker-end="url(#arrM)"/>
      ${Tt(186, 154, "d", "var(--c-g)")}${Tt(456, 112, "d", "var(--c-g)")}
    </svg>`;
  }
  function cfig(cx, cy, R0, inner, vb = "0 0 300 240") {
    return `<svg class="mfig" viewBox="${vb}" role="img"><line x1="${cx - R0 - 25}" y1="${cy}" x2="${cx + R0 + 25}" y2="${cy}" stroke="var(--axis)" stroke-width="1.2"/><line x1="${cx}" y1="${cy + R0 + 20}" x2="${cx}" y2="${cy - R0 - 20}" stroke="var(--axis)" stroke-width="1.2"/><circle cx="${cx}" cy="${cy}" r="${R0}" fill="none" stroke="var(--muted)" stroke-width="1.3" opacity=".7"/>${inner}</svg>`;
  }
  const Tc = (x, y, tx, col = "var(--fg)", a = "middle", it = true, fs = 16) => `<text x="${x}" y="${y}" fill="${col}" text-anchor="${a}" font-size="${fs}"${it ? ' font-style="italic"' : ""} paint-order="stroke" stroke="var(--surface)" stroke-width="4" stroke-linejoin="round">${tx}</text>`;
  function figComp() {
    const SN = N("sin"), CN = N("cos");
    return `<svg class="mfig" viewBox="0 0 300 230" role="img">
      <path d="M40 180 L250 180 L250 40 Z" fill="color-mix(in srgb, var(--fg) 5%, transparent)" stroke="var(--fg)" stroke-width="2" stroke-linejoin="round"/>
      <line x1="250" y1="180" x2="250" y2="40" stroke="var(--c-sin)" stroke-width="4.5"/>
      <path d="M238 180 L238 168 L250 168" fill="none" stroke="var(--muted)" stroke-width="1.3"/>
      <path d="M78 180 A38 38 0 0 0 72 159" fill="none" stroke="var(--c-a)" stroke-width="2"/>
      <path d="M250 74 A34 34 0 0 1 222 59" fill="none" stroke="var(--c-b)" stroke-width="2"/>
      ${Tc(92, 172, "x", "var(--c-a)")}${Tc(230, 92, "90° − x", "var(--c-b)", "end")}${Tc(138, 104, "1", "var(--fg)", "end", false)}
      ${Tc(150, 214, `${SN} x = ${CN}(90° − x)`, "var(--c-sin)", "middle", true, 15)}
    </svg>`;
  }
  function figSigns() {
    const cx = 150, cy = 120, R0 = 80, SN = N("sin"), CN = N("cos"), TN = N("tan");
    const plus = '<tspan fill="var(--c-csc)" font-style="normal" font-weight="700"> +</tspan>', minus = '<tspan fill="var(--c-sec)" font-style="normal" font-weight="700"> −</tspan>';
    const Q = [[1, 1, 1], [1, 0, 0], [0, 0, 1], [0, 1, 0]], pos = [[238, 30], [62, 30], [62, 168], [238, 168]];
    const block = (q, [x, y]) => [SN, CN, TN].map((n, i) => `<text x="${x}" y="${y + i * 19}" text-anchor="middle" font-size="15" font-style="italic" fill="var(--fg)">${n}${Q[q][i] ? plus : minus}</text>`).join("");
    const roman = ["I", "II", "III", "IV"], rp = [[cx + 34, cy - 30], [cx - 34, cy - 30], [cx - 34, cy + 42], [cx + 34, cy + 42]];
    return cfig(cx, cy, R0, Q.map((_, q) => block(q, pos[q]) + Tc(rp[q][0], rp[q][1], roman[q], "var(--muted)", "middle", false, 15)).join(""));
  }
  function figRad() {
    const cx = 150, cy = 125, R0 = 90, a = 180 / Math.PI, ex = cx + R0 * Math.cos(rad(a)), ey = cy - R0 * Math.sin(rad(a));
    return cfig(cx, cy, R0, `<path d="M${cx} ${cy} L${cx + 26} ${cy} A26 26 0 0 0 ${cx + 26 * Math.cos(rad(a))} ${cy - 26 * Math.sin(rad(a))} Z" fill="color-mix(in srgb, var(--c-g) 15%, transparent)" stroke="var(--c-g)" stroke-width="1.5"/>
      <line x1="${cx}" y1="${cy}" x2="${cx + R0}" y2="${cy}" stroke="var(--c-a)" stroke-width="3.5"/><line x1="${cx}" y1="${cy}" x2="${ex}" y2="${ey}" stroke="var(--c-a)" stroke-width="3.5"/>
      <path d="M${cx + R0} ${cy} A${R0} ${R0} 0 0 0 ${ex} ${ey}" fill="none" stroke="var(--c-g)" stroke-width="5"/>
      <circle cx="${cx + R0}" cy="${cy}" r="4.5" fill="var(--fg)"/><circle cx="${ex}" cy="${ey}" r="4.5" fill="var(--fg)"/>
      ${Tc(cx + R0 / 2, cy + 20, "r", "var(--c-a)")}${Tc(cx + R0 * .32, cy - R0 * .62, "r", "var(--c-a)")}${Tc(cx + (R0 + 20) * Math.cos(rad(a / 2)), cy - (R0 + 20) * Math.sin(rad(a / 2)) + 5, "⌒ = r", "var(--c-g)", "start")}
      ${Tc(cx + 44 * Math.cos(rad(a / 2)) + 2, cy - 44 * Math.sin(rad(a / 2)) + 6, "1 " + L("§rad"), "var(--c-g)", "start", false, 14)}`);
  }
  function figS2p() {
    const cx = 150, cy = 130, R0 = 95, a = 120, b = 25, p = d => [cx + R0 * Math.cos(rad(d)), cy - R0 * Math.sin(rad(d))];
    const [ax, ay] = p(a), [bx, by] = p(b), mx = (ax + bx) / 2, my = (ay + by) / 2, [ex, ey] = p((a + b) / 2), SN = N("sin");
    const vline = (x, y, col, w = 1.3, dash = "3 4") => `<line x1="${x}" y1="${cy}" x2="${x}" y2="${y}" stroke="${col}" stroke-width="${w}" stroke-dasharray="${dash}"/>`;
    return cfig(cx, cy, R0, `<line x1="${cx}" y1="${cy}" x2="${ex}" y2="${ey}" stroke="var(--c-g)" stroke-width="1.5" stroke-dasharray="5 5"/>
      <line x1="${cx}" y1="${cy}" x2="${ax}" y2="${ay}" stroke="var(--c-a)" stroke-width="2"/><line x1="${cx}" y1="${cy}" x2="${bx}" y2="${by}" stroke="var(--c-b)" stroke-width="2"/>
      ${vline(ax, ay, "var(--c-a)")}${vline(bx, by, "var(--c-b)")}<line x1="${mx}" y1="${cy}" x2="${mx}" y2="${my}" stroke="var(--c-sin)" stroke-width="4.5"/>
      <line x1="${ax}" y1="${ay}" x2="${bx}" y2="${by}" stroke="var(--c-g)" stroke-width="3"/>
      <circle cx="${ax}" cy="${ay}" r="5" fill="var(--c-a)"/><circle cx="${bx}" cy="${by}" r="5" fill="var(--c-b)"/><circle cx="${mx}" cy="${my}" r="5.5" fill="var(--c-g)"/>
      ${Tc(ax - 10, ay - 8, "A", "var(--c-a)", "end")}${Tc(bx + 10, by - 6, "B", "var(--c-b)", "start")}${Tc(mx - 8, my - 10, "M", "var(--c-g)", "end")}
      ${Tc(ex + 6, ey - 8, "(α+β)/2", "var(--c-g)", "start", true, 14)}
      ${Tc(cx, cy + R0 + 38, `y<tspan font-size="11" dy="3">M</tspan><tspan dy="-3"> = (${SN} α + ${SN} β) / 2</tspan>`, "var(--c-sin)", "middle", true, 15)}`, "0 0 300 268");
  }
  function figNot() {
    const Tt = (x, y, tx, col = "var(--fg)", a = "middle") => `<text x="${x}" y="${y}" fill="${col}" font-size="17" text-anchor="${a}">${tx}</text>`;
    const sq = (x, y) => `<path d="M${x - 12} ${y} L${x - 12} ${y - 12} L${x} ${y - 12}" fill="none" stroke="var(--muted)" stroke-width="1.3"/>`;
    return `<svg class="mfig wide" viewBox="0 0 560 240" role="img">
      <path d="M40 205 L190 205 L190 55 Z" fill="color-mix(in srgb, var(--fg) 5%, transparent)" stroke="var(--fg)" stroke-width="2" stroke-linejoin="round"/>
      <line x1="40" y1="205" x2="190" y2="205" stroke="var(--c-cos)" stroke-width="4"/><line x1="190" y1="205" x2="190" y2="55" stroke="var(--c-sin)" stroke-width="4"/>
      ${sq(190, 205)}${Tt(105, 120, "1", "var(--fg)", "end")}${Tt(115, 230, "√2/2", "var(--c-cos)")}${Tt(200, 135, "√2/2", "var(--c-sin)", "start")}${Tt(78, 198, "45°", "var(--muted)")}${Tt(178, 85, "45°", "var(--muted)", "end")}
      <path d="M330 205 L420 205 L420 49 Z" fill="color-mix(in srgb, var(--fg) 5%, transparent)" stroke="var(--fg)" stroke-width="2" stroke-linejoin="round"/>
      <path d="M420 205 L510 205 L420 49" fill="none" stroke="var(--muted)" stroke-width="1.3" stroke-dasharray="4 5"/>
      <line x1="330" y1="205" x2="420" y2="205" stroke="var(--c-cos)" stroke-width="4"/><line x1="420" y1="205" x2="420" y2="49" stroke="var(--c-sin)" stroke-width="4"/>
      ${sq(420, 205)}${Tt(362, 120, "1", "var(--fg)", "end")}${Tt(375, 230, "1/2", "var(--c-cos)")}${Tt(412, 140, "√3/2", "var(--c-sin)", "end")}${Tt(358, 198, "60°", "var(--muted)")}${Tt(412, 90, "30°", "var(--muted)", "end")}
    </svg>`;
  }

/*@@CX@@*/
  /* ================= popup ================= */
  const dlg = $("demo"), dlgBody = $("demoBody");
  let currentDemo = null;
  function openDemo(id) {
    const F = FORM[id] || CXF[id], Tx = F && F.cx ? (cxD().demos?.[id] ?? CX.es.demos[id]) : t("demos." + id); if (!F || typeof Tx !== "object") return;
    currentDemo = id;
    dlgBody.innerHTML = `<div class="dlg-head"><div><span class="eyebrow">${t("ui.demo")}</span><h2 id="demoTitle">${LX(Tx.t)}</h2></div><button type="button" class="x" aria-label="${t("ui.close")}">×</button></div>
      <div class="stmt">${LX(F.stmt)}</div>${F.fig ? `<div class="figrow">${[].concat(F.fig).map(F.cx ? cxFig : fig).join("")}</div>` : ""}
      <ol class="psteps">${F.f.map((f, i) => `<li><div class="sf">${LX(f)}</div><p>${LX(Tx.s[i] ?? "")}</p></li>`).join("")}</ol>
      <div class="usebox"><b>${t("ui.use")}</b><p>${LX(Tx.u)}</p></div>`;
    dlgBody.querySelector(".x").addEventListener("click", () => dlg.close());
    if (!dlg.open) { dlg.showModal(); dlg.scrollTop = 0; }
  }
  dlg.addEventListener("click", e => { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener("close", () => currentDemo = null);
  document.addEventListener("click", e => { const tg = e.target.closest("[data-demo]"); if (tg && !dlg.contains(tg)) openDemo(tg.dataset.demo); });
  document.addEventListener("keydown", e => {
    if (e.key !== "Enter" && e.key !== " ") return;
    const tg = e.target.closest?.('[data-demo][role="button"]'); if (!tg || tg !== e.target) return;
    e.preventDefault(); openDemo(tg.dataset.demo);
  });

  /* ================= tema ================= */
  const root = document.documentElement, themeBtn = $("themeBtn"), mq = matchMedia("(prefers-color-scheme: dark)");
  const SUN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6"/></svg>';
  const MOON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/></svg>';
  const effective = () => root.getAttribute("data-theme") || (mq.matches ? "dark" : "light");
  function themeIcon() {
    const dark = effective() === "dark";
    themeBtn.innerHTML = dark ? SUN : MOON;
    themeBtn.setAttribute("aria-label", t(dark ? "ui.toLight" : "ui.toDark"));
    themeBtn.title = t(dark ? "ui.toLight" : "ui.toDark");
  }
  try { const saved = localStorage.getItem("trig-theme"); if (saved) root.setAttribute("data-theme", saved); } catch {}
  themeBtn.addEventListener("click", () => {
    const next = effective() === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("trig-theme", next); } catch {}
    themeIcon();
  });
  mq.addEventListener?.("change", themeIcon);
  new MutationObserver(themeIcon).observe(root, { attributes: true, attributeFilter: ["data-theme"] });

  /* ================= banderas y menú de idioma ================= */
  let flagN = 0;
  function flag(code) {
    const V = (a, b, c) => `<svg viewBox="0 0 3 2" preserveAspectRatio="none"><rect width="1" height="2" fill="${a}"/><rect x="1" width="1" height="2" fill="${b}"/><rect x="2" width="1" height="2" fill="${c}"/></svg>`;
    const H = (a, b, c) => `<svg viewBox="0 0 3 3" preserveAspectRatio="none"><rect width="3" height="1" fill="${a}"/><rect y="1" width="3" height="1" fill="${b}"/><rect y="2" width="3" height="1" fill="${c}"/></svg>`;
    let s;
    switch (code) {
      case "es": s = `<svg viewBox="0 0 30 20" preserveAspectRatio="none"><rect width="30" height="20" fill="#AA151B"/><rect y="5" width="30" height="10" fill="#F1BF00"/></svg>`; break;
      case "ca": s = `<svg viewBox="0 0 9 9" preserveAspectRatio="none"><rect width="9" height="9" fill="#FCDD09"/>${[1, 3, 5, 7].map(y => `<rect y="${y}" width="9" height="1" fill="#DA121A"/>`).join("")}</svg>`; break;
      case "en": { const i = ++flagN; s = `<svg viewBox="0 0 60 30" preserveAspectRatio="xMidYMid slice"><clipPath id="uk${i}"><path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z"/></clipPath><rect width="60" height="30" fill="#012169"/><path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" stroke-width="6"/><path d="M0,0 L60,30 M60,0 L0,30" clip-path="url(#uk${i})" stroke="#C8102E" stroke-width="4"/><path d="M30,0 v30 M0,15 h60" stroke="#fff" stroke-width="10"/><path d="M30,0 v30 M0,15 h60" stroke="#C8102E" stroke-width="6"/></svg>`; break; }
      case "fr": s = V("#0055A4", "#FFFFFF", "#EF4135"); break;
      case "de": s = H("#000000", "#DD0000", "#FFCE00"); break;
      case "it": s = V("#009246", "#FFFFFF", "#CE2B37"); break;
      case "pt": s = `<svg viewBox="0 0 30 20" preserveAspectRatio="none"><rect width="30" height="20" fill="#FF0000"/><rect width="12" height="20" fill="#006600"/><circle cx="12" cy="10" r="4.2" fill="#FFCC00"/><circle cx="12" cy="10" r="2.6" fill="#FF0000"/><rect x="10.8" y="8.4" width="2.4" height="3" rx=".5" fill="#fff"/></svg>`; break;
      case "ro": s = V("#002B7F", "#FCD116", "#CE1126"); break;
      case "ru": s = H("#FFFFFF", "#0039A6", "#D52B1E"); break;
    }
    return `<span class="flag" aria-hidden="true">${s}</span>`;
  }
  const langBtn = $("langBtn"), langMenu = $("langMenu");
  function buildLangUI() {
    langBtn.innerHTML = `${flag(lang)}<span>${I18N[lang].meta.code}</span><svg class="chev" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M2 3.5 L5 6.5 L8 3.5"/></svg>`;
    langBtn.setAttribute("aria-label", `${t("ui.lang")}: ${I18N[lang].meta.name}`);
    langMenu.innerHTML = LANGS.map(c => `<button type="button" role="menuitemradio" data-lang="${c}" aria-selected="${c === lang}" lang="${I18N[c].meta.html}">${flag(c)}<span>${I18N[c].meta.name}</span></button>`).join("");
  }
  const closeMenu = () => { langMenu.hidden = true; langBtn.setAttribute("aria-expanded", "false"); };
  langBtn.addEventListener("click", e => {
    e.stopPropagation();
    const open = langMenu.hidden;
    langMenu.hidden = !open; langBtn.setAttribute("aria-expanded", String(open));
    if (open) langMenu.querySelector('[aria-selected="true"]')?.focus();
  });
  langMenu.addEventListener("click", e => {
    const b = e.target.closest("[data-lang]"); if (!b) return;
    setLang(b.dataset.lang); closeMenu(); langBtn.focus();
  });
  langMenu.addEventListener("keydown", e => {
    const items = [...langMenu.querySelectorAll("button")], i = items.indexOf(document.activeElement);
    if (e.key === "ArrowDown") { items[(i + 1) % items.length].focus(); e.preventDefault(); }
    if (e.key === "ArrowUp") { items[(i - 1 + items.length) % items.length].focus(); e.preventDefault(); }
  });
  document.addEventListener("click", e => { if (!langMenu.hidden && !e.target.closest(".langwrap")) closeMenu(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape" && !langMenu.hidden) { closeMenu(); langBtn.focus(); } });

  function applyTexts() {
    document.documentElement.lang = Dct().meta.html;
    document.querySelectorAll("[data-t]").forEach(e => e.innerHTML = t(e.dataset.t));
    chipTexts.forEach(([sp, fn]) => sp.innerHTML = fn());
    RATIOS.forEach(r => {
      T[r.k].textContent = N(r.k);
      rows[r.k].querySelector(".name").innerHTML = `${N(r.k)} <i>θ</i>`;
      rows[r.k].querySelector(".def").textContent = t("g1.def." + r.k);
    });
    gh.setAttribute("aria-label", t("ui.angle")); $("slider").setAttribute("aria-label", t("ui.angle"));
    $("legend2").innerHTML = [["--c-a", "α"], ["--c-b", t("ui.legB")], ["--c-g", "α ± β"], ["--c-cos", `${N("cos")}(α ± β)`], ["--c-sin", `${N("sin")}(α ± β)`]]
      .map(([c, l]) => `<span style="--sw:var(${c})"><i></i>${l}</span>`).join("");
    buildLangUI(); themeIcon();
    renderGuide1(); renderGuide2();
    setUnit1(st.unit); setUnit2(st2.unit);
    document.querySelectorAll("[data-n]").forEach(e => { if (e.closest("#nSeg")) return; e.textContent = nv(e.dataset.n); });
    $("subjects").setAttribute("aria-label", nv("subj"));
    applyCX();
    showView(subj, topic, true);
  }
  function setLang(code) {
    if (!I18N[code]) return;
    lang = code;
    try { localStorage.setItem("trig-lang", code); } catch {}
    applyTexts();
    if (currentDemo && dlg.open) openDemo(currentDemo);
  }

  /* ================= asignaturas y pestañas ================= */
  let subj = "calc", topic = "uno";
  const HASH = { uno: "trig", suma: "suma", cx: "complejos", stat: "estadistica", lin: "algebra" };
  function setHeader() {
    let e, h, p;
    if (subj !== "calc") { e = nv("site"); h = nv(subj); p = ""; }
    else if (topic === "cx") { e = ct("eyebrow"); h = ct("title"); p = ct("intro"); }
    else { e = t("ui.eyebrow"); h = t("ui.title"); p = t("ui.intro"); }
    $("hdEye").innerHTML = e; $("hdTitle").innerHTML = h; $("hdIntro").innerHTML = p; $("hdIntro").hidden = !p;
    document.title = `${h.replace(/<[^>]+>/g, "")} · ${nv("site")}`;
  }
  function showView(s_, tp, quiet) {
    subj = s_; if (tp) topic = tp;
    document.querySelectorAll("#subjects [data-subj]").forEach(b => b.setAttribute("aria-pressed", b.dataset.subj === subj));
    $("calcTabs").hidden = subj !== "calc";
    ["uno", "suma", "cx"].forEach(n => { const on = subj === "calc" && n === topic; $("tab-" + n).setAttribute("aria-selected", on); $("view-" + n).hidden = !on; });
    $("view-soon").hidden = subj === "calc";
    if (subj !== "calc") {
      $("soonIc").textContent = subj === "stat" ? "σ  x̄" : "[A]  λ";
      $("soonT").textContent = nv("soonT"); $("soonP").textContent = nv("soonP", { s: nv(subj) }); $("soonBack").textContent = nv("back");
    }
    setHeader();
    if (!quiet) { try { history.replaceState(null, "", "#" + HASH[subj === "calc" ? topic : subj]); } catch {} }
  }
  $("tab-uno").addEventListener("click", () => showView("calc", "uno"));
  $("tab-suma").addEventListener("click", () => showView("calc", "suma"));
  $("tab-cx").addEventListener("click", () => showView("calc", "cx"));
  $("subjects").addEventListener("click", e => { const b = e.target.closest("[data-subj]"); if (b) showView(b.dataset.subj); });
  $("soonBack").addEventListener("click", () => showView("calc"));

  { const hsh = location.hash.slice(1), hit = Object.entries(HASH).find(([, v]) => v === hsh);
    if (hit) { if (hit[0] === "stat" || hit[0] === "lin") subj = hit[0]; else topic = hit[0]; } }
  applyTexts();
})();
