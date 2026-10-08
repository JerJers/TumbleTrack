import Badge from "../atoms/Badge";

export default function ClothingCard({ name, category, lastWashedDate }) {
  return (
    <div className="card" style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-start" }}>
      <div style={{ fontWeight: 600 }}>{name}</div>
      {category && <Badge label={category} />}
      <div className="muted">Last washed: {lastWashedDate}</div>
    </div>
  );
}
