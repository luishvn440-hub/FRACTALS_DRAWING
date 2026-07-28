const PAL = {
  purple: '#a78bfa',
  teal:   '#2dd4bf',
  coral:  '#fb7185',
  blue:   '#60a5fa',
  amber:  '#fbbf24',
};

const META = {
  'koch-snowflake':       { name: 'Koch snowflake',         max: 6,  desc: 'Infinite perimeter, finite area. Triangular bumps on each edge, recursive.' },
  'anti-snowflake':       { name: 'Anti-snowflake',         max: 6,  desc: 'Bumps fold inward instead of outward — star-like fractal cavity.' },
  'koch-curve':           { name: 'Koch curve',             max: 6,  desc: 'Single Koch segment; 4 sub-segments per iteration at 1/3 scale.' },
  'dragon':               { name: 'Dragon curve',           max: 15, desc: 'Paper-folding sequence; non-self-intersecting, tiles the plane.' },
  'gosper':               { name: 'Gosper / flowsnake',     max: 5,  desc: 'Hexagonal L-system; 7 copies nest into one larger region per step.' },
  'hilbert':              { name: 'Hilbert curve',          max: 7,  desc: 'Space-filling; maps a 1-D line onto 2-D plane preserving locality.' },
  'peano':                { name: 'Peano curve',            max: 5,  desc: 'First space-filling curve (1890); each segment becomes 9 sub-segments.' },
  'sierpinski':           { name: 'Sierpiński triangle',    max: 7,  desc: 'L-system revealing self-similar triangular holes at each iteration.' },
  'sierpinski-arrowhead': { name: 'Sierpiński arrowhead',   max: 7,  desc: "Curve version of Sierpiński's triangle; orientation flips each step." },
  'levy':                 { name: 'Lévy C curve',           max: 16, desc: 'Two segments at 45° replace each one; converges to a self-similar shape.' },
};

const VW = 700, VH = 500, PAD = 28;

/* ── Koch ────────────────────────────────── */
function kochSeg(p1, p2, d, inv) {
  if (d === 0) return [p1, p2];
  const dx = p2.x - p1.x, dy = p2.y - p1.y;
  const a  = { x: p1.x + dx / 3,     y: p1.y + dy / 3 };
  const b  = { x: p1.x + 2 * dx / 3, y: p1.y + 2 * dy / 3 };
  const s  = inv ? -1 : 1;
  const pk = {
    x: a.x + (dx / 3) * Math.cos(s * Math.PI / 3) - (dy / 3) * Math.sin(s * Math.PI / 3),
    y: a.y + (dx / 3) * Math.sin(s * Math.PI / 3) + (dy / 3) * Math.cos(s * Math.PI / 3),
  };
  return [
    ...kochSeg(p1, a,  d-1, inv).slice(0,-1),
    ...kochSeg(a,  pk, d-1, inv).slice(0,-1),
    ...kochSeg(pk, b,  d-1, inv).slice(0,-1),
    ...kochSeg(b,  p2, d-1, inv),
  ];
}
function kochFlake(d, inv) {
  const cx = VW/2, cy = VH/2, R = 170;
  const c = [0,1,2].map(i => ({
    x: cx + R * Math.cos(Math.PI/2 + i * 2*Math.PI/3),
    y: cy - R * Math.sin(Math.PI/2 + i * 2*Math.PI/3),
  }));
  let all = [];
  [[c[0],c[1]],[c[1],c[2]],[c[2],c[0]]].forEach((s, i, a) => {
    const seg = kochSeg(s[0], s[1], d, inv);
    all = all.concat(i < a.length - 1 ? seg.slice(0,-1) : seg);
  });
  return { pts: all, closed: true };
}
function kochCurve(d) {
  const cx = VW/2, cy = VH/2 + 30, R = 240;
  return { pts: kochSeg({x:cx-R,y:cy}, {x:cx+R,y:cy}, d, false), closed: false };
}

/* ── Dragon ──────────────────────────────── */
function dragonCurve(d) {
  let t = [1];
  for (let i = 1; i < d; i++) {
    const c = [...t]; t.push(1);
    for (let j = c.length-1; j >= 0; j--) t.push(c[j]===1 ? 0 : 1);
  }
  const dirs = [[1,0],[0,1],[-1,0],[0,-1]];
  let dir = 0, x = 0, y = 0;
  const pts = [{x, y}];
  for (const v of t) {
    dir = (dir + (v===1 ? 1 : 3)) % 4;
    x += dirs[dir][0]; y += dirs[dir][1];
    pts.push({x, y});
  }
  return { pts, closed: false };
}

