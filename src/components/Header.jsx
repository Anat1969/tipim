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
  textDecoration: "none",
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
};

export default function Header({ stats, onReset }) {
  const allRevealed = stats.revealed >= stats.total && stats.total > 0;

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
        <a
          href="https://claude.ai/code/session_01AVn5pdqL4PojzRwRkaQpKJ"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            ...btnStyle,
            borderColor: "rgba(130,100,220,0.25)",
            color: "rgba(170,150,240,0.8)",
          }}
        >
          Claude ✦
        </a>
        <button onClick={onReset} style={{
          ...btnStyle,
          borderColor: "rgba(100,200,180,0.25)",
          color: "rgba(100,200,180,0.7)",
        }}>אפס</button>
      </div>
    </div>
  );
}
