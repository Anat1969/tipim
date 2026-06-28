import { useState } from "react";
import { PRESET_TIPS, CATEGORIES, CATEGORY_COLOR_MAP } from "../data/initialTips";
import { PLANET_PALETTES } from "../utils/colors";

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
  border: "none",
};

export default function AddTipForm({ onAdd, onAddPreset, onLoadPresets, totalCount, presetsLoaded }) {
  const [mode, setMode] = useState("preset");
  const [topic, setTopic] = useState("");
  const [text, setText] = useState("");
  const [source, setSource] = useState("I");
  const [category, setCategory] = useState("");

  const canAdd = topic.trim() && text.trim();

  const handleAdd = () => {
    if (!canAdd) return;
    onAdd({ topic: topic.trim(), text: text.trim(), source, category: category.trim() || topic.trim() });
    setTopic("");
    setText("");
    setCategory("");
  };

  return (
    <div style={{ maxWidth: 920, margin: "14px auto 0", padding: "0 12px" }}>
      {/* Mode toggle */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        gap: 4,
        marginBottom: 10,
      }}>
        <button
          onClick={() => setMode("preset")}
          style={{
            ...btnBase,
            padding: "8px 20px",
            background: mode === "preset" ? "rgba(220,130,70,0.15)" : "rgba(30,40,60,0.4)",
            color: mode === "preset" ? "rgba(240,170,100,0.9)" : "rgba(130,150,180,0.4)",
            border: mode === "preset" ? "1px solid rgba(220,130,70,0.3)" : "1px solid rgba(80,110,160,0.1)",
            borderRadius: "8px 0 0 8px",
          }}
        >
          טיפים מוכנים
        </button>
        <button
          onClick={() => setMode("personal")}
          style={{
            ...btnBase,
            padding: "8px 20px",
            background: mode === "personal" ? "rgba(80,160,220,0.15)" : "rgba(30,40,60,0.4)",
            color: mode === "personal" ? "rgba(130,200,250,0.9)" : "rgba(130,150,180,0.4)",
            border: mode === "personal" ? "1px solid rgba(80,160,220,0.3)" : "1px solid rgba(80,110,160,0.1)",
            borderRadius: "0 8px 8px 0",
          }}
        >
          טיפ אישי
        </button>
      </div>

      {mode === "preset" ? (
        <PresetPanel onAdd={onAddPreset} onLoadAll={onLoadPresets} presetsLoaded={presetsLoaded} />
      ) : (
        <div>
          <div style={{
            display: "flex",
            gap: 8,
            background: "rgba(10,14,24,0.5)",
            border: "1px solid rgba(80,160,220,0.15)",
            borderRadius: 12,
            padding: 6,
            alignItems: "center",
            flexWrap: "wrap",
          }}>
            <input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="קטגוריה..."
              dir="rtl"
              style={{
                ...inputStyle,
                width: 80,
                borderLeft: "1px solid rgba(80,110,160,0.12)",
              }}
            />
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
                background: canAdd ? "rgba(80,160,220,0.2)" : "rgba(60,80,120,0.08)",
                border: "1px solid rgba(80,160,220,0.25)",
                color: canAdd ? "rgba(130,200,250,0.9)" : "rgba(130,150,180,0.3)",
                cursor: canAdd ? "pointer" : "default",
              }}
            >
              הוסף
            </button>
          </div>
        </div>
      )}

      <div style={{
        textAlign: "center",
        padding: "14px 0 28px",
        fontSize: 11,
        color: "rgba(130,150,180,0.25)",
        letterSpacing: "0.06em",
      }}>
        {totalCount} כוכבים ברשת
        <span style={{ margin: "0 8px", opacity: 0.4 }}>—</span>
        <span style={{ color: "rgba(240,170,100,0.35)" }}>A</span> בינה מלאכותית
        <span style={{ margin: "0 4px", opacity: 0.3 }}>/</span>
        <span style={{ color: "rgba(130,200,250,0.35)" }}>I</span> אנושי
      </div>
    </div>
  );
}

