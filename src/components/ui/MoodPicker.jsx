const MOOD_LABELS = ['', 'Rough', 'Low', 'Okay', 'Good', 'Great'];

export function MoodPicker({ value, onChange }) {
  return (
    <div className="mood-picker" role="radiogroup" aria-label="Mood rating">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={value === n}
          aria-label={`Mood ${n}: ${MOOD_LABELS[n]}`}
          className={`mood-btn ${value === n ? 'mood-btn--selected' : ''}`}
          onClick={() => onChange(n)}
        >
          {n}
        </button>
      ))}
    </div>
  );
}

export function MoodLabel({ value }) {
  return <span>{MOOD_LABELS[value] || '—'}</span>;
}
