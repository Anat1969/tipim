import { nebulaRGB, nebulaColor } from "./colors";
import { project } from "./physics";

export function drawBackground(ctx, w, h, time) {
  const grad = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w * 0.7);
  grad.addColorStop(0, "rgba(8,14,28,1)");
  grad.addColorStop(0.5, "rgba(4,8,18,1)");
  grad.addColorStop(1, "rgba(2,4,8,1)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // Subtle nebula glow
  const gx = w / 2 + Math.sin(time * 0.003) * 60;
  const gy = h / 2 + Math.cos(time * 0.004) * 40;
  const nebGrad = ctx.createRadialGradient(gx, gy, 0, gx, gy, 280);
  nebGrad.addColorStop(0, "rgba(40,60,120,0.04)");
  nebGrad.addColorStop(1, "rgba(40,60,120,0)");
  ctx.fillStyle = nebGrad;
  ctx.fillRect(0, 0, w, h);
}

export function drawStars(ctx, stars, time) {
  for (const s of stars) {
    const twinkle = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(time * s.twinkleSpeed + s.twinkleOffset));
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(180,200,240,${twinkle * 0.4})`;
    ctx.fill();
  }
}

export function drawEdges(ctx, nodes, edges, w, h) {
  ctx.lineWidth = 0.5;
  for (const [aId, bId] of edges) {
    const a = nodes.find((n) => n.id === aId);
    const b = nodes.find((n) => n.id === bId);
    if (!a || !b || a.dying || b.dying) continue;
    const pa = project(a, w, h);
    const pb = project(b, w, h);
    const alpha = Math.min(pa.scale, pb.scale) * 0.12;
    ctx.beginPath();
    ctx.moveTo(pa.sx, pa.sy);
    ctx.lineTo(pb.sx, pb.sy);
    ctx.strokeStyle = `rgba(80,120,180,${alpha})`;
    ctx.stroke();
  }
}

export function drawNodes(ctx, nodes, w, h, selectedId) {
  const sorted = [...nodes].sort((a, b) => b.z - a.z);

  for (const node of sorted) {
    if (node.baseR <= 0) continue;
    const p = project(node, w, h);
    const r = node.baseR * p.scale;
    const rgb = nebulaRGB(node.colorIdx);
    const isSelected = node.id === selectedId;

    let alpha = node.revealed ? 0.25 : 0.6;
    if (node.dying) alpha *= (1 - node.deathPhase);

    // Glow
    const glowR = r * (node.isPulsing ? 3.5 : 2.2);
    const glowGrad = ctx.createRadialGradient(p.sx, p.sy, r * 0.3, p.sx, p.sy, glowR);
    glowGrad.addColorStop(0, `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${alpha * 0.35})`);
    glowGrad.addColorStop(1, `rgba(${rgb[0]},${rgb[1]},${rgb[2]},0)`);
    ctx.beginPath();
    ctx.arc(p.sx, p.sy, glowR, 0, Math.PI * 2);
    ctx.fillStyle = glowGrad;
    ctx.fill();

    // Core
    const coreGrad = ctx.createRadialGradient(p.sx - r * 0.2, p.sy - r * 0.2, 0, p.sx, p.sy, r);
    coreGrad.addColorStop(0, `rgba(${Math.min(255, rgb[0] + 80)},${Math.min(255, rgb[1] + 80)},${Math.min(255, rgb[2] + 80)},${alpha})`);
    coreGrad.addColorStop(1, `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${alpha * 0.7})`);
    ctx.beginPath();
    ctx.arc(p.sx, p.sy, r, 0, Math.PI * 2);
    ctx.fillStyle = coreGrad;
    ctx.fill();

    // Selection ring
    if (isSelected && node.revealed) {
      ctx.beginPath();
      ctx.arc(p.sx, p.sy, r + 4, 0, Math.PI * 2);
      ctx.strokeStyle = nebulaColor(node.colorIdx, 0.4);
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    // Topic label
    if (!node.revealed && !node.dying && r > 6) {
      ctx.font = `${Math.max(8, r * 0.65)}px system-ui, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = `rgba(220,230,250,${alpha * 0.8})`;
      ctx.fillText(node.tip.topic, p.sx, p.sy);
    }
  }
}

export function drawParticles(ctx, particles) {
  for (const p of particles) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r * p.life, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${p.color[0]},${p.color[1]},${p.color[2]},${p.life * 0.7})`;
    ctx.fill();
  }
}
