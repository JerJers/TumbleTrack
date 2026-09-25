import { useEffect, useState } from "react";
import { api } from "../apiClient";
import LoadCard from "../components/molecules/LoadCard";

export default function HistoryPage() {
  const [loads, setLoads] = useState([]);

  useEffect(() => { api.getLoads().then(setLoads); }, []);

  return (
    <div className="screen">
      <h1>History</h1>

      {loads.length === 0 && <div className="muted">No laundry logged yet.</div>}

      <div className="history-cards">
        {loads.map((l) => <LoadCard key={l.id} {...l} />)}
      </div>

      <table className="history-table">
        <thead>
          <tr>
            <th>Date</th><th>Type</th><th>Weight</th><th>Cost</th><th>Notes</th>
          </tr>
        </thead>
        <tbody>
          {loads.map((l) => (
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
