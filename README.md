# FRACTALS_DRAWING
# 🌀 Fractal Curve Explorer
[fractals-index.html](https://github.com/user-attachments/files/30481980/fractals-index.html)
[fractals-script.js](https://github.com/user-attachments/files/30481982/fractals-script.js)[fractals-style.css](https://github.com/user-attachments/files/30481983/fractals-style.css)
An interactive web application 
to visualize and download **10 classic fractal curves** rendered in pure SVG — no external libraries, no dependencies, just HTML, CSS, and JavaScript.

---

## ✨ Live Demo

👉 [Open the Fractal Explorer](https://luishvn440-hub.github.io/FRACTALS_DRAWING/)

---

## 📐 Included Fractals

### Koch family
| Fractal | Description |
|--------|-------------|
| **Koch Snowflake** | Triangular bumps on each edge; infinite perimeter enclosing finite area |
| **Anti-Snowflake** | Bumps fold inward, producing a star-like fractal cavity |
| **Koch Curve** | Single Koch segment; 4 sub-segments per iteration at ⅓ scale |

### Space-filling curves
| Fractal | Description |
|--------|-------------|
| **Dragon Curve** | Paper-folding sequence; non-self-intersecting, tiles the plane |
| **Gosper Curve (Flowsnake)** | Hexagonal L-system; 7 copies nest into one larger region per step |
| **Hilbert Curve** | Maps a 1-D line onto 2-D space preserving locality |
| **Peano Curve** | First space-filling curve ever discovered (1890) |

### Sierpiński family
| Fractal | Description |
|--------|-------------|
| **Sierpiński Triangle** | L-system revealing self-similar triangular holes |
| **Sierpiński Arrowhead** | Curve version of the triangle; orientation flips each iteration |

### Other
| Fractal | Description |
|--------|-------------|
| **Lévy C Curve** | Two segments at 45° replace each one; converges to a self-similar shape |

---

## 🎛️ Features

- **10 fractal curves** selectable from a dropdown menu
- **Iterations slider** — control recursion depth per fractal (up to 16 for some)
- **5 color palettes** — Purple, Teal, Coral, Blue, Amber
- **Stroke width control** — from hairline to thick
- **Rainbow mode** — colors each segment by its position along the curve
- **SVG download** — exports exactly what is rendered, named after the selected fractal
- **Segment counter** — shows the exact number of segments drawn in real time
- **Zero dependencies** — pure HTML, CSS, and JavaScript; works offline

---

## 🗂️ Project Structure

```
fractal-curves/
├── index.html        ← Page structure and controls
├── style.css         ← Layout and visual styling
└── script.js         ← All fractal algorithms and SVG rendering
```

---

## 🚀 How to Run Locally

No installation needed. Just clone and open:

```bash
git clone https://github.com/your-username/fractal-curves.git
cd fractal-curves
open index.html
```

Or simply double-click `index.html` in your file explorer.

---

## 🧮 How It Works

Each fractal is generated with one of two techniques:

**Recursive geometry** (Koch family, Lévy, Dragon)
Each line segment is replaced by a set of smaller segments according to a geometric rule. The function calls itself until the desired iteration depth is reached.

**L-systems** (Gosper, Hilbert, Peano, Sierpiński)
A string of symbols is expanded by rewriting rules at each iteration. A virtual turtle then reads the string and draws: `F` = move forward, `+` = turn left, `-` = turn right. After expansion the resulting path is fitted and scaled to the SVG viewport.

All curves are auto-scaled and centered to fill the canvas regardless of iteration count.

---

## 🖼️ Algorithm Reference

| Fractal | Method | Angle | Max iterations |
|---------|--------|-------|----------------|
| Koch Snowflake | Recursive | 60° | 6 |
| Koch Curve | Recursive | 60° | 6 |
| Anti-Snowflake | Recursive | 60° | 6 |
| Dragon Curve | Fold sequence | 90° | 15 |
| Gosper Curve | L-system | 60° | 5 |
| Hilbert Curve | L-system | 90° | 7 |
| Peano Curve | L-system | 90° | 5 |
| Sierpiński Triangle | L-system | 120° | 7 |
| Sierpiński Arrowhead | L-system | 60° | 7 |
| Lévy C Curve | Recursive | 45° | 16 |

---

## 📄 License

MIT — free to use, modify, and share.

---

*Built with vanilla JavaScript and SVG. No frameworks, no build tools, no internet connection required.*
