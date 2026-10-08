import { useEffect, useState } from "react";
import { api } from "../apiClient";
import LoadCard from "../components/molecules/LoadCard";
import FormControl from "../components/atoms/FormControl";
import Button from "../components/atoms/Button"

const LOAD_TYPES = [
  "All types", 
  "Machine wash", 
  "Hand wash", 
  "Dry clean"];

export default function HistoryPage() {
  const [loads, setLoads] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [loadType, setLoadType] = useState("All types");

  const loadHistory = async () => {
    try {
      const data = await api.getLoads();
      setLoads(data);
    } catch (err) {
      console.error("Failed to load history.", err);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const filteredLoads = loads.filter((load) => {
    if (fromDate && load.date < fromDate) return false;
    if (toDate && load.date > toDate) return false;
    if (loadType !== "All types" && load.loadType !== loadType) return false;
    return true;
  });

  const clearFilters = () => {
    setFromDate("");
    setToDate("");
    setLoadType("All types");
  };

  const hasActiveFilters = fromDate || toDate || loadType !== "All types";

  return (
    <div className="screen">
      <h1>History</h1>

      <div className="card"
        style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "flex-end", 
        }}
      >
        <FormControl
          type="date"
          label="From"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)} />
        <FormControl
          type="date"
          label="To"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)} />
        <FormControl 
          type="select"
          label="Load type"
          value={loadType}
          options={LOAD_TYPES}
          onChange={(e) => setLoadType(e.target.value)} />

        {hasActiveFilters && (
          <Button
            variant="secondary"
            onClick={clearFilters}>
            Clear Filter 
          </Button>

        )}
      </div>

      {filteredLoads.length === 0 && (
        <div className="muted">
          {loads.length === 0
            ? "No laundry logged yet."
            : "No loads match this filter."}
        </div>
      )}

      <div className="history-cards">
        {filteredLoads.map((load) => (
          <LoadCard key={load.id} {...load} />
        ))}
      </div>

      <table className="history-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Weight</th>
            <th>Cost</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          {filteredLoads.map((load) => (
            <tr key={load.id}>
              <td>{load.date}</td>
              <td>{load.loadType}</td>
              <td>
                {load.weight}
                {load.weightUnit}
              </td>
              <td>₱{load.cost}</td>
              <td className="muted">{load.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}