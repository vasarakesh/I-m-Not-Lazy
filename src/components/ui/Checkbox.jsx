export function Checkbox({ label, checked, onChange, id }) {
  return (
    <label className="checkbox-label" htmlFor={id}>
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span>{label}</span>
    </label>
  );
}
