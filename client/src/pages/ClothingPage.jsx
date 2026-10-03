import { useEffect, useState } from "react";
import { api } from "../apiClient";
import ClothingCard from "../components/molecules/ClothingCard";
import FormControl from "../components/atoms/FormControl";
import Button from "../components/atoms/Button";

const CATEGORIES = [
  "Delicate",
  "Whites",
  "Heavy Fabric",
  "Lights",
  "Darks",
  "Lint Givers",
  "Heavily Soiled",
];

const INITIAL_FORM = {
  name: "",
  category: CATEGORIES[0],
  lastWashedDate: "",
};

export default function ClothingPage() {
  const [clothing, setClothing] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadClothing = async () => {
    const data = await api.getClothing();
    setClothing(data);
  };

  useEffect(() => {
    loadClothing();
  }, []);

  const handleInputChange = (key, value) => {
    setForm((prevForm) => ({
      ...prevForm,
      [key]: value,
    }));
  };
  
  const handleCloseModal = () => {
    setModalOpen(false);
    setForm(INITIAL_FORM);
    setError(null);
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);

    try {
      await api.addClothing(form);
      handleCloseModal();
      await loadClothing();
    } catch (err) {
      setError(err.message || "Could not save this item, Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="screen">
      <p className="muted">Special &amp; Clothing items only - not your whole wardrobe</p>

      <Button variant="primary" onClick={() => setModalOpen(true)}>
        + Add Clothing Item
      </Button>

      <div className="clothing-grid">
        {clothing.map((item) => (
          <ClothingCard key={item.id} {...item} />
        ))}
      </div>

      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-sheet">
            <h2 style={{ fontSize: 14, fontWeight: 600 }}>Add Clothing Item</h2>

            <FormControl
              label="Name"
              value={form.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
            />

            <FormControl 
              type="select"
              label="Category"
              value={form.category}
              options={CATEGORIES}
              onChange={(e) => handleInputChange("category", e.target.value)}
            />

            <FormControl 
              type="date"
              label="Last Washed Date"
              value={form.lastWashedDate}
              onChange={(e) => handleInputChange("lastWashedDate", e.target.value)}
            />

            <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
              {error && (
                <div style={{ color: "#b42318", fontSize: 13 }}>
                  {error}
                </div>
              )}

              <Button variant="secondary" onClick={handleCloseModal}>
                Cancel
              </Button>

              <Button variant="primary" disabled={!form.name || loading} onClick={handleSave}>
                {loading ? "Saving..." : "Save"}      
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}