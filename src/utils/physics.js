import { PLANET_PALETTES } from "./colors";
import { CATEGORY_COLOR_MAP, CATEGORIES } from "../data/initialTips";
import { getCategoryColorIdx } from "./categoryColors";

export function createNode3D(id, tip, w, h, zScale = 1) {
  const cat = tip.category || tip.topic || "";
  const colorIdx = getCategoryColorIdx(cat);
  const allCats = getCategoryColorIdx._registry
    ? Object.keys(getCategoryColorIdx._registry)
    : CATEGORIES;
  const catOrder = allCats.indexOf(cat);
  const totalCats = Math.max(allCats.length, 1);
  const catAngle = catOrder >= 0
    ? (catOrder / totalCats) * Math.PI * 2 - Math.PI / 2
    : 0;
  const cx = w / 2 + Math.cos(catAngle) * 40;
  const cy = h / 2 + Math.sin(catAngle) * 30;
  const angle = Math.random() * Math.PI * 2;
  const radius = 5 + Math.random() * 25;
  const hasRing = Math.random() < 0.25;
  const ringTilt = 0.3 + Math.random() * 0.4;
  return {
    id,
    tip,
    x: cx + Math.cos(angle) * radius,
    y: cy + Math.sin(angle) * radius,
    z: (Math.random() - 0.5) * 100 * zScale,
    vx: 0,
    vy: 0,
    vz: 0,
    baseR: 18 + Math.random() * 14,
    colorIdx,
    revealed: false,
    dying: false,
    deathPhase: 0,
    isPulsing: false,
    pulsePhase: 0,
    hasRing,
    ringTilt,
    rotationOffset: Math.random() * Math.PI * 2,
    bands: Math.random() < 0.5,
    floatSpeed: 0.006 + Math.random() * 0.012,
    floatAmpX: 0.3 + Math.random() * 0.5,
    floatAmpY: 0.2 + Math.random() * 0.4,
    floatAmpZ: 0.15 + Math.random() * 0.3,
    floatPhase: Math.random() * Math.PI * 2,
  };
}

export function buildEdges(nodes) {
  const edges = [];
  const byCategory = {};
  for (const n of nodes) {
    const cat = n.tip.category || n.tip.topic;
    if (!byCategory[cat]) byCategory[cat] = [];
    byCategory[cat].push(n);
  }
  for (const cat in byCategory) {
    const group = byCategory[cat];
    for (let i = 0; i < group.length; i++) {
      for (let j = i + 1; j < group.length; j++) {
        edges.push([group[i].id, group[j].id]);
      }
    }
  }
  const cats = Object.keys(byCategory);
  for (let i = 0; i < cats.length; i++) {
    const next = (i + 1) % cats.length;
    const a = byCategory[cats[i]];
    const b = byCategory[cats[next]];
    if (a.length && b.length) {
      edges.push([a[0].id, b[0].id]);
    }
  }
  return edges;
}

export function createStars(count, w, h) {
  const stars = [];
  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * w,
      y: Math.random() * h,
      r: 0.2 + Math.random() * 1.5,
      twinkleSpeed: 0.008 + Math.random() * 0.025,
      twinkleOffset: Math.random() * Math.PI * 2,
      hue: Math.random() < 0.3 ? 30 + Math.random() * 30 : 200 + Math.random() * 40,
    });
  }
  return stars;
}

export function project(node, w, h) {
  const fov = 600;
  const scale = fov / (fov + node.z);
  const sx = w / 2 + (node.x - w / 2) * scale;
  const sy = h / 2 + (node.y - h / 2) * scale;
  return { sx, sy, scale };
}

export function spawnExplosion(cx, cy, r, colorIdx) {
  const particles = [];
  const pal = PLANET_PALETTES[colorIdx % PLANET_PALETTES.length];
  const count = 24 + Math.floor(Math.random() * 16);
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2 + Math.random() * 0.4;
    const speed = 2 + Math.random() * 4;
    const useHi = Math.random() < 0.4;
    particles.push({
      x: cx,
      y: cy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1,
      decay: 0.012 + Math.random() * 0.018,
      r: 1.5 + Math.random() * 3,
      color: useHi ? pal.hi : pal.atmo,
    });
  }
  return particles;
}

