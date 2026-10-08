import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../apiClient.js";
import FormControl from "../components/atoms/FormControl";
import Button from "../components/atoms/Button.jsx";

const LOAD_TYPES = [
  "Machine wash", 
  "Hand wash",
  "Dry clean" 
];

const INITIAL_FORM = {
  date: new Date().toISOString().slice(0, 10),
  loadType: LOAD_TYPES[0],
  weight: "",
  cost: "",
  notes: "",
  clothingIds: [],
};

export default function LogLoadPage() {
  const navigate = useNavigate();

  const [clothing, setClothing] = useState([]);
  const [form, setForm] = useState(INITIAL_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const loadClothing = async() => {
    try {
      const data = await api.getClothing();
      setClothing(data);
    } catch (err) {
      console.error("Failed to load clothing items.", err);
    }
  };

  useEffect(() => {
    loadClothing();
  }, []);

  const handleInputChange = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const toggleClothingItem = (id) => {
    setForm((prev) => {
      const exists = prev.clothingIds.includes(id);
      const updatedIds = exists
        ? prev.clothingIds.filter((item) => item !== id)
        : [...prev.clothingIds, id];

      return { ...prev, clothingIds: updatedIds };
    });
  };

  const isFormValid = 
  form.date &&
  form.loadType &&
  form.weight !== "" &&
  form.cost !== "";

  const handleSave = async() => {
    setSaving(true);
    setError(null);

    try {
      await api.addLoad({
        ...form,
        weight: Number(form.weight),
        cost: Number(form.cost),
        weightUnit: "kg",
      });
      navigate("/");
    } catch (err) {
      setError(err.message || "Could not save this load. Please Try Again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="screen" style={{ maxWidth: 420 }}>
      <h1>Log a load</h1>

      <FormControl
        type="date"
        label="Date"
        value={form.date}
        onChange={(e) => handleInputChange("date", e.target.value)} />

      <FormControl
        type="select"
        label="Load Type"
        value={form.loadType}
        options={LOAD_TYPES}
        onChange={(e) => handleInputChange("loadType", e.target.value)} />

      <FormControl
        type="number"
        label="Weight (kg)"
        value={form.weight}
        onChange={(e) => handleInputChange("weight", e.target.value)} />

      <FormControl
        type="number"
        label="Cost (₱)"
        value={form.cost}
        onChange={(e) => handleInputChange("cost", e.target.value)} />

      <FormControl
        type="textarea"
        label="Notes"
        value={form.notes}
        onChange={(e) => handleInputChange("notes", e.target.value)} />

      <div style={{ display: "flex", flexDirection: "column", gap: 4}}>
        <span style={{ fontSize: 13, color: "rgba(44, 44, 42, .7)" }}>
          Tag special clothing items (Optional)
        </span>

        {clothing.length === 0 && (
          <span className="muted">No tracked clothing items yet.</span>
        )}

        {clothing.map((item) => (
          <label
            key={item.id}
            style={{ fontSize: 14, display: "flex", alignItems: "center", gap: 8 }}>
              <input 
                type="checkbox"
                checked={form.clothingIds.includes(item.id)}
                onChange={() => toggleClothingItem(item.id)} />

              {item.name}
            </label>
        ))}
      </div>

      {error && (
        <div style={{ color: "#b42318", fontSize: 13 }}>{error}</div>
      )}
      <Button
        variant="primary"
        disabled={!isFormValid || saving}
        onClick={handleSave}>
          {saving ? "Saving...": "Save"}
        </Button>
    </div>
  );
}
