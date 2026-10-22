  /* ================= NÚMEROS COMPLEJOS ================= */
  const CXLANG = () => (window.CX && CX[lang]) ? lang : (lang === "ca" ? "es" : "en");
  const cxD = () => CX[CXLANG()];
  const SS = s => s.replace(/\^\{([^}]*)\}/g, "<sup>$1</sup>").replace(/_\{([^}]*)\}/g, "<sub>$1</sub>").replace(/\^([A-Za-zα-ωπ0-9]+)/g, "<sup>$1</sup>").replace(/_([A-Za-zα-ωπ0-9₀-₉−]+)/g, "<sub>$1</sub>");
  const LX = s => L(SS(String(s)).replace(/§([a-z]+)/g, (mm, n) => cxD().w?.[n] ?? CX.es.w?.[n] ?? mm));
  function ct(p, params) {
    let x = getPath(cxD(), p); if (x == null) x = getPath(CX.es, p); if (x == null) return p;
    if (typeof x !== "string") return x;
    x = LX(x);
    return params ? x.replace(/\{(\w+)\}/g, (mm, kk) => params[kk] ?? mm) : x;
  }

  /* ---- números ---- */
  function ratio(x, maxDen = 64) {
    if (!Number.isFinite(x)) return null;
    for (let q = 1; q <= maxDen; q++) { const p = Math.round(x * q); if (Math.abs(p / q - x) < 1e-9 * Math.max(1, Math.abs(x))) return [p, q]; }
    return null;
  }
  const fT = (x, d = 3) => { if (Math.abs(x) < 5 * 10 ** -(d + 1)) x = 0; return minus(x.toLocaleString(loc(), { maximumFractionDigits: d, useGrouping: false })); };
  function nq(x) {
    if (Math.abs(x) < 1e-10) return { s: "0", ex: true };
    if (Math.abs(x * 1000 - Math.round(x * 1000)) < 1e-7) return { s: fT(x), ex: true };
    const r = ratio(x); if (r) return { s: minus(`${r[0]}/${r[1]}`), ex: true };
    return { s: fT(x), ex: false };
  }
  function sqrtEx(n) {
    const r = ratio(n, 64); if (!r) return null;
    const [p, q] = r; if (p < 0) return null;
    const N2 = p * q; if (N2 > 1e7) return null;
    let kf = 1, mm = N2;
    for (let f = 2; f * f <= mm; f++) while (mm % (f * f) === 0) { mm /= f * f; kf *= f; }
    const g = gcd(kf, q), co = kf / g, de = q / g;
    if (mm === 1) return nq(co / de).s;
    return `${co === 1 ? "" : co}√${mm}${de > 1 ? "/" + de : ""}`;
  }
  function scaleEx(str, [p, q]) {
    if (p === q) return str;
    const neg = str.startsWith("−"), s = neg ? str.slice(1) : str;
    const mt = s.match(/^(\d+)?(?:√(\d+))?(?:\/(\d+))?$/);
    if (!mt || (!mt[1] && !mt[2])) return null;
    const co = mt[1] ? +mt[1] : 1, rt = mt[2], de = mt[3] ? +mt[3] : 1;
    let P_ = co * p, Q_ = de * q; if (P_ === 0) return "0";
    const g = gcd(P_, Q_); P_ /= g; Q_ /= g;
    let out = rt ? `${P_ === 1 ? "" : P_}√${rt}` : String(P_);
    if (Q_ > 1) out += "/" + Q_;
    return (neg ? "−" : "") + out;
  }
  const piQ = r => {
    const f = ratio(r, 360); if (!f) return null;
    const [p, q] = f; if (p === 0) return "0";
    return (p < 0 ? "−" : "") + (Math.abs(p) === 1 ? "" : Math.abs(p)) + "π" + (q > 1 ? "/" + q : "");
  };
  const pp = s => s.startsWith("−") ? `(${s})` : s;
  const ppc = s => (s.startsWith("−") || /[+−]/.test(s.slice(1))) ? `(${s})` : s;
  const cl0 = x => Math.abs(x) < 1e-10 ? 0 : x;
  const Cx = (re, im) => ({ re: cl0(re), im: cl0(im) });
  const cAdd = (z, w) => Cx(z.re + w.re, z.im + w.im);
  const cMul = (z, w) => Cx(z.re * w.re - z.im * w.im, z.re * w.im + z.im * w.re);
  const cDiv = (z, w) => { const d = w.re ** 2 + w.im ** 2; return Cx((z.re * w.re + z.im * w.im) / d, (z.im * w.re - z.re * w.im) / d); };
  const cAbs = z => Math.hypot(z.re, z.im);
  const cArg = z => { const a = Math.atan2(cl0(z.im), cl0(z.re)); return a <= -Math.PI + 1e-12 ? Math.PI : a; };
  const cPol = (r, th) => Cx(r * Math.cos(th), r * Math.sin(th));
  const cPow = (z, n) => { let r = Cx(1, 0); for (let i = 0; i < n; i++) r = cMul(r, z); return r; };
  const redA = a => { while (a > Math.PI + 1e-9) a -= 2 * Math.PI; while (a <= -Math.PI + 1e-9) a += 2 * Math.PI; return a; };
  function partsOf(z) {
    const A = nq(z.re), B = nq(z.im);
    if (A.ex && B.ex) return { a: A.s, b: B.s, ex: true };
    const r = cAbs(z), rq = ratio(r, 64), d = cArg(z) * 180 / Math.PI;
    if (rq && isInt(d) && Math.round(d) % 15 === 0) {
      const E = exact(((Math.round(d) % 360) + 360) % 360);
      const a = scaleEx(E.cos, rq), b = scaleEx(E.sin, rq);
      if (a && b) return { a, b, ex: true };
    }
    return { a: A.s, b: B.s, ex: false };
  }
  function joinBin(a, b, html = true) {
    const I = html ? "<i>i</i>" : "i";
    if (b === "0") return a;
    const neg = b.startsWith("−"), bb = neg ? b.slice(1) : b;
    const bi = bb === "1" ? I : /\//.test(bb) ? `(${bb})${I}` : /√/.test(bb) ? `${bb} ${I}` : `${bb}${I}`;
    if (a === "0") return (neg ? "−" : "") + bi;
    return `${a} ${neg ? "−" : "+"} ${bi}`;
  }
  const binOf = (z, html = true) => { const P_ = partsOf(z); return { s: joinBin(P_.a, P_.b, html), ex: P_.ex }; };
  const binH = (z, html = true) => { const b = binOf(z, html); return (b.ex ? "" : "≈ ") + b.s; };
  function modOf(z) { const sq = z.re ** 2 + z.im ** 2, e = sqrtEx(cl0(sq)); return e ? { s: e, ex: true } : { s: fT(Math.sqrt(sq)), ex: false }; }
  function angOf(th, unit) {
    if (unit === "deg") { const d = th * 180 / Math.PI; return { s: fmtDeg(d) + "°", ex: Math.abs(d * 10 - Math.round(d * 10)) < 1e-6 }; }
    const p = piQ(th / Math.PI); return p ? { s: p, ex: true } : { s: fT(th), ex: false };
  }
  const radS = th => { const p = piQ(th / Math.PI); return p ?? fT(th); };
  const supI = (n, x) => `<sup class="ri">${n}</sup>√${x}`;
  function polH(z, unit) {
    const r = modOf(z), a = angOf(cArg(z), unit);
    return `${r.s}<sub>${a.s}</sub>`;
  }
  const expS = th => { const s = radS(th); if (s === "0") return "<i>i</i>·0"; if (/π/.test(s)) return s.startsWith("−") ? `−<i>i</i>${s.slice(1)}` : `<i>i</i>${s}`; return `${s}<i>i</i>`; };
  const expH = (z) => { const r = modOf(z); return `${r.s === "1" ? "" : r.s}<i>e</i><sup>${expS(cArg(z))}</sup>`; };
  const trigH = (z, unit) => { const r = modOf(z), a = ((x) => x.startsWith("−") ? `(${x})` : x)(angOf(cArg(z), unit).s), SN = N("sin"), CN = N("cos"); return `${r.s === "1" ? "" : r.s}(${CN} ${a} + <i>i</i> ${SN} ${a})`; };
  const cxPN = s => { // número para un input (texto plano)
    return s.replace(/−/g, "-").replace(/ /g, "");
  };
  function parseNum(str) {
    let s = String(str).trim().toLowerCase().replace(/,/g, ".").replace(/−/g, "-").replace(/[°º]/g, "");
    if (!s) return null;
    const hasPi = /π|pi/.test(s);
    s = s.replace(/sqrt/g, "√").replace(/π|pi/g, "(P)");
    s = s.replace(/√\s*(\d+(?:\.\d+)?)/g, "S($1)").replace(/√\s*\(/g, "S(");
    s = s.replace(/(\d|\))\s*(?=[(SP])/g, "$1*");
    if (!/^[0-9.+\-*/()PS\s]+$/.test(s)) return null;
    try { const val = Function("P", "S", `"use strict";return (${s})`)(Math.PI, Math.sqrt); return Number.isFinite(val) ? { val, hasPi } : null; } catch { return null; }
  }

  /* ---- fórmulas (cursiva automática para variables) ---- */
  const WORDS = new Set("sin sen cos tan cot sec csc arctan ln log Log Re Im Arg arg mod rad".split(" "));
  const m = s => String(s).split(/(<[^>]*>)/).map((p, i) => i % 2 ? p : p.replace(/(§?)([A-Za-zÀ-ÿ]+)|([α-ορ-ω])/g, (all, sc, word, gr) => {
    if (gr) return `<i>${gr}</i>`;
    if (sc || WORDS.has(word) || /[À-ÿ]/.test(word)) return all;
    return [...word].map(ch => `<i>${ch}</i>`).join("");
  })).join("");
  const ov = x => `<span class="ov">${x}</span>`;
  const sb = (b, s) => `${b}<sub>${s}</sub>`, sp = (b, s) => `${b}<sup>${s}</sup>`;
  const ex_ = x => `e<sup>${x}</sup>`;
  const sqr = x => `√<span class="rad">${x}</span>`;
  const r1 = sb("ρ", "1"), r2 = sb("ρ", "2"), t1 = sb("θ", "1"), t2 = sb("θ", "2");
  const SIN = "§sin", COS = "§cos";
  const cs = x => `${COS} ${x} + i ${SIN} ${x}`;
  const CXF0 = {
    "cx-axiom": { fig: "plane", stmt: `(a, b) · (c, d) = (ac − bd, ad + bc)`, f: [
      `ℂ = ℝ² = {(a, b) : a, b ∈ ℝ}`,
      `(a, b) + (c, d) = (a + c, b + d)`,
      `(a + bi)(c + di) = ac + adi + bci + bd·i²`,
      `= ac + ${k("bd·(−1)")} + (ad + bc)i = (ac − bd) + (ad + bc)i`,
      `(a, b) · (c, d) := (ac − bd, ad + bc)`,
      `i = (0, 1)  →  i² = (0·0 − 1·1, 0·1 + 1·0) = (−1, 0) = −1`] },
    "cx-ipow": { fig: "ipow", stmt: `i⁰ = 1,  i¹ = i,  i² = −1,  i³ = −i,  i⁴ = 1`, f: [
      `i² = −1`, `i³ = i² · i = −i`, `i⁴ = i² · i² = (−1)(−1) = 1`, `i<sup>n</sup> = i<sup>r</sup>,  r = §rest(n ÷ 4)`, `i²⁷ = i<sup>4·6 + 3</sup> = (i⁴)⁶ · i³ = −i`] },
    "cx-field": { fig: "inv", stmt: `z ≠ 0  ⇒  z⁻¹ = ${fr("a − bi", "a² + b²")}`, f: [
      `z + w = w + z,   zw = wz`, `z(w + v) = zw + zv`, `0 = 0 + 0i,   1 = 1 + 0i`, `−z = −a − bi`,
      `${fr("1", "a + bi")} = ${fr("1", "a + bi")} · ${fr(k("a − bi"), k("a − bi"))} = ${fr("a − bi", "a² + b²")}`,
      `(1 + i)⁻¹ = ${fr("1 − i", "2")} = ${fr("1", "2")} − ${fr("1", "2")}i`] },
    "cx-order": { stmt: `2 < i ?   §no`, f: [
      `x > 0, y > 0  ⇒  xy > 0`, `x ≠ 0  ⇒  x² > 0`, `i ≠ 0  ⇒  i² > 0`, `i² = −1  ⇒  −1 > 0`, `1 = 1² > 0`, `0 = (−1) + 1 > 0   (§contra)`] },
    "cx-phasor": { fig: "phasor", stmt: `|z| = 1  ⇔  a² + b² = 1  ⇔  z = ${cs("θ")}`, f: [
      `z = a + bi,   |z| = ${sqr("a² + b²")}`, `|z| = 1  ⇔  a² + b² = 1`, `a = ${COS} θ,   b = ${SIN} θ`, `z = ${cs("θ")} = ${sb("1", "θ")} = ${ex_("iθ")}`] },
    "cx-conj1": { fig: "conj", stmt: `${ov(ov("z"))} = z`, f: [
      `z = a + bi  ⇒  ${ov("z")} = a − bi`, `${ov(ov("z"))} = ${ov("a + (−b)i")} = a − (−b)i`, `= a + bi = z`] },
    "cx-conj2": { fig: "conjsum", stmt: `${ov("z + w")} = ${ov("z")} + ${ov("w")}`, f: [
      `z = a + bi,   w = c + di`, `z + w = (a + c) + (b + d)i`, `${ov("z + w")} = (a + c) − (b + d)i`, `= (a − bi) + (c − di) = ${ov("z")} + ${ov("w")}`] },
    "cx-conj3": { stmt: `${ov("z · w")} = ${ov("z")} · ${ov("w")}   ⇒   ${ov(sp("z", "n"))} = ${sp(ov("z"), "n")}`, f: [
      `zw = (ac − bd) + (ad + bc)i`, `${ov("zw")} = (ac − bd) − (ad + bc)i`, `${ov("z")} · ${ov("w")} = (a − bi)(c − di) = ac − adi − bci + bd·i²`,
      `= (ac − bd) − (ad + bc)i`, `${ov(sp("z", "n"))} = ${ov("z · z ⋯ z")} = ${ov("z")} · ${ov("z")} ⋯ ${ov("z")} = ${sp(ov("z"), "n")}`] },
    "cx-mod1": { fig: "polar", stmt: `|z| = ${sqr("a² + b²")} ≥ 0`, f: [
      `|z| = ${sqr("Re(z)² + Im(z)²")}`, `a² ≥ 0,  b² ≥ 0  ⇒  a² + b² ≥ 0  ⇒  |z| ≥ 0`, `|z| = 0  ⇔  a² + b² = 0  ⇔  a = b = 0  ⇔  z = 0`, `|3 + 4i| = ${sqr("9 + 16")} = √25 = 5`] },
    "cx-tri": { fig: "tri", stmt: `|z + w| ≤ |z| + |w|`, f: [
      `z + w`, `0  →  z  →  z + w`, `|z + w| ≤ |z| + |w|`, `|z + w| = |z| + |w|  ⇔  ${sb("θ", "z")} = ${sb("θ", "w")}`, `|3 + 4i| = 5  ≤  |3| + |4i| = 7`] },
    "cx-modprod": { fig: "prod", stmt: `|zw| = |z| · |w|   ⇒   |${sp("z", "n")}| = |z|<sup>n</sup>`, f: [
      `|zw|² = (ac − bd)² + (ad + bc)²`, `= a²c² ${k("− 2abcd")} + b²d² + a²d² ${k("+ 2abcd")} + b²c²`, `= a²(c² + d²) + b²(c² + d²) = (a² + b²)(c² + d²)`, `= |z|² · |w|²   ⇒   |zw| = |z| · |w|`, `|${sp("z", "n")}| = |z · z ⋯ z| = |z|<sup>n</sup>`] },
    "cx-modconj": { fig: "conj", stmt: `|z| = |${ov("z")}|`, f: [
      `${ov("z")} = a − bi`, `|${ov("z")}| = ${sqr("a² + (−b)²")} = ${sqr("a² + b²")} = |z|`] },
    "cx-zz": { stmt: `z · ${ov("z")} = |z|²`, f: [
      `z · ${ov("z")} = (a + bi)(a − bi)`, `= a² ${k("− abi + abi")} − b²i²`, `= a² − b²(−1) = a² + b²`, `= |z|²  ∈ ℝ,  ≥ 0`] },
    "cx-div": { fig: "inv", stmt: `${fr("z", "w")} = ${fr(`z ${ov("w")}`, "|w|²")},    ${fr("1", "w")} = ${fr(ov("w"), "|w|²")}   (w ≠ 0)`, f: [
      `${fr("z", "w")} = ${fr("z", "w")} · ${fr(k(ov("w")), k(ov("w")))}`, `= ${fr(`z ${ov("w")}`, `w ${ov("w")}`)} = ${fr(`z ${ov("w")}`, "|w|²")}`, `z = 1  ⇒  ${fr("1", "w")} = ${fr(ov("w"), "|w|²")}`,
      `${fr("2 + 3i", "1 + 2i")} = ${fr("(2 + 3i)(1 − 2i)", "1² + 2²")}`, `= ${fr("2 − 4i + 3i − 6i²", "5")} = ${fr("8 − i", "5")} = ${fr("8", "5")} − ${fr("1", "5")}i`] },
    "cx-arg": { fig: "quad", stmt: `ρ = ${sqr("a² + b²")},    θ = Arg z ∈ (−π, π]`, f: [
      `${COS} θ = ${fr("a", "ρ")},   ${SIN} θ = ${fr("b", "ρ")}`, `§tan θ = ${fr("b", "a")}  ⇒  θ = arctan ${fr("b", "a")}`, `a > 0:   θ = arctan ${fr("b", "a")}`,
      `a < 0, b ≥ 0:  θ = arctan ${fr("b", "a")} + π;    a < 0, b < 0:  θ = arctan ${fr("b", "a")} − π`, `a = 0:   θ = ±${fr("π", "2")}`, `arg z = {θ + 2πk : k ∈ ℤ}`] },
    "cx-p2b": { fig: "polar", stmt: `a = ρ ${COS} θ,   b = ρ ${SIN} θ   ⇒   z = ρ(${cs("θ")})`, f: [
      `${COS} θ = ${fr("a", "ρ")}  ⇒  a = ρ ${COS} θ`, `${SIN} θ = ${fr("b", "ρ")}  ⇒  b = ρ ${SIN} θ`, `z = a + bi = ρ ${COS} θ + iρ ${SIN} θ = ρ(${cs("θ")})`,
      `${sb("2", "π/3")} = 2(${fr("1", "2")} + ${fr("√3", "2")}i) = 1 + √3 i`] },
    "cx-pprod": { fig: "prod", stmt: `${sb("(" + r1 + ")", t1)} · ${sb("(" + r2 + ")", t2)} = ${sb(`(${r1}${r2})`, `${t1} + ${t2}`)}`, f: [
      `z = ${r1}(${cs("α")}),   w = ${r2}(${cs("β")})`, `zw = ${r1}${r2} (${cs("α")})(${cs("β")})`,
      `= ${r1}${r2}[(${COS} α ${COS} β − ${SIN} α ${SIN} β) + i(${SIN} α ${COS} β + ${COS} α ${SIN} β)]`,
      `= ${r1}${r2}[${k(`${COS}(α + β)`)} + i ${k(`${SIN}(α + β)`)}]`, `= ${sb(`(${r1}${r2})`, "α + β")}`, `α + β ∉ (−π, π]  ⇒  ± 2π`] },
    "cx-pquot": { fig: "quot", stmt: `${fr(sb("(" + r1 + ")", t1), sb("(" + r2 + ")", t2))} = ${sb(`(${fr(r1, r2)})`, `${t1} − ${t2}`)}`, f: [
      `q = ${fr("z", "w")}  ⇔  q · w = z`, `q = ${sb("r", "φ")}  ⇒  ${sb("r", "φ")} · ${sb("(" + r2 + ")", t2)} = ${sb(`(r${r2})`, `φ + ${t2}`)}`,
      `${sb(`(r${r2})`, `φ + ${t2}`)} = ${sb("(" + r1 + ")", t1)}  ⇒  r${r2} = ${r1},   φ + ${t2} = ${t1}`, `r = ${fr(r1, r2)},    φ = ${t1} − ${t2}`] },
    "cx-pconj": { fig: "inv", stmt: `${ov(sb("ρ", "θ"))} = ${sb("ρ", "−θ")},     ${sp(`(${sb("ρ", "θ")})`, "−1")} = ${sb(`(${fr("1", "ρ")})`, "−θ")}`, f: [
      `${sb("ρ", "θ")} = ρ ${COS} θ + iρ ${SIN} θ`, `${ov(sb("ρ", "θ"))} = ρ ${COS} θ − iρ ${SIN} θ = ρ ${COS}(−θ) + iρ ${SIN}(−θ)`, `= ${sb("ρ", "−θ")}`,
      `${fr("1", sb("ρ", "θ"))} = ${fr(sb("1", "0"), sb("ρ", "θ"))} = ${sb(`(${fr("1", "ρ")})`, "0 − θ")} = ${sb(`(${fr("1", "ρ")})`, "−θ")}`] },
    "cx-moivre": { fig: "moivre", stmt: `(${cs("θ")})<sup>n</sup> = ${cs("nθ")}`, f: [
      `${sp(`(${sb("ρ", "θ")})`, "n")} = ${sb("ρ", "θ")} · ${sb("ρ", "θ")} ⋯ ${sb("ρ", "θ")}`, `= ${sb("(ρ · ρ ⋯ ρ)", "θ + θ + ⋯ + θ")} = ${sb(`(${sp("ρ", "n")})`, "nθ")}`,
      `ρ = 1:   ${sp(`(${sb("1", "θ")})`, "n")} = ${sb("1", "nθ")}`, `(${cs("θ")})<sup>n</sup> = ${cs("nθ")}`,
      `n = 2:  ${COS}²θ − ${SIN}²θ + 2i ${SIN} θ ${COS} θ = ${COS} 2θ + i ${SIN} 2θ`, `(1 + i)⁸ = ${sp(`(${sb("√2", "π/4")})`, "8")} = ${sb("16", "2π")} = 16`] },
    "cx-rot": { fig: "rot", stmt: `(x + yi) · ${sb("1", "β")}   =   §rotate β`, f: [
      `1 · (${cs("β")}) = ${cs("β")}`, `i · (${cs("β")}) = −${SIN} β + i ${COS} β`, `(1, 0) → (${COS} β, ${SIN} β),    (0, 1) → (−${SIN} β, ${COS} β)`,
      `β = 90°:   (1, 0) → (0, 1),    (0, 1) → (−1, 0)`, `${sb("1", "30°")} · ${sb("1", "90°")} = ${sb("1", "120°")} = −${fr("1", "2")} + ${fr("√3", "2")}i`] },
    "cx-euler": { fig: "phasorE", stmt: `${ex_("iθ")} := ${cs("θ")} = ${sb("1", "θ")}`, f: [
      `${ex_("iθ")} := ${cs("θ")}    (θ §in §rad)`, `|${ex_("iθ")}| = ${sqr(`${COS}²θ + ${SIN}²θ`)} = √1 = 1`, `Arg(${ex_("iθ")}) = θ    (θ ∈ (−π, π])`,
      `${sb("ρ", "θ")} = ρ(${cs("θ")}) = ρ${ex_("iθ")}`, `${ex_("iπ")} = ${COS} π + i ${SIN} π = −1   ⇒   ${ex_("iπ")} + 1 = 0`] },
    "cx-cossin": { fig: "euler", stmt: `${COS} θ = ${fr(`${ex_("iθ")} + ${ex_("−iθ")}`, "2")},     ${SIN} θ = ${fr(`${ex_("iθ")} − ${ex_("−iθ")}`, "2i")}`, f: [
      `${ex_("iθ")} = ${COS} θ + i ${SIN} θ`, `${ex_("−iθ")} = ${COS}(−θ) + i ${SIN}(−θ) = ${COS} θ − i ${SIN} θ`,
      `${ex_("iθ")} + ${ex_("−iθ")} = 2 ${COS} θ ${k("+ i " + SIN + " θ − i " + SIN + " θ")}`, `${COS} θ = ${fr(`${ex_("iθ")} + ${ex_("−iθ")}`, "2")}`,
      `${ex_("iθ")} − ${ex_("−iθ")} = 2i ${SIN} θ ${k(`+ ${COS} θ − ${COS} θ`)}`, `${SIN} θ = ${fr(`${ex_("iθ")} − ${ex_("−iθ")}`, "2i")}`] },
    "cx-eprop": { fig: "prodE", stmt: `${sp(`(${ex_("iθ")})`, "n")} = ${ex_("inθ")},     ${ex_("i(θ + ω)")} = ${ex_("iθ")}${ex_("iω")}`, f: [
      `${ex_("iθ")} · ${ex_("iω")} = ${sb("1", "θ")} · ${sb("1", "ω")} = ${sb("1", "θ + ω")} = ${ex_("i(θ + ω)")}`, `${sp(`(${ex_("iθ")})`, "n")} = ${sp(`(${sb("1", "θ")})`, "n")} = ${sb("1", "nθ")} = ${ex_("inθ")}`,
      `(ρ${ex_("iθ")})(r${ex_("iω")}) = ρr ${ex_("i(θ + ω)")}`] },
    "cx-roots": { fig: "roots", stmt: `${supI("n", sb("ρ", "θ"))} = { ${sb(`(${supI("n", "ρ")})`, fr("θ + 2πk", "n"))} : k = 0, …, n − 1 }`, f: [
      `w = ${sb("r", "φ")},   ${sp("w", "n")} = z = ${sb("ρ", "θ")}`, `${sp("w", "n")} = ${sb(`(${sp("r", "n")})`, "nφ")}`, `${sp("r", "n")} = ρ  ⇒  r = ${supI("n", "ρ")}`,
      `nφ = θ + ${k("2πk")}  ⇒  φ = ${fr("θ + 2πk", "n")}`, `k = 0, 1, …, n − 1`, `${sb("φ", "k+1")} − ${sb("φ", "k")} = ${fr("2π", "n")}`] },
    "cx-root1": { fig: "roots3", stmt: `${supI("3", "1")} = { 1,  ${fr("−1 ± √3 i", "2")} }`, f: [
      `z = 1:   ρ = 1,  θ = 0   ⇒   z = ${sb("1", "0")}`, `${supI("3", sb("1", "0"))} = { ${sb("1", fr("0 + 2πk", "3"))} : k = 0, 1, 2 }`, `k = 0:   ${sb("1", "0")} = 1`,
      `k = 1:   ${sb("1", "2π/3")} = ${COS} ${fr("2π", "3")} + i ${SIN} ${fr("2π", "3")} = −${fr("1", "2")} + ${fr("√3", "2")}i = ω`,
      `k = 2:   ${sb("1", "4π/3")} = −${fr("1", "2")} − ${fr("√3", "2")}i = ${ov("ω")} = ω²`, `k = 3:   ${sb("1", "2π")} = ${sb("1", "0")}`] },
    "cx-z38": { fig: "roots8", stmt: `z³ − 8 = 0   ⇒   z ∈ { 2,  −1 ± √3 i }`, f: [
      `z³ − 8 = 0  ⇒  z³ = 8  ⇒  z ∈ ${supI("3", "8")}`, `z³ − 8 = 0  ⇒  ${sp(`(${fr("z", "2")})`, "3")} − 1 = 0    (2 · 2 · 2 = 8)`, `${fr("z", "2")} ∈ ${supI("3", "1")} = { 1,  ${fr("−1 ± √3 i", "2")} }`,
      `z ∈ { 2,  −1 ± √3 i }`, `${sb("8", "0")}:   ${supI("3", "8")} = 2,   φ = 0, ${fr("2π", "3")}, ${fr("4π", "3")}`] },
    "cx-exp": { fig: "exp", stmt: `${ex_("z")} := ${ex_("Re z")} ${ex_("i Im z")}`, f: [
      `z = a + bi  ⇒  ${ex_("z")} = ${ex_("a + bi")} = ${ex_("a")}${ex_("bi")}`, `= ${ex_("a")}(${cs("b")}) = ${sb(`(${ex_("a")})`, "b")}`, `|${ex_("z")}| = ${ex_("Re z")}`,
      `arg(${ex_("z")}) = Im z + 2πk`, `${ex_("z + 2πi")} = ${ex_("z")} · ${ex_("2πi")} = ${ex_("z")} · 1 = ${ex_("z")}`, `${ex_("1 + iπ/2")} = e · ${ex_("iπ/2")} = e · i`] },
    "cx-log": { fig: "log", stmt: `log z = ln|z| + i arg z,     Log z = ln|z| + i Arg z`, f: [
      `${ex_("w")} = z,   w = x + yi`, `${ex_("w")} = ${sb(`(${ex_("x")})`, "y")} = ${sb("ρ", "θ")}`, `${ex_("x")} = ρ  ⇒  x = ln ρ = ln|z|`,
      `y = θ + 2πk  ⇒  log z = ln|z| + i(θ + 2πk)`, `Log z = ln|z| + i Arg z`, `Log(−1) = ln 1 + iπ = iπ`] },
  };
  const CXF = {};
  for (const id in CXF0) { const F = CXF0[id]; CXF[id] = { cx: true, fig: F.fig, stmt: m(F.stmt), f: F.f.map(m) }; }

  /* ---- figuras pequeñas ---- */
  const svgT = s => String(s).replace(/\^\(((?:[^()]|\([^()]*\))*)\)/g, '<tspan baseline-shift="super" font-size="72%">$1</tspan>').replace(/\^([^\s()<]+)/g, '<tspan baseline-shift="super" font-size="72%">$1</tspan>')
    .replace(/_\(((?:[^()]|\([^()]*\))*)\)/g, '<tspan baseline-shift="sub" font-size="72%">$1</tspan>').replace(/_([^\s()<]+)/g, '<tspan baseline-shift="sub" font-size="72%">$1</tspan>');
  let mfN = 0;
  function MP(o = {}) {
    const s = o.s ?? 50, ox = o.ox ?? 150, oy = o.oy ?? 120, W_ = o.w ?? 300, H_ = o.h ?? 240;
    const px = x => ox + x * s, py = y => oy - y * s;
    const api = {
      px, py, s,
      ln: (x1, y1, x2, y2, col = "var(--fg)", w = 2, dash) => `<line x1="${px(x1)}" y1="${py(y1)}" x2="${px(x2)}" y2="${py(y2)}" stroke="${col}" stroke-width="${w}" stroke-linecap="round"${dash ? ` stroke-dasharray="${dash}"` : ""}/>`,
      ar: (x1, y1, x2, y2, col = "var(--fg)", w = 2.6, dash) => {
        const a = px(x1), b = py(y1), c = px(x2), d = py(y2), Lh = Math.hypot(c - a, d - b); if (Lh < 2) return "";
        const ux = (c - a) / Lh, uy = (d - b) / Lh, hl = Math.min(11, Lh * .45), hw = hl * .5, bx = c - ux * hl, by = d - uy * hl;
        return `<line x1="${a}" y1="${b}" x2="${bx + ux}" y2="${by + uy}" stroke="${col}" stroke-width="${w}" stroke-linecap="round"${dash ? ` stroke-dasharray="${dash}"` : ""}/><path d="M${c} ${d} L${bx - uy * hw} ${by + ux * hw} L${bx + uy * hw} ${by - ux * hw} Z" fill="${col}"/>`;
      },
      dot: (x, y, col = "var(--fg)", r = 4.5) => `<circle cx="${px(x)}" cy="${py(y)}" r="${r}" fill="${col}"/>`,
      tx: (x, y, t_, col = "var(--fg)", a = "middle", fs = 15, it = false) => `<text x="${px(x)}" y="${py(y) + fs * .35}" fill="${col}" text-anchor="${a}" font-size="${fs}"${it ? ' font-style="italic"' : ""} paint-order="stroke" stroke="var(--surface)" stroke-width="4" stroke-linejoin="round">${svgT(t_)}</text>`,
      arc: (r, a0, a1, col = "var(--fg)", w = 1.8, fill) => {
        if (Math.abs(a1 - a0) < .5) return "";
        const R = r * s, P0 = [ox + R * Math.cos(rad(a0)), oy - R * Math.sin(rad(a0))], P1 = [ox + R * Math.cos(rad(a1)), oy - R * Math.sin(rad(a1))];
        const big = Math.abs(a1 - a0) > 180 ? 1 : 0, sw = a1 > a0 ? 0 : 1;
        return fill ? `<path d="M${ox} ${oy} L${P0[0]} ${P0[1]} A${R} ${R} 0 ${big} ${sw} ${P1[0]} ${P1[1]} Z" fill="${fill}" stroke="${col}" stroke-width="${w}"/>`
          : `<path d="M${P0[0]} ${P0[1]} A${R} ${R} 0 ${big} ${sw} ${P1[0]} ${P1[1]}" fill="none" stroke="${col}" stroke-width="${w}"/>`;
      },
      circ: (r, col = "var(--muted)", w = 1.3, dash) => `<circle cx="${ox}" cy="${oy}" r="${r * s}" fill="none" stroke="${col}" stroke-width="${w}"${dash ? ` stroke-dasharray="${dash}"` : ""} opacity=".8"/>`,
      axes: (x0, x1, y0, y1, lab = true) => `<line x1="${px(x0)}" y1="${oy}" x2="${px(x1)}" y2="${oy}" stroke="var(--axis)" stroke-width="1.2"/><line x1="${ox}" y1="${py(y0)}" x2="${ox}" y2="${py(y1)}" stroke="var(--axis)" stroke-width="1.2"/>` +
        (lab ? `<text x="${px(x1) - 2}" y="${oy - 7}" text-anchor="end" font-size="12" fill="var(--muted)">Re</text><text x="${ox + 6}" y="${py(y1) + 11}" font-size="12" fill="var(--muted)">Im</text>` : ""),
      svg: (inner, cls = "mfig") => `<svg class="${cls}" viewBox="0 0 ${W_} ${H_}" role="img">${inner}</svg>`,
    };
    return api;
  }
  const tintC = col => `color-mix(in srgb, var(${col}) 16%, transparent)`;
  function cxFig(kind) {
    const SN = N("sin"), CN = N("cos"), ZB = "z̅", WB = "w̅";
    const P_ = (r, d) => [r * Math.cos(rad(d)), r * Math.sin(rad(d))];
    let M, g = "";
    switch (kind) {
      case "plane": { M = MP({ s: 52, ox: 58, oy: 190, h: 230 }); const a = 3, b = 2;
        g = M.axes(-.7, 4.6, -.6, 3.4) + M.ln(0, 0, a, 0, "var(--c-re)", 4.5) + M.ln(a, 0, a, b, "var(--c-im)", 4.5) + M.ar(0, 0, a, b, "var(--c-z)", 3) + M.dot(a, b, "var(--c-z)") +
          M.tx(a / 2, -.32, "a = Re(z)", "var(--c-re)") + M.tx(a + .12, b / 2, "b = Im(z)", "var(--c-im)", "start") + M.tx(a - .1, b + .32, "z = a + bi ≡ (a, b)", "var(--c-z)", "middle", 15, true);
        return M.svg(g); }
      case "ipow": { M = MP({ s: 68, ox: 150, oy: 118, h: 236 });
        const pts = [[1, 0, "i⁰ = 1"], [0, 1, "i¹ = i"], [-1, 0, "i² = −1"], [0, -1, "i³ = −i"]];
        g = M.axes(-1.8, 1.8, -1.55, 1.6, false) + M.circ(1);
        for (let q = 0; q < 4; q++) { const a0 = q * 90 + 12, a1 = q * 90 + 78, [ex, ey] = P_(1.22, a1), [bx, by] = P_(1.22, a1 - 9);
          g += M.arc(1.22, a0, a1, "var(--c-r)", 2) + M.ar(bx, by, ex, ey, "var(--c-r)", 2) + M.tx(...P_(1.42, q * 90 + 45), "· i", "var(--c-r)", "middle", 13); }
        pts.forEach(([x, y, l], q) => { g += M.dot(x, y, "var(--c-z)", 5) + M.tx(x * .62 + (q === 1 || q === 3 ? .3 : 0), y * .62 + (q % 2 ? 0 : .14), l, "var(--fg)", "middle", 14); });
        return M.svg(g); }
      case "inv": { M = MP({ s: 58, ox: 120, oy: 120 }); const z = [1.6, 1.2], zb = [1.6, -1.2], iv = [.4, -.3];
        g = M.axes(-1.2, 2.6, -1.9, 1.9) + M.circ(1, "var(--muted)", 1.2, "3 4") + M.ln(z[0], z[1], zb[0], zb[1], "var(--muted)", 1.2, "3 4") +
          M.ar(0, 0, ...z, "var(--c-z)", 2.8) + M.ar(0, 0, ...zb, "var(--c-r)", 2.2, "5 4") + M.ar(0, 0, ...iv, "var(--c-w)", 3) +
          M.dot(...z, "var(--c-z)") + M.dot(...zb, "var(--c-r)") + M.dot(...iv, "var(--c-w)") +
          M.tx(z[0] + .12, z[1] + .12, "z  (ρ = 2)", "var(--c-z)", "start", 14, true) + M.tx(zb[0] + .12, zb[1] - .12, ZB, "var(--c-r)", "start", 16, true) + M.tx(iv[0] + .1, iv[1] - .25, "1/z  (1/ρ = 1/2)", "var(--c-w)", "start", 13, true);
        return M.svg(g); }
      case "phasor": case "phasorE": { M = MP({ s: 85, ox: 130, oy: 125, h: 236 }); const d = 40, [c, s_] = P_(1, d);
        g = M.axes(-1.25, 1.5, -1.2, 1.3) + M.circ(1, "var(--muted)", 1.3) + M.arc(.24, 0, d, "var(--fg)", 1.6) + M.tx(...P_(.36, d / 2), "θ", "var(--fg)", "middle", 15, true) +
          M.ln(0, 0, c, 0, "var(--c-re)", 4.5) + M.ln(c, 0, c, s_, "var(--c-im)", 4.5) + M.ar(0, 0, c, s_, "var(--c-z)", 2.8) + M.dot(c, s_, "var(--c-z)") +
          M.tx(c / 2, -.14, `${CN} θ`, "var(--c-re)", "middle", 14, true) + M.tx(c + .06, s_ / 2, `${SN} θ`, "var(--c-im)", "start", 14, true) + M.tx(c / 2 - .1, s_ / 2 + .12, "1", "var(--fg)", "end", 14) +
          M.tx(c + .06, s_ + .12, kind === "phasorE" ? "e^(iθ) = 1_θ" : "z = 1_θ", "var(--c-z)", "start", 14, true) + M.tx(-.78, 1.13, "a² + b² = 1", "var(--muted)", "middle", 13, true);
        return M.svg(g); }
      case "conj": case "conjsum": { M = MP({ s: 46, ox: 70, oy: 120 });
        if (kind === "conj") { const z = [2.4, 1.5], zb = [2.4, -1.5], d = Math.atan2(1.5, 2.4) * 180 / Math.PI;
          g = M.axes(-.8, 4.6, -2.3, 2.3) + M.ln(-.8, 0, 4.4, 0, "var(--c-re)", 2) + M.ln(...z, ...zb, "var(--muted)", 1.2, "3 4") + M.arc(.7, 0, d, "var(--c-z)", 1.8) + M.arc(.7, 0, -d, "var(--c-r)", 1.8) +
            M.ar(0, 0, ...z, "var(--c-z)", 2.8) + M.ar(0, 0, ...zb, "var(--c-r)", 2.8) + M.dot(...z, "var(--c-z)") + M.dot(...zb, "var(--c-r)") +
            M.tx(z[0] + .15, z[1] + .1, "z = a + bi", "var(--c-z)", "start", 14, true) + M.tx(zb[0] + .15, zb[1] - .1, ZB + " = a − bi", "var(--c-r)", "start", 14, true) +
            M.tx(.95, .3, "θ", "var(--c-z)", "start", 14, true) + M.tx(.95, -.3, "−θ", "var(--c-r)", "start", 14, true) ;
          return M.svg(g); }
        const z = [1.4, .6], w = [.6, 1.3], s = [2, 1.9];
        g = M.axes(-.8, 4.6, -2.3, 2.3) + M.ar(0, 0, ...z, "var(--c-z)", 2.4) + M.ar(0, 0, ...w, "var(--c-w)", 2.4) + M.ar(0, 0, ...s, "var(--c-r)", 3) +
          M.ar(0, 0, z[0], -z[1], "var(--c-z)", 1.8, "4 3") + M.ar(0, 0, w[0], -w[1], "var(--c-w)", 1.8, "4 3") + M.ar(0, 0, s[0], -s[1], "var(--c-r)", 2.4, "4 3") +
          M.tx(z[0] + .1, z[1] - .05, "z", "var(--c-z)", "start", 15, true) + M.tx(w[0] - .1, w[1] + .1, "w", "var(--c-w)", "end", 15, true) + M.tx(s[0] + .1, s[1] + .1, "z + w", "var(--c-r)", "start", 15, true) +
          M.tx(s[0] + .1, -s[1] - .1, ZB + " + " + WB, "var(--c-r)", "start", 14, true);
        return M.svg(g); }
      case "tri": { M = MP({ s: 52, ox: 40, oy: 200, h: 230 }); const z = [2.6, .7], w = [.9, 2], s = [3.5, 2.7];
        g = M.axes(-.4, 4.9, -.4, 3.6) + `<path d="M${M.px(0)} ${M.py(0)} L${M.px(z[0])} ${M.py(z[1])} L${M.px(s[0])} ${M.py(s[1])} Z" fill="${tintC("--c-r")}"/>` +
          M.ar(0, 0, ...w, "var(--c-w)", 1.6, "4 4") + M.ar(0, 0, ...z, "var(--c-z)", 3) + M.ar(...z, ...s, "var(--c-w)", 3) + M.ar(0, 0, ...s, "var(--c-r)", 3.2) +
          M.tx(1.4, .1, "|z|", "var(--c-z)", "middle", 15, true) + M.tx(3.3, 1.6, "|w|", "var(--c-w)", "start", 15, true) + M.tx(2.05, 1.2, "|z + w|", "var(--c-r)", "middle", 15, true) + M.tx(s[0], s[1] + .3, "z + w", "var(--c-r)", "middle", 14, true);
        return M.svg(g); }
      case "prod": case "prodE": { M = MP({ s: 72, ox: 50, oy: 200, h: 230 }); const a = 28, b = 42, r1_ = 1.35, r2_ = 1.25;
        const [zx, zy] = P_(r1_, a), [wx, wy] = P_(r2_, b), [px_, py_] = P_(r1_ * r2_, a + b);
        g = M.axes(-.3, 3.4, -.3, 2.8) + M.arc(.42, 0, a, "var(--c-z)", 2, tintC("--c-z")) + M.arc(.62, a, a + b, "var(--c-w)", 2.2) + M.arc(.5, 0, b, "var(--c-w)", 1.2) +
          M.ar(0, 0, zx, zy, "var(--c-z)", 2.6) + M.ar(0, 0, wx, wy, "var(--c-w)", 2.6) + M.ar(0, 0, px_, py_, "var(--c-r)", 3.2) +
          M.tx(...P_(.62, a / 2), kind === "prodE" ? "θ" : "α", "var(--c-z)", "middle", 14, true) + M.tx(...P_(.8, a + b / 2), kind === "prodE" ? "ω" : "β", "var(--c-w)", "middle", 14, true) +
          M.tx(zx + .08, zy - .05, kind === "prodE" ? "e^(iθ)" : "z = ρ₁_α", "var(--c-z)", "start", 14, true) + M.tx(wx + .02, wy + .14, kind === "prodE" ? "e^(iω)" : "w = ρ₂_β", "var(--c-w)", "start", 14, true) +
          M.tx(px_ + .06, py_ + .1, kind === "prodE" ? "e^(i(θ+ω))" : "zw = (ρ₁ρ₂)_(α+β)", "var(--c-r)", "start", 14, true);
        return M.svg(g); }
      case "quot": { M = MP({ s: 72, ox: 50, oy: 200, h: 230 }); const a = 80, b = 30, [zx, zy] = P_(1.8, a), [wx, wy] = P_(1.2, b), [qx, qy] = P_(1.5, a - b);
        g = M.axes(-.3, 3.4, -.3, 2.8) + M.arc(.42, 0, a, "var(--c-z)", 1.6) + M.arc(.62, a, a - b, "var(--c-w)", 2.2) + M.arc(.5, 0, b, "var(--c-w)", 1.2) +
          M.ar(0, 0, zx, zy, "var(--c-z)", 2.6) + M.ar(0, 0, wx, wy, "var(--c-w)", 2.6) + M.ar(0, 0, qx, qy, "var(--c-r)", 3.2) +
          M.tx(zx + .08, zy, "z = ρ₁_θ₁", "var(--c-z)", "start", 14, true) + M.tx(wx + .08, wy - .05, "w = ρ₂_θ₂", "var(--c-w)", "start", 14, true) + M.tx(qx + .08, qy + .05, "z/w = (ρ₁/ρ₂)_(θ₁−θ₂)", "var(--c-r)", "start", 13, true) +
          M.tx(...P_(.85, a - b / 2), "−θ₂", "var(--c-w)", "middle", 13, true);
        return M.svg(g); }
      case "polar": { M = MP({ s: 70, ox: 40, oy: 195, h: 230 }); const a = 2.4, b = 1.6, d = Math.atan2(b, a) * 180 / Math.PI;
        g = M.axes(-.3, 3.7, -.3, 2.55) + M.ln(0, 0, a, 0, "var(--c-re)", 4.5) + M.ln(a, 0, a, b, "var(--c-im)", 4.5) + M.ar(0, 0, a, b, "var(--c-z)", 3) + M.dot(a, b, "var(--c-z)") +
          M.arc(.5, 0, d, "var(--fg)", 1.6) + M.tx(...P_(.68, d / 2), "θ", "var(--fg)", "middle", 15, true) +
          `<path d="M${M.px(a) - 10} ${M.py(0)} v-10 h10" fill="none" stroke="var(--muted)" stroke-width="1.2"/>` +
          M.tx(a / 2, -.2, "a = ρ cos θ".replace("cos", CN), "var(--c-re)", "middle", 14, true) + M.tx(a + .1, b / 2, "b = ρ sen θ".replace("sen", SN), "var(--c-im)", "start", 14, true) + M.tx(a / 2 - .1, b / 2 + .16, "ρ = |z|", "var(--c-z)", "end", 14, true) + M.tx(a, b + .2, "z", "var(--c-z)", "middle", 16, true);
        return M.svg(g); }
      case "quad": { M = MP({ s: 58, ox: 150, oy: 118 }); const z = [-1.5, 1], nz = [1.5, -1], dA = Math.atan2(1, -1.5) * 180 / Math.PI, dT = Math.atan(1 / -1.5) * 180 / Math.PI;
        g = M.axes(-2.4, 2.4, -1.9, 1.9) + M.arc(.45, 0, dT, "var(--muted)", 1.6) + M.arc(.62, 0, dA, "var(--c-z)", 2.2) +
          M.ar(0, 0, ...nz, "var(--muted)", 2, "4 4") + M.ar(0, 0, ...z, "var(--c-z)", 2.8) + M.dot(...z, "var(--c-z)") +
          M.tx(z[0] - .05, z[1] + .22, "z = −3/2 + i", "var(--c-z)", "middle", 13, true) + M.tx(nz[0] + .05, nz[1] - .2, `arctan(b/a) ≈ ${fT(dT * Math.PI / 180)}`, "var(--muted)", "middle", 12, true) +
          M.tx(.15, .78, `Arg z = arctan(b/a) + π ≈ ${fT(dA * Math.PI / 180)}`, "var(--c-z)", "start", 12, true) + M.tx(-2.2, -1.55, "II", "var(--muted)", "start", 12) + M.tx(2.2, -1.55, "IV", "var(--muted)", "end", 12);
        return M.svg(g); }
      case "rot": { M = MP({ s: 78, ox: 150, oy: 120 }); const b = 30, [c, s_] = P_(1, b), [c2, s2] = P_(1, 90 + b);
        g = M.axes(-1.6, 1.6, -.5, 1.45) + M.circ(1, "var(--muted)", 1.2, "3 4") + M.ar(0, 0, 1, 0, "var(--muted)", 2, "4 3") + M.ar(0, 0, 0, 1, "var(--muted)", 2, "4 3") +
          M.arc(1.1, 0, b, "var(--c-z)", 2) + M.arc(1.1, 90, 90 + b, "var(--c-w)", 2) + M.ar(0, 0, c, s_, "var(--c-z)", 3) + M.ar(0, 0, c2, s2, "var(--c-w)", 3) +
          M.tx(1.05, -.14, "1", "var(--muted)", "middle", 14) + M.tx(.1, 1.14, "i", "var(--muted)", "start", 14, true) + M.tx(...P_(1.25, b / 2), "β", "var(--c-z)", "middle", 14, true) + M.tx(...P_(1.25, 90 + b / 2), "β", "var(--c-w)", "middle", 14, true) +
          M.tx(c + .06, s_ + .1, `(${CN} β, ${SN} β)`, "var(--c-z)", "start", 13, true) + M.tx(c2 - .06, s2 + .12, `(−${SN} β, ${CN} β)`, "var(--c-w)", "end", 13, true);
        return M.svg(g); }
      case "moivre": { M = MP({ s: 48, ox: 150, oy: 140, h: 236 }); const r = 1.16, d = 26, n = 6, pts = [];
        for (let i = 1; i <= n; i++) pts.push(P_(r ** i, d * i));
        g = M.axes(-2.9, 2.9, -.9, 2.1) + M.circ(1, "var(--muted)", 1.1, "3 4") + `<polyline points="${pts.map(([x, y]) => `${M.px(x)},${M.py(y)}`).join(" ")}" fill="none" stroke="var(--muted)" stroke-width="1.3" stroke-dasharray="4 4"/>` +
          pts.map(([x, y], i) => M.ln(0, 0, x, y, i === n - 1 ? "var(--c-r)" : "var(--c-z)", i === n - 1 ? 2.8 : 1.3, i === 0 || i === n - 1 ? null : "2 4") + M.dot(x, y, i === n - 1 ? "var(--c-r)" : "var(--c-z)", i === 0 || i === n - 1 ? 5 : 3.5) +
            M.tx(x + (x >= 0 ? .1 : -.1), y + .2, i === 0 ? "z" : "z" + "¹²³⁴⁵⁶"[i], i === n - 1 ? "var(--c-r)" : "var(--c-z)", x >= 0 ? "start" : "end", 14, true)).join("") +
          M.arc(.4, 0, d, "var(--c-z)", 1.8) + M.tx(...P_(.6, d / 2), "θ", "var(--c-z)", "middle", 13, true) + M.tx(2.75, 1.85, "z⁶ = (ρ⁶)_6θ", "var(--c-r)", "end", 14, true);
        return M.svg(g); }
      case "euler": { M = MP({ s: 82, ox: 120, oy: 120 }); const d = 50, [c, s_] = P_(1, d);
        g = M.axes(-1.25, 2, -1.3, 1.3) + M.circ(1) + M.arc(.24, 0, d, "var(--c-z)", 1.6) + M.arc(.24, 0, -d, "var(--c-r)", 1.6) +
          M.ln(c, s_, c, -s_, "var(--c-im)", 4) + M.ar(0, 0, c, s_, "var(--c-z)", 2.6) + M.ar(0, 0, c, -s_, "var(--c-r)", 2.6) +
          M.ar(c, s_, 2 * c, 0, "var(--c-r)", 1.4, "3 4") + M.ar(c, -s_, 2 * c, 0, "var(--c-z)", 1.4, "3 4") + M.ln(0, 0, 2 * c, 0, "var(--c-re)", 4) + M.dot(2 * c, 0, "var(--c-re)", 5) +
          M.tx(c + .06, s_ + .12, "e^(iθ)", "var(--c-z)", "start", 14, true) + M.tx(c + .06, -s_ - .12, "e^(−iθ)", "var(--c-r)", "start", 14, true) +
          M.tx(2 * c + .05, -.2, `2 ${CN} θ`, "var(--c-re)", "middle", 14, true) + M.tx(-1.2, 1.18, `e^(iθ) + e^(−iθ) = 2 ${CN} θ`, "var(--c-re)", "start", 12, true) + M.tx(-1.2, -1.2, `e^(iθ) − e^(−iθ) = 2i ${SN} θ`, "var(--c-im)", "start", 12, true);
        return M.svg(g); }
      case "roots": case "roots3": case "roots8": {
        const n = kind === "roots" ? 5 : 3, r = kind === "roots8" ? 2 : kind === "roots3" ? 1 : 1.25, th0 = kind === "roots" ? 50 : 0, s = kind === "roots8" ? 46 : kind === "roots3" ? 82 : 70;
        M = MP({ s, ox: 150, oy: 120 }); const pts = []; for (let i = 0; i < n; i++) pts.push(P_(r, (th0 + 360 * i) / n));
        const lab3 = ["1", "ω = −1/2 + (√3/2)i", "ω̄ = ω²"], lab8 = ["2", "−1 + √3 i", "−1 − √3 i"];
        g = M.axes(-r - .55, r + .7, -r - .4, r + .45) + M.circ(r, "var(--c-r)", 1.2, "4 4") +
          `<polygon points="${pts.map(([x, y]) => `${M.px(x)},${M.py(y)}`).join(" ")}" fill="${tintC("--c-r")}" stroke="var(--c-r)" stroke-width="1.6"/>` +
          pts.map(([x, y], i) => M.ln(0, 0, x, y, "var(--c-r)", i ? 1.2 : 2.4, i ? "3 3" : null) + M.dot(x, y, "var(--c-r)", i ? 4.5 : 6)).join("") +
          pts.map(([x, y], i) => { const lb = kind === "roots3" ? lab3[i] : kind === "roots8" ? lab8[i] : `w${"₀₁₂₃₄"[i]}`, R = r + .2, [lx, ly] = P_(R, (th0 + 360 * i) / n);
            return M.tx(lx, ly, lb, "var(--c-r)", lx > .2 ? "start" : lx < -.2 ? "end" : "middle", 13, true); }).join("") +
          (kind === "roots" ? M.arc(.42, 0, th0 / n, "var(--c-z)", 1.8) + M.arc(.62, th0 / n, th0 / n + 72, "var(--muted)", 1.3) + M.tx(...P_(.85, th0 / n + 36), "2π/5", "var(--muted)", "middle", 12, true) + M.tx(...P_(.55, th0 / n / 2 + 3), "θ/5", "var(--c-z)", "start", 11, true) : M.tx(...P_(.62, 60), "120°", "var(--muted)", "middle", 12) + M.arc(.36, 0, 120, "var(--muted)", 1.2));
        return M.svg(g); }
      case "exp": case "log": {
        const L1 = MP({ s: 52, ox: 70, oy: 140, w: 560, h: 240 }), L2 = MP({ s: kind === "exp" ? 62 : 52, ox: 400, oy: 140, w: 560, h: 240 });
        const a = .4, b = 1, ea = Math.exp(a), [ex, ey] = [ea * Math.cos(b), ea * Math.sin(b)];
        if (kind === "exp") {
          g = L1.axes(-.8, 2.3, -1.6, 1.9) + L1.ln(0, 0, a, 0, "var(--c-re)", 4) + L1.ln(a, 0, a, b, "var(--c-im)", 4) + L1.dot(a, b, "var(--c-z)", 5.5) + L1.ln(-.8, b, 2.2, b, "var(--c-im)", 1, "3 4") + L1.ln(a, -1.5, a, 1.8, "var(--c-re)", 1, "3 4") +
            L1.tx(a + .1, b + .25, "z = a + bi", "var(--c-z)", "start", 14, true) + L1.tx(a / 2, -.25, "a", "var(--c-re)", "middle", 14, true) + L1.tx(a + .1, b / 2, "b", "var(--c-im)", "start", 14, true) +
            L2.axes(-2, 2.3, -1.7, 1.9) + L2.circ(ea, "var(--c-re)", 1.2, "3 4") + L2.arc(.4, 0, b * 180 / Math.PI, "var(--c-im)", 2.2) + L2.ar(0, 0, ex, ey, "var(--c-r)", 3) + L2.dot(ex, ey, "var(--c-r)", 5) +
            L2.tx(ex + .08, ey + .15, "e^z", "var(--c-r)", "start", 15, true) + L2.tx(...P_(.62, 28), "b", "var(--c-im)", "middle", 14, true) + L2.tx(ea * .5 - .2, -.16, "|e^z| = e^a", "var(--c-re)", "middle", 13, true) +
            `<path d="M228 70 Q265 52 302 70" fill="none" stroke="var(--muted)" stroke-width="1.5"/><path d="M302 70 l-9 -1 l5 -7 z" fill="var(--muted)"/><text x="265" y="46" text-anchor="middle" font-size="15" font-style="italic" fill="var(--muted)">${svgT("e^z")}</text>`;
          return L1.svg(g, "mfig wide");
        }
        const rz = Math.E, th = .8, lz = MP({ s: 34, ox: 90, oy: 140, w: 560, h: 240 }), [zx, zy] = [rz * Math.cos(th), rz * Math.sin(th)], R2 = MP({ s: 14, ox: 400, oy: 120, w: 560, h: 240 });
        const xs = 1 * 3; // ln e = 1, escala horizontal ampliada
        g = lz.axes(-1.5, 3.4, -1.2, 3) + lz.circ(rz, "var(--c-re)", 1, "3 4") + lz.arc(.7, 0, th * 180 / Math.PI, "var(--c-im)", 2) + lz.ar(0, 0, zx, zy, "var(--c-z)", 2.8) +
          lz.tx(zx + .1, zy + .15, "z = e_0,8", "var(--c-z)", "start", 14, true) + lz.tx(1.2, .35, "θ", "var(--c-im)", "start", 14, true) +
          `<line x1="${R2.px(-6)}" y1="120" x2="${R2.px(9)}" y2="120" stroke="var(--axis)" stroke-width="1.2"/><line x1="400" y1="232" x2="400" y2="8" stroke="var(--axis)" stroke-width="1.2"/>` +
          [-1, 0, 1].map(kk => { const y = th + 2 * Math.PI * kk, X_ = R2.px(xs), Y_ = R2.py(y);
            return `<circle cx="${X_}" cy="${Y_}" r="${kk ? 4.5 : 6}" fill="var(--c-r)"/><text x="${X_ + 10}" y="${Y_ + 5}" font-size="13" font-style="italic" fill="var(--c-r)" paint-order="stroke" stroke="var(--surface)" stroke-width="4">${kk ? `k = ${minus(String(kk))}` : "Log z  (k = 0)"}</text>`; }).join("") +
          `<line x1="${R2.px(xs)}" y1="${R2.py(th - 2 * Math.PI)}" x2="${R2.px(xs)}" y2="${R2.py(th + 2 * Math.PI)}" stroke="var(--c-r)" stroke-width="1.2" stroke-dasharray="3 4"/>` +
          `<text x="${R2.px(xs)}" y="${R2.py(0) + 18}" text-anchor="middle" font-size="12" fill="var(--c-re)" font-style="italic">ln|z| = 1</text><text x="${R2.px(xs) - 10}" y="${R2.py(th + Math.PI) + 4}" text-anchor="end" font-size="12" fill="var(--muted)" font-style="italic">+2π</text>` +
          `<path d="M228 70 Q265 52 302 70" fill="none" stroke="var(--muted)" stroke-width="1.5"/><path d="M302 70 l-9 -1 l5 -7 z" fill="var(--muted)"/><text x="265" y="46" text-anchor="middle" font-size="15" font-style="italic" fill="var(--muted)">log</text>`;
        return lz.svg(g, "mfig wide"); }
    }
    return "";
  }

  /* ---- estado y lienzo ---- */
  const S3 = 60, C3 = 350, R3 = 5.5;
  const X3 = x => C3 + x * S3, Y3 = y => C3 - y * S3;
  const OPS = [["none", "opNone", "z"], ["conj", "opConj", "z̄"], ["sum", "opSum", "z + w"], ["prod", "opProd", "z · w"], ["quot", "opQuot", "z / w"], ["pow", "opPow", "zⁿ"], ["root", "opRoot", "ⁿ√z"]];
  const USESW = { sum: 1, prod: 1, quot: 1 };
  const cx = { z: Cx(2, 1), w: Cx(-1, 1), op: "prod", n: 3, unit: "rad", mode: "bin", show: { labels: 1, proj: 1, polar: 1, unit: 1 }, snap: true };
  const svg3 = $("plot3"), gd3 = $("dyn3"), hZ = $("hZ"), hW = $("hW");
  (function buildStatic3(gs) {
    let s = "";
    for (let i = -5.5; i <= 5.5; i += .5) {
      const major = Number.isInteger(i);
      s += `<line x1="${X3(i)}" y1="0" x2="${X3(i)}" y2="700" stroke="var(--grid)" stroke-width="${major ? 1.2 : .6}"/><line x1="0" y1="${Y3(i)}" x2="700" y2="${Y3(i)}" stroke="var(--grid)" stroke-width="${major ? 1.2 : .6}"/>`;
    }
    s += `<line x1="8" y1="${C3}" x2="692" y2="${C3}" stroke="var(--axis)" stroke-width="1.4"/><line x1="${C3}" y1="692" x2="${C3}" y2="8" stroke="var(--axis)" stroke-width="1.4"/>`;
    s += `<path d="M692 ${C3} l-10 -5 v10 z" fill="var(--axis)"/><path d="M${C3} 8 l-5 10 h10 z" fill="var(--axis)"/>`;
    s += `<text x="684" y="${C3 - 12}" text-anchor="end" fill="var(--muted)" font-size="17">Re</text><text x="${C3 + 12}" y="26" fill="var(--muted)" font-size="17">Im</text>`;
    for (let i = -5; i <= 5; i++) {
      if (!i) continue;
      s += `<line x1="${X3(i)}" y1="${C3 - 4}" x2="${X3(i)}" y2="${C3 + 4}" stroke="var(--axis)"/><line x1="${C3 - 4}" y1="${Y3(i)}" x2="${C3 + 4}" y2="${Y3(i)}" stroke="var(--axis)"/>`;
      s += `<text x="${X3(i)}" y="${C3 + 20}" text-anchor="middle" fill="var(--muted)" font-size="13">${minus(String(i))}</text>`;
      s += `<text x="${C3 - 9}" y="${Y3(i) + 4}" text-anchor="end" fill="var(--muted)" font-size="13" font-style="italic">${i === 1 ? "i" : i === -1 ? "−i" : minus(String(i)) + "i"}</text>`;
    }
    s += `<circle cx="${C3}" cy="${C3}" r="3.5" fill="var(--axis)"/>`;
    gs.innerHTML = s;
  })($("static3"));

  function arrow3(x1, y1, x2, y2, col, w = 3.5, dash) {
    const a = X3(x1), b = Y3(y1), c = X3(x2), d = Y3(y2), Lh = Math.hypot(c - a, d - b);
    if (Lh < 4) return "";
    const ux = (c - a) / Lh, uy = (d - b) / Lh, hl = Math.min(17, Lh * .45), hw = hl * .5, bx = c - ux * hl, by = d - uy * hl;
    return `<line x1="${a}" y1="${b}" x2="${bx + ux * 2}" y2="${by + uy * 2}" stroke="${col}" stroke-width="${w}" stroke-linecap="round"${dash ? ` stroke-dasharray="${dash}"` : ""}/><path d="M${c} ${d} L${bx - uy * hw} ${by + ux * hw} L${bx + uy * hw} ${by - ux * hw} Z" fill="${col}"/>`;
  }
  const line3 = (x1, y1, x2, y2, col, w = 2, dash, extra = "") => `<line x1="${X3(x1)}" y1="${Y3(y1)}" x2="${X3(x2)}" y2="${Y3(y2)}" stroke="${col}" stroke-width="${w}" stroke-linecap="round"${dash ? ` stroke-dasharray="${dash}"` : ""}${extra}/>`;
  const lab3 = (x, y, t_, col, a = "middle", fs = 20, it = true) => cx.show.labels ? `<text x="${X3(x)}" y="${Y3(y) + fs * .35}" fill="${col}" text-anchor="${a}" font-size="${fs}"${it ? ' font-style="italic"' : ""} paint-order="stroke" stroke="var(--surface)" stroke-width="5" stroke-linejoin="round">${t_}</text>` : "";
  function arc3(rpx, a0, a1, col, w = 2, fill) {
    if (Math.abs(a1 - a0) < .3) return "";
    const p = a => [C3 + rpx * Math.cos(a), C3 - rpx * Math.sin(a)], [x0, y0] = p(a0);
    const parts = Math.abs(a1 - a0) >= 2 * Math.PI - 1e-6 ? [a0 + (a1 - a0) / 2, a1] : [a1];
    let d = `M${x0} ${y0}`, prev = a0;
    for (const e of parts) { const [x1, y1] = p(e); d += ` A${rpx} ${rpx} 0 ${Math.abs(e - prev) > Math.PI ? 1 : 0} ${e > prev ? 0 : 1} ${x1} ${y1}`; prev = e; }
    return fill ? `<path d="M${C3} ${C3} L${x0} ${y0} ${d.slice(d.indexOf("A"))} Z" fill="${fill}" stroke="none"/><path d="${d}" fill="none" stroke="${col}" stroke-width="${w}"/>` : `<path d="${d}" fill="none" stroke="${col}" stroke-width="${w}"/>`;
  }
  const lblPos = (z, off = .42) => { const r = cAbs(z); return r < 1e-9 ? [off * .7, off * .7] : [z.re + z.re / r * off, z.im + z.im / r * off]; };
  const anchorFor = z => Math.abs(z.re) < .15 ? "middle" : z.re > 0 ? "start" : "end";

  function drawCX() {
    const { z, w, op, n, show: sh } = cx;
    let g = "";
    if (sh.unit) g += `<circle cx="${C3}" cy="${C3}" r="${S3}" fill="none" stroke="var(--muted)" stroke-width="1.3" stroke-dasharray="3 5" opacity=".85"/>`;
    const r = cAbs(z), th = cArg(z);
    const polarZ = (zz, col, rpx, fillOn = true) => {
      const rr = cAbs(zz); if (rr < 1e-9) return "";
      const t_ = cArg(zz), rp = Math.min(rpx, rr * S3 * .6);
      return arc3(rp, 0, t_, col, 2, fillOn ? `color-mix(in srgb, ${col} 12%, transparent)` : null) + lab3(...[Math.cos(t_ / 2), Math.sin(t_ / 2)].map(c => c * (rp + 16) / S3), "θ", col, "middle", 17);
    };
    if (sh.polar && r > 1e-9) g += `<circle cx="${C3}" cy="${C3}" r="${r * S3}" fill="none" stroke="var(--c-z)" stroke-width="1" stroke-dasharray="2 6" opacity=".7"/>`;
    // operación
    let res = null;
    if (op === "conj") {
      res = Cx(z.re, -z.im);
      g += line3(z.re, z.im, res.re, res.im, "var(--muted)", 1.3, "4 5");
      if (sh.polar && r > 1e-9) g += arc3(Math.min(44, r * S3 * .6), 0, -th, "var(--c-r)", 2);
      g += arrow3(0, 0, res.re, res.im, "var(--c-r)", 4) + lab3(...lblPos(res), "z̅", "var(--c-r)", anchorFor(res));
    } else if (op === "sum") {
      res = cAdd(z, w);
      g += `<path d="M${X3(0)} ${Y3(0)} L${X3(z.re)} ${Y3(z.im)} L${X3(res.re)} ${Y3(res.im)} L${X3(w.re)} ${Y3(w.im)} Z" fill="color-mix(in srgb, var(--c-r) 9%, transparent)"/>`;
      g += line3(z.re, z.im, res.re, res.im, "var(--c-w)", 2, "6 5") + line3(w.re, w.im, res.re, res.im, "var(--c-z)", 2, "6 5");
      g += arrow3(0, 0, w.re, w.im, "var(--c-w)", 4) + arrow3(0, 0, res.re, res.im, "var(--c-r)", 4.5);
      g += lab3(...lblPos(w), "w", "var(--c-w)", anchorFor(w)) + lab3(...lblPos(res), "z + w", "var(--c-r)", anchorFor(res));
    } else if (op === "prod" || op === "quot") {
      const zero = op === "quot" && cAbs(w) < 1e-12;
      g += arrow3(0, 0, w.re, w.im, "var(--c-w)", 4) + lab3(...lblPos(w), "w", "var(--c-w)", anchorFor(w));
      if (!zero) {
        res = op === "prod" ? cMul(z, w) : cDiv(z, w);
        const tz = th, tw = cArg(w), t2 = op === "prod" ? tz + tw : tz - tw;
        if (sh.polar && r > 1e-9 && cAbs(w) > 1e-9) g += arc3(34, 0, tz, "var(--c-z)", 2.2) + arc3(50, tz, t2, "var(--c-w)", 2.6) + arc3(66, 0, t2, "var(--c-r)", 1.4);
        if (sh.polar && cAbs(res) > 1e-9) g += `<circle cx="${C3}" cy="${C3}" r="${cAbs(res) * S3}" fill="none" stroke="var(--c-r)" stroke-width="1" stroke-dasharray="2 6" opacity=".7"/>`;
        g += arrow3(0, 0, res.re, res.im, "var(--c-r)", 4.5) + lab3(...lblPos(res), op === "prod" ? "z · w" : "z / w", "var(--c-r)", anchorFor(res));
      }
    } else if (op === "pow") {
      const pts = []; for (let i = 1; i <= n; i++) pts.push(cPow(z, i));
      res = pts[n - 1];
      g += `<polyline points="${[{ re: 1, im: 0 }, ...pts].map(p => `${X3(p.re)},${Y3(p.im)}`).join(" ")}" fill="none" stroke="var(--muted)" stroke-width="1.4" stroke-dasharray="4 5"/>`;
      pts.slice(1, -1).forEach((p, i) => { g += `<circle cx="${X3(p.re)}" cy="${Y3(p.im)}" r="5" fill="var(--c-z)" opacity=".75"/>` + lab3(...lblPos(p, .32), "z" + sup(i + 2), "var(--c-z)", anchorFor(p), 15); });
      if (sh.polar && r > 1e-9) g += arc3(66, 0, n * th, "var(--c-r)", 1.6);
      g += arrow3(0, 0, res.re, res.im, "var(--c-r)", 4.5) + lab3(...lblPos(res), "z" + sup(n), "var(--c-r)", anchorFor(res));
    } else if (op === "root" && r > 1e-12) {
      const rr = r ** (1 / n), roots = []; for (let kk = 0; kk < n; kk++) roots.push(cPol(rr, (th + 2 * Math.PI * kk) / n));
      g += `<circle cx="${C3}" cy="${C3}" r="${rr * S3}" fill="none" stroke="var(--c-r)" stroke-width="1.3" stroke-dasharray="5 5"/>`;
      if (n > 2) g += `<polygon points="${roots.map(p => `${X3(p.re)},${Y3(p.im)}`).join(" ")}" fill="color-mix(in srgb, var(--c-r) 12%, transparent)" stroke="var(--c-r)" stroke-width="1.8"/>`;
      else g += line3(roots[0].re, roots[0].im, roots[1].re, roots[1].im, "var(--c-r)", 1.8);
      if (sh.polar) g += arc3(Math.min(40, rr * S3 * .6), 0, th / n, "var(--c-r)", 2.2);
      roots.forEach((p, i) => { g += (i ? line3(0, 0, p.re, p.im, "var(--c-r)", 1.4, "3 4") : arrow3(0, 0, p.re, p.im, "var(--c-r)", 4)) + `<circle cx="${X3(p.re)}" cy="${Y3(p.im)}" r="${i ? 6 : 7.5}" fill="var(--c-r)"/>` + lab3(...lblPos(p, .36), "w" + sub(i), "var(--c-r)", anchorFor(p), 17); });
      res = roots;
    }
    // z
    if (sh.proj && r > 1e-9) g += line3(0, 0, z.re, 0, "var(--c-re)", 6) + line3(z.re, 0, z.re, z.im, "var(--c-im)", 6);
    if (sh.polar && op !== "prod" && op !== "quot") g += polarZ(z, "var(--c-z)", 44);
    g += arrow3(0, 0, z.re, z.im, "var(--c-z)", 4.5);
    if (sh.proj && sh.labels && r > 1e-9) {
      if (Math.abs(z.re) > .3) g += lab3(z.re / 2, z.im >= 0 ? -.33 : .33, "a", "var(--c-re)", "middle", 17);
      if (Math.abs(z.im) > .3) g += lab3(z.re + (z.re >= 0 ? .2 : -.2), z.im / 2, "b", "var(--c-im)", z.re >= 0 ? "start" : "end", 17);
    }
    if (sh.polar && sh.labels && r > .6) { const ang = th + (Math.abs(th) < 1.4 ? .22 : -.22); g += lab3(Math.cos(ang) * r * .55, Math.sin(ang) * r * .55, "ρ", "var(--c-z)", "middle", 17); }
    g += lab3(...lblPos(z), "z", "var(--c-z)", anchorFor(z), 22);
    gd3.innerHTML = g;
    const ring = (zz, col) => `<circle cx="${X3(zz.re)}" cy="${Y3(zz.im)}" r="26" fill="transparent"/><circle cx="${X3(zz.re)}" cy="${Y3(zz.im)}" r="15" fill="none" stroke="${col}" stroke-width="2.4" opacity=".55"/><circle cx="${X3(zz.re)}" cy="${Y3(zz.im)}" r="7.5" fill="${col}" stroke="var(--surface)" stroke-width="2"/>`;
    hZ.innerHTML = ring(z, "var(--c-z)");
    hW.innerHTML = USESW[op] ? ring(w, "var(--c-w)") : "";
    vis(hW, !!USESW[op]);
    hZ.setAttribute("aria-valuetext", binOf(z, false).s); hW.setAttribute("aria-valuetext", binOf(w, false).s);
    const out = (rs) => [].concat(rs || []).some(p => Math.abs(p.re) > R3 + .3 || Math.abs(p.im) > R3 + .3);
    return { res, out: out(res) || out(z) };
  }
  const sup = n => String(n).split("").map(d => "⁰¹²³⁴⁵⁶⁷⁸⁹"[d]).join("");
  const sub = n => String(n).split("").map(d => "₀₁₂₃₄₅₆₇₈₉"[d]).join("");

  /* ---- panel ---- */
  const btnD = id => `<button type="button" class="more" data-demo="${id}">${t("ui.seeDemo")}</button>`;
  function fxBlock(f, s, r, demo, extra = "") {
    return `<div class="fx"><div class="f">${f}</div>${s ? `<div class="s">${s}</div>` : ""}${r ? `<div class="r">${r}</div>` : ""}${extra}${demo ? [].concat(demo).map(btnD).join("") : ""}</div>`;
  }
  const Zi = `<i class="cz">z</i>`, Wi = `<i class="cw">w</i>`, Ii = "<i>i</i>";
  function partsP(zz) { const P1 = partsOf(zz); return P1; }
  function polarStep(z1, op, z2) { // texto de suma de ángulos con reducción
    const u_ = cx.unit, ta = cArg(z1), tb = cArg(z2), raw = op === "+" ? ta + tb : ta - tb, red = redA(raw);
    const A1 = angOf(ta, u_).s, A2 = angOf(tb, u_).s, RAW = angOf(raw, u_).s, RED = angOf(red, u_).s;
    return { A1, A2, RAW, RED, reduced: Math.abs(raw - red) > 1e-9, raw, red };
  }
  function renderPanel(info) {
    const { z, w, op, n, unit: u_ } = cx, r = cAbs(z), th = cArg(z);
    const B = binOf(z), M_ = modOf(z), A = angOf(th, u_);
    $("bigZ").innerHTML = `${Zi} = <span class="cz">${B.ex ? "" : "≈ "}${B.s}</span>`;
    $("subZ").innerHTML = r < 1e-12 ? `|${Zi}| = 0 · ${ct("ui.undefArg")}` :
      `|${Zi}| = ${M_.s}${M_.ex && /√|\//.test(M_.s) ? ` ≈ <span class="num">${fT(r)}</span>` : ""} · Arg ${Zi} ${A.ex ? "= " + A.s : "≈ " + A.s}${u_ === "rad" ? ` <span class="num">(${fmtDeg(th * 180 / Math.PI)}°)</span>` : ` <span class="num">(${fT(th)} rad)</span>`}`;
    // formas
    const P1 = partsOf(z), CN = N("cos"), SN = N("sin");
    const argExpl = () => {
      if (r < 1e-12) return ct("ui.undefArg");
      if (A.ex) return A.s;
      const q = nq(z.im / z.re).s, base = `arctan(${q})`;
      const corr = z.re > 0 ? "" : z.im >= 0 ? " + π" : " − π";
      return `${base}${corr}`;
    };
    const rows = [
      ["--c-z", `${m("a + bi")}`, ct("ui.rowBin"), (P1.ex ? "" : "≈ ") + joinBin(P1.a, P1.b), "", "cx-axiom"],
      ["--c-re", `Re(${Zi}) = <i>a</i>`, ct("ui.rowRe"), P1.a, P1.ex && /√|\//.test(P1.a) ? fT(z.re) : "", "cx-axiom"],
      ["--c-im", `Im(${Zi}) = <i>b</i>`, ct("ui.rowIm"), P1.b, P1.ex && /√|\//.test(P1.b) ? fT(z.im) : "", "cx-axiom"],
      ["--fg", m(`|z| = ${sqr("a² + b²")}`), ct("ui.rowMod"), `${sqr(`${ppc(P1.a)}² + ${ppc(P1.b)}²`)} = ${M_.s}`, M_.ex && /√|\//.test(M_.s) ? fT(r) : "", "cx-mod1"],
      ["--c-z", m("θ = Arg z"), ct("ui.rowArg"), argExpl(), r < 1e-12 ? "" : (u_ === "rad" ? (A.ex ? `${fT(th)} rad · ` : "") + fmtDeg(th * 180 / Math.PI) + "°" : fT(th) + " rad"), "cx-arg"],
      ["--c-z", m(sb("ρ", "θ")), ct("ui.rowPol"), polH(z, u_), "", "cx-p2b"],
      ["--c-z", m(`ρ(${CN} θ + i ${SN} θ)`), ct("ui.rowTrig"), trigH(z, u_), "", "cx-p2b"],
      ["--c-z", m(`ρ${ex_("iθ")}`), ct("ui.rowExp"), expH(z), u_ === "deg" ? ct("ui.expRad") : "", "cx-euler"],
      ["--c-r", m(`${ov("z")} = a − bi`), ct("ui.rowConj"), binH(Cx(z.re, -z.im)), "", "cx-conj1"],
    ];
    $("cxForms").innerHTML = rows.map(([c, nm, df, val, dec, demo]) => `<div class="frow click" data-demo="${demo}" role="button" tabindex="0" style="--col:var(${c})"><span class="bar"></span><div class="fb"><div class="fh"><span class="fn mr">${nm}</span><span class="fd">${df}</span></div><div class="fv mr">${val}${dec ? ` <span class="dec num">≈ ${dec}</span>` : ""}</div></div></div>`).join("");
    // resultado
    const P2 = partsOf(w), zS = binOf(z).s, wS = binOf(w).s;
    let h = "";
    const res = info.res, outNote = info.out ? `<div class="hint">${ct("ui.outside")}</div>` : "";
    const resB = rr => `<span class="cr">${binH(rr)}</span>`;
    const resP = rr => `<span class="cr">${cAbs(rr) < 1e-12 ? "0" : polH(rr, u_)}</span>`;
    if (op === "none") {
      h = `<p class="hint" style="margin-top:8px">${ct("ui.pickOp")}</p>`;
    } else if (op === "conj") {
      h = fxBlock(`${ov(Zi)} = <i>a</i> − <i>b</i>${Ii}`, `= ${binOf(Cx(z.re, -z.im)).s}`, `<span>${ct("ui.inPolar")}: ${ov(Zi)} = ${m(sb("ρ", "−θ"))} = ${resP(res)}</span>`, ["cx-conj1", "cx-pconj"]);
    } else if (op === "sum") {
      h = fxBlock(`${Zi} + ${Wi} = (<i>a</i> + <i>c</i>) + (<i>b</i> + <i>d</i>)${Ii}`, `= (${P1.a} + ${pp(P2.a)}) + (${P1.b} + ${pp(P2.b)})${Ii}`, `<span>= ${resB(res)}</span>`, ["cx-axiom", "cx-tri"]);
    } else if (op === "prod") {
      h = fxBlock(`(<i>a</i> + <i>b</i>${Ii})(<i>c</i> + <i>d</i>${Ii}) = (<i>ac</i> − <i>bd</i>) + (<i>ad</i> + <i>bc</i>)${Ii}`,
        `= (${pp(P1.a)}·${pp(P2.a)} − ${pp(P1.b)}·${pp(P2.b)}) + (${pp(P1.a)}·${pp(P2.b)} + ${pp(P1.b)}·${pp(P2.a)})${Ii}`, `<span>= ${resB(res)}</span>`, "cx-axiom");
      if (cAbs(z) > 1e-12 && cAbs(w) > 1e-12) {
        const ps = polarStep(z, "+", w), m1 = modOf(z).s, m2 = modOf(w).s;
        h += fxBlock(`${m(`${sb("(" + r1 + ")", t1)} · ${sb("(" + r2 + ")", t2)} = ${sb(`(${r1}${r2})`, `${t1} + ${t2}`)}`)}`,
          `= ${sb(`(${pp(m1)} · ${pp(m2)})`, `${ps.A1} + ${pp(ps.A2)}`)} = ${sb(modOf(res).s, ps.RAW)}`,
          `<span>= ${resP(res)}</span>${ps.reduced ? `<span class="hint">${ct("ui.reduce", { a: ps.RAW, b: ps.RED })}</span>` : ""}`, "cx-pprod");
      }
    } else if (op === "quot") {
      if (cAbs(w) < 1e-12) h = `<p class="res-warn" style="margin-top:8px">${ct("ui.noDiv")}</p>`;
      else {
        const wb = binOf(Cx(w.re, -w.im)).s, w2 = nq(w.re ** 2 + w.im ** 2).s, num = cMul(z, Cx(w.re, -w.im));
        h = fxBlock(`${fr(Zi, Wi)} = ${fr(`${Zi} · ${ov(Wi)}`, `|${Wi}|²`)}`, `= ${fr(`(${zS})(${wS === "0" ? "0" : wb})`, w2)} = ${fr(binOf(num).s, w2)}`, `<span>= ${resB(res)}</span>`, "cx-div");
        if (cAbs(z) > 1e-12) {
          const ps = polarStep(z, "−", w);
          h += fxBlock(m(`${fr(sb("(" + r1 + ")", t1), sb("(" + r2 + ")", t2))} = ${sb(`(${fr(r1, r2)})`, `${t1} − ${t2}`)}`),
            `= ${sb(`(${modOf(z).s} / ${modOf(w).s})`, `${ps.A1} − ${pp(ps.A2)}`)}`, `<span>= ${resP(res)}</span>${ps.reduced ? `<span class="hint">${ct("ui.reduce", { a: ps.RAW, b: ps.RED })}</span>` : ""}`, "cx-pquot");
        }
      }
    } else if (op === "pow") {
      const raw = n * th, red = redA(raw), RAW = angOf(raw, u_).s, RED = angOf(red, u_).s;
      const rn = sqrtEx((z.re ** 2 + z.im ** 2) ** n) ?? fT(r ** n);
      h = fxBlock(m(`${sp(`(${sb("ρ", "θ")})`, "n")} = ${sb(`(${sp("ρ", "n")})`, "nθ")}`), r < 1e-12 ? "" : `= ${sb(`(${M_.s})${sup(n)}`, `${n} · ${pp(A.s)}`)} = ${sb(rn, RAW)}`,
        `<span>= ${resP(res)} = ${resB(res)}</span>${r > 1e-12 && Math.abs(raw - red) > 1e-9 ? `<span class="hint">${ct("ui.reduce", { a: RAW, b: RED })}</span>` : ""}`, "cx-moivre");
    } else if (op === "root") {
      if (r < 1e-12) h = `<p class="hint" style="margin-top:8px">${ct("ui.root0")}</p>`;
      else {
        const rr = r ** (1 / n), rq = ratio(rr, 64), sq = z.re ** 2 + z.im ** 2, sqq = nq(sq);
        const rS = rq ? nq(rr).s : (sqq.ex ? supI(2 * n, sqq.s) : fT(rr));
        const list = res.map((p, kk) => { const ang = (th + 2 * Math.PI * kk) / n, AS = angOf(ang, u_).s;
          return `<div><b>k = ${kk}</b><span>${sb(`<span class="cr"><i>w</i>${sub(kk)}</span> = ${rS}`, AS)}</span><span>= ${resB(p)}</span></div>`; }).join("");
        h = fxBlock(m(`${supI("n", "z")} = { ${sb(`(${supI("n", "ρ")})`, fr("θ + 2πk", "n"))} }`),
          `${supI(n, "ρ")} = ${supI(n, pp(M_.s))} = ${rS}${rq ? "" : ` ≈ ${fT(rr)}`} ·  ${fr(`${A.s} + 2πk`.replace("2πk", u_ === "deg" ? "360°k" : "2πk"), n)}`, "", "cx-roots", `<div class="res-list">${list}</div>`);
      }
    }
    $("cxRes").innerHTML = h + outNote;
  }

  /* ---- entradas ---- */
  const inZ = [$("zA"), $("zB")], inW = [$("wA"), $("wB")];
  const fZ = [$("fZ1"), $("fZ2")], fW = [$("fW1"), $("fW2")];
  function fieldText(zz, idx) {
    if (cx.mode === "bin") { const P1 = partsOf(zz); return P1.ex ? cxPN(idx ? P1.b : P1.a) : (idx ? zz.im : zz.re).toFixed(4).replace(/\.?0+$/, ""); }
    if (idx === 0) { const M_ = modOf(zz); return M_.ex ? cxPN(M_.s) : cAbs(zz).toFixed(4); }
    const th = cArg(zz);
    if (cx.unit === "deg") return fmtDeg(th * 180 / Math.PI).replace("−", "-").replace(",", ".");
    const p = piQ(th / Math.PI); return p ? cxPN(p) : th.toFixed(4);
  }
  function syncInputs(from) {
    [[inZ, cx.z, "z"], [inW, cx.w, "w"]].forEach(([ins, zz, nm]) => { if (from === nm) return; ins.forEach((el_, i) => el_.value = fieldText(zz, i)); });
  }
  function readNum(which) {
    const ins = which === "z" ? inZ : inW, fs = which === "z" ? fZ : fW;
    const p0 = parseNum(ins[0].value), p1 = parseNum(ins[1].value);
    fs[0].classList.toggle("bad", !p0); fs[1].classList.toggle("bad", !p1);
    if (!p0 || !p1) return;
    let zz;
    if (cx.mode === "bin") zz = Cx(p0.val, p1.val);
    else { if (p0.val < 0) { fs[0].classList.add("bad"); return; } const th = (cx.unit === "rad" || p1.hasPi) ? p1.val : p1.val * Math.PI / 180; zz = cPol(p0.val, th); }
    cx[which] = zz; renderCX(which);
  }
  [...inZ, ...inW].forEach((el_, i) => {
    const which = i < 2 ? "z" : "w";
    el_.addEventListener("input", () => readNum(which));
    el_.addEventListener("blur", () => { (which === "z" ? fZ : fW).forEach(f => f.classList.remove("bad")); syncInputs(); });
    el_.addEventListener("keydown", e => { if (e.key === "Enter") el_.blur(); });
  });
  function labelsCX() {
    const bin = cx.mode === "bin", deg = cx.unit === "deg";
    $("lZ1").innerHTML = bin ? "a =" : "ρ ="; $("lZ2").innerHTML = bin ? "b =" : "θ =";
    $("lW1").innerHTML = bin ? "c =" : "ρ =";  $("lW2").innerHTML = bin ? "d =" : "θ =";
    $("uZ1").textContent = ""; $("uW1").textContent = "";
    $("uZ2").innerHTML = bin ? "" : (deg ? "°" : "rad"); $("uW2").innerHTML = bin ? "" : (deg ? "°" : "rad");
    $("cxHint").innerHTML = ct(bin ? "ui.hintBin" : "ui.hintPol");
    $("mBin").setAttribute("aria-pressed", bin); $("mPol").setAttribute("aria-pressed", !bin);
    $("cDeg").setAttribute("aria-pressed", deg); $("cRad").setAttribute("aria-pressed", !deg);
  }
  $("mBin").addEventListener("click", () => { cx.mode = "bin"; labelsCX(); syncInputs(); });
  $("mPol").addEventListener("click", () => { cx.mode = "pol"; labelsCX(); syncInputs(); });
  $("cDeg").addEventListener("click", () => { cx.unit = "deg"; labelsCX(); renderCX(); });
  $("cRad").addEventListener("click", () => { cx.unit = "rad"; labelsCX(); renderCX(); });

  function buildOps() {
    $("ops").innerHTML = OPS.map(([id, key, sym]) => `<button type="button" data-op="${id}" aria-pressed="${cx.op === id}"><span class="mr">${sym}</span><span>${ct("ui." + key)}</span></button>`).join("");
    $("nSeg").innerHTML = [2, 3, 4, 5, 6, 8].map(v => `<button type="button" data-n="${v}" aria-pressed="${cx.n === v}">${v}</button>`).join("");
  }
  $("ops").addEventListener("click", e => { const b = e.target.closest("[data-op]"); if (!b) return; cx.op = b.dataset.op; renderCX(); });
  $("nSeg").addEventListener("click", e => { const b = e.target.closest("[data-n]"); if (!b) return; cx.n = +b.dataset.n; renderCX(); });
  const QUICK = [
    ["1 + i", [1, 1], null, "none"], ["(2 − i) + (1 + 2i)", [2, -1], [1, 2], "sum"], ["(1 + i)(1 − i)", [1, 1], [1, -1], "prod"],
    ["(2 + 3i)/(1 + 2i)", [2, 3], [1, 2], "quot"], ["(1 + i)⁴", [1, 1], null, "pow", 4], ["i²", [0, 1], null, "pow", 2],
    ["∛1", [1, 0], null, "root", 3], ["z³ = 8", [8, 0], null, "root", 3], ["e<sup>iπ</sup> = −1", [-1, 0], null, "none"],
  ];
  function buildQuick() {
    $("quick3").innerHTML = QUICK.map((q, i) => `<button type="button" data-cq="${i}">${m(q[0])}</button>`).join("");
  }
  $("quick3").addEventListener("click", e => {
    const b = e.target.closest("[data-cq]"); if (!b) return; const q = QUICK[+b.dataset.cq];
    cx.z = Cx(...q[1]); if (q[2]) cx.w = Cx(...q[2]); cx.op = q[3]; if (q[4]) cx.n = q[4]; renderCX();
  });
  // chips
  const cxChips = $("chips3");
  [["labels", "chipLabels", null], ["proj", "chipProj", "--c-re"], ["polar", "chipPolar", "--c-z"], ["unit", "chipUnit", "--muted"]].forEach(([kk, key, col]) =>
    mkChip(cxChips, "cxc-" + kk, () => ct("ui." + key), col, true, on => { cx.show[kk] = on ? 1 : 0; renderCX(); }));
  mkChip(cxChips, "cxc-snap", () => ct("ui.chipSnap"), null, true, on => cx.snap = on);

  // arrastre
  const ptMath = e => { const pt = new DOMPoint(e.clientX, e.clientY).matrixTransform(svg3.getScreenCTM().inverse()); return [(pt.x - C3) / S3, (C3 - pt.y) / S3]; };
  function snapPt(x, y) {
    x = Math.max(-R3, Math.min(R3, x)); y = Math.max(-R3, Math.min(R3, y));
    if (!cx.snap) return [Math.round(x * 100) / 100, Math.round(y * 100) / 100];
    let best = null, bd = .2;
    const gx = Math.round(x * 2) / 2, gy = Math.round(y * 2) / 2, d0 = Math.hypot(x - gx, y - gy);
    if (d0 < bd) { best = [gx, gy]; bd = d0; }
    for (let a = 0; a < 360; a += 15) { if (a % 45 && a % 30) continue; const qx = Math.cos(rad(a)), qy = Math.sin(rad(a)), d = Math.hypot(x - qx, y - qy); if (d < bd) { best = [qx, qy]; bd = d; } }
    return best ?? [Math.round(x * 20) / 20, Math.round(y * 20) / 20];
  }
  let dragC = null;
  svg3.addEventListener("pointerdown", e => {
    const [x, y] = ptMath(e);
    const dz = Math.hypot(x - cx.z.re, y - cx.z.im), dw = USESW[cx.op] ? Math.hypot(x - cx.w.re, y - cx.w.im) : Infinity;
    dragC = dw < dz ? "w" : "z";
    svg3.setPointerCapture(e.pointerId); cx[dragC] = Cx(...snapPt(x, y)); renderCX(); e.preventDefault();
  });
  svg3.addEventListener("pointermove", e => { if (!dragC) return; cx[dragC] = Cx(...snapPt(...ptMath(e))); renderCX(); });
  svg3.addEventListener("pointerup", () => dragC = null); svg3.addEventListener("pointercancel", () => dragC = null);
  [[hZ, "z"], [hW, "w"]].forEach(([h, nm]) => h.addEventListener("keydown", e => {
    const st_ = e.shiftKey || !cx.snap ? .05 : .5, d = { ArrowRight: [st_, 0], ArrowLeft: [-st_, 0], ArrowUp: [0, st_], ArrowDown: [0, -st_] }[e.key];
    if (!d) return; e.preventDefault();
    const zz = cx[nm], nx = Math.max(-R3, Math.min(R3, Math.round((zz.re + d[0]) * 100) / 100)), ny = Math.max(-R3, Math.min(R3, Math.round((zz.im + d[1]) * 100) / 100));
    cx[nm] = Cx(nx, ny); renderCX();
  }));

  /* ---- guía ---- */
  const cxCard = (id, live) => { const D = cxD().demos?.[id] ?? CX.es.demos[id]; return `<div class="id demo" data-demo="${id}" role="button" tabindex="0"><h3>${LX(D.t)}</h3><div class="f">${LX(CXF[id].stmt)}</div><p>${LX(D.p)}</p>${live ? `<div class="live" id="lv-${id}"></div>` : ""}${more()}</div>`; };
  const cards = (ids, live = []) => `<div class="ids">${ids.map(id => cxCard(id, live.includes(id))).join("")}</div>`;
  function renderGuide3() {
    const g = p => ct("g." + p);
    const defs1 = ct("g.defs1"), defs6 = ct("g.defs6");
    const defBox = arr => `<div class="defs">${arr.map(([h, p]) => `<div class="def-item"><b>${LX(h)}</b>${LX(p)}</div>`).join("")}</div>`;
    const figPlane = (() => { const M = MP({ s: 40, ox: 150, oy: 120, h: 240 }); const z = [2, -1], w = [1, 2];
      let s = M.axes(-3.2, 3.4, -2.6, 2.7);
      for (let i = -3; i <= 3; i++) if (i) s += `<text x="${M.px(i)}" y="${M.py(0) + 15}" text-anchor="middle" font-size="11" fill="var(--muted)">${minus(String(i))}</text>` + (Math.abs(i) < 3 ? `<text x="${M.px(0) - 5}" y="${M.py(i) + 4}" text-anchor="end" font-size="11" fill="var(--muted)" font-style="italic">${i === 1 ? "i" : i === -1 ? "−i" : minus(String(i)) + "i"}</text>` : "");
      s += M.ln(...z, z[0], 0, "var(--muted)", 1, "3 3") + M.ln(...z, 0, z[1], "var(--muted)", 1, "3 3") + M.ln(...w, w[0], 0, "var(--muted)", 1, "3 3") + M.ln(...w, 0, w[1], "var(--muted)", 1, "3 3");
      s += M.ar(0, 0, ...z, "var(--c-z)", 2.8) + M.ar(0, 0, ...w, "var(--c-w)", 2.8) + M.dot(...z, "var(--c-z)") + M.dot(...w, "var(--c-w)");
      s += M.tx(z[0] + .15, z[1] - .1, "z = 2 − i", "var(--c-z)", "start", 14, true) + M.tx(w[0] + .15, w[1] + .1, "w = 1 + 2i", "var(--c-w)", "start", 14, true);
      return M.svg(s); })();
    const ex1 = Cx(1, 1), ex2 = Cx(1, -1);
    const formsTable = `<div class="tablewrap"><table class="big forms"><thead><tr>${ct("g.formsH").map(h => `<th>${h}</th>`).join("")}</tr></thead><tbody>${[
      [ct("ui.rowBin"), m("a + bi"), "1 + <i>i</i>", "1 − <i>i</i>"],
      [ct("ui.rowPol"), m(sb("ρ", "θ")), polH(ex1, "rad"), polH(ex2, "rad")],
      [ct("ui.rowTrig"), m(`ρ(${COS} θ + i ${SIN} θ)`), trigH(ex1, "rad"), trigH(ex2, "rad")],
      [ct("ui.rowExp"), m(`ρ${ex_("iθ")}`), expH(ex1), expH(ex2)]].map(rw => `<tr>${rw.map((c, i) => `<td>${i ? LX(c) : c}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
    const loadBtn = (q, txt) => `<button type="button" class="linkbtn" data-cxq="${q}">${txt}</button>`;
    $("guide3").innerHTML =
      sec(g("s1e"), g("s1h"), defBox(defs1) + cards(["cx-axiom", "cx-ipow"]), g("s1l")) +
      sec(g("s2e"), g("s2h"), cards(["cx-field", "cx-order"]), g("s2l")) +
      sec(g("s3e"), g("s3h"), `<div class="split"><div class="fig-inline">${figPlane}</div><div class="split-txt"><p>${g("s3p")}</p><div class="ex-row">${loadBtn(1, g("load"))}</div></div></div>` + cards(["cx-phasor"]), g("s3l")) +
      sec(g("s4e"), g("s4h"), cards(["cx-conj1", "cx-conj2", "cx-conj3"]), g("s4l")) +
      sec(g("s5e"), g("s5h"), cards(["cx-mod1", "cx-tri", "cx-modprod", "cx-modconj", "cx-zz", "cx-div"], ["cx-tri", "cx-modprod", "cx-zz", "cx-div"]), g("s5l")) +
      sec(g("s6e"), g("s6h"), defBox(defs6) + formsTable + cards(["cx-arg", "cx-p2b"], ["cx-arg"]), g("s6l")) +
      sec(g("s7e"), g("s7h"), cards(["cx-pprod", "cx-pquot", "cx-pconj", "cx-rot"], ["cx-pprod"]), g("s7l")) +
      sec(g("s8e"), g("s8h"), cards(["cx-moivre"], ["cx-moivre"]), g("s8l")) +
      sec(g("s9e"), g("s9h"), `<p>${g("s9p")}</p>` + cards(["cx-euler", "cx-cossin", "cx-eprop"]), g("s9l")) +
      sec(g("s10e"), g("s10h"), cards(["cx-roots", "cx-root1", "cx-z38"], ["cx-roots"]) + `<div class="ex-row">${loadBtn(6, "∛1")}${loadBtn(7, "z³ = 8")}</div>`, g("s10l")) +
      sec(g("s11e"), g("s11h"), cards(["cx-exp", "cx-log"], ["cx-exp", "cx-log"]), g("s11l")) +
      sec(g("s12e"), g("s12h"), uses(ct("g.uses").map(([a, b]) => [LX(a), LX(b)])));
  }
  document.addEventListener("click", e => {
    const b = e.target.closest("[data-cxq]"); if (!b) return;
    const q = QUICK[+b.dataset.cxq]; cx.z = Cx(...q[1]); if (q[2]) cx.w = Cx(...q[2]); cx.op = q[3]; if (q[4]) cx.n = q[4]; renderCX();
    svg3.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
  });
  function liveCX() {
    const { z, w, n } = cx, set = (id, s) => { const e = $("lv-" + id); if (e) e.innerHTML = s; };
    const zS = binH(z), wS = binH(w), az = cAbs(z), aw = cAbs(w);
    set("cx-tri", `z = ${zS}, w = ${wS}: |z + w| = ${fT(cAbs(cAdd(z, w)))} ≤ ${fT(az)} + ${fT(aw)} = ${fT(az + aw)}`);
    set("cx-modprod", `|zw| = ${fT(cAbs(cMul(z, w)))} = ${fT(az)} · ${fT(aw)}`);
    set("cx-zz", `(${zS})(${binH(Cx(z.re, -z.im))}) = ${fT(az * az)} = |z|²`);
    set("cx-div", aw < 1e-12 ? ct("ui.noDiv") : `z / w = ${binH(cDiv(z, w))}`);
    set("cx-arg", az < 1e-12 ? ct("ui.undefArg") : `Arg(${zS}) ${angOf(cArg(z), "rad").ex ? "=" : "≈"} ${angOf(cArg(z), "rad").s} ≈ ${fmtDeg(cArg(z) * 180 / Math.PI)}°`);
    set("cx-pprod", az * aw < 1e-12 ? "" : `${polH(z, cx.unit)} · ${polH(w, cx.unit)} = ${polH(cMul(z, w), cx.unit)}`);
    set("cx-moivre", `z${sup(n)} = (${zS})${sup(n)} = ${binH(cPow(z, n))}`);
    set("cx-roots", az < 1e-12 ? "" : `${sup(n)}√(${zS}): ${Array.from({ length: n }, (_, kk) => binH(cPol(az ** (1 / n), (cArg(z) + 2 * Math.PI * kk) / n))).join(" · ")}`);
    set("cx-exp", `e^(${zS}) = ${binH(cPol(Math.exp(z.re), z.im))}, |e^z| = e^${fT(z.re)} = ${fT(Math.exp(z.re))}`);
    set("cx-log", az < 1e-12 ? "log 0 ∄" : `Log(${zS}) = ${binH(Cx(Math.log(az), cArg(z)))}`);
  }

  function renderCX(from) {
    const info = drawCX();
    renderPanel(info);
    syncInputs(from);
    $("ops").querySelectorAll("[data-op]").forEach(b => b.setAttribute("aria-pressed", b.dataset.op === cx.op));
    $("nSeg").querySelectorAll("[data-n]").forEach(b => b.setAttribute("aria-pressed", +b.dataset.n === cx.n));
    vis($("wRow"), !!USESW[cx.op]); vis($("nRow"), cx.op === "pow" || cx.op === "root");
    liveCX();
  }
  function applyCX() {
    const only = CXLANG() !== lang;
    $("cxOnly").hidden = !only; $("cxOnly").textContent = nv("cxOnly");
    $("view-cx").lang = cxD() === CX.es ? "es" : "en";
    $("mBin").textContent = ct("ui.bin"); $("mPol").textContent = ct("ui.pol");
    $("cDeg").textContent = t("ui.deg"); $("cRad").textContent = t("ui.radians");
    $("cxEye").textContent = ct("ui.number"); $("cxOpT").textContent = ct("ui.op"); $("cxQuickT").textContent = ct("ui.quick");
    $("cxResT").textContent = ct("ui.result"); $("cxFormsT").textContent = ct("ui.forms");
    $("legend3").innerHTML = [["--c-z", "z"], ["--c-w", "w"], ["--c-r", ct("ui.legR")], ["--c-re", "Re(z) = a"], ["--c-im", "Im(z) = b"]].map(([c, l]) => `<span style="--sw:var(${c})"><i></i>${l}</span>`).join("");
    buildOps(); buildQuick(); labelsCX(); renderGuide3(); renderCX();
  }
