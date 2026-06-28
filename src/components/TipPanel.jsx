import { useRef, useState, useCallback, useEffect } from "react";
import { SOURCE_COLORS } from "../utils/colors";

export default function TipPanel({ node, revealProgress }) {
  const panelRef = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, px: 0, py: 0 });

  useEffect(() => {
    setPos({ x: 0, y: 0 });
  }, [node?.id]);

  const onDown = useCallback((e) => {
    e.stopPropagation();
    const touch = e.touches ? e.touches[0] : e;
    dragStart.current = { x: touch.clientX, y: touch.clientY, px: pos.x, py: pos.y };
    setDragging(true);
  }, [pos]);

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e) => {
      const touch = e.touches ? e.touches[0] : e;
      setPos({
        x: dragStart.current.px + (touch.clientX - dragStart.current.x),
        y: dragStart.current.py + (touch.clientY - dragStart.current.y),
      });
    };
    const onUp = () => setDragging(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onMove);
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
    };
  }, [dragging]);

  if (!node || !node.revealed) return null;

  const tip = node.tip;
  const sc = SOURCE_COLORS[tip.source] || SOURCE_COLORS.A;
  const opacity = Math.min(1, revealProgress * 1.5);

  return (
    <div
      ref={panelRef}
      onMouseDown={onDown}
      onTouchStart={onDown}
      style={{
        position: "absolute",
        bottom: 16,
        left: "50%",
        transform: `translate(calc(-50% + ${pos.x}px), calc(${(1 - revealProgress) * 12}px + ${pos.y}px))`,
        background: "rgba(8,12,22,0.88)",
        border: "1px solid rgba(80,110,160,0.18)",
        borderRadius: 12,
        padding: "14px 20px",
        maxWidth: 400,
        minWidth: 220,
        opacity,
        transition: dragging ? "none" : "opacity 0.3s, transform 0.3s",
        backdropFilter: "blur(12px)",
        direction: "rtl",
        cursor: dragging ? "grabbing" : "grab",
        userSelect: "none",
        zIndex: 10,
      }}
    >
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
      }}>
        <div>
          <span style={{
            fontSize: 13,
            fontWeight: 600,
            color: "rgba(180,200,240,0.9)",
            letterSpacing: "0.03em",
          }}>
            {tip.topic}
          </span>
          {tip.category && (
            <span style={{
              fontSize: 9,
              color: "rgba(140,160,190,0.45)",
              marginRight: 8,
              letterSpacing: "0.04em",
            }}>
              {tip.category}
            </span>
          )}
        </div>
        <span style={{
          fontSize: 10,
          padding: "2px 8px",
          borderRadius: 4,
          background: sc.bg,
          border: `1px solid ${sc.border}`,
          color: sc.text,
          letterSpacing: "0.05em",
        }}>
          {tip.source === "A" ? "AI" : "אנושי"}
        </span>
      </div>
      <blockquote style={{
        fontSize: 18,
        lineHeight: 1.7,
        color: "rgba(200,215,240,0.9)",
        margin: 0,
        padding: "8px 16px 8px 0",
        borderRight: `3px solid ${sc.border}`,
        fontStyle: "italic",
      }}>
        &#x201F;{tip.text}&#x201E;
      </blockquote>
    </div>
  );
}