/* ── Gosper ──────────────────────────────── */
function gosperCurve(d) {
  const rules = { A:'A-B--B+A++AA+B-', B:'+A-BB--B-A++A+B' };
  let s = 'A';
  for (let i = 0; i < d; i++) { let n=''; for (const ch of s) n += rules[ch]||ch; s=n; }
  const D = Math.PI/3; let x=0, y=0, a=0;
  const pts = [{x,y}];
  for (const ch of s) {
    if (ch==='A'||ch==='B') { x+=10*Math.cos(a); y+=10*Math.sin(a); pts.push({x,y}); }
    else if (ch==='+') a-=D; else if (ch==='-') a+=D;
  }
  return { pts, closed: false };
}

/* ── Hilbert ─────────────────────────────── */
function hilbertCurve(d) {
  const rules = { A:'+BF-AFA-FB+', B:'-AF+BFB+FA-' };
  let s = 'A';
  for (let i = 0; i < d; i++) { let n=''; for (const ch of s) n += rules[ch]||ch; s=n; }
  const D = Math.PI/2; let x=0, y=0, a=0;
  const pts = [{x,y}];
  for (const ch of s) {
    if (ch==='F') { x+=10*Math.cos(a); y+=10*Math.sin(a); pts.push({x,y}); }
    else if (ch==='+') a+=D; else if (ch==='-') a-=D;
  }
  return { pts, closed: false };
}

/* ── Sierpiński Triangle ─────────────────── */
function sierpTriangle(d) {
  const rules = { F:'F-G+F+G-F', G:'GG' };
  let s = 'F-G-G';
  for (let i = 0; i < d; i++) { let n=''; for (const ch of s) n += rules[ch]||ch; s=n; }
  const D = 2*Math.PI/3; let x=0, y=0, a=0;
  const pts = [{x,y}];
  for (const ch of s) {
    if (ch==='F'||ch==='G') { x+=10*Math.cos(a); y+=10*Math.sin(a); pts.push({x,y}); }
    else if (ch==='+') a+=D; else if (ch==='-') a-=D;
  }
  return { pts, closed: false };
}

/* ── Sierpiński Arrowhead ────────────────── */
function sierpArrowhead(d) {
  const rules = { A:'B-A-B', B:'A+B+A' };
  let s = 'A';
  for (let i = 0; i < d; i++) { let n=''; for (const ch of s) n += rules[ch]||ch; s=n; }
  const D = Math.PI/3; let x=0, y=0, a = d%2===0 ? 0 : D;
  const pts = [{x,y}];
  for (const ch of s) {
    if (ch==='A'||ch==='B') { x+=10*Math.cos(a); y+=10*Math.sin(a); pts.push({x,y}); }
    else if (ch==='+') a+=D; else if (ch==='-') a-=D;
  }
  return { pts, closed: false };
}

/* ── Lévy C ──────────────────────────────── */
function levyCurve(d) {
  let segs = [{x1:0,y1:0,x2:1,y2:0}];
  for (let i = 0; i < d; i++) {
    const nxt = [];
    for (const s of segs) {
      const mx=(s.x1+s.x2)/2, my=(s.y1+s.y2)/2;
      const dx=(s.x2-s.x1)/2, dy=(s.y2-s.y1)/2;
      const px=mx-dy, py=my+dx;
      nxt.push({x1:s.x1,y1:s.y1,x2:px,y2:py}, {x1:px,y1:py,x2:s.x2,y2:s.y2});
    }
    segs = nxt;
  }
  const pts = [{x:segs[0].x1, y:segs[0].y1}];
  for (const s of segs) pts.push({x:s.x2, y:s.y2});
  return { pts, closed: false };
}

