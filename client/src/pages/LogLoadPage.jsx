import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../apiClient";
import FormControl from "../components/atoms/FormControl";
import Button from "../components/atoms/Button";

const LOAD_TYPES = ["Machine wash", "Hand wash", "Dry clean"];

export default function LogLoadPage() {
  const navigate = useNavigate();
  const [clothing, setClothing] = useState([]);
  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    loadType: LOAD_TYPES[0],
    weight: "",
    cost: "",
    notes: "",
    clothingIds: [],
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => { api.getClothing().then(setClothing); }, []);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const toggleClothing = (id) => {
    setForm((f) => ({
      ...f,
      clothingIds: f.clothingIds.includes(id)
        ? f.clothingIds.filter((c) => c !== id)
        : [...f.clothingIds, id],
    }));
  };

  const canSave = form.date && form.loadType && form.weight !== "" && form.cost !== "";

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.addLoad({ ...form, weight: Number(form.weight), cost: Number(form.cost), weightUnit: "kg" });
      navigate("/");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="screen" style={{ maxWidth: 420 }}>
      <h1>Log a load</h1>

      <FormControl type="date" label="Date" value={form.date} onChange={set("date")} />
      <FormControl type="select" label="Load type" value={form.loadType} onChange={set("loadType")} options={LOAD_TYPES} />
      <FormControl type="number" label="Weight (kg)" value={form.weight} onChange={set("weight")} />
      <FormControl type="number" label="Cost (₱)" value={form.cost} onChange={set("cost")} />
      <FormControl type="textarea" label="Notes" value={form.notes} onChange={set("notes")} />

      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <span style={{ fontSize: 13, color: "rgba(44,44,42,.7)" }}>Tag special clothing items (optional)</span>
        {clothing.length === 0 && <span className="muted">No tracked clothing items yet.</span>}
        {clothing.map((c) => (
          <label key={c.id} style={{ fontSize: 14, display: "flex", alignItems: "center", gap: 8 }}>
            <input type="checkbox" checked={form.clothingIds.includes(c.id)} onChange={() => toggleClothing(c.id)} />
            {c.name}
          </label>
        ))}
      </div>

      <Button variant="primary" disabled={!canSave || saving} onClick={handleSave}>
        {saving ? "Saving…" : "Save"}
      </Button>
    </div>
  );
}
