/**
 * ARENA_CORE — Procedural 3D Stadium Hero Centerpiece
 * Light visual identity: architectural miniature stadium, layered grandstand tiers,
 * lawn-striped pitch with accurate white markings & 3D goals,
 * patterned 3D football with bounce physics, curved tactical trajectory,
 * and pinned analytics annotations (Mulberry32, Poisson λ, 48-Team Draw).
 *
 * Dynamically loaded for the homepage only.
 * Respects prefers-reduced-motion, WebGL availability, and view switching.
 */

(async function initHomeHero3D() {
  'use strict';

  const container = document.getElementById('home-hero-3d-container');
  const fallbackScene = document.getElementById('hero-fallback-scene');
  if (!container) return;

  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Dynamically load Three.js via ES module import
  let THREE;
  try {
    const mod = await import('three');
    THREE = mod;
  } catch (err) {
    console.warn('Three.js dynamic load failed, using CSS stadium fallback:', err);
    if (fallbackScene) fallbackScene.style.display = 'block';
    return;
  }

  // WebGL availability check
  function isWebGLAvailable() {
    try {
      const canvas = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch {
      return false;
    }
  }

  if (!isWebGLAvailable()) {
    console.info('WebGL unavailable; retaining CSS stadium fallback.');
    if (fallbackScene) fallbackScene.style.display = 'block';
    return;
  }

  // Hide fallback scene when 3D initializes
  if (fallbackScene) {
    fallbackScene.classList.add('is-hidden');
  }

  /* --------------------------------------------------------------------------
     1. Scene, Camera, Renderer Setup
     -------------------------------------------------------------------------- */
  const width = container.clientWidth || 540;
  const height = container.clientHeight || 420;

  const scene = new THREE.Scene();
  scene.background = null; // Transparent background to blend with hero card

  const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
  camera.position.set(0, 15, 20);
  camera.lookAt(0, 0.2, 0);

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
  } catch (e) {
    console.warn('WebGLRenderer initialization failed:', e);
    if (fallbackScene) fallbackScene.style.display = 'block';
    return;
  }

  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.domElement.className = 'home-hero-3d-canvas';
  renderer.domElement.setAttribute('aria-hidden', 'true');
  container.appendChild(renderer.domElement);

  /* --------------------------------------------------------------------------
     2. Lighting (Natural Daylight Stadium Atmosphere)
     -------------------------------------------------------------------------- */
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.78);
  scene.add(ambientLight);

  const sunLight = new THREE.DirectionalLight(0xfffcf5, 1.15);
  sunLight.position.set(12, 18, 14);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.width = 1024;
  sunLight.shadow.mapSize.height = 1024;
  sunLight.shadow.camera.near = 2;
  sunLight.shadow.camera.far = 40;
  sunLight.shadow.camera.left = -10;
  sunLight.shadow.camera.right = 10;
  sunLight.shadow.camera.top = 10;
  sunLight.shadow.camera.bottom = -10;
  sunLight.shadow.bias = -0.0005;
  scene.add(sunLight);

  const fillLight = new THREE.HemisphereLight(0xf0f7ff, 0xdcfce7, 0.5);
  scene.add(fillLight);

  const rimLight = new THREE.DirectionalLight(0xa7f3d0, 0.35);
  rimLight.position.set(-12, 8, -10);
  scene.add(rimLight);

  /* --------------------------------------------------------------------------
     3. Procedural Stadium Centerpiece Construction
     -------------------------------------------------------------------------- */
  const stadiumGroup = new THREE.Group();
  scene.add(stadiumGroup);

  // Stadium Base Foundation Plinth (warm pale architectural stone)
  const plinthGeo = new THREE.BoxGeometry(16.8, 0.5, 12.6);
  const plinthMat = new THREE.MeshStandardMaterial({
    color: 0xf1f5f9,
    roughness: 0.85,
    metalness: 0.05
  });
  const plinth = new THREE.Mesh(plinthGeo, plinthMat);
  plinth.position.y = -0.25;
  plinth.receiveShadow = true;
  stadiumGroup.add(plinth);

  // Outer Stadium Rim Fascia (curved border)
  const outerBorderGeo = new THREE.BoxGeometry(17.2, 0.7, 13.0);
  const outerBorderMat = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    roughness: 0.7,
    metalness: 0.1
  });
  const outerBorder = new THREE.Mesh(outerBorderGeo, outerBorderMat);
  outerBorder.position.y = -0.45;
  stadiumGroup.add(outerBorder);

  // Football Pitch Dimensions
  const pitchL = 11.6;
  const pitchW = 7.6;

  // Procedural Football Pitch Lawn Texture with Mowing Stripes & White Markings
  function createPitchTexture() {
    const cvs = document.createElement('canvas');
    cvs.width = 1024;
    cvs.height = 680;
    const ctx = cvs.getContext('2d');

    // Lawn mowing stripes (alternating rich emerald greens)
    const stripes = 12;
    const stripeW = cvs.width / stripes;
    for (let i = 0; i < stripes; i++) {
      ctx.fillStyle = (i % 2 === 0) ? '#15803d' : '#16a34a';
      ctx.fillRect(i * stripeW, 0, stripeW, cvs.height);
    }

    // Outer pitch white border margin
    const m = 36;
    const pw = cvs.width - m * 2;
    const ph = cvs.height - m * 2;

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 9;
    ctx.lineCap = 'square';
    ctx.strokeRect(m, m, pw, ph);

    // Halfway line
    const cx = cvs.width / 2;
    const cy = cvs.height / 2;
    ctx.beginPath();
    ctx.moveTo(cx, m);
    ctx.lineTo(cx, cvs.height - m);
    ctx.stroke();

    // Center circle & Center spot
    ctx.beginPath();
    ctx.arc(cx, cy, 76, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(cx, cy, 9, 0, Math.PI * 2);
    ctx.fill();

    // Penalty Boxes (Left & Right)
    const boxW = 145;
    const boxH = 280;
    const boxY = (cvs.height - boxH) / 2;

    // Left Box
    ctx.strokeRect(m, boxY, boxW, boxH);
    ctx.strokeRect(m, (cvs.height - 140) / 2, 55, 140);
    ctx.beginPath(); ctx.arc(m + 105, cy, 7, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(m + 105, cy, 65, -0.65, 0.65); ctx.stroke();

    // Right Box
    ctx.strokeRect(cvs.width - m - boxW, boxY, boxW, boxH);
    ctx.strokeRect(cvs.width - m - 55, (cvs.height - 140) / 2, 55, 140);
    ctx.beginPath(); ctx.arc(cvs.width - m - 105, cy, 7, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(cvs.width - m - 105, cy, 65, Math.PI - 0.65, Math.PI + 0.65); ctx.stroke();

    // Corner Arcs
    const arcR = 24;
    ctx.beginPath(); ctx.arc(m, m, arcR, 0, Math.PI / 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(m, cvs.height - m, arcR, -Math.PI / 2, 0); ctx.stroke();
    ctx.beginPath(); ctx.arc(cvs.width - m, m, arcR, Math.PI / 2, Math.PI); ctx.stroke();
    ctx.beginPath(); ctx.arc(cvs.width - m, cvs.height - m, arcR, Math.PI, Math.PI * 1.5); ctx.stroke();

    const texture = new THREE.CanvasTexture(cvs);
    texture.anisotropy = 4;
    return texture;
  }

  const pitchGeo = new THREE.BoxGeometry(pitchL, 0.22, pitchW);
  const pitchTex = createPitchTexture();
  const pitchSideMat = new THREE.MeshStandardMaterial({ color: 0x14532d, roughness: 0.9 });
  const pitchTopMat = new THREE.MeshStandardMaterial({ map: pitchTex, roughness: 0.65, metalness: 0.05 });
  const pitchMats = [
    pitchSideMat, pitchSideMat,
    pitchTopMat,
    pitchSideMat, pitchSideMat, pitchSideMat
  ];
  const pitchMesh = new THREE.Mesh(pitchGeo, pitchMats);
  pitchMesh.position.y = 0.11;
  pitchMesh.receiveShadow = true;
  stadiumGroup.add(pitchMesh);

  // Layered Grandstands (North, South, East, West Tiers)
  function createGrandstand(x, z, w, d, angleY, tiers = 3) {
    const standGroup = new THREE.Group();
    const tierMat1 = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.7 });
    const tierMat2 = new THREE.MeshStandardMaterial({ color: 0xcbd5e1, roughness: 0.7 });
    const accentMat = new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.5 });
    const canopyMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.4, metalness: 0.1 });

    for (let t = 0; t < tiers; t++) {
      const stepH = 0.35;
      const stepD = d / tiers;
      const stepGeo = new THREE.BoxGeometry(w, stepH * (t + 1), stepD);
      const mat = (t === 1) ? accentMat : ((t % 2 === 0) ? tierMat1 : tierMat2);
      const step = new THREE.Mesh(stepGeo, mat);
      step.position.set(0, (stepH * (t + 1)) / 2, (t - (tiers - 1) / 2) * stepD);
      step.receiveShadow = true;
      step.castShadow = true;
      standGroup.add(step);
    }

    // Architectural Canopy / Roof overhang
    const canopyGeo = new THREE.BoxGeometry(w + 0.3, 0.12, d * 0.85);
    const canopy = new THREE.Mesh(canopyGeo, canopyMat);
    canopy.position.set(0, 1.8, -d * 0.15);
    canopy.rotation.x = 0.12;
    canopy.castShadow = true;
    standGroup.add(canopy);

    standGroup.position.set(x, 0, z);
    standGroup.rotation.y = angleY;
    return standGroup;
  }

  // North Stand (top) & South Stand (bottom)
  const standNorth = createGrandstand(0, -4.8, pitchL, 1.6, 0);
  const standSouth = createGrandstand(0, 4.8, pitchL, 1.6, Math.PI);
  // West Stand (left goal) & East Stand (right goal)
  const standWest = createGrandstand(-6.6, 0, pitchW, 1.4, Math.PI / 2);
  const standEast = createGrandstand(6.6, 0, pitchW, 1.4, -Math.PI / 2);

  stadiumGroup.add(standNorth);
  stadiumGroup.add(standSouth);
  stadiumGroup.add(standWest);
  stadiumGroup.add(standEast);

  // 4 Modern Floodlight Towers at the corners
  const floodlightPositions = [
    [-6.8, -4.8], [6.8, -4.8],
    [-6.8, 4.8],  [6.8, 4.8]
  ];
  const mastGeo = new THREE.CylinderGeometry(0.08, 0.12, 3.8, 8);
  const mastMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.5, metalness: 0.4 });
  const headGeo = new THREE.BoxGeometry(0.7, 0.4, 0.2);
  const headMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.2,
    emissive: 0xfef08a,
    emissiveIntensity: 0.45
  });

  floodlightPositions.forEach(([mx, mz]) => {
    const mast = new THREE.Mesh(mastGeo, mastMat);
    mast.position.set(mx, 2.0, mz);
    stadiumGroup.add(mast);

    const head = new THREE.Mesh(headGeo, headMat);
    head.position.set(mx, 3.8, mz);
    head.lookAt(0, 0.5, 0);
    stadiumGroup.add(head);
  });

  // Recognizable 3D Goalposts (Left & Right)
  function createGoal(xPos, isRight = false) {
    const goal = new THREE.Group();
    const postMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.25, metalness: 0.15 });
    const postGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.95, 8);
    const barGeo = new THREE.CylinderGeometry(0.045, 0.045, 1.9, 8);

    const postA = new THREE.Mesh(postGeo, postMat);
    postA.position.set(0, 0.47, -0.95);
    goal.add(postA);

    const postB = new THREE.Mesh(postGeo, postMat);
    postB.position.set(0, 0.47, 0.95);
    goal.add(postB);

    const crossbar = new THREE.Mesh(barGeo, postMat);
    crossbar.rotation.x = Math.PI / 2;
    crossbar.position.set(0, 0.95, 0);
    goal.add(crossbar);

    // Goal Netting
    const netGeo = new THREE.BoxGeometry(0.65, 0.9, 1.9);
    const netMat = new THREE.MeshBasicMaterial({
      color: 0xf8fafc,
      wireframe: true,
      transparent: true,
      opacity: 0.35
    });
    const net = new THREE.Mesh(netGeo, netMat);
    net.position.set(isRight ? 0.32 : -0.32, 0.45, 0);
    goal.add(net);

    goal.position.set(xPos, 0.22, 0);
    return goal;
  }

  stadiumGroup.add(createGoal(-5.4, false));
  stadiumGroup.add(createGoal(5.4, true));

  // Patterned 3D Football (Classic Telstar Hexagon/Pentagon Texture)
  function createBallTexture() {
    const cvs = document.createElement('canvas');
    cvs.width = 512;
    cvs.height = 256;
    const ctx = cvs.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, cvs.width, cvs.height);

    ctx.fillStyle = '#0f172a';
    const pentagons = [
      [128, 64, 24], [384, 64, 24],
      [256, 128, 28],
      [128, 192, 24], [384, 192, 24]
    ];

    pentagons.forEach(([px, py, r]) => {
      ctx.beginPath();
      for (let a = 0; a < 5; a++) {
        const rad = (a * 2 * Math.PI) / 5 - Math.PI / 2;
        const x = px + Math.cos(rad) * r;
        const y = py + Math.sin(rad) * r;
        if (a === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fill();
    });

    // Subdued seam lines
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 2.5;
    pentagons.forEach(([px, py, r]) => {
      ctx.beginPath();
      for (let a = 0; a < 5; a++) {
        const rad = (a * 2 * Math.PI) / 5 - Math.PI / 2;
        const x = px + Math.cos(rad) * r * 1.5;
        const y = py + Math.sin(rad) * r * 1.5;
        ctx.moveTo(px + Math.cos(rad) * r, py + Math.sin(rad) * r);
        ctx.lineTo(x, y);
      }
      ctx.stroke();
    });

    const tex = new THREE.CanvasTexture(cvs);
    tex.anisotropy = 4;
    return tex;
  }

  const ballRadius = 0.38;
  const ballGeo = new THREE.SphereGeometry(ballRadius, 32, 32);
  const ballMat = new THREE.MeshStandardMaterial({
    map: createBallTexture(),
    roughness: 0.35,
    metalness: 0.08
  });
  const ballMesh = new THREE.Mesh(ballGeo, ballMat);
  ballMesh.castShadow = true;
  ballMesh.position.set(-0.8, 3.8, 0.3); // starts high for entrance bounce
  stadiumGroup.add(ballMesh);

  // Dynamic Contact Shadow on pitch
  const shadowGeo = new THREE.PlaneGeometry(1.2, 1.2);
  function createShadowTexture() {
    const cvs = document.createElement('canvas');
    cvs.width = 128; cvs.height = 128;
    const ctx = cvs.getContext('2d');
    const grad = ctx.createRadialGradient(64, 64, 4, 64, 64, 60);
    grad.addColorStop(0, 'rgba(15, 23, 42, 0.6)');
    grad.addColorStop(0.5, 'rgba(15, 23, 42, 0.25)');
    grad.addColorStop(1, 'rgba(15, 23, 42, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(cvs);
  }
  const shadowMat = new THREE.MeshBasicMaterial({
    map: createShadowTexture(),
    transparent: true,
    opacity: 0.55,
    depthWrite: false
  });
  const ballShadow = new THREE.Mesh(shadowGeo, shadowMat);
  ballShadow.rotation.x = -Math.PI / 2;
  ballShadow.position.set(-0.8, 0.24, 0.3);
  stadiumGroup.add(ballShadow);

  // Curved Ball Trajectory Line (Simulated Shot / Pass Arc)
  const trajectoryCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.8, 0.6, 0.3),
    new THREE.Vector3(1.2, 2.2, -0.4),
    new THREE.Vector3(3.4, 1.8, -0.3),
    new THREE.Vector3(5.2, 0.9, -0.1)
  ]);
  const curvePoints = trajectoryCurve.getPoints(40);
  const trajectoryGeo = new THREE.BufferGeometry().setFromPoints(curvePoints);
  const trajectoryMat = new THREE.LineDashedMaterial({
    color: 0x10b981,
    dashSize: 0.35,
    gapSize: 0.2,
    linewidth: 2,
    transparent: true,
    opacity: 0.85
  });
  const trajectoryLine = new THREE.Line(trajectoryGeo, trajectoryMat);
  trajectoryLine.computeLineDistances();
  stadiumGroup.add(trajectoryLine);

  // Moving Tactical Simulation Marker Pulse
  const pulseMarkerGeo = new THREE.SphereGeometry(0.16, 16, 16);
  const pulseMarkerMat = new THREE.MeshStandardMaterial({
    color: 0x00e676,
    emissive: 0x10b981,
    emissiveIntensity: 0.8,
    roughness: 0.2
  });
  const pulseMarker = new THREE.Mesh(pulseMarkerGeo, pulseMarkerMat);
  pulseMarker.position.copy(curvePoints[0]);
  stadiumGroup.add(pulseMarker);

  // 2 Analytical Player Tokens
  function createPlayerToken(x, z, color = 0x16a34a) {
    const tokenGroup = new THREE.Group();
    const baseGeo = new THREE.CylinderGeometry(0.28, 0.32, 0.18, 16);
    const baseMat = new THREE.MeshStandardMaterial({ color, roughness: 0.4, metalness: 0.2 });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.y = 0.09;
    tokenGroup.add(base);

    const pinGeo = new THREE.SphereGeometry(0.12, 12, 12);
    const pinMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
    const pin = new THREE.Mesh(pinGeo, pinMat);
    pin.position.y = 0.26;
    tokenGroup.add(pin);

    tokenGroup.position.set(x, 0.22, z);
    return tokenGroup;
  }

  const tokenHome = createPlayerToken(-2.6, -1.2, 0x16a34a);
  const tokenAway = createPlayerToken(2.2, 1.0, 0x0284c7);
  stadiumGroup.add(tokenHome);
  stadiumGroup.add(tokenAway);

  /* --------------------------------------------------------------------------
     4. Compact 3D-Pinned Analytics Annotations (Overlay HTML Pins)
     -------------------------------------------------------------------------- */
  const annotationData = [
    {
      id: 'pin-prng',
      label: 'PRNG',
      detail: 'Mulberry32 Seed',
      pos: new THREE.Vector3(-0.6, 1.4, -0.4)
    },
    {
      id: 'pin-poisson',
      label: 'POISSON',
      detail: 'λ = 1.35 xG',
      pos: new THREE.Vector3(2.8, 1.4, -2.0)
    },
    {
      id: 'pin-draw',
      label: '48-TEAM',
      detail: 'Procedural Draw',
      pos: new THREE.Vector3(-2.6, 1.3, 2.0)
    }
  ];

  let pinContainer = container.querySelector('.hero-3d-pins');
  if (!pinContainer) {
    pinContainer = document.createElement('div');
    pinContainer.className = 'hero-3d-pins';
    pinContainer.setAttribute('aria-hidden', 'true');
    container.appendChild(pinContainer);
  }

  pinContainer.innerHTML = annotationData.map(pin => `
    <div class="hero-3d-pin" id="${pin.id}">
      <span class="pin-dot"></span>
      <span class="pin-tag">${pin.label}</span>
      <span class="pin-val">${pin.detail}</span>
    </div>
  `).join('');

  const pinElements = annotationData.map(pin => ({
    el: document.getElementById(pin.id),
    pos: pin.pos
  }));

  function updatePins() {
    const halfW = container.clientWidth / 2;
    const halfH = container.clientHeight / 2;
    const tempV = new THREE.Vector3();

    pinElements.forEach(({ el, pos }) => {
      if (!el) return;
      tempV.copy(pos);
      tempV.applyMatrix4(stadiumGroup.matrixWorld);
      tempV.project(camera);

      if (tempV.z > 1.0) {
        el.style.opacity = '0';
        return;
      }

      const x = (tempV.x * halfW) + halfW;
      const y = -(tempV.y * halfH) + halfH;
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
      el.style.opacity = '1';
    });
  }

  /* --------------------------------------------------------------------------
     5. Choreographed Animation Lifecycle
     -------------------------------------------------------------------------- */
  const baseRotationX = 0.58;
  const baseRotationY = -0.28;

  stadiumGroup.rotation.x = baseRotationX;
  stadiumGroup.rotation.y = baseRotationY;
  stadiumGroup.scale.set(0.96, 0.96, 0.96);

  let targetTiltX = 0;
  let targetTiltY = 0;
  let currentTiltX = 0;
  let currentTiltY = 0;

  const isFinePointer = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!prefersReduced && isFinePointer) {
    container.addEventListener('mousemove', (e) => {
      const rect = container.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      targetTiltY = nx * 0.08;
      targetTiltX = -ny * 0.06;
    }, { passive: true });

    container.addEventListener('mouseleave', () => {
      targetTiltX = 0;
      targetTiltY = 0;
    });
  }

  let animStartTime = performance.now();
  let rafId = null;
  let isRunning = false;
  let settledBall = false;

  const ballRestY = 0.22 + ballRadius;

  function animate(now) {
    if (!isRunning) return;
    rafId = requestAnimationFrame(animate);

    const elapsed = (now - animStartTime) / 1000;

    // Entrance & Ball Bounce
    if (!prefersReduced && elapsed < 2.2) {
      const enterProgress = Math.min(1, elapsed / 1.0);
      const ease = 1 - Math.pow(1 - enterProgress, 3);
      stadiumGroup.scale.setScalar(0.94 + ease * 0.06);

      // Controlled natural bounce
      const bTime = elapsed;
      if (bTime < 0.5) {
        const t = bTime / 0.5;
        ballMesh.position.y = 3.8 - (3.8 - ballRestY) * (t * t);
      } else if (bTime < 1.1) {
        const t = (bTime - 0.5) / 0.6;
        const h = 1.2 * Math.sin(t * Math.PI);
        ballMesh.position.y = ballRestY + h;
      } else if (bTime < 1.6) {
        const t = (bTime - 1.1) / 0.5;
        const h = 0.4 * Math.sin(t * Math.PI);
        ballMesh.position.y = ballRestY + h;
      } else {
        ballMesh.position.y = ballRestY;
        settledBall = true;
      }
    } else {
      if (!settledBall) {
        ballMesh.position.y = ballRestY;
        stadiumGroup.scale.setScalar(1.0);
        settledBall = true;
      }
    }

    // Dynamic Ball Shadow scaling
    const shadowScale = THREE.MathUtils.clamp(1.0 - (ballMesh.position.y - ballRestY) * 0.22, 0.35, 1.0);
    ballShadow.scale.set(shadowScale, shadowScale, 1);
    ballShadow.material.opacity = THREE.MathUtils.clamp(0.55 - (ballMesh.position.y - ballRestY) * 0.12, 0.12, 0.55);

    // Trajectory Pulse Marker
    if (!prefersReduced && trajectoryCurve) {
      const pulseT = THREE.MathUtils.clamp((elapsed * 0.42) % 1.0, 0, 0.999);
      const pt = trajectoryCurve.getPoint(pulseT);
      if (pt) {
        pulseMarker.position.copy(pt);
        const pulseScale = 0.85 + 0.25 * Math.sin(elapsed * 5.5);
        pulseMarker.scale.setScalar(pulseScale);
      }
    }

    // Subtle Ambient Sway
    let ambientY = 0;
    if (!prefersReduced) {
      ambientY = Math.sin(elapsed * 0.65) * 0.03;
    }

    // Smooth Tilt Lerp
    currentTiltX += (targetTiltX - currentTiltX) * 0.06;
    currentTiltY += (targetTiltY - currentTiltY) * 0.06;

    stadiumGroup.rotation.x = baseRotationX + currentTiltX;
    stadiumGroup.rotation.y = baseRotationY + ambientY + currentTiltY;

    renderer.render(scene, camera);
    updatePins();
  }

  /* --------------------------------------------------------------------------
     6. Visibility, Lifecycle & Performance Optimization
     -------------------------------------------------------------------------- */
  function startLoop() {
    if (prefersReduced || isRunning) return;
    isRunning = true;
    animStartTime = performance.now();
    rafId = requestAnimationFrame(animate);
  }

  function stopLoop() {
    if (!isRunning) return;
    isRunning = false;
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  const io = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      if (!prefersReduced && isHomeViewActive()) startLoop();
    } else {
      stopLoop();
    }
  }, { threshold: 0.05 });
  io.observe(container);

  function isHomeViewActive() {
    const homePanel = document.getElementById('view-product-home');
    return homePanel && !homePanel.hidden;
  }

  const homePanel = document.getElementById('view-product-home');
  if (homePanel) {
    const mutObs = new MutationObserver(() => {
      if (!prefersReduced && isHomeViewActive()) {
        const rect = container.getBoundingClientRect();
        if (rect.bottom > 0 && rect.top < window.innerHeight) {
          startLoop();
        }
      } else {
        stopLoop();
      }
    });
    mutObs.observe(homePanel, { attributes: true, attributeFilter: ['hidden', 'class'] });
  }

  function onResize() {
    const newW = container.clientWidth;
    const newH = container.clientHeight;
    if (newW > 0 && newH > 0) {
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
      if (prefersReduced) {
        renderer.render(scene, camera);
      }
      updatePins();
    }
  }
  window.addEventListener('resize', onResize, { passive: true });

  if (prefersReduced) {
    ballMesh.position.y = ballRestY;
    stadiumGroup.scale.setScalar(1.0);
    stadiumGroup.rotation.x = baseRotationX;
    stadiumGroup.rotation.y = baseRotationY;
    renderer.render(scene, camera);
    updatePins();
    console.info('ArenaCore 3D Hero: prefers-reduced-motion respected (single static render).');
  } else {
    if (isHomeViewActive()) {
      startLoop();
    }
  }

  window.ArenaHero3D = {
    renderer,
    scene,
    camera,
    stadiumGroup,
    start: startLoop,
    stop: stopLoop
  };

})();