/* ── Peano ───────────────────────────────── */
function peanoCurve(d) {
  const rules = { L:'LFRFL+F+RFLFR-F-LFRFL', R:'RFLFR+F+LFRFL-F-RFLFR' };
  let s = 'L';
  for (let i = 0; i < d; i++) { let n=''; for (const ch of s) n += rules[ch]||ch; s=n; }
  const D = Math.PI/2; let x=0, y=0, a=0;
  const pts = [{x,y}];
  for (const ch of s) {
    if (ch==='F') { x+=10*Math.cos(a); y+=10*Math.sin(a); pts.push({x,y}); }
    else if (ch==='+') a+=D; else if (ch==='-') a-=D;
  }
  return { pts, closed: false };
}

/* ── Dispatch ────────────────────────────── */
function getFractal(id, d) {
  switch (id) {
    case 'koch-snowflake':       return kochFlake(d, false);
    case 'anti-snowflake':       return kochFlake(d, true);
    case 'koch-curve':           return kochCurve(d);
    case 'dragon':               return dragonCurve(d);
    case 'gosper':               return gosperCurve(d);
    case 'hilbert':              return hilbertCurve(d);
    case 'peano':                return peanoCurve(d);
    case 'sierpinski':           return sierpTriangle(d);
    case 'sierpinski-arrowhead': return sierpArrowhead(d);
    case 'levy':                 return levyCurve(d);
    default:                     return kochFlake(d, false);
  }
}

/* ── Fit & render ────────────────────────── */
function fitPts(pts) {
  const xs = pts.map(p => p.x), ys = pts.map(p => p.y);
  const mnX = Math.min(...xs), mxX = Math.max(...xs);
  const mnY = Math.min(...ys), mxY = Math.max(...ys);
  const sc  = Math.min((VW - PAD*2)/(mxX-mnX||1), (VH - PAD*2)/(mxY-mnY||1));
  const ox  = (VW - (mxX-mnX)*sc)/2 - mnX*sc;
  const oy  = (VH - (mxY-mnY)*sc)/2 - mnY*sc;
  return pts.map(p => ({ x: +(p.x*sc+ox).toFixed(2), y: +(p.y*sc+oy).toFixed(2) }));
}

function hslC(i, t) { return `hsl(${Math.round(i/t*360)},72%,58%)`; }

let currentSVG = '';

function draw() {
  const id      = document.getElementById('fractal').value;
  const meta    = META[id];
  const depthEl = document.getElementById('depth');
  depthEl.max   = meta.max;
  const depth   = Math.min(+depthEl.value, meta.max);
  depthEl.value = depth;
  const scheme  = document.getElementById('scheme').value;
  const sw      = +document.getElementById('sw').value;
  const rain    = document.getElementById('rainbow').value === 'on';

  document.getElementById('dv').textContent   = depth;
  document.getElementById('swv').textContent  = sw;
  document.getElementById('iname').textContent = meta.name;
  document.getElementById('idesc').textContent = meta.desc;

  const color = PAL[scheme];
  const { pts, closed } = getFractal(id, depth);
  const mp = fitPts(pts);
  document.getElementById('sc').textContent = (pts.length - 1).toLocaleString() + ' segments';

  let content = '';
  if (rain) {
    const seg = mp.length - 1;
    for (let i = 0; i < seg; i++)
      content += `<line x1="${mp[i].x}" y1="${mp[i].y}" x2="${mp[i+1].x}" y2="${mp[i+1].y}" stroke="${hslC(i,seg)}" stroke-width="${sw}" stroke-linecap="round"/>`;
  } else {
    let d = `M${mp[0].x},${mp[0].y}`;
    for (let i = 1; i < mp.length; i++) d += ` L${mp[i].x},${mp[i].y}`;
    if (closed) d += ' Z';
    content = `<path d="${d}" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/>`;
  }

  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${VW} ${VH}">` +
    `<rect width="${VW}" height="${VH}" fill="#0d0f14"/>` +
    content +
    `</svg>`;
  currentSVG = svg;
  document.getElementById('wrap').innerHTML = svg;
}

function downloadSVG() {
  const id   = document.getElementById('fractal').value;
  const blob = new Blob([currentSVG], { type: 'image/svg+xml' });
  const a    = document.createElement('a');
  a.href     = URL.createObjectURL(blob);
  a.download = id + '-fractal.svg';
  a.click();
}

['fractal','depth','scheme','sw','rainbow'].forEach(id => {
  document.getElementById(id).addEventListener('input',  draw);
  document.getElementById(id).addEventListener('change', draw);
});

draw();