export function stepPhysics(nodes, edges, dragId, w, h, time) {
  const cx = w / 2, cy = h / 2;
  const margin = 30;

  for (const node of nodes) {
    if (node.dying) {
      node.deathPhase += 0.02;
      node.baseR *= 0.97;
      if (node.deathPhase > 1) node.baseR = 0;
      continue;
    }
    if (node.id === dragId) continue;

    node.vx += (cx - node.x) * 0.004;
    node.vy += (cy - node.y) * 0.004;
    node.vz += (0 - node.z) * 0.003;

    for (const other of nodes) {
      if (other.id === node.id || other.dying) continue;
      const dx = node.x - other.x;
      const dy = node.y - other.y;
      const dz = node.z - other.z;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1;
      const sameCat = node.tip.category && node.tip.category === other.tip.category;
      if (sameCat) {
        // Same category: attract gently to cluster
        if (dist > 60) {
          const attract = (dist - 60) / dist * 0.002;
          node.vx -= dx * attract;
          node.vy -= dy * attract;
        }
        // But still repel if too close
        if (dist < 50) {
          const force = (50 - dist) / dist * 0.02;
          node.vx += dx * force;
          node.vy += dy * force;
        }
      } else {
        // Different category: repel to separate clusters
        if (dist < 120) {
          const force = (120 - dist) / dist * 0.008;
          node.vx += dx * force;
          node.vy += dy * force;
          node.vz += dz * force * 0.15;
        }
      }
    }

    for (const [a, b] of edges) {
      if (a !== node.id && b !== node.id) continue;
      const other = nodes.find((n) => n.id === (a === node.id ? b : a));
      if (!other || other.dying) continue;
      const dx = other.x - node.x;
      const dy = other.y - node.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const target = 70;
      const force = (dist - target) / dist * 0.002;
      node.vx += dx * force;
      node.vy += dy * force;
    }

    const ft = time * node.floatSpeed + node.floatPhase;
    node.vx += Math.sin(ft) * node.floatAmpX * 0.04;
    node.vy += Math.cos(ft * 0.7) * node.floatAmpY * 0.04;
    node.vz += Math.sin(ft * 0.5 + 1.3) * node.floatAmpZ * 0.03;

    node.vx *= 0.95;
    node.vy *= 0.95;
    node.vz *= 0.93;

    node.x += node.vx;
    node.y += node.vy;
    node.z += node.vz;

    const padX = w * 0.15, padY = h * 0.15;
    if (node.x < padX) node.vx += (padX - node.x) * 0.01;
    if (node.x > w - padX) node.vx -= (node.x - (w - padX)) * 0.01;
    if (node.y < padY) node.vy += (padY - node.y) * 0.01;
    if (node.y > h - padY) node.vy -= (node.y - (h - padY)) * 0.01;

    const hard = 20;
    if (node.x < hard) { node.x = hard; node.vx *= -0.3; }
    if (node.x > w - hard) { node.x = w - hard; node.vx *= -0.3; }
    if (node.y < hard) { node.y = hard; node.vy *= -0.3; }
    if (node.y > h - hard) { node.y = h - hard; node.vy *= -0.3; }
    if (node.z < -150) { node.z = -150; node.vz *= -0.3; }
    if (node.z > 150) { node.z = 150; node.vz *= -0.3; }

    if (node.isPulsing) {
      node.pulsePhase += 0.05;
      if (node.pulsePhase > 1) node.isPulsing = false;
    }
  }
}

export function stepParticles(particles) {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vx *= 0.97;
    p.vy *= 0.97;
    p.life -= p.decay;
    if (p.life <= 0) particles.splice(i, 1);
  }
}
