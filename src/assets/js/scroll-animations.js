import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initScrollAnimations() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    // Reveal all elements immediately
    document.querySelectorAll('.reveal-on-scroll').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    return;
  }

  // 1. Sticky / Glass Nav Scroll Shift
  const header = document.querySelector('header');
  if (header) {
    ScrollTrigger.create({
      start: 'top -50',
      end: 99999,
      toggleClass: {
        className: 'shadow-2xl shadow-black/40 border-b border-slate-800/80 bg-slate-950/90',
        targets: header
      }
    });
  }

  // 2. Pinned 3-Step "How it works" Process Journey
  const processSection = document.getElementById('pinned-process-section');
  if (processSection) {
    const steps = processSection.querySelectorAll('.process-step-item');
    const previews = processSection.querySelectorAll('.process-preview-item');
    const progressBar = processSection.querySelector('.process-progress-bar');

    if (steps.length > 0 && previews.length > 0) {
      // Create pinned timeline
      const processTL = gsap.timeline({
        scrollTrigger: {
          trigger: processSection,
          start: 'top top',
          end: '+=2000',
          pin: true,
          scrub: 0.6,
          anticipatePin: 1
        }
      });

      // Step transitions
      steps.forEach((step, idx) => {
        if (idx === 0) return; // First step starts active

        const prevIdx = idx - 1;
        const targetPercent = ((idx) / (steps.length - 1)) * 100;

        processTL
          // Dim previous step
          .to(steps[prevIdx], { opacity: 0.4, scale: 0.98, duration: 0.4 }, `step-${idx}`)
          // Fade out previous preview
          .to(previews[prevIdx], { opacity: 0, y: -20, display: 'none', duration: 0.3 }, `step-${idx}`)
          // Light up current step
          .to(steps[idx], { opacity: 1, scale: 1.02, duration: 0.4 }, `step-${idx}`)
          // Reveal current preview
          .fromTo(previews[idx], 
            { opacity: 0, y: 30, display: 'none' }, 
            { opacity: 1, y: 0, display: 'block', duration: 0.4 }, 
            `step-${idx}`
          );

        if (progressBar) {
          processTL.to(progressBar, { height: `${targetPercent}%`, duration: 0.4 }, `step-${idx}`);
        }
      });
    }
  }

  // 3. Staggered Card Entrance Reveals
  const revealContainers = document.querySelectorAll('[data-stagger-cards]');
  revealContainers.forEach(container => {
    const cards = container.children;
    gsap.from(cards, {
      scrollTrigger: {
        trigger: container,
        start: 'top 82%',
        toggleActions: 'play none none none'
      },
      y: 40,
      opacity: 0,
      duration: 0.8,
      stagger: 0.12,
      ease: 'power2.out'
    });
  });

  // 4. Individual Reveal Elements
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  revealElements.forEach(el => {
    gsap.from(el, {
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      y: 30,
      opacity: 0,
      duration: 0.7,
      ease: 'power2.out'
    });
  });

  // 5. Parallax Background Mesh Shift
  const parallaxMeshes = document.querySelectorAll('.parallax-mesh');
  parallaxMeshes.forEach(mesh => {
    gsap.to(mesh, {
      scrollTrigger: {
        trigger: mesh.parentElement || mesh,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
      },
      y: -60,
      ease: 'none'
    });
  });
}
