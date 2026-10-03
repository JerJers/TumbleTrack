import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../apiClient";
import DemoNotice from "../components/DemoNotice.jsx";
import StatCard from "../components/molecules/StatCard";
import LoadCard from "../components/molecules/LoadCard";
import Button from "../components/atoms/Button"

const OVERDUE_DAYS = 7;
const MS_PER_DAY = 1000 * 60 * 60 * 24;

export default function DashboardPage() {
  const [loads, setLoads] = useState([]);
  const [clothing, setClothing] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [loadsData, clothingData] = await Promise.all([
        api.getLoads(),
        api.getClothing(),
      ]);
      setLoads(loadsData);
      setClothing(clothingData);
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const loadsThisWeek = loads.filter((load) => new Date(load.date) >= oneWeekAgo).length;
  const totalSpent = loads.reduce((sum, load) => sum + Number(load.cost || 0), 0);
  const overdueCount = clothing.filter((item) => {
    const daysSinceWashed = (Date.now() - new Date(item.lastWashedDate)) / MS_PER_DAY;
    return daysSinceWashed > OVERDUE_DAYS;
  }).length;

  const cleanCount = clothing.length - overdueCount;

  return (
    <div className="screen">

      <DemoNotice />

      <h1>This Week</h1>

      {loading ? (
        <div className="muted">
          Loading...
        </div>
      ) : (
        <>
        <div className="stat-grid">
          <StatCard label="Loads" value={loadsThisWeek} />
          <StatCard label="Total Spent" value={`₱${totalSpent}`} />
          <StatCard label="Clean items" value={cleanCount} />
          <StatCard label="Overdue" value={overdueCount} />
        </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>

        <h2 style={{ fontSize: 14, color: "rgba(44, 44, 42, .7)" }}>
          Recent loads
        </h2>

        {loads.length === 0 && (
          <div className="muted">
            No laundry logged yet. 
          </div>

        )}
        {loads.slice(0, 5).map((load) => (
          <LoadCard key={load.id} {...load} />
        ))}
      </div>
    </>
  )}
    <Link to="/log">
      <Button variant="primary"> + Log Load</Button>
    </Link>
  </div>
  );
}
