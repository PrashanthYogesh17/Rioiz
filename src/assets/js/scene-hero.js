import * as THREE from 'three';

// Module metadata for the HUD overlay
export const MODULE_DATA = {
  erp: {
    id: 'erp',
    name: 'Rioiz ERP',
    tagline: 'Autonomous Financial & Ledger Core',
    color: '#14b8a6',
    colorRgb: [20, 184, 166],
    metrics: '99.98% ledger accuracy • Multi-entity support',
    capabilities: ['General Ledger & Multi-currency', 'Automated Bank Reconciliation', '3-Way PO Matching Engine'],
    link: '/product-detail.html'
  },
  crm: {
    id: 'crm',
    name: 'Rioiz CRM',
    tagline: 'Client Intelligence & Pipeline Engine',
    color: '#10b981',
    colorRgb: [16, 185, 129],
    metrics: '3.4x pipeline velocity • Realtime stock lock',
    capabilities: ['Dynamic Deal Pipelines', 'Contact 360 & Quotation Generator', 'Zero-Phantom Stock Reservation'],
    link: '/products-hub.html'
  },
  hrms: {
    id: 'hrms',
    name: 'Rioiz HRMS',
    tagline: 'Workforce & Statutory Payroll',
    color: '#f59e0b',
    colorRgb: [245, 158, 11],
    metrics: '1-click payroll • 100% PF/ESI compliant',
    capabilities: ['Statutory Tax Regime Auto-calc', 'Biometric & Geofenced Punching', 'Performance & Appraisal Cycles'],
    link: '/products-hub.html'
  },
  inventory: {
    id: 'inventory',
    name: 'Rioiz Inventory',
    tagline: 'Multi-Warehouse Stock & Fulfillment',
    color: '#8b5cf6',
    colorRgb: [139, 92, 246],
    metrics: '< 0.5s barcode scanning • Low stock alerts',
    capabilities: ['Batch & Serial Number Tracking', 'Multi-DC Stock Transfers', 'Automated Reorder Forecasting'],
    link: '/products-hub.html'
  },
  billing: {
    id: 'billing',
    name: 'Rioiz Billing',
    tagline: 'Government GST IRN & Subscriptions',
    color: '#06b6d4',
    colorRgb: [6, 182, 212],
    metrics: 'Sub-second IRN • Instant payment links',
    capabilities: ['Direct NIC Gateway API for IRN & QR', 'Usage-based & Recurring Billing', 'Unified Multi-Gateway Recon'],
    link: '/products-hub.html'
  }
};

