export function MoodTrendChart({ checkIns }) {
  const withMood = checkIns
    .filter((c) => c.mood != null)
    .sort((a, b) => a.id.localeCompare(b.id))
    .slice(-14);

  if (withMood.length < 2) return null;

  const chartHeight = 100;
  const pointGap = 36;
  const width = withMood.length * pointGap;
  const padding = 16;

  const points = withMood.map((c, i) => ({
    x: padding + i * pointGap,
    y: padding + chartHeight - ((c.mood - 1) / 4) * chartHeight,
    mood: c.mood,
    date: c.id,
  }));

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  return (
    <div className="chart-container">
      <svg
        width={width + padding * 2}
        height={chartHeight + padding * 2 + 20}
        role="img"
        aria-label="Mood trend over recent check-ins"
      >
        {[1, 2, 3, 4, 5].map((m) => {
          const y = padding + chartHeight - ((m - 1) / 4) * chartHeight;
          return (
            <g key={m}>
              <line
                x1={padding}
                y1={y}
                x2={width + padding}
                y2={y}
                stroke="var(--color-border)"
                strokeWidth="0.5"
              />
              <text x={4} y={y + 4} fontSize="10" fill="var(--color-text-muted)">
                {m}
              </text>
            </g>
          );
        })}
        <path d={pathD} fill="none" stroke="var(--color-accent)" strokeWidth="2" />
        {points.map((p) => (
          <g key={p.date}>
            <circle cx={p.x} cy={p.y} r="4" fill="var(--color-accent)" />
            <text
              x={p.x}
              y={chartHeight + padding + 16}
              textAnchor="middle"
              fontSize="9"
              fill="var(--color-text-muted)"
            >
              {new Date(p.date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
