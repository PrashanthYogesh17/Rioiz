# Rioiz Worksuite — 3D Animated UI Rebuild

A high-performance, animated, 3D-interactive, front-end-only B2B SaaS marketing and procurement platform for **Rioiz Worksuite** (ERP, CRM, HRMS, Inventory, Billing).

Engineered from day one with **strict Laravel Blade portability**: plain HTML5 partials, Tailwind CSS, Three.js, GSAP ScrollTrigger, and Alpine.js.

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Run local development server (with HMR & partial compilation)
npm run dev

# 3. Build optimized production bundle
npm run build

# 4. Preview production build locally
npm run preview
```

Open `http://localhost:5173` in your browser.

---

## 📁 Folder Structure

```
Rioiz/
├── package.json
├── vite.config.js              # Blade-compatible partial include plugin & multi-page config
├── tailwind.config.js          # Custom Rioiz color system, glows, and animations
├── postcss.config.js
├── README.md
├── index.html                  # Root entry redirect
└── src/
    ├── partials/               # 1:1 Portable Blade partials
    │   ├── header.html         # Main navbar, announcement, cart trigger, mobile menu
    │   ├── nav.html            # Navigation links & mega dropdown
    │   ├── footer.html         # 5-column semantic footer & system status indicator
    │   ├── cookie-banner.html  # GDPR / Privacy banner with Alpine toggle
    │   ├── hero.html           # 3D canvas, HUD overlay, and accessible fallbacks
    │   ├── process-steps.html  # Pinned GSAP ScrollTrigger 3-step journey
    │   ├── product-card.html   # Interactive 3D CSS tilt product cards
    │   ├── pricing-card.html   # Tier cards with animated monthly/annual switch
    │   ├── pricing-table.html  # Semantic feature comparison matrix table
    │   ├── testimonial-card.html # Enterprise social proof cards
    │   ├── cta-band.html       # High-impact conversion rollout banner
    │   ├── newsletter-form.html# Simulated newsletter subscription with UI states
    │   └── trust-strip.html    # SOC-2, visible entitlements, and modularity strip
    ├── pages/                  # 12 Complete Pages
    │   ├── index.html          # 1. Home
    │   ├── products-hub.html   # 2. Products Hub (Filterable catalog)
    │   ├── product-detail.html # 3. Product Detail (Rioiz ERP flagship deep-dive)
    │   ├── pricing.html        # 4. Comprehensive Pricing & Full Matrix
    │   ├── about.html          # 5. Architecture, Mission & SOC-2 Governance
    │   ├── contact.html        # 6. Contact & Solutions Inquiries
    │   ├── faq.html            # 7. Searchable FAQ Accordion Directory
    │   ├── blog-list.html      # 8. Engineering Blog Directory
    │   ├── blog-post.html      # 9. In-Depth Architecture Article
    │   ├── login.html          # 10. Workspace Sign-In & SSO Mock
    │   ├── register.html       # 11. 3-Step Sandbox Provisioning Wizard
    │   └── knowledge-base.html # 12. Documentation Hub with Sticky Nav
    └── assets/
        ├── css/
        │   └── main.css        # Tailwind directives, glassmorphism, 3D tilt styles
        └── js/
            ├── main.js         # Master bootstrap & lazy loader
            ├── scene-hero.js   # Three.js 5-node interconnected suite graph
            ├── scroll-animations.js # GSAP ScrollTrigger pinned sections & reveals
            └── alpine-components.js # Cart drawer, pricing state, forms & accordions
```

---

## 🔄 How Partials Map to Laravel Blade Views

The templating architecture mirrors Laravel's `@include` directive identically.

In Vite, our custom plugin in `vite.config.js` resolves:
```html
@include('partials.header')
@include('partials.product-card')
@include('partials.footer')
```