function PresetPanel({ onAdd, onLoadAll, presetsLoaded }) {
  const [expandedCat, setExpandedCat] = useState(null);

  return (
    <div style={{
      background: "rgba(10,14,24,0.5)",
      border: "1px solid rgba(220,130,70,0.12)",
      borderRadius: 12,
      padding: 12,
    }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
      }}>
        <span style={{
          fontSize: 12,
          color: "rgba(240,170,100,0.6)",
          letterSpacing: "0.04em",
        }}>
          24 טיפים — 5 קטגוריות
        </span>
        <button
          onClick={onLoadAll}
          disabled={presetsLoaded}
          style={{
            ...btnBase,
            padding: "6px 16px",
            fontSize: 12,
            background: presetsLoaded ? "rgba(60,80,120,0.08)" : "rgba(220,130,70,0.15)",
            border: "1px solid rgba(220,130,70,0.25)",
            color: presetsLoaded ? "rgba(130,150,180,0.3)" : "rgba(240,170,100,0.9)",
            cursor: presetsLoaded ? "default" : "pointer",
          }}
        >
          {presetsLoaded ? "נטענו" : "טען הכל"}
        </button>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {CATEGORIES.map((cat) => {
          const tips = PRESET_TIPS.filter((t) => t.category === cat);
          const isExpanded = expandedCat === cat;
          const palIdx = CATEGORY_COLOR_MAP[cat] ?? 0;
          const pal = PLANET_PALETTES[palIdx];
          const catColor = `rgba(${pal.base[0]},${pal.base[1]},${pal.base[2]}`;
          return (
            <div key={cat} style={{ width: "100%" }}>
              <button
                onClick={() => setExpandedCat(isExpanded ? null : cat)}
                style={{
                  ...btnBase,
                  width: "100%",
                  textAlign: "right",
                  padding: "8px 14px",
                  background: isExpanded ? `${catColor},0.12)` : "rgba(30,40,60,0.3)",
                  border: `1px solid ${catColor},${isExpanded ? 0.25 : 0.12})`,
                  color: isExpanded ? `${catColor},0.9)` : "rgba(180,200,230,0.6)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderRadius: isExpanded ? "8px 8px 0 0" : 8,
                }}
              >
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{
                    width: 8, height: 8, borderRadius: "50%",
                    background: `${catColor},0.7)`,
                    boxShadow: `0 0 6px ${catColor},0.4)`,
                    display: "inline-block",
                  }} />
                  {cat}
                </span>
                <span style={{ fontSize: 11, opacity: 0.5 }}>
                  {tips.length} טיפים {isExpanded ? "▲" : "▼"}
                </span>
              </button>
              {isExpanded && (
                <div style={{
                  background: "rgba(15,20,35,0.6)",
                  border: "1px solid rgba(220,130,70,0.08)",
                  borderTop: "none",
                  borderRadius: "0 0 8px 8px",
                  padding: 8,
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                }}>
                  {tips.map((tip, i) => (
                    <div key={i} style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "6px 10px",
                      borderRadius: 6,
                      background: "rgba(20,28,45,0.5)",
                      border: "1px solid rgba(80,110,160,0.08)",
                    }}>
                      <span style={{
                        fontSize: 10,
                        padding: "1px 6px",
                        borderRadius: 3,
                        background: tip.source === "A" ? "rgba(220,130,70,0.15)" : "rgba(80,160,220,0.15)",
                        color: tip.source === "A" ? "rgba(240,170,100,0.8)" : "rgba(130,200,250,0.8)",
                        flexShrink: 0,
                      }}>
                        {tip.source}
                      </span>
                      <span style={{
                        fontSize: 11,
                        color: "rgba(180,200,230,0.7)",
                        fontWeight: 600,
                        flexShrink: 0,
                        minWidth: 50,
                      }}>
                        {tip.topic}
                      </span>
                      <span style={{
                        fontSize: 11,
                        color: "rgba(160,180,210,0.5)",
                        flex: 1,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}>
                        {tip.text}
                      </span>
                      <button
                        onClick={() => onAdd(tip)}
                        style={{
                          ...btnBase,
                          padding: "3px 10px",
                          fontSize: 11,
                          background: "rgba(220,130,70,0.12)",
                          border: "1px solid rgba(220,130,70,0.2)",
                          color: "rgba(240,170,100,0.8)",
                          flexShrink: 0,
                        }}
                      >
                        +
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
