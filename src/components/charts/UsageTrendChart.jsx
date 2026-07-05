export function UsageTrendChart({ data }) {
  if (!data.length) return null;

  const maxHours = Math.max(
    ...data.map((d) => d.hours ?? 0),
    ...data.map((d) => d.baseline ?? 0),
    1
  );
  const chartHeight = 120;
  const barWidth = 32;
  const gap = 12;
  const width = data.length * (barWidth + gap);

  return (
    <div className="chart-container">
      <svg
        width={width}
        height={chartHeight + 30}
        role="img"
        aria-label="Weekly usage trend chart"
      >
        {data.map((d, i) => {
          const x = i * (barWidth + gap);
          const barH = d.hours != null ? (d.hours / maxHours) * chartHeight : 0;
          const baselineY = d.baseline
            ? chartHeight - (d.baseline / maxHours) * chartHeight
            : null;

          return (
            <g key={d.date}>
              {baselineY != null && (
                <line
                  x1={x}
                  y1={baselineY}
                  x2={x + barWidth}
                  y2={baselineY}
                  stroke="var(--color-warning)"
                  strokeWidth="1"
                  strokeDasharray="4 2"
                />
              )}
              {d.hours != null ? (
                <rect
                  x={x}
                  y={chartHeight - barH}
                  width={barWidth}
                  height={barH}
                  rx="3"
                  fill="var(--color-accent)"
                />
              ) : (
                <rect
                  x={x}
                  y={chartHeight - 4}
                  width={barWidth}
                  height={4}
                  rx="2"
                  fill="var(--color-border)"
                />
              )}
              <text
                x={x + barWidth / 2}
                y={chartHeight + 18}
                textAnchor="middle"
                fontSize="11"
                fill="var(--color-text-muted)"
              >
                {d.label}
              </text>
            </g>
          );
        })}
      </svg>
      <p className="input-hint" style={{ marginTop: '8px' }}>
        Dashed line = your baseline from onboarding. Bars = self-reported daily usage.
      </p>
    </div>
  );
}
