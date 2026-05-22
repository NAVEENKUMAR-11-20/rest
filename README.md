# 🔥 Ember & Ash — Fine Dining Restaurant Website

A visually stunning, fully responsive restaurant website built with pure **HTML**, **CSS**, and **Vanilla JavaScript** — no frameworks, no dependencies.

---

## 📁 File Structure

```
restaurant/
├── index.html      ← Full page markup (semantic HTML5)
├── style.css       ← All styles (CSS custom properties, animations, responsive)
├── script.js       ← All interactions & animations (Vanilla JS)
└── README.md       ← This file
```

---

## ✨ Features

### Design
- **Dark luxury theme** — deep blacks, ember orange `#c4622d`, antique gold `#d4a853`, cream `#f0ebe2`
- **Typography** — Cormorant Garamond (serif headings) + Jost (sans-serif body) via Google Fonts
- **Editorial layout** — asymmetric, magazine-style sections

### UI/UX Highlights
| Feature | Implementation |
|---|---|
| Custom cursor | Dot + lagging ring with hover reactions |
| Frosted glass navbar | `backdrop-filter` + scroll class toggle |
| Hero parallax | CSS `background-attachment: fixed` + JS mouse parallax |
| Marquee ticker | Pure CSS `@keyframes` infinite scroll, pauses on hover |
| Character reveal | JS text splitting + staggered CSS transitions |
| Counter animation | RAF-based easing with `IntersectionObserver` trigger |
| Menu tabs | Vanilla JS tab switching with re-triggered animations |
| Masonry gallery | CSS `columns` with hover caption reveal |
| Floating labels | CSS sibling selectors + JS for `<select>` |
| Form validation | Custom styled error messages, no library |
| Smooth scroll | Native `scrollTo` with navbar offset |
| Scroll reveal | `IntersectionObserver` with stagger delays |

### Sections
1. **Hero** — Full-viewport with parallax bg, animated headline, dual CTAs, marquee ticker
2. **About** — Split-screen layout with overlapping badge, pull-quote, animated counters
3. **Menu** — 4 tabbed categories × 3 cards each with hover-reveal images
4. **Chef** — Full-width feature with large name, bio, and signature
5. **Gallery** — 6-image CSS masonry grid, hover zoom + caption reveal
6. **Testimonials** — 3 review cards with quote icon and star ratings
7. **Reservation** — Fixed-bg dark form with floating labels and validation
8. **Contact + Footer** — Address/hours + Google Maps embed, social icons

---

## 🚀 Getting Started

### Option 1 — Open directly
Just double-click `index.html` in your file explorer. The site works with no build step.

### Option 2 — Local dev server (recommended for parallax + fonts)
Use **VS Code Live Server** extension or any static file server:

```bash
# Using Python (if installed)
python -m http.server 5500

# Using Node.js (npx)
npx serve .

# Using VS Code
# Right-click index.html → "Open with Live Server"
```

Then open `http://localhost:5500` in your browser.

> **Note:** Some effects (parallax `background-attachment: fixed`, Google Fonts) work best when served over HTTP rather than opened as a `file://` URL.

---

## 📱 Responsive Breakpoints

| Breakpoint | Layout |
|---|---|
| **1440px** (Desktop) | Full multi-column layouts |
| **1024px** (Tablet) | 2-col → 1-col transitions |
| **768px** (Mobile) | Hamburger menu, stacked sections, hidden custom cursor |
| **480px** (Small) | Single-column gallery, stacked buttons |

---

## ⚙️ Customization

### Colors — edit in `style.css` `:root`
```css
:root {
  --ember:  #c4622d;   /* primary brand colour */
  --gold:   #d4a853;   /* accent gold */
  --cream:  #f0ebe2;   /* text / light */
  --dark:   #0a0806;   /* page background */
}
```

### Restaurant Name / Content
Edit text directly in `index.html` — all content is semantic HTML, clearly commented by section.

### Images
All images use Unsplash URLs with the `loading="lazy"` attribute. Replace with your own:
```html
<img src="YOUR_IMAGE_URL" alt="Description" loading="lazy" />
```

### Menu Items
Find the `#menu` section in `index.html`. Each card follows this structure:
```html
<article class="menu-card reveal">
  <div class="menu-card-img-wrap">
    <img src="IMAGE_URL" alt="Dish name" loading="lazy" />
    <div class="menu-card-overlay"></div>
  </div>
  <div class="menu-card-body">
    <h3 class="menu-card-name">Dish Name</h3>
    <p class="menu-card-desc">Description text.</p>
    <div class="menu-card-footer">
      <span class="menu-card-price">$XX</span>
      <span class="menu-card-tag">Label</span>
    </div>
  </div>
</article>
```

### Reservation Form
The form currently simulates submission (1.4s delay + success message). To connect to a backend, replace the `setTimeout` block in `script.js` (section 11) with a `fetch()` call to your API.

---

## 🏗️ Technical Notes

- **Zero external dependencies** — no jQuery, no libraries
- **`IntersectionObserver`** for all scroll-triggered animations (performant, no scroll event listeners for animations)
- **`requestAnimationFrame`** for the cursor ring lag and counter animations
- **CSS `clip-path`** ready for diagonal section dividers (add `.clip-top` / `.clip-bottom` classes)
- **`prefers-reduced-motion`** respected — parallax and heavy animations disabled for accessibility
- **ARIA attributes** — roles, labels, and live regions for screen reader support
- **Lazy loading** on all images below the fold

---

## 📄 License

Free to use for personal and commercial projects. Attribution appreciated but not required.

---

*Crafted with passion & fire. — Ember & Ash, Est. 2012*
