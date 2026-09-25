// Tones from 03-design-system-laundry-day.md — add a matching .badge-*
// class in index.css whenever a new category is introduced.
const TONE_CLASS = {
  Delicate: "badge-delicate",
  Whites: "badge-whites",
  "Heavy Fabric": "badge-heavy-fabric",
  Lights: "badge-lights",
  Darks: "badge-darks",
  "Lint Givers": "badge-lint-givers",
  "Heavily Soiled": "badge-heavily-soiled",
};

export default function Badge({ label }) {
  const toneClass = TONE_CLASS[label] || "badge-default";
  return <span className={`badge ${toneClass}`}>{label}</span>;
}
