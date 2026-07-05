export function Input({ label, hint, error, id, className = '', ...props }) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className={`input-group ${className}`}>
      {label && <label htmlFor={inputId}>{label}</label>}
      <input
        id={inputId}
        className={`input ${error ? 'input--error' : ''}`}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
        {...props}
      />
      {hint && !error && <span id={`${inputId}-hint`} className="input-hint">{hint}</span>}
      {error && <span id={`${inputId}-error`} className="input-error" role="alert">{error}</span>}
    </div>
  );
}

export function Textarea({ label, hint, error, id, className = '', ...props }) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className={`input-group ${className}`}>
      {label && <label htmlFor={inputId}>{label}</label>}
      <textarea
        id={inputId}
        className={`textarea ${error ? 'textarea--error' : ''}`}
        aria-invalid={error ? 'true' : undefined}
        {...props}
      />
      {hint && !error && <span className="input-hint">{hint}</span>}
      {error && <span className="input-error" role="alert">{error}</span>}
    </div>
  );
}

export function Select({ label, options, id, className = '', ...props }) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className={`input-group ${className}`}>
      {label && <label htmlFor={inputId}>{label}</label>}
      <select id={inputId} className="select" {...props}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}
