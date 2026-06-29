import { useState, useRef, useEffect, useCallback } from "react";
import { PRESET_TIPS } from "./data/initialTips";
import {
  createNode3D,
  buildEdges,
  createStars,
  project,
  spawnExplosion,
  stepPhysics,
  stepParticles,
} from "./utils/physics";
import {
  drawBackground,
  drawStars,
  drawEdges,
  drawNodes,
  drawParticles,
} from "./utils/renderer";
import { loadPersonalTips, savePersonalTip } from "./utils/supabase";
import Header from "./components/Header";
import TipPanel from "./components/TipPanel";
import AddTipForm from "./components/AddTipForm";

export default function App() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const nodesRef = useRef([]);
  const edgesRef = useRef([]);
  const particlesRef = useRef([]);
  const starsRef = useRef([]);
  const dragRef = useRef(null);
  const timeRef = useRef(0);

  const [personalTips, setPersonalTips] = useState([]);
  const [presetTips, setPresetTips] = useState([]);
  const [selected, setSelected] = useState(null);
  const [revealProgress, setRevealProgress] = useState(0);
  const [dims, setDims] = useState({ w: 800, h: 520 });
  const [stats, setStats] = useState({ total: 0, revealed: 0 });
  const [presetsLoaded, setPresetsLoaded] = useState(false);
  const [viewMode, setViewMode] = useState("preset");
  const supabaseLoaded = useRef(false);

  const allTips = viewMode === "personal" ? personalTips : presetTips;

  const init = useCallback((tipsList, w, h) => {
    nodesRef.current = tipsList.map((t, i) => createNode3D(i, t, w, h));
    edgesRef.current = buildEdges(nodesRef.current);
    particlesRef.current = [];
    starsRef.current = createStars(280, w, h);
  }, []);

  const updateStats = useCallback(() => {
    const nodes = nodesRef.current;
    setStats({
      total: nodes.length,
      revealed: nodes.filter((n) => n.revealed).length,
    });
  }, []);

  useEffect(() => {
    const measure = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const w = rect.width;
        const h = window.innerHeight;
        setDims({ w, h });
        return { w, h };
      }
      return { w: 800, h: 520 };
    };
    const { w, h } = measure();
    init(allTips, w, h);
    updateStats();

    if (!supabaseLoaded.current) {
      supabaseLoaded.current = true;
      loadPersonalTips().then((tips) => {
        if (tips && tips.length > 0) {
          setPersonalTips(tips);
        }
      });
    }

    const onResize = () => measure();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;

    const frame = () => {
      const { w, h } = dims;
      timeRef.current += 1;

      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const dragId = dragRef.current ? dragRef.current.id : null;
      stepPhysics(nodesRef.current, edgesRef.current, dragId, w, h, timeRef.current);
      stepParticles(particlesRef.current);

      drawBackground(ctx, w, h, timeRef.current);
      drawStars(ctx, starsRef.current, timeRef.current);
      drawEdges(ctx, nodesRef.current, edgesRef.current, w, h);
      drawNodes(ctx, nodesRef.current, w, h, selected, timeRef.current);
      drawParticles(ctx, particlesRef.current);

      animRef.current = requestAnimationFrame(frame);
    };

    frame();
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [dims, selected]);

  const getNodeAt = (mx, my) => {
    const { w, h } = dims;
    const candidates = [...nodesRef.current]
      .filter((n) => !n.dying && !n.revealed)
      .sort((a, b) => b.z - a.z);
    for (const n of candidates) {
      const p = project(n, w, h);
      const r = n.baseR * p.scale;
      const dx = mx - p.sx, dy = my - p.sy;
      if (dx * dx + dy * dy < r * r) return n;
    }
    return null;
  };

  const getXY = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const touch = e.touches ? e.touches[0] : e;
    return { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
  };

  const triggerExplosion = (node) => {
    const { w, h } = dims;
    const p = project(node, w, h);
    const r = node.baseR * p.scale;
    node.isPulsing = true;
    node.pulsePhase = 0;
    particlesRef.current.push(...spawnExplosion(p.sx, p.sy, r, node.colorIdx));
    nodesRef.current.forEach((other) => {
      if (other.id === node.id || other.dying) return;
      const dx = other.x - node.x;
      const dy = other.y - node.y;
      const dz = other.z - node.z;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1;
      if (dist < 300) {
        const push = (300 - dist) / dist * 0.6;
        other.vx += dx * push * 0.04;
        other.vy += dy * push * 0.04;
        other.vz += dz * push * 0.02;
      }
    });
  };

  const onDown = (e) => {
    const { x, y } = getXY(e);
    const node = getNodeAt(x, y);
    if (node) {
      dragRef.current = { id: node.id, startX: x, startY: y, moved: false };
    }
  };

  const onMove = (e) => {
    if (!dragRef.current) return;
    const { x, y } = getXY(e);
    const n = nodesRef.current.find((nd) => nd.id === dragRef.current.id);
    if (n) {
      const dx = x - dragRef.current.startX;
      const dy = y - dragRef.current.startY;
      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) dragRef.current.moved = true;
      n.x += (x - dragRef.current.startX) * 0.8;
      n.y += (y - dragRef.current.startY) * 0.8;
      dragRef.current.startX = x;
      dragRef.current.startY = y;
      n.vx = 0; n.vy = 0;
    }
  };

  const onUp = () => {
    if (dragRef.current && !dragRef.current.moved) {
      const nodeId = dragRef.current.id;
      const node = nodesRef.current.find((n) => n.id === nodeId);
      if (node && !node.revealed) {
        triggerExplosion(node);
        node.revealed = true;
        setSelected(nodeId);
        setRevealProgress(0);
        let frame = 0;
        const revealAnim = () => {
          frame++;
          setRevealProgress(Math.min(1, frame / 20));
          if (frame < 20) requestAnimationFrame(revealAnim);
        };
        requestAnimationFrame(revealAnim);
        setTimeout(() => {
          node.dying = true;
          node.deathPhase = 0;
          updateStats();
        }, 2200);
        updateStats();
      }
    }
    dragRef.current = null;
  };

  const addTipToScene = (newTip) => {
    const n = createNode3D(nodesRef.current.length, newTip, dims.w, dims.h, 0.5);
    nodesRef.current.push(n);
    // Connect to same-category nodes
    const sameCategory = nodesRef.current.filter(
      (nd) => !nd.dying && nd.id !== n.id && nd.tip.category === newTip.category
    );
    for (const other of sameCategory) {
      edgesRef.current.push([n.id, other.id]);
    }
    if (sameCategory.length === 0 && nodesRef.current.length > 1) {
      const alive = nodesRef.current.filter((nd) => !nd.dying && nd.id !== n.id);
      if (alive.length > 0) {
        const target = alive[Math.floor(Math.random() * alive.length)];
        edgesRef.current.push([n.id, target.id]);
      }
    }
    triggerExplosion(n);
  };

  const handleAddTip = (newTip) => {
    const updated = [...personalTips, newTip];
    setPersonalTips(updated);
    savePersonalTip(newTip);
    addTipToScene(newTip);
    updateStats();
  };

  const handleAddPresetTip = (tip) => {
    setPresetTips((prev) => [...prev, tip]);
    addTipToScene(tip);
    updateStats();
  };

  const handleLoadPresets = () => {
    if (presetsLoaded) return;
    setPresetTips(PRESET_TIPS);
    for (const tip of PRESET_TIPS) {
      addTipToScene(tip);
    }
    setPresetsLoaded(true);
    updateStats();
  };

  const handleReset = () => {
    const tips = viewMode === "personal" ? personalTips : presetTips;
    init(tips, dims.w, dims.h);
    setSelected(null);
    updateStats();
  };

  const handleModeChange = (newMode) => {
    setViewMode(newMode);
    setSelected(null);
    if (newMode === "personal") {
      init(personalTips, dims.w, dims.h);
    } else {
      init(presetTips, dims.w, dims.h);
    }
    updateStats();
  };

  const selectedNode = selected !== null
    ? nodesRef.current.find((n) => n.id === selected)
    : null;

  return (
    <div
      ref={containerRef}
      dir="rtl"
      style={{
        fontFamily: "system-ui, sans-serif",
        background: "#010210",
        color: "#c0cde0",
        padding: 0,
        margin: 0,
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "block",
          cursor: "pointer",
        }}
        onMouseDown={onDown}
        onMouseMove={onMove}
        onMouseUp={onUp}
        onMouseLeave={onUp}
        onTouchStart={onDown}
        onTouchMove={onMove}
        onTouchEnd={onUp}
      />

      <div style={{ position: "relative", zIndex: 1, pointerEvents: "none" }}>
        <div style={{ pointerEvents: "auto" }}>
          <Header
            stats={stats}
            onReset={handleReset}
          />
        </div>

        <TipPanel node={selectedNode} revealProgress={revealProgress} />

        <div style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          pointerEvents: "auto",
          background: "linear-gradient(to top, rgba(1,2,16,0.95) 60%, rgba(1,2,16,0) 100%)",
          paddingTop: 30,
          maxHeight: "50vh",
          overflowY: "auto",
        }}>
          <AddTipForm
            onAdd={handleAddTip}
            onAddPreset={handleAddPresetTip}
            onLoadPresets={handleLoadPresets}
            totalCount={stats.total}
            presetsLoaded={presetsLoaded}
            activeMode={viewMode}
            onModeChange={handleModeChange}
            personalTips={personalTips}
          />
        </div>
      </div>
    </div>
  );
}
