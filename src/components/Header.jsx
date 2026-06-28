import { useRef } from "react";

const btnStyle = {
  background: "rgba(60,80,120,0.15)",
  border: "1px solid rgba(100,140,200,0.2)",
  color: "rgba(180,200,230,0.7)",
  borderRadius: 8,
  padding: "7px 16px",
  cursor: "pointer",
  fontSize: 13,
  fontFamily: "inherit",
  transition: "all 0.2s",
  letterSpacing: "0.03em",
};

export default function Header({ stats, onSave, onLoad, onReset }) {
  const fileInputRef = useRef(null);
  const allRevealed = stats.revealed >= stats.total && stats.total > 0;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (Array.isArray(data) && data.length > 0 && data[0].topic) {
          onLoad(data);
        }
      } catch (err) { /* ignore bad files */ }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <div style={{
      padding: "24px 28px 8px",
      maxWidth: 920,
      margin: "0 auto",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      flexWrap: "wrap",
      gap: 12,
    }}>
      <div>
        <h1 style={{
          fontSize: 21,
          fontWeight: 300,
          letterSpacing: "0.1em",
          color: "rgba(140,170,220,0.85)",
          margin: 0,
        }}>
          רשת ידע מולקולרית
        </h1>
        <p style={{
          fontSize: 12,
          color: "rgba(130,150,180,0.45)",
          margin: "5px 0 0",
          letterSpacing: "0.04em",
        }}>
          לחצו על כוכב לחשיפה — {stats.revealed} מתוך {stats.total} נחשפו
          {allRevealed && " — כל הטיפים נחשפו"}
        </p>
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button onClick={onSave} style={btnStyle}>שמור</button>
        <button onClick={() => fileInputRef.current?.click()} style={btnStyle}>טען</button>
        <button onClick={onReset} style={{
          ...btnStyle,
          borderColor: "rgba(100,200,180,0.25)",
          color: "rgba(100,200,180,0.7)",
        }}>אפס</button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
      </div>
    </div>
  );
}
