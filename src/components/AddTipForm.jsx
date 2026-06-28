import { useState } from "react";

const inputStyle = {
  background: "transparent",
  border: "none",
  outline: "none",
  color: "rgba(180,200,230,0.85)",
  fontSize: 13,
  padding: "10px 12px",
  fontFamily: "inherit",
};

const btnBase = {
  borderRadius: 8,
  padding: "7px 16px",
  cursor: "pointer",
  fontSize: 13,
  fontFamily: "inherit",
  transition: "all 0.2s",
  letterSpacing: "0.03em",
};

export default function AddTipForm({ onAdd, totalCount }) {
  const [topic, setTopic] = useState("");
  const [text, setText] = useState("");
  const [source, setSource] = useState("A");

  const canAdd = topic.trim() && text.trim();

  const handleAdd = () => {
    if (!canAdd) return;
    onAdd({ topic: topic.trim(), text: text.trim(), source });
    setTopic("");
    setText("");
  };

  return (
    <div style={{ maxWidth: 920, margin: "14px auto 0", padding: "0 12px" }}>
      <div style={{
        display: "flex",
        gap: 8,
        background: "rgba(10,14,24,0.5)",
        border: "1px solid rgba(80,110,160,0.12)",
        borderRadius: 12,
        padding: 6,
        alignItems: "center",
        flexWrap: "wrap",
      }}>
        <input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="נושא..."
          dir="rtl"
          style={{
            ...inputStyle,
            width: 80,
            borderLeft: "1px solid rgba(80,110,160,0.12)",
          }}
        />
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          placeholder="טקסט הטיפ..."
          dir="rtl"
          style={{ ...inputStyle, flex: 1, minWidth: 140 }}
        />

        {/* Source toggle */}
        <div style={{
          display: "flex",
          borderRadius: 6,
          overflow: "hidden",
          border: "1px solid rgba(80,110,160,0.15)",
        }}>
          <button
            onClick={() => setSource("A")}
            style={{
              ...btnBase,
              padding: "6px 12px",
              fontSize: 12,
              borderRadius: 0,
              border: "none",
              background: source === "A" ? "rgba(220,130,70,0.2)" : "transparent",
              color: source === "A" ? "rgba(240,170,100,0.9)" : "rgba(150,160,180,0.4)",
            }}
          >
            A
          </button>
          <button
            onClick={() => setSource("I")}
            style={{
              ...btnBase,
              padding: "6px 12px",
              fontSize: 12,
              borderRadius: 0,
              border: "none",
              borderRight: "1px solid rgba(80,110,160,0.12)",
              background: source === "I" ? "rgba(80,160,220,0.2)" : "transparent",
              color: source === "I" ? "rgba(130,200,250,0.9)" : "rgba(150,160,180,0.4)",
            }}
          >
            I
          </button>
        </div>

        <button
          onClick={handleAdd}
          style={{
            ...btnBase,
            background: canAdd ? "rgba(60,100,180,0.2)" : "rgba(60,80,120,0.08)",
            border: "1px solid rgba(100,140,200,0.2)",
            color: canAdd ? "rgba(140,180,240,0.9)" : "rgba(130,150,180,0.3)",
            cursor: canAdd ? "pointer" : "default",
          }}
        >
          הוסף
        </button>
      </div>

      <div style={{
        textAlign: "center",
        padding: "14px 0 28px",
        fontSize: 11,
        color: "rgba(130,150,180,0.25)",
        letterSpacing: "0.06em",
      }}>
        {totalCount} כוכבים ברשת
        <span style={{ margin: "0 8px", opacity: 0.4 }}>—</span>
        <span style={{ color: "rgba(240,170,100,0.35)" }}>A</span> אנושי
        <span style={{ margin: "0 4px", opacity: 0.3 }}>/</span>
        <span style={{ color: "rgba(130,200,250,0.35)" }}>I</span> בינה מלאכותית
      </div>
    </div>
  );
}
