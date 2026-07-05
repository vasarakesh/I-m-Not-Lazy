import { useState } from 'react';
import { AppShell } from '../components/layout/AppShell';
import learnData from '../content/learn-feed.json';

const CATEGORIES = ['all', ...new Set(learnData.cards.map((c) => c.category))];

export default function Learn() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedId, setExpandedId] = useState(null);

  const filtered = activeCategory === 'all'
    ? learnData.cards
    : learnData.cards.filter((c) => c.category === activeCategory);

  return (
    <AppShell>
      <div className="page-header">
        <h1>Learn</h1>
        <p>Short reads on why scrolling hooks you — and what to do about it.</p>
      </div>

      <div className="learn-filters" role="tablist" aria-label="Filter by category">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            role="tab"
            aria-selected={activeCategory === cat}
            className={`learn-filter ${activeCategory === cat ? 'learn-filter--active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {filtered.map((card) => {
        const isExpanded = expandedId === card.id;
        return (
          <article
            key={card.id}
            className="learn-card"
            onClick={() => setExpandedId(isExpanded ? null : card.id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setExpandedId(isExpanded ? null : card.id);
              }
            }}
            tabIndex={0}
            role="button"
            aria-expanded={isExpanded}
          >
            <div className="learn-card__meta">
              <span className="learn-card__category">{card.category}</span>
              <span>{card.readingTimeMinutes} min read</span>
            </div>
            <h3>{card.title}</h3>
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', marginTop: '4px' }}>
              {card.summary}
            </p>
            {isExpanded && (
              <div className="learn-card__body">
                {card.body.split('\n\n').map((para, i) => (
                  <p key={i} style={{ marginBottom: '12px' }}>{para}</p>
                ))}
              </div>
            )}
            {!isExpanded && (
              <p className="input-hint" style={{ marginTop: '8px' }}>Tap to read</p>
            )}
          </article>
        );
      })}
    </AppShell>
  );
}
