import { useEffect, useState } from "react";
import { api } from "../apiClient";
import ClothingCard from "../components/molecules/ClothingCard";
import FormControl from "../components/atoms/FormControl";
import Button from "../components/atoms/Button";

const CATEGORIES = ["Delicate", "Whites", "Heavy Fabric", "Lights", "Darks", "Lint Givers", "Heavily Soiled"];

export default function ClothingPage() {
  const [clothing, setClothing] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: "", category: CATEGORIES[0], lastWashedDate: "" });
  const [saving, setSaving] = useState(false);

  const load = () => api.getClothing().then(setClothing);
  useEffect(() => { load(); }, []);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.addClothing(form);
      setForm({ name: "", category: CATEGORIES[0], lastWashedDate: "" });
      setModalOpen(false);
      await load();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="screen">
      <p className="muted">Special &amp; delicate items only — not your whole wardrobe</p>
      <Button variant="primary" onClick={() => setModalOpen(true)}>+ Add clothing item</Button>

      <div className="clothing-grid">
        {clothing.map((c) => <ClothingCard key={c.id} {...c} />)}
      </div>

      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-sheet">
            <h2 style={{ fontSize: 14, fontWeight: 600 }}>Add clothing item</h2>
            <FormControl label="Name" value={form.name} onChange={set("name")} />
            <FormControl type="select" label="Category" value={form.category} onChange={set("category")} options={CATEGORIES} />
            <FormControl type="date" label="Last washed date (optional, defaults to today)" value={form.lastWashedDate} onChange={set("lastWashedDate")} />
            <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
              <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button variant="primary" disabled={!form.name || saving} onClick={handleSave}>
                {saving ? "Saving…" : "Save"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
