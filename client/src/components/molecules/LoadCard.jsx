export default function LoadCard({ date, loadType, weight, weightUnit, cost, notes }) {
  return (
    <div className="card">
      <div style={{ fontWeight: 600 }}>{date}</div>
      <div className="muted">
        {loadType} · {weight}{weightUnit} · ₱{cost}
      </div>
      {notes && <div className="muted" style={{ marginTop: 4 }}>{notes}</div>}
    </div>
  );
}
