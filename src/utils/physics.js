import { NEBULA_COLORS } from "./colors";

export function createNode3D(id, tip, w, h, zScale = 1) {
  const angle = (id / 12) * Math.PI * 2 + Math.random() * 0.5;
  const radius = 80 + Math.random() * 160;
  return {
    id,
    tip,
    x: w / 2 + Math.cos(angle) * radius * (0.5 + Math.random() * 0.5),
    y: h / 2 + Math.sin(angle) * radius * (0.3 + Math.random() * 0.5),
    z: (Math.random() - 0.5) * 300 * zScale,
    vx: 0,
    vy: 0,
    vz: 0,
    baseR: 14 + Math.random() * 10,
    colorIdx: id % NEBULA_COLORS.length,
    revealed: false,
    dying: false,
    deathPhase: 0,
    isPulsing: false,
    pulsePhase: 0,
  };
}

export function buildEdges(nodes) {
  const edges = [];
  for (let i = 0; i < nodes.length; i++) {
    const count = 1 + Math.floor(Math.random() * 2);
    for (let c = 0; c < count; c++) {
      let j = (i + 1 + Math.floor(Math.random() * 3)) % nodes.length;
      if (j !== i) edges.push([nodes[i].id, nodes[j].id]);
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
      r: 0.3 + Math.random() * 1.2,
      twinkleSpeed: 0.01 + Math.random() * 0.03,
      twinkleOffset: Math.random() * Math.PI * 2,
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
  const color = NEBULA_COLORS[colorIdx % NEBULA_COLORS.length];
  const count = 18 + Math.floor(Math.random() * 12);
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2 + Math.random() * 0.3;
    const speed = 1.5 + Math.random() * 3;
    particles.push({
      x: cx,
      y: cy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1,
      decay: 0.015 + Math.random() * 0.02,
      r: 1 + Math.random() * 2.5,
      color,
    });
  }
  return particles;
}

export function stepPhysics(nodes, edges, dragId) {
  const cx = 460, cy = 260;

  for (const node of nodes) {
    if (node.dying) {
      node.deathPhase += 0.02;
      node.baseR *= 0.97;
      if (node.deathPhase > 1) node.baseR = 0;
      continue;
    }
    if (node.id === dragId) continue;

    // Center gravity
    node.vx += (cx - node.x) * 0.0003;
    node.vy += (cy - node.y) * 0.0003;
    node.vz += (0 - node.z) * 0.0005;

    // Repulsion between nodes
    for (const other of nodes) {
      if (other.id === node.id || other.dying) continue;
      const dx = node.x - other.x;
      const dy = node.y - other.y;
      const dz = node.z - other.z;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1;
      if (dist < 120) {
        const force = (120 - dist) / dist * 0.015;
        node.vx += dx * force;
        node.vy += dy * force;
        node.vz += dz * force * 0.3;
      }
    }

    // Edge spring forces
    for (const [a, b] of edges) {
      if (a !== node.id && b !== node.id) continue;
      const other = nodes.find((n) => n.id === (a === node.id ? b : a));
      if (!other || other.dying) continue;
      const dx = other.x - node.x;
      const dy = other.y - node.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const target = 100;
      const force = (dist - target) / dist * 0.003;
      node.vx += dx * force;
      node.vy += dy * force;
    }

    // Damping
    node.vx *= 0.95;
    node.vy *= 0.95;
    node.vz *= 0.93;

    node.x += node.vx;
    node.y += node.vy;
    node.z += node.vz;

    // Pulse decay
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
