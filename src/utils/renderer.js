import { getPalette, nebulaColor } from "./colors";
import { project } from "./physics";

export function drawBackground(ctx, w, h, time) {
  const grad = ctx.createRadialGradient(w / 2, h * 0.45, 0, w / 2, h * 0.45, w * 0.85);
  grad.addColorStop(0, "rgba(6,10,30,1)");
  grad.addColorStop(0.25, "rgba(4,8,24,1)");
  grad.addColorStop(0.5, "rgba(3,6,20,1)");
  grad.addColorStop(0.75, "rgba(2,4,14,1)");
  grad.addColorStop(1, "rgba(1,2,8,1)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  const gcx = w * 0.5 + Math.sin(time * 0.0008) * 25;
  const gcy = h * 0.42 + Math.cos(time * 0.001) * 18;

  const core = ctx.createRadialGradient(gcx, gcy, 0, gcx, gcy, w * 0.18);
  core.addColorStop(0, "rgba(100,140,220,0.06)");
  core.addColorStop(0.5, "rgba(60,100,180,0.03)");
  core.addColorStop(1, "rgba(40,70,140,0)");
  ctx.fillStyle = core;
  ctx.fillRect(0, 0, w, h);

  ctx.save();
  ctx.translate(gcx, gcy);
  ctx.rotate(time * 0.00015);
  for (let arm = 0; arm < 3; arm++) {
    const armAngle = (arm / 3) * Math.PI * 2;
    for (let i = 0; i < 60; i++) {
      const t = i / 60;
      const spiral = armAngle + t * Math.PI * 2.5;
      const dist = t * w * 0.4;
      const x = Math.cos(spiral) * dist;
      const y = Math.sin(spiral) * dist * 0.35;
      const size = (1 - t) * 40 + 8;
      const alpha = (1 - t) * 0.02;
      const nebGrad = ctx.createRadialGradient(x, y, 0, x, y, size);
      const hue = arm === 0 ? "40,80,160" : arm === 1 ? "60,50,140" : "100,60,130";
      nebGrad.addColorStop(0, `rgba(${hue},${alpha})`);
      nebGrad.addColorStop(1, `rgba(${hue},0)`);
      ctx.fillStyle = nebGrad;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();

  const clouds = [
    { x: w * 0.2, y: h * 0.7, r: 150, color: "30,50,120" },
    { x: w * 0.8, y: h * 0.3, r: 120, color: "20,60,140" },
    { x: w * 0.6, y: h * 0.8, r: 100, color: "50,30,100" },
  ];
  for (const c of clouds) {
    const cx = c.x + Math.sin(time * 0.0015 + c.r) * 12;
    const cy = c.y + Math.cos(time * 0.0012 + c.r) * 10;
    const cg = ctx.createRadialGradient(cx, cy, 0, cx, cy, c.r);
    cg.addColorStop(0, `rgba(${c.color},0.04)`);
    cg.addColorStop(0.6, `rgba(${c.color},0.015)`);
    cg.addColorStop(1, `rgba(${c.color},0)`);
    ctx.fillStyle = cg;
    ctx.fillRect(0, 0, w, h);
  }
}

export function drawStars(ctx, stars, time) {
  for (const s of stars) {
    const twinkle = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(time * s.twinkleSpeed + s.twinkleOffset));
    const alpha = twinkle * 0.6;

    if (s.r > 0.8) {
      const glow = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 4);
      glow.addColorStop(0, `rgba(180,200,255,${alpha * 0.15})`);
      glow.addColorStop(1, `rgba(180,200,255,0)`);
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r * 4, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(200,215,255,${alpha})`;
    ctx.fill();
  }

  const shootingCount = 3;
  for (let i = 0; i < shootingCount; i++) {
    const period = 400 + i * 270;
    const phase = (time + i * 137) % period;
    const t = phase / period;
    if (t > 0.15) continue;
    const progress = t / 0.15;
    const sw = ctx.canvas.width / (window.devicePixelRatio || 1);
    const sh = ctx.canvas.height / (window.devicePixelRatio || 1);
    const startX = (0.2 + (i * 0.3)) * sw;
    const startY = (0.05 + (i * 0.15)) * sh;
    const angle = 0.6 + i * 0.3;
    const len = 60 + i * 20;
    const cx = startX + Math.cos(angle) * len * progress;
    const cy = startY + Math.sin(angle) * len * progress;
    const tailX = cx - Math.cos(angle) * len * 0.4;
    const tailY = cy - Math.sin(angle) * len * 0.4;
    const fadeIn = Math.min(1, progress * 4);
    const fadeOut = Math.max(0, 1 - (progress - 0.6) / 0.4);
    const a = fadeIn * fadeOut * 0.7;
    const grad = ctx.createLinearGradient(tailX, tailY, cx, cy);
    grad.addColorStop(0, `rgba(180,200,255,0)`);
    grad.addColorStop(1, `rgba(220,235,255,${a})`);
    ctx.beginPath();
    ctx.moveTo(tailX, tailY);
    ctx.lineTo(cx, cy);
    ctx.strokeStyle = grad;
    ctx.lineWidth = 1.5;
    ctx.stroke();
    const headGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 4);
    headGlow.addColorStop(0, `rgba(240,248,255,${a})`);
    headGlow.addColorStop(1, `rgba(200,220,255,0)`);
    ctx.fillStyle = headGlow;
    ctx.beginPath();
    ctx.arc(cx, cy, 4, 0, Math.PI * 2);
    ctx.fill();
  }
}

export function drawEdges(ctx, nodes, edges, w, h) {
  ctx.lineWidth = 0.6;
  for (const [aId, bId] of edges) {
    const a = nodes.find((n) => n.id === aId);
    const b = nodes.find((n) => n.id === bId);
    if (!a || !b || a.dying || b.dying) continue;
    const pa = project(a, w, h);
    const pb = project(b, w, h);
    const alpha = Math.min(pa.scale, pb.scale) * 0.08;
    const grad = ctx.createLinearGradient(pa.sx, pa.sy, pb.sx, pb.sy);
    const ca = getPalette(a.colorIdx).atmo;
    const cb = getPalette(b.colorIdx).atmo;
    grad.addColorStop(0, `rgba(${ca[0]},${ca[1]},${ca[2]},${alpha})`);
    grad.addColorStop(1, `rgba(${cb[0]},${cb[1]},${cb[2]},${alpha})`);
    ctx.beginPath();
    ctx.moveTo(pa.sx, pa.sy);
    ctx.lineTo(pb.sx, pb.sy);
    ctx.strokeStyle = grad;
    ctx.stroke();
  }
}

function hash(n) {
  let h = Math.abs(n * 2654435761 | 0);
  h = ((h >>> 16) ^ h) * 0x45d9f3b | 0;
  return Math.abs(((h >>> 16) ^ h)) / 4294967296;
}

function drawPlanet(ctx, sx, sy, r, pal, node, time) {
  if (r < 1) return;
  const { base, hi, shadow, atmo } = pal;

  const lightAngle = time * 0.003 + node.rotationOffset;
  const lightX = -0.4 + Math.sin(lightAngle) * 0.08;
  const lightY = -0.4 + Math.cos(lightAngle * 0.7) * 0.06;

  // Outer atmosphere halo with fresnel-like falloff
  const glowR = Math.max(r * (node.isPulsing ? 3.5 : 2.4), 2);
  const atmoGrad = ctx.createRadialGradient(sx, sy, Math.max(0, r * 0.85), sx, sy, glowR);
  atmoGrad.addColorStop(0, `rgba(${atmo[0]},${atmo[1]},${atmo[2]},0.18)`);
  atmoGrad.addColorStop(0.3, `rgba(${atmo[0]},${atmo[1]},${atmo[2]},0.08)`);
  atmoGrad.addColorStop(0.6, `rgba(${atmo[0]},${atmo[1]},${atmo[2]},0.02)`);
  atmoGrad.addColorStop(1, `rgba(${atmo[0]},${atmo[1]},${atmo[2]},0)`);
  ctx.beginPath();
  ctx.arc(sx, sy, glowR, 0, Math.PI * 2);
  ctx.fillStyle = atmoGrad;
  ctx.fill();

  // Cast shadow behind planet (depth cue)
  if (r > 6) {
    const shadowOff = r * 0.15;
    const shadowGrad = ctx.createRadialGradient(
      sx + shadowOff, sy + shadowOff, Math.max(0, r * 0.5),
      sx + shadowOff, sy + shadowOff, Math.max(1, r * 1.8)
    );
    shadowGrad.addColorStop(0, "rgba(0,0,0,0.2)");
    shadowGrad.addColorStop(1, "rgba(0,0,0,0)");
    ctx.beginPath();
    ctx.arc(sx + shadowOff, sy + shadowOff, r * 1.8, 0, Math.PI * 2);
    ctx.fillStyle = shadowGrad;
    ctx.fill();
  }

  ctx.save();
  ctx.beginPath();
  ctx.arc(sx, sy, r, 0, Math.PI * 2);
  ctx.clip();

  const bodyGrad = ctx.createRadialGradient(
    sx + lightX * r * 0.7, sy + lightY * r * 0.7, Math.max(0, r * 0.05),
    sx - lightX * r * 0.4, sy - lightY * r * 0.4, Math.max(1, r * 1.3)
  );
  bodyGrad.addColorStop(0, `rgb(${Math.min(255, hi[0] + 40)},${Math.min(255, hi[1] + 40)},${Math.min(255, hi[2] + 40)})`);
  bodyGrad.addColorStop(0.2, `rgb(${hi[0]},${hi[1]},${hi[2]})`);
  bodyGrad.addColorStop(0.5, `rgb(${base[0]},${base[1]},${base[2]})`);
  bodyGrad.addColorStop(0.8, `rgb(${shadow[0]},${shadow[1]},${shadow[2]})`);
  bodyGrad.addColorStop(1, `rgb(${Math.max(0, shadow[0] - 20)},${Math.max(0, shadow[1] - 20)},${Math.max(0, shadow[2] - 20)})`);
  ctx.fillStyle = bodyGrad;
  ctx.fillRect(sx - r, sy - r, r * 2, r * 2);

  // Surface texture — procedural spots/features
  if (r > 10) {
    const spotCount = 5 + Math.floor(hash(node.id * 7) * 8);
    for (let s = 0; s < spotCount; s++) {
      const sa = hash(node.id * 13 + s * 37) * Math.PI * 2;
      const sd = hash(node.id * 17 + s * 41) * r * 0.7;
      const spotX = sx + Math.cos(sa + time * 0.002) * sd;
      const spotY = sy + Math.sin(sa) * sd * 0.8;
      const spotR = r * (0.08 + hash(node.id * 19 + s * 43) * 0.18);
      const spotAlpha = 0.06 + hash(node.id * 23 + s * 47) * 0.08;
      const useHi = hash(node.id * 29 + s * 53) > 0.5;
      const sc = useHi ? hi : shadow;
      const sg = ctx.createRadialGradient(spotX, spotY, 0, spotX, spotY, spotR);
      sg.addColorStop(0, `rgba(${sc[0]},${sc[1]},${sc[2]},${spotAlpha})`);
      sg.addColorStop(1, `rgba(${sc[0]},${sc[1]},${sc[2]},0)`);
      ctx.fillStyle = sg;
      ctx.beginPath();
      ctx.arc(spotX, spotY, spotR, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Atmospheric bands with subtle curvature
  if (node.bands && r > 10) {
    const bandCount = 5 + Math.floor(r / 5);
    for (let b = 0; b < bandCount; b++) {
      const by = sy - r + (b / bandCount) * r * 2;
      const bandWidth = r * 2 / bandCount * (0.3 + hash(node.id * 31 + b) * 0.4);
      const bandAlpha = 0.05 + Math.sin(b * 1.3 + node.rotationOffset + time * 0.001) * 0.03;
      const useColor = b % 2 === 0 ? hi : base;
      ctx.fillStyle = `rgba(${useColor[0]},${useColor[1]},${useColor[2]},${Math.abs(bandAlpha)})`;
      ctx.fillRect(sx - r, by, r * 2, bandWidth);
    }
  }

  // Primary specular highlight (sharp, bright)
  const specCx = sx + lightX * r * 0.5;
  const specCy = sy + lightY * r * 0.5;
  const specGrad = ctx.createRadialGradient(specCx, specCy, 0, specCx, specCy, Math.max(1, r * 0.35));
  specGrad.addColorStop(0, "rgba(255,255,255,0.45)");
  specGrad.addColorStop(0.3, "rgba(255,255,255,0.15)");
  specGrad.addColorStop(0.7, "rgba(255,255,255,0.03)");
  specGrad.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = specGrad;
  ctx.fillRect(sx - r, sy - r, r * 2, r * 2);

  // Secondary specular (broader, softer)
  const spec2Grad = ctx.createRadialGradient(
    sx + lightX * r * 0.35, sy + lightY * r * 0.35, 0,
    sx + lightX * r * 0.35, sy + lightY * r * 0.35, Math.max(1, r * 0.7)
  );
  spec2Grad.addColorStop(0, "rgba(255,255,255,0.08)");
  spec2Grad.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = spec2Grad;
  ctx.fillRect(sx - r, sy - r, r * 2, r * 2);

  // Terminator with smooth S-curve transition
  const termGrad = ctx.createLinearGradient(
    sx + lightX * r * 0.3, sy + lightY * r * 0.3,
    sx - lightX * r * 1.2, sy - lightY * r * 1.2
  );
  termGrad.addColorStop(0, "rgba(0,0,0,0)");
  termGrad.addColorStop(0.35, "rgba(0,0,0,0)");
  termGrad.addColorStop(0.55, "rgba(0,0,0,0.15)");
  termGrad.addColorStop(0.75, "rgba(0,0,0,0.35)");
  termGrad.addColorStop(1, "rgba(0,0,0,0.55)");
  ctx.fillStyle = termGrad;
  ctx.fillRect(sx - r, sy - r, r * 2, r * 2);

  // Fresnel rim light on the dark side
  const rimGrad = ctx.createRadialGradient(sx, sy, Math.max(0, r * 0.8), sx, sy, Math.max(1, r));
  rimGrad.addColorStop(0, "rgba(0,0,0,0)");
  rimGrad.addColorStop(0.7, "rgba(0,0,0,0)");
  rimGrad.addColorStop(1, `rgba(${atmo[0]},${atmo[1]},${atmo[2]},0.2)`);
  ctx.fillStyle = rimGrad;
  ctx.fillRect(sx - r, sy - r, r * 2, r * 2);

  ctx.restore();

  // Ring system (more realistic with multiple bands and opacity variation)
  if (node.hasRing && r > 8) {
    ctx.save();
    ctx.translate(sx, sy);
    const ringW = r * 2.4;
    const ringH = r * node.ringTilt;

    for (let ring = 0; ring < 3; ring++) {
      const scale = 1 - ring * 0.12;
      const rw = ringW * scale;
      const rh = ringH * scale;
      const lw = r * (0.18 - ring * 0.04);
      const ringAlpha = 0.22 - ring * 0.06;

      ctx.beginPath();
      ctx.ellipse(0, 0, rw, rh, 0, 0, Math.PI * 2);
      const ringColor = ring % 2 === 0 ? hi : base;
      ctx.strokeStyle = `rgba(${ringColor[0]},${ringColor[1]},${ringColor[2]},${ringAlpha})`;
      ctx.lineWidth = lw;
      ctx.stroke();
    }

    // Ring shadow on planet
    ctx.beginPath();
    ctx.ellipse(0, r * 0.08, ringW * 0.6, ringH * 0.3, 0, 0, Math.PI);
    ctx.fillStyle = "rgba(0,0,0,0.08)";
    ctx.fill();

    ctx.restore();
  }

  // Atmospheric rim glow (outer edge)
  ctx.beginPath();
  ctx.arc(sx, sy, r, 0, Math.PI * 2);
  const rimStroke = ctx.createRadialGradient(
    sx + lightX * r * 0.3, sy + lightY * r * 0.3, r * 0.9,
    sx, sy, r
  );
  rimStroke.addColorStop(0, `rgba(${atmo[0]},${atmo[1]},${atmo[2]},0)`);
  rimStroke.addColorStop(1, `rgba(${atmo[0]},${atmo[1]},${atmo[2]},0.25)`);
  ctx.strokeStyle = rimStroke;
  ctx.lineWidth = 1.5;
  ctx.stroke();
}

export function drawNodes(ctx, nodes, w, h, selectedId, time) {
  const sorted = [...nodes].sort((a, b) => b.z - a.z);

  for (const node of sorted) {
    if (node.baseR < 1) continue;
    const p = project(node, w, h);
    const r = Math.max(1, node.baseR * p.scale);
    const pal = getPalette(node.colorIdx);
    const isSelected = node.id === selectedId;

    // Depth-of-field: far objects get slightly blurred via lower alpha
    const depthFade = Math.max(0.5, Math.min(1, p.scale * 1.2));
    let alpha = node.revealed ? 0.3 : depthFade;
    if (node.dying) alpha *= (1 - node.deathPhase);

    ctx.globalAlpha = alpha;
    drawPlanet(ctx, p.sx, p.sy, r, pal, node, time);
    ctx.globalAlpha = 1;

    if (isSelected && node.revealed) {
      ctx.beginPath();
      ctx.arc(p.sx, p.sy, r + 5, 0, Math.PI * 2);
      ctx.strokeStyle = nebulaColor(node.colorIdx, 0.5);
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    if (!node.revealed && !node.dying && r > 8) {
      const fontSize = Math.max(9, r * 0.55);
      ctx.font = `600 ${fontSize}px system-ui, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      ctx.fillStyle = `rgba(0,0,0,0.5)`;
      ctx.fillText(node.tip.topic, p.sx + 1, p.sy + 1);

      ctx.fillStyle = `rgba(255,250,240,${alpha * 0.92})`;
      ctx.fillText(node.tip.topic, p.sx, p.sy);
    }
  }
}

export function drawParticles(ctx, particles) {
  for (const p of particles) {
    const pr = p.r * p.life;
    if (pr <= 0) continue;

    const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, pr * 2);
    glow.addColorStop(0, `rgba(${p.color[0]},${p.color[1]},${p.color[2]},${p.life * 0.6})`);
    glow.addColorStop(1, `rgba(${p.color[0]},${p.color[1]},${p.color[2]},0)`);
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(p.x, p.y, pr * 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(p.x, p.y, pr, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${p.color[0]},${p.color[1]},${p.color[2]},${p.life * 0.8})`;
    ctx.fill();
  }
}
