import { useEffect, useState } from "react";
import { api } from "../apiClient";
import LoadCard from "../components/molecules/LoadCard";
import FormControl from "../components/atoms/FormControl";

const LOAD_TYPES = ["All types", "Machine wash", "Hand wash", "Dry clean"];

export default function HistoryPage() {
  const [loads, setLoads] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [loadType, setLoadType] = useState("All types");

  useEffect(() => { api.getLoads().then(setLoads); }, []);

  const filtered = loads.filter((l) => {
    if (fromDate && l.date < fromDate) return false;
    if (toDate && l.date > toDate) return false;
    if (loadType !== "All types" && l.loadType !== loadType) return false;
    return true;
  });

  const clearFilters = () => {
    setFromDate("");
    setToDate("");
    setLoadType("All types");
  };

  const filtersActive = fromDate || toDate || loadType !== "All types";

  return (
    <div className="screen">
      <h1>History</h1>

      <div className="card" style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "flex-end" }}>
        <FormControl type="date" label="From" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
        <FormControl type="date" label="To" value={toDate} onChange={(e) => setToDate(e.target.value)} />
        <FormControl type="select" label="Load type" value={loadType} onChange={(e) => setLoadType(e.target.value)} options={LOAD_TYPES} />
        {filtersActive && (
          <button onClick={clearFilters} className="btn btn-secondary" style={{ height: 38 }}>
            Clear filter
          </button>
        )}
      </div>

      {filtered.length === 0 && (
        <div className="muted">
          {loads.length === 0 ? "No laundry logged yet." : "No loads match this filter."}
        </div>
      )}

      <div className="history-cards">
        {filtered.map((l) => <LoadCard key={l.id} {...l} />)}
      </div>

      <table className="history-table">
        <thead>
          <tr>
            <th>Date</th><th>Type</th><th>Weight</th><th>Cost</th><th>Notes</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((l) => (
            <tr key={l.id}>
              <td>{l.date}</td>
              <td>{l.loadType}</td>
              <td>{l.weight}{l.weightUnit}</td>
              <td>₱{l.cost}</td>
              <td className="muted">{l.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