### Converting to Laravel Blade (Trivial 3-Step Process):
1. **Copy Partials**: Copy `/src/partials/*.html` directly into your Laravel project at `resources/views/partials/` and rename the extension from `.html` to `.blade.php` (e.g. `header.blade.php`).
2. **Copy Pages**: Copy `/src/pages/*.html` into `resources/views/` (e.g. `index.blade.php`, `pricing.blade.php`). The `@include('partials.xxx')` directives inside them **require zero modification** as Blade already recognizes this exact syntax natively!
3. **Swap Mock State for Blade Variables**:
   - Replace hardcoded card lists with Blade `@foreach($products as $product)` loops.
   - Replace static price values with `{{ $product->price }}` or `{{ config('pricing.starter') }}`.
   - The Alpine.js stores (`$store.cart`, `$store.nav`) and GSAP animations work 100% untouched inside Blade templates.

---

## 🎨 Three.js 3D Hero Scene (`scene-hero.js`)

The hero section features a Three.js WebGL visualization representing Rioiz's interconnected architecture:
- **5 Abstract Module Nodes**:
  - **ERP** (`#4f46e5`, Indigo)
  - **CRM** (`#10b981`, Emerald)
  - **HRMS** (`#f59e0b`, Amber)
  - **Inventory** (`#8b5cf6`, Violet)
  - **Billing** (`#06b6d4`, Cyan)
- **Central Core Hub**: The Rioiz Synapse Core with rotating wireframe geometry.
- **Dynamic Connection Curves**: Smooth quadratic bezier splines with animated glowing particle packets transmitting between modules.
- **Raycasting & DOM HUD Synchronization**: Hovering or clicking any node in the 3D space scales the node, accelerates particles, and updates an accessible HTML DOM card (`#hero-module-hud`) displaying real metrics, capabilities, and links.
- **Lazy Loading**: Loaded asynchronously after critical DOM elements render to ensure LCP < 2.5s.

### How to Swap Assets or Load a `.glb` Model:
In `src/assets/js/scene-hero.js`, import Three.js's `GLTFLoader`:
```javascript
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const loader = new GLTFLoader();
loader.load('/src/assets/models/custom-network.glb', (gltf) => {
  scene.add(gltf.scene);
});
```

---

## ⚡ Disabling 3D / "Lite Mode" Flag

To disable the 3D WebGL scene entirely and enforce the animated CSS/SVG fallback, define the global flag before scripts load:

```html
<script>
  window.RIOIZ_CONFIG = {
    disable3D: true // Set to true for low-bandwidth or lite deployments
  };
</script>
```

### Automatic Fallback Triggers:
The 3D scene automatically shuts off and displays the CSS fallback when:
1. `window.RIOIZ_CONFIG.disable3D === true`
2. `prefers-reduced-motion: reduce` is active in the user's OS
3. `navigator.hardwareConcurrency < 4` or `navigator.deviceMemory < 4` (low-end mobile/laptop)
4. WebGL context cannot be created

---

## ♿ Accessibility & Standards

- **Semantic HTML**: Fully structured `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, and `<footer>` landmarks.
- **Accessible Comparison Matrix**: Pricing table uses real `<table>` with `scope="col"` and `scope="row"`.
- **Keyboard Navigable**: Visible `focus-visible:ring-2` outlines across all buttons, inputs, and links.
- **WCAG AA Contrast**: High-contrast text on dark surfaces with clear hierarchy.
- **Safe Fallbacks**: Zero critical content or navigation is trapped inside the canvas.

---

## 🛡️ Functional Inertia & Mock States

All interactive forms and buttons simulate realistic SaaS behavior without external APIs:
- **Workspace Cart Drawer**: Slide-out panel lets users select and combine modules with live subtotal calculation and simulated tenant sandbox checkout.
- **Contact Form**: Intercepts `submit`, renders an animated spinner, and reveals an accessible confirmation state.
- **Sign In & Registration Wizard**: 3-step interactive onboarding flow with instant mock workspace generation.
- **Searchable FAQ**: Live real-time string filtering powered by Alpine.js.
