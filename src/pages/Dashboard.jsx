import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getRecentUsageLogs, getRecentCheckIns } from '../services/firestore';
import {
  computeStreak,
  computeReclaimedHours,
  humanEquivalent,
  getWeekUsageTrend,
} from '../utils/stats';
import { AppShell } from '../components/layout/AppShell';
import { Card } from '../components/ui/Card';
import { UsageTrendChart } from '../components/charts/UsageTrendChart';
import { LoadingState, EmptyState } from '../components/ui/States';

export default function Dashboard() {
  const { user, profile } = useAuth();
  const [usageLogs, setUsageLogs] = useState([]);
  const [checkIns, setCheckIns] = useState([]);
  const [loading, setLoading] = useState(true);

  const baselineHours = profile?.stats?.baselineHours || profile?.onboarding?.hoursPerDay;

  useEffect(() => {
    if (!user) return;
    (async () => {
      setLoading(true);
      const [logs, checks] = await Promise.all([
        getRecentUsageLogs(user.uid, 7),
        getRecentCheckIns(user.uid, 30),
      ]);
      setUsageLogs(logs);
      setCheckIns(checks);
      setLoading(false);
    })();
  }, [user]);

  if (loading) return <AppShell><LoadingState message="Loading dashboard..." /></AppShell>;

  const streak = computeStreak(checkIns);
  const reclaimed = computeReclaimedHours(baselineHours, usageLogs);
  const equivalent = humanEquivalent(reclaimed);
  const trend = getWeekUsageTrend(usageLogs, baselineHours);
  const hasUsageData = usageLogs.length > 0;

  return (
    <AppShell>
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Your progress at a glance.</p>
      </div>

      <div className="grid-2 section">
        <Card>
          <div className="card__title">Current streak</div>
          <div className="stat-value">{streak.current}</div>
          <div className="stat-label">day{streak.current !== 1 ? 's' : ''} checking in</div>
        </Card>
        <Card>
          <div className="card__title">Best streak</div>
          <div className="stat-value">{streak.best}</div>
          <div className="stat-label">personal record</div>
        </Card>
      </div>

      <section className="section">
        <Card highlight={reclaimed > 0}>
          <div className="card__title">Hours reclaimed this week</div>
          <div className="stat-value">{reclaimed > 0 ? reclaimed : '—'}</div>
          {equivalent && (
            <p className="equivalent-text" style={{ marginTop: 'var(--space-sm)' }}>
              {equivalent}
            </p>
          )}
          {!hasUsageData && (
            <p className="input-hint" style={{ marginTop: 'var(--space-sm)' }}>
              Log your daily scroll time in{' '}
              <Link to="/check-in">Check-in</Link> to see reclaimed hours.
            </p>
          )}
        </Card>
      </section>

      <section className="section">
        <h2 className="section-title">Weekly usage trend</h2>
        {hasUsageData ? (
          <UsageTrendChart data={trend} />
        ) : (
          <EmptyState
            title="No usage data yet"
            message="Report your scroll time during daily check-ins to see your trend."
            action={<Link to="/check-in" className="btn btn--primary">Go to check-in</Link>}
          />
        )}
      </section>

      {profile?.detoxPath && (
        <section className="section">
          <h2 className="section-title">Your path</h2>
          <Card>
            <h3 style={{ marginBottom: '8px' }}>{profile.detoxPath.title}</h3>
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>
              {profile.detoxPath.summary}
            </p>
            <ul style={{ paddingLeft: '20px', marginTop: '12px' }}>
              {profile.detoxPath.recommendations.slice(0, 3).map((rec) => (
                <li key={rec.id} style={{ fontSize: 'var(--font-size-sm)', marginBottom: '4px' }}>
                  {rec.text}
                </li>
              ))}
            </ul>
          </Card>
        </section>
      )}

      {profile?.badges && Object.keys(profile.badges).length > 0 && (
        <section className="section">
          <h2 className="section-title">Badges</h2>
          <div className="row" style={{ flexWrap: 'wrap', gap: '8px' }}>
            {Object.entries(profile.badges).map(([key, earned]) =>
              earned ? (
                <span key={key} className="badge-display">
                  {formatBadge(key)}
                </span>
              ) : null
            )}
          </div>
        </section>
      )}
    </AppShell>
  );
}

function formatBadge(key) {
  return key
    .replace('WizardComplete', ' setup complete')
    .replace(/([A-Z])/g, ' $1')
    .trim()
    .toLowerCase()
    .replace(/^\w/, (c) => c.toUpperCase());
}
