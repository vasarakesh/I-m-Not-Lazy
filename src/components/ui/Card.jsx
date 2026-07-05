export function Card({ children, highlight, className = '' }) {
  return (
    <div className={`card ${highlight ? 'card--highlight' : ''} ${className}`}>
      {children}
    </div>
  );
}
