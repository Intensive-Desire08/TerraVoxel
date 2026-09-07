import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function GlobeVisualization() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let width = container.clientWidth;
    let height = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.z = 230;

    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Root globe group
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);
    globeGroup.rotation.x = 0.22; // Natural axial tilt

    const GLOBE_RADIUS = 70;

    // 1. Base Core Ocean Sphere
    const oceanGeo = new THREE.SphereGeometry(GLOBE_RADIUS - 0.2, 64, 64);
    const oceanMat = new THREE.MeshBasicMaterial({
      color: 0xFAFDF9,
      transparent: true,
      opacity: 0.82
    });
    const oceanSphere = new THREE.Mesh(oceanGeo, oceanMat);
    globeGroup.add(oceanSphere);

    // Inner depth layer
    const oceanGlowGeo = new THREE.SphereGeometry(GLOBE_RADIUS + 0.1, 48, 48);
    const oceanGlowMat = new THREE.MeshBasicMaterial({
      color: 0xD1E2CF,
      wireframe: true,
      transparent: true,
      opacity: 0.25
    });
    const oceanGlow = new THREE.Mesh(oceanGlowGeo, oceanGlowMat);
    globeGroup.add(oceanGlow);

    // 2. Latitude & Longitude Grids
    const latLongMat = new THREE.LineBasicMaterial({
      color: 0xBDD2BB,
      transparent: true,
      opacity: 0.55
    });

    // Latitude rings
    for (let lat = -60; lat <= 60; lat += 20) {
      const radius = GLOBE_RADIUS * Math.cos((lat * Math.PI) / 180);
      const y = GLOBE_RADIUS * Math.sin((lat * Math.PI) / 180);
      const ringGeo = new THREE.BufferGeometry();
      const points = [];
      const segments = 90;
      for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        points.push(new THREE.Vector3(Math.cos(theta) * radius, y, Math.sin(theta) * radius));
      }
      ringGeo.setFromPoints(points);
      const line = new THREE.Line(ringGeo, latLongMat);
      globeGroup.add(line);
    }

    // Longitude meridians
    for (let lng = 0; lng < 180; lng += 30) {
      const ringGeo = new THREE.BufferGeometry();
      const points = [];
      const segments = 90;
      const radLng = (lng * Math.PI) / 180;
      for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        const x = GLOBE_RADIUS * Math.sin(theta) * Math.cos(radLng);
        const y = GLOBE_RADIUS * Math.cos(theta);
        const z = GLOBE_RADIUS * Math.sin(theta) * Math.sin(radLng);
        points.push(new THREE.Vector3(x, y, z));
      }
      ringGeo.setFromPoints(points);
      const line = new THREE.Line(ringGeo, latLongMat);
      globeGroup.add(line);
    }

    // 3. Realistic Continent Landmasses
    const landCoords = [];
    function addLandRegion(centerLat, centerLng, latRadius, lngRadius, count, isTropical = false) {
      for (let i = 0; i < count; i++) {
        const u = Math.random();
        const v = Math.random();
        const lat = centerLat + (u - 0.5) * latRadius * 2 * (0.8 + 0.25 * Math.sin(v * Math.PI));
        const lng = centerLng + (v - 0.5) * lngRadius * 2 * (0.8 + 0.25 * Math.cos(u * Math.PI));
        landCoords.push({ lat, lng, isTropical });
      }
    }

    addLandRegion(-12, -60, 24, 18, 550, true);
    addLandRegion(14, -85, 8, 12, 160, true);
    addLandRegion(40, -100, 22, 32, 500, false);
    addLandRegion(52, 55, 20, 55, 750, false);
    addLandRegion(0, 22, 16, 18, 380, true);
    addLandRegion(18, 18, 12, 28, 260, false);
    addLandRegion(-22, 26, 12, 16, 220, false);
    addLandRegion(4, 112, 14, 26, 420, true);
    addLandRegion(-24, 134, 16, 20, 280, false);

    const landGeometry = new THREE.BufferGeometry();
    const positions = [];
    const colors = [];

    const greenEmeraldBright = new THREE.Color(0x10B981);
    const greenEmeraldBrand  = new THREE.Color(0x059669);
    const greenForestSlate   = new THREE.Color(0x064E3B);
    const slateDarkAccent    = new THREE.Color(0x0F172A);

    landCoords.forEach(pt => {
      const phi = (90 - pt.lat) * (Math.PI / 180);
      const theta = (pt.lng + 180) * (Math.PI / 180);
      const r = GLOBE_RADIUS + 0.6;

      const x = -(r * Math.sin(phi) * Math.cos(theta));
      const z = r * Math.sin(phi) * Math.sin(theta);
      const y = r * Math.cos(phi);

      positions.push(x, y, z);

      const rand = Math.random();
      if (pt.isTropical) {
        if (rand > 0.45) {
          colors.push(greenEmeraldBright.r, greenEmeraldBright.g, greenEmeraldBright.b);
        } else if (rand > 0.15) {
          colors.push(greenEmeraldBrand.r, greenEmeraldBrand.g, greenEmeraldBrand.b);
        } else {
          colors.push(greenForestSlate.r, greenForestSlate.g, greenForestSlate.b);
        }
      } else {
        if (rand > 0.5) {
          colors.push(greenEmeraldBrand.r, greenEmeraldBrand.g, greenEmeraldBrand.b);
        } else if (rand > 0.25) {
          colors.push(greenForestSlate.r, greenForestSlate.g, greenForestSlate.b);
        } else {
          colors.push(slateDarkAccent.r, slateDarkAccent.g, slateDarkAccent.b);
        }
      }
    });

    landGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    landGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    const landMaterial = new THREE.PointsMaterial({
      size: 3.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.96
    });
    const landPoints = new THREE.Points(landGeometry, landMaterial);
    globeGroup.add(landPoints);

    // 4. Luminous Atmospheric Rim
    const atmoGeo = new THREE.SphereGeometry(GLOBE_RADIUS + 3.5, 48, 48);
    const atmoMat = new THREE.MeshBasicMaterial({
      color: 0x10B981,
      transparent: true,
      opacity: 0.16,
      side: THREE.BackSide
    });
    const atmoMesh = new THREE.Mesh(atmoGeo, atmoMat);
    scene.add(atmoMesh);

    const outerGlowGeo = new THREE.SphereGeometry(GLOBE_RADIUS + 8.5, 32, 32);
    const outerGlowMat = new THREE.MeshBasicMaterial({
      color: 0x34D399,
      transparent: true,
      opacity: 0.08,
      side: THREE.BackSide
    });
    const outerGlow = new THREE.Mesh(outerGlowGeo, outerGlowMat);
    scene.add(outerGlow);

    // 5. Telemetry Nodes
    const telemetrySites = [
      { lat: -3.46, lng: -62.21 },
      { lat: -0.22, lng: 18.24 },
      { lat: -2.53, lng: 115.54 },
      { lat: 45.42, lng: -75.69 },
      { lat: 37.77, lng: -122.41 },
      { lat: -18.20, lng: -47.00 },
      { lat: 12.56, lng: 104.99 }
    ];

    const nodeGroup = new THREE.Group();
    globeGroup.add(nodeGroup);
    const activeNodePos = [];
    const pulseRings = [];

    telemetrySites.forEach(site => {
      const phi = (90 - site.lat) * (Math.PI / 180);
      const theta = (site.lng + 180) * (Math.PI / 180);
      const r = GLOBE_RADIUS + 1.2;

      const x = -(r * Math.sin(phi) * Math.cos(theta));
      const z = r * Math.sin(phi) * Math.sin(theta);
      const y = r * Math.cos(phi);

      activeNodePos.push(new THREE.Vector3(x, y, z));

      const pinGeo = new THREE.SphereGeometry(1.9, 14, 14);
      const pinMat = new THREE.MeshBasicMaterial({ color: 0x10B981 });
      const pin = new THREE.Mesh(pinGeo, pinMat);
      pin.position.set(x, y, z);
      nodeGroup.add(pin);

      const pinCoreGeo = new THREE.SphereGeometry(0.85, 10, 10);
      const pinCoreMat = new THREE.MeshBasicMaterial({ color: 0x064E3B });
      const pinCore = new THREE.Mesh(pinCoreGeo, pinCoreMat);
      pinCore.position.set(x * 1.01, y * 1.01, z * 1.01);
      nodeGroup.add(pinCore);

      const ringGeo = new THREE.RingGeometry(2.4, 3.8, 24);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x059669,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.85
      });
      const pulseRing = new THREE.Mesh(ringGeo, ringMat);
      pulseRing.position.set(x * 1.015, y * 1.015, z * 1.015);
      pulseRing.lookAt(0, 0, 0);
      nodeGroup.add(pulseRing);
      pulseRings.push(pulseRing);
    });

    // 6. Arcs
    function createGreatCircleArc(v1, v2, colorHex = 0x10B981) {
      const mid = v1.clone().add(v2).multiplyScalar(0.5);
      const dist = v1.distanceTo(v2);
      mid.normalize().multiplyScalar(GLOBE_RADIUS + dist * 0.26);

      const curve = new THREE.QuadraticBezierCurve3(v1, mid, v2);
      const points = curve.getPoints(60);
      const arcGeo = new THREE.BufferGeometry().setFromPoints(points);
      const arcMat = new THREE.LineBasicMaterial({
        color: colorHex,
        transparent: true,
        opacity: 0.88,
        linewidth: 2
      });
      return new THREE.Line(arcGeo, arcMat);
    }

    if (activeNodePos.length >= 4) {
      globeGroup.add(createGreatCircleArc(activeNodePos[0], activeNodePos[1], 0x10B981));
      globeGroup.add(createGreatCircleArc(activeNodePos[1], activeNodePos[2], 0x059669));
      globeGroup.add(createGreatCircleArc(activeNodePos[0], activeNodePos[4], 0x047857));
      globeGroup.add(createGreatCircleArc(activeNodePos[2], activeNodePos[6], 0x10B981));
    }

    // 7. Outer Ring
    const orbitalGeo = new THREE.BufferGeometry();
    const orbPoints = [];
    for (let i = 0; i <= 140; i++) {
      const theta = (i / 140) * Math.PI * 2;
      orbPoints.push(new THREE.Vector3(Math.cos(theta) * (GLOBE_RADIUS + 14), 0, Math.sin(theta) * (GLOBE_RADIUS + 14)));
    }
    orbitalGeo.setFromPoints(orbPoints);
    const orbitalRing = new THREE.Line(
      orbitalGeo,
      new THREE.LineBasicMaterial({ color: 0x059669, transparent: true, opacity: 0.45 })
    );
    orbitalRing.rotation.x = Math.PI / 3.2;
    orbitalRing.rotation.z = Math.PI / 7;
    globeGroup.add(orbitalRing);

    // 8. Interactive Drag
    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };
    let velX = 0;
    let velY = 0;

    const onMouseDown = (e) => {
      isDragging = true;
      prevMouse = { x: e.clientX, y: e.clientY };
      velX = 0;
      velY = 0;
    };
    const onMouseUp = () => { isDragging = false; };
    const onMouseMove = (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouse.x;
      const deltaY = e.clientY - prevMouse.y;
      velX = deltaX * 0.005;
      velY = deltaY * 0.005;
      globeGroup.rotation.y += velX;
      globeGroup.rotation.x += velY;
      prevMouse = { x: e.clientX, y: e.clientY };
    };

    const onTouchStart = (e) => {
      if (e.touches.length === 1) {
        isDragging = true;
        prevMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        velX = 0;
        velY = 0;
      }
    };
    const onTouchEnd = () => { isDragging = false; };
    const onTouchMove = (e) => {
      if (!isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - prevMouse.x;
      const deltaY = e.touches[0].clientY - prevMouse.y;
      velX = deltaX * 0.006;
      velY = deltaY * 0.006;
      globeGroup.rotation.y += velX;
      globeGroup.rotation.x += velY;
      prevMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('mousemove', onMouseMove);
    container.addEventListener('touchstart', onTouchStart, { passive: false });
    window.addEventListener('touchend', onTouchEnd);
    window.addEventListener('touchmove', onTouchMove, { passive: false });

    let animationFrameId;
    let clock = 0;
    function animate() {
      animationFrameId = requestAnimationFrame(animate);
      clock += 0.03;
      if (!isDragging) {
        globeGroup.rotation.y += 0.0028 + velX;
        globeGroup.rotation.x += velY;
        velX *= 0.92;
        velY *= 0.92;
      }
      pulseRings.forEach((ring, idx) => {
        const s = 1 + 0.18 * Math.sin(clock + idx * 0.8);
        ring.scale.set(s, s, s);
      });
      orbitalRing.rotation.z += 0.0012;
      renderer.render(scene, camera);
    }
    animate();

    const onResize = () => {
      if (!containerRef.current) return;
      width = containerRef.current.clientWidth;
      height = containerRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('touchmove', onTouchMove);
      if (container) {
        container.removeEventListener('mousedown', onMouseDown);
        container.removeEventListener('touchstart', onTouchStart);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="w-full h-[500px] max-w-5xl mx-auto relative flex items-center justify-center" ref={containerRef} style={{ cursor: 'grab' }} onMouseDown={(e) => e.target.style.cursor = 'grabbing'} onMouseUp={(e) => e.target.style.cursor = 'grab'}>
      <canvas className="w-full h-full block" ref={canvasRef}></canvas>
      <div className="absolute bottom-4 font-label-code text-[10px] text-stone-dark uppercase tracking-widest bg-cream-surface/90 backdrop-blur-sm px-3 py-1.5 border border-emerald-brand/40 pointer-events-none flex items-center gap-2 shadow-[2px_2px_0px_0px_#10B981]">
        <span className="inline-block w-2 h-2 rounded-full bg-emerald-bright shadow-[0_0_6px_#10B981] animate-ping"></span>
        <span className="font-medium">DRAG TO ROTATE GLOBE // RICH MULTI-SPECTRAL BIOMASS TELEMETRY</span>
      </div>
    </div>
  );
}