export function initHeroScene() {
  const container = document.getElementById('hero-3d-container');
  const fallbackEl = document.getElementById('hero-3d-fallback');
  const hudEl = document.getElementById('hero-module-hud');

  if (!container) return;

  // 1. Progressive Enhancement & Hardware Capabilities Check
  const disable3D = window.RIOIZ_CONFIG?.disable3D === true;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isLowEndHardware = (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) ||
                           (navigator.deviceMemory && navigator.deviceMemory < 4);

  let hasWebGL = false;
  try {
    const testCanvas = document.createElement('canvas');
    hasWebGL = !!(window.WebGLRenderingContext && (testCanvas.getContext('webgl2') || testCanvas.getContext('webgl')));
  } catch (e) {
    hasWebGL = false;
  }

  if (disable3D || prefersReducedMotion || isLowEndHardware || !hasWebGL) {
    console.info('[Rioiz 3D] Using progressive fallback.');
    if (fallbackEl) fallbackEl.classList.remove('hidden');
    if (container) container.classList.add('hidden');
    return;
  }

  if (fallbackEl) fallbackEl.classList.add('hidden');
  container.classList.remove('hidden');

  // Clean up any existing canvas in container before mounting
  if (container.querySelector('canvas')) {
    container.innerHTML = '';
  }

  // 2. Scene, Camera, Renderer Setup
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1,
    100
  );
  camera.position.set(0, 0, 9.2);

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.3;
  container.appendChild(renderer.domElement);

  // 3. Lighting Setup with Signature Rioiz Teal & Rim Light
  const ambientLight = new THREE.AmbientLight(0x060810, 3.0);
  scene.add(ambientLight);

  const keyLight = new THREE.DirectionalLight(0x2dd4bf, 2.8);
  keyLight.position.set(5, 8, 6);
  scene.add(keyLight);

  const tealPointLight = new THREE.PointLight(0x14b8a6, 4.0, 15);
  tealPointLight.position.set(0, 0, 1.5);
  scene.add(tealPointLight);

  const rimLight = new THREE.DirectionalLight(0x38bdf8, 2.5);
  rimLight.position.set(-6, -4, -4);
  scene.add(rimLight);

  // 4. Central Hub (Rioiz Core Synapse)
  const coreGroup = new THREE.Group();
  scene.add(coreGroup);

  const coreGeometry = new THREE.IcosahedronGeometry(0.9, 2);
  const coreMaterial = new THREE.MeshStandardMaterial({
    color: 0x042f2e,
    emissive: 0x0f766e,
    emissiveIntensity: 1.1,
    roughness: 0.15,
    metalness: 0.9,
    wireframe: false
  });
  const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
  coreGroup.add(coreMesh);

  // Outer wireframe cage for core
  const coreWireGeo = new THREE.IcosahedronGeometry(1.15, 1);
  const coreWireMat = new THREE.MeshBasicMaterial({
    color: 0x2dd4bf,
    wireframe: true,
    transparent: true,
    opacity: 0.45
  });
  const coreWireMesh = new THREE.Mesh(coreWireGeo, coreWireMat);
  coreGroup.add(coreWireMesh);

  // Orbiting Synapse Ring
  const coreRingGeo = new THREE.TorusGeometry(1.6, 0.018, 12, 64);
  const coreRingMat = new THREE.MeshBasicMaterial({
    color: 0x14b8a6,
    transparent: true,
    opacity: 0.5
  });
  const coreRingMesh = new THREE.Mesh(coreRingGeo, coreRingMat);
  coreRingMesh.rotation.x = Math.PI / 3;
  coreGroup.add(coreRingMesh);

  // 5. Build the 5 Module Nodes with Signature Colors
  const nodeDefs = [
    { key: 'erp', pos: new THREE.Vector3(-2.8, 1.1, 0.5), color: 0x0f766e, emissive: 0x2dd4bf },
    { key: 'crm', pos: new THREE.Vector3(2.6, 1.3, -0.2), color: 0x059669, emissive: 0x34d399 },
    { key: 'hrms', pos: new THREE.Vector3(2.2, -1.6, 0.6), color: 0xd97706, emissive: 0xfbbf24 },
    { key: 'inventory', pos: new THREE.Vector3(-2.3, -1.5, -0.5), color: 0x7c3aed, emissive: 0xa78bfa },
    { key: 'billing', pos: new THREE.Vector3(0.1, 2.7, 0.7), color: 0x0284c7, emissive: 0x38bdf8 }
  ];

  const nodeMeshes = [];
  const nodeObjects = {};
  const connectionCurves = [];
  const particlePackets = [];

  nodeDefs.forEach(def => {
    const group = new THREE.Group();
    group.position.copy(def.pos);
    group.userData = {
      key: def.key,
      originalPos: def.pos.clone(),
      originalScale: 1.0,
      targetScale: 1.0,
      meta: MODULE_DATA[def.key]
    };

    // Inner glowing sphere
    const nodeGeo = new THREE.DodecahedronGeometry(0.55, 1);
    const nodeMat = new THREE.MeshStandardMaterial({
      color: def.color,
      emissive: def.emissive,
      emissiveIntensity: 0.85,
      roughness: 0.15,
      metalness: 0.75
    });
    const mesh = new THREE.Mesh(nodeGeo, nodeMat);
    mesh.userData = { parentGroup: group, key: def.key };
    group.add(mesh);

    // Orbiting wireframe halo ring
    const haloGeo = new THREE.TorusGeometry(0.78, 0.02, 8, 36);
    const haloMat = new THREE.MeshBasicMaterial({
      color: def.emissive,
      transparent: true,
      opacity: 0.75
    });
    const haloMesh = new THREE.Mesh(haloGeo, haloMat);
    haloMesh.rotation.x = Math.PI / 2.4;
    group.add(haloMesh);
    group.userData.haloMesh = haloMesh;

    scene.add(group);
    nodeMeshes.push(mesh);
    nodeObjects[def.key] = group;

    // Connect Node to Core Hub via smooth Bezier curve
    const midPoint = new THREE.Vector3(
      def.pos.x * 0.5,
      def.pos.y * 0.5 + 0.25,
      def.pos.z * 0.5 + 0.35
    );
    const curve = new THREE.QuadraticBezierCurve3(def.pos, midPoint, new THREE.Vector3(0, 0, 0));
    connectionCurves.push({ curve, color: def.emissive });

    // Render glowing laser curve
    const points = curve.getPoints(36);
    const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
    const lineMat = new THREE.LineBasicMaterial({
      color: def.emissive,
      transparent: true,
      opacity: 0.45,
      linewidth: 1.5
    });
    const lineMesh = new THREE.Line(lineGeo, lineMat);
    scene.add(lineMesh);

    // Create 3 animated photon particle packets travelling along this curve
    for (let p = 0; p < 3; p++) {
      const pGeo = new THREE.SphereGeometry(0.045, 6, 6);
      const pMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.95
      });
      const pMesh = new THREE.Mesh(pGeo, pMat);
      scene.add(pMesh);
      particlePackets.push({
        mesh: pMesh,
        curve: curve,
        progress: (p / 3) + Math.random() * 0.1,
        speed: 0.004 + Math.random() * 0.002
      });
    }
  });

  // Connect peripheral neighbors in constellation ring
  for (let i = 0; i < nodeDefs.length; i++) {
    const nextIdx = (i + 1) % nodeDefs.length;
    const p1 = nodeDefs[i].pos;
    const p2 = nodeDefs[nextIdx].pos;
    const ringLineGeo = new THREE.BufferGeometry().setFromPoints([p1, p2]);
    const ringLineMat = new THREE.LineBasicMaterial({
      color: 0x1e293b,
      transparent: true,
      opacity: 0.35
    });
    scene.add(new THREE.Line(ringLineGeo, ringLineMat));
  }

  // 6. Starfield Ambient Dust
  const dustCount = 180;
  const dustPositions = new Float32Array(dustCount * 3);
  for (let i = 0; i < dustCount * 3; i += 3) {
    dustPositions[i] = (Math.random() - 0.5) * 16;
    dustPositions[i + 1] = (Math.random() - 0.5) * 12;
    dustPositions[i + 2] = (Math.random() - 0.5) * 10;
  }
  const dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
  const dustMat = new THREE.PointsMaterial({
    color: 0x2dd4bf,
    size: 0.035,
    transparent: true,
    opacity: 0.5
  });
  const dustParticles = new THREE.Points(dustGeo, dustMat);
  scene.add(dustParticles);

  // 7. Mouse Parallax & Raycasting
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2(-999, -999);
  const targetCam = { x: 0, y: 0 };
  let hoveredNodeKey = null;
  let activeSelectedKey = 'erp';

  function updateHUD(meta) {
    if (!hudEl) return;
    hudEl.innerHTML = `
      <div class="flex items-center justify-between gap-3 mb-2">
        <div class="flex items-center gap-2.5">
          <span class="w-3 h-3 rounded-full" style="background-color: ${meta.color}; box-shadow: 0 0 12px ${meta.color};"></span>
          <h4 class="font-bold text-white text-base tracking-wide">${meta.name}</h4>
        </div>
        <span class="text-[10px] font-mono px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/30">Active Synapse</span>
      </div>
      <p class="text-xs text-slate-300 mb-2">${meta.tagline}</p>
      <div class="text-[11px] font-semibold text-emerald-400 mb-3 flex items-center gap-1.5">
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
        ${meta.metrics}
      </div>
      <ul class="text-[11px] text-slate-400 space-y-1 mb-3">
        ${meta.capabilities.map(cap => `<li class="flex items-center gap-1.5"><span class="w-1 h-1 rounded-full bg-teal-400"></span>${cap}</li>`).join('')}
      </ul>
      <div class="flex items-center justify-between pt-2 border-t border-slate-800">
        <a href="${meta.link}" class="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-400 hover:text-teal-300 transition">
          Explore specifications &rarr;
        </a>
        <button 
          type="button"
          onclick="window.Alpine?.store('cart')?.addItem({ id: '${meta.id}', name: '${meta.name}', badge: 'Selected', priceMonthly: 1999, priceAnnual: 1499 })"
          class="px-2.5 py-1 rounded-lg text-[11px] font-bold text-white bg-teal-600 hover:bg-teal-500 transition">
          + Add Suite
        </button>
      </div>
    `;
    hudEl.style.borderColor = meta.color;
  }

  updateHUD(MODULE_DATA['erp']);

  function onPointerMove(e) {
    const rect = container.getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    targetCam.x = mouse.x * 0.55;
    targetCam.y = mouse.y * 0.35;
  }

  function onClick() {
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(nodeMeshes);
    if (intersects.length > 0) {
      const key = intersects[0].object.userData.key;
      activeSelectedKey = key;
      updateHUD(MODULE_DATA[key]);
      const group = nodeObjects[key];
      if (group) {
        group.scale.set(1.4, 1.4, 1.4);
      }
    }
  }

  container.addEventListener('pointermove', onPointerMove, { passive: true });
  container.addEventListener('click', onClick);

  // 8. Visibility & Resize Observer
  let isVisible = true;
  const observer = new IntersectionObserver(([entry]) => {
    isVisible = entry.isIntersecting;
  }, { threshold: 0.1 });
  observer.observe(container);

  const resizeObserver = new ResizeObserver(entries => {
    for (let entry of entries) {
      const width = entry.contentRect.width;
      const height = entry.contentRect.height;
      if (width > 0 && height > 0) {
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      }
    }
  });
  resizeObserver.observe(container);

  // 9. Main Animation Loop
  let clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    if (!isVisible) return;

    const delta = clock.getDelta();
    const time = clock.getElapsedTime();

    // Rotation of core
    coreMesh.rotation.y = time * 0.2;
    coreMesh.rotation.x = time * 0.1;
    coreWireMesh.rotation.y = -time * 0.25;
    coreWireMesh.rotation.z = time * 0.12;
    coreRingMesh.rotation.z = time * 0.3;

    // Camera parallax smoothing
    camera.position.x += (targetCam.x - camera.position.x) * 0.05;
    camera.position.y += (targetCam.y - camera.position.y) * 0.05;
    camera.lookAt(0, 0, 0);

    // Dust gentle drift
    dustParticles.rotation.y = time * 0.025;

    // Raycast on hover
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(nodeMeshes);
    let newHovered = null;

    if (intersects.length > 0) {
      newHovered = intersects[0].object.userData.key;
      container.style.cursor = 'pointer';
    } else {
      container.style.cursor = 'default';
    }

    if (newHovered !== hoveredNodeKey) {
      hoveredNodeKey = newHovered;
      if (hoveredNodeKey) {
        updateHUD(MODULE_DATA[hoveredNodeKey]);
      }
    }

    // Animate each module node
    Object.keys(nodeObjects).forEach(key => {
      const group = nodeObjects[key];
      const isHovered = hoveredNodeKey === key;
      const isSelected = activeSelectedKey === key;

      let targetScale = 1.0;
      if (isHovered) targetScale = 1.35;
      else if (isSelected) targetScale = 1.18;

      group.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);

      if (group.userData.haloMesh) {
        group.userData.haloMesh.rotation.z = time * 0.9;
      }

      group.position.y = group.userData.originalPos.y + Math.sin(time * 1.6 + group.position.x) * 0.08;
    });

    // Advance particle packets along spline paths
    particlePackets.forEach(pkt => {
      pkt.progress = (pkt.progress + pkt.speed) % 1.0;
      const pos = pkt.curve.getPointAt(pkt.progress);
      pkt.mesh.position.copy(pos);
    });

    renderer.render(scene, camera);
  }

  animate();
}
