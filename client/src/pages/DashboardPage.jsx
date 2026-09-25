import { useEffect, useState } from "react";
import { api } from "../apiClient";
import StatCard from "../components/molecules/StatCard";
import LoadCard from "../components/molecules/LoadCard";
import Button from "../components/atoms/Button";
import DemoNotice from "../components/DemoNotice.jsx";
import { Link } from "react-router-dom";

const OVERDUE_DAYS = 7;

export default function DashboardPage() {
  const [loads, setLoads] = useState([]);
  const [clothing, setClothing] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getLoads(), api.getClothing()])
      .then(([l, c]) => { setLoads(l); setClothing(c); })
      .finally(() => setLoading(false));
  }, []);

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const loadsThisWeek = loads.filter((l) => new Date(l.date) >= oneWeekAgo).length;
  const totalSpent = loads.reduce((sum, l) => sum + Number(l.cost || 0), 0);

  const overdueCount = clothing.filter((c) => {
    const days = (Date.now() - new Date(c.lastWashedDate)) / 86400000;
    return days > OVERDUE_DAYS;
  }).length;
  const cleanCount = clothing.length - overdueCount;

  return (
    <div className="screen">
      <DemoNotice />
      <h1>This week</h1>

      {loading ? (
        <div className="muted">Loading…</div>
      ) : (
        <>
          <div className="stat-grid">
            <StatCard label="Loads" value={loadsThisWeek} />
            <StatCard label="Spent" value={`₱${totalSpent}`} />
            <StatCard label="Clean items" value={cleanCount} />
            <StatCard label="Overdue" value={overdueCount} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <h2 style={{ fontSize: 14, color: "rgba(44,44,42,.7)" }}>Recent loads</h2>
            {loads.length === 0 && <div className="muted">No laundry logged yet.</div>}
            {loads.slice(0, 5).map((l) => <LoadCard key={l.id} {...l} />)}
          </div>
        </>
      )}

      <Link to="/log">
        <Button variant="primary">+ Log load</Button>
      </Link>
    </div>
  );
}
