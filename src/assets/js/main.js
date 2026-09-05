import '../css/main.css';
import Alpine from 'alpinejs';
import { registerAlpineComponents } from './alpine-components.js';
import { initScrollAnimations } from './scroll-animations.js';

// Setup Alpine.js
window.Alpine = Alpine;
registerAlpineComponents();
Alpine.start();

// Setup 3D Card Tilt Interactions
function init3DCardTilt() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      // Calculate rotation (-7deg to +7deg)
      const rotateX = ((y - centerY) / centerY) * -7;
      const rotateY = ((x - centerX) / centerX) * 7;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });
}

// Cart button pulse feedback
window.addEventListener('cart-item-added', () => {
  const cartBtn = document.getElementById('header-cart-btn');
  if (cartBtn) {
    cartBtn.classList.add('scale-125', 'ring-4', 'ring-teal-400');
    setTimeout(() => {
      cartBtn.classList.remove('scale-125', 'ring-4', 'ring-teal-400');
    }, 400);
  }
});

// Lazy-load Three.js Hero Scene after first paint (prioritizing LCP)
function loadHeroSceneWhenReady() {
  const heroContainer = document.getElementById('hero-3d-container');
  if (!heroContainer) return;

  const loadScene = () => {
    import('./scene-hero.js')
      .then(module => {
        module.initHeroScene();
      })
      .catch(err => {
        console.warn('[Rioiz] Failed to load 3D scene module:', err);
      });
  };

  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(loadScene, { timeout: 1500 });
  } else {
    setTimeout(loadScene, 80);
  }
}

// Instant Pre-fetch & Seamless SPA Menu Navigation (Zero FOUC, Zero Page-Reload Flicker)
function initInstantNav() {
  const cache = new Map();

  async function fetchPage(url) {
    const cleanUrl = url.split('#')[0];
    if (cache.has(cleanUrl)) return cache.get(cleanUrl);
    try {
      const res = await fetch(cleanUrl);
      if (!res.ok) return null;
      const html = await res.text();
      cache.set(cleanUrl, html);
      return html;
    } catch {
      return null;
    }
  }

  function prefetch(url) {
    const cleanUrl = url.split('#')[0];
    const currentClean = window.location.href.split('#')[0];
    if (cache.has(cleanUrl) || cleanUrl === currentClean) return;
    fetchPage(cleanUrl);
  }

  // Hover & touch prefetch on links
  document.addEventListener('mouseover', (e) => {
    const a = e.target.closest('a');
    if (a && a.href && a.origin === window.location.origin && !a.hasAttribute('download') && a.target !== '_blank') {
      prefetch(a.href);
    }
  }, { passive: true });

  document.addEventListener('touchstart', (e) => {
    const a = e.target.closest('a');
    if (a && a.href && a.origin === window.location.origin && !a.hasAttribute('download') && a.target !== '_blank') {
      prefetch(a.href);
    }
  }, { passive: true });

  let isNavigating = false;

  async function navigateTo(url, pushState = true) {
    if (isNavigating) return;
    const targetUrl = new URL(url, window.location.origin);
    const cleanTarget = targetUrl.href.split('#')[0];
    const cleanCurrent = window.location.href.split('#')[0];

    // If same page with hash anchor, scroll smoothly
    if (cleanTarget === cleanCurrent) {
      if (targetUrl.hash) {
        const targetEl = document.querySelector(targetUrl.hash);
        if (targetEl) targetEl.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    isNavigating = true;

    const currentMain = document.getElementById('main-content');
    if (currentMain) {
      currentMain.classList.add('page-fade-out');
    }

    const html = await fetchPage(cleanTarget);
    if (!html) {
      isNavigating = false;
      window.location.href = url;
      return;
    }

    const doc = new DOMParser().parseFromString(html, 'text/html');
    const newMain = doc.getElementById('main-content');
    if (!newMain) {
      isNavigating = false;
      window.location.href = url;
      return;
    }

    // Update document title
    if (doc.title) {
      document.title = doc.title;
    }

    // Update browser history
    if (pushState) {
      window.history.pushState({}, '', url);
    }

    // Swap content seamlessly
    if (currentMain && currentMain.parentNode) {
      newMain.classList.add('page-fade-in');
      currentMain.parentNode.replaceChild(newMain, currentMain);
    }

    // Close open drawers in Alpine stores
    if (window.Alpine && window.Alpine.store) {
      try {
        const cart = window.Alpine.store('cart');
        if (cart && cart.isOpen) cart.close();
        const nav = window.Alpine.store('nav');
        if (nav && nav.mobileOpen) nav.mobileOpen = false;
      } catch (err) {
        // Safe store access
      }
    }

    // Handle scroll position
    if (targetUrl.hash) {
      const targetEl = document.querySelector(targetUrl.hash);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }

    // Re-bind interactive behaviors on the newly swapped DOM tree
    init3DCardTilt();
    initScrollAnimations();
    loadHeroSceneWhenReady();

    isNavigating = false;
  }

  // Click interceptor for instant seamless navigation
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a');
    if (!a || !a.href || a.target === '_blank' || a.hasAttribute('download')) return;
    if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
    
    const hrefAttr = a.getAttribute('href') || '';
    if (hrefAttr.startsWith('mailto:') || hrefAttr.startsWith('tel:') || hrefAttr.startsWith('javascript:')) return;
    if (hrefAttr.startsWith('#')) return; // In-page jump

    const url = new URL(a.href, window.location.origin);
    if (url.origin !== window.location.origin) return; // External link

    e.preventDefault();
    navigateTo(a.href);
  });

  // Handle browser Back / Forward buttons
  window.addEventListener('popstate', () => {
    navigateTo(window.location.href, false);
  });
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  init3DCardTilt();
  initScrollAnimations();
  loadHeroSceneWhenReady();
  initInstantNav();
});
