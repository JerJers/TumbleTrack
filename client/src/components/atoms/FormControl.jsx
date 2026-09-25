export default function FormControl({ type = "text", label, value, onChange, options, error, ...rest }) {
  const inputId = label ? label.toLowerCase().replace(/\s+/g, "-") : undefined;

  return (
    <div className="form-control">
      {label && <label htmlFor={inputId}>{label}</label>}
      {type === "select" ? (
        <select id={inputId} value={value} onChange={onChange} {...rest}>
          {options?.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      ) : type === "textarea" ? (
        <textarea id={inputId} value={value} onChange={onChange} {...rest} />
      ) : (
        <input id={inputId} type={type} value={value} onChange={onChange} {...rest} />
      )}
      {error && <span className="error">{error}</span>}
    </div>
  );
}
