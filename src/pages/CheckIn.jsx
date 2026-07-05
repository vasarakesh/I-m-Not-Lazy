import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import {
  getCheckIn,
  saveCheckIn,
  saveUsageLog,
  getRecentCheckIns,
  updateStreak,
} from '../services/firestore';
import { formatDateKey, computeStreak } from '../utils/stats';
import { generateMoodScrollInsight } from '../utils/insights';
import { AppShell } from '../components/layout/AppShell';
import { Button } from '../components/ui/Button';
import { Textarea, Input } from '../components/ui/Input';
import { MoodPicker, MoodLabel } from '../components/ui/MoodPicker';
import { MoodTrendChart } from '../components/charts/MoodTrendChart';
import { LoadingState } from '../components/ui/States';

export default function CheckIn() {
  const { user, profile, refreshProfile } = useAuth();
  const today = formatDateKey();
  const [morningIntention, setMorningIntention] = useState('');
  const [eveningReflection, setEveningReflection] = useState('');
  const [mood, setMood] = useState(null);
  const [scrollHours, setScrollHours] = useState('');
  const [recentCheckIns, setRecentCheckIns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;
    (async () => {
      setLoading(true);
      const [todayData, recent] = await Promise.all([
        getCheckIn(user.uid, today),
        getRecentCheckIns(user.uid, 30),
      ]);
      if (todayData) {
        setMorningIntention(todayData.morningIntention || '');
        setEveningReflection(todayData.eveningReflection || '');
        setMood(todayData.mood ?? null);
        setScrollHours(todayData.reportedScrollHours?.toString() || '');
      }
      setRecentCheckIns(recent);
      setLoading(false);
    })();
  }, [user, today]);

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSaved(false);
    try {
      const data = {
        morningIntention: morningIntention.trim(),
        eveningReflection: eveningReflection.trim(),
        mood,
        reportedScrollHours: scrollHours ? parseFloat(scrollHours) : null,
      };
      await saveCheckIn(user.uid, today, data);

      if (scrollHours) {
        await saveUsageLog(user.uid, today, parseFloat(scrollHours));
      }

      const updatedRecent = await getRecentCheckIns(user.uid, 30);
      setRecentCheckIns(updatedRecent);
      const streak = computeStreak(updatedRecent);
      await updateStreak(user.uid, {
        ...profile.stats,
        currentStreak: streak.current,
        bestStreak: Math.max(streak.best, profile?.stats?.bestStreak || 0),
        lastCheckInDate: today,
      });
      await refreshProfile();
      setSaved(true);
    } catch (err) {
      setError(err.message || 'Failed to save check-in.');
    } finally {
      setSaving(false);
    }
  };

  const insight = generateMoodScrollInsight(recentCheckIns);

  if (loading) return <AppShell><LoadingState message="Loading check-in..." /></AppShell>;

  return (
    <AppShell narrow>
      <div className="page-header">
        <h1>Daily Check-in</h1>
        <p>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
      </div>

      {error && <div className="alert alert--error" role="alert">{error}</div>}
      {saved && <div className="alert alert--success" role="status">Check-in saved.</div>}

      <div className="stack-lg">
        <section className="checkin-section">
          <h3 style={{ marginBottom: 'var(--space-sm)' }}>Morning intention</h3>
          <p className="input-hint" style={{ marginBottom: 'var(--space-sm)' }}>
            What do you want to focus on today instead of scrolling?
          </p>
          <Textarea
            value={morningIntention}
            onChange={(e) => setMorningIntention(e.target.value)}
            placeholder="e.g. Finish chapter 4, go for a walk after lunch..."
            rows={3}
          />
        </section>

        <section className="checkin-section">
          <h3 style={{ marginBottom: 'var(--space-sm)' }}>Scroll time today</h3>
          <p className="input-hint" style={{ marginBottom: 'var(--space-sm)' }}>
            Rough estimate in hours. Honesty helps you see patterns.
          </p>
          <Input
            type="number"
            min="0"
            max="24"
            step="0.5"
            value={scrollHours}
            onChange={(e) => setScrollHours(e.target.value)}
            placeholder="e.g. 2.5"
          />
        </section>

        <section className="checkin-section">
          <h3 style={{ marginBottom: 'var(--space-sm)' }}>How are you feeling?</h3>
          <p className="input-hint" style={{ marginBottom: 'var(--space-md)' }}>
            1 = rough, 5 = great
          </p>
          <MoodPicker value={mood} onChange={setMood} />
          {mood && (
            <p style={{ textAlign: 'center', marginTop: 'var(--space-sm)', fontSize: 'var(--font-size-sm)' }}>
              <MoodLabel value={mood} />
            </p>
          )}
        </section>

        <section className="checkin-section">
          <h3 style={{ marginBottom: 'var(--space-sm)' }}>Evening reflection</h3>
          <p className="input-hint" style={{ marginBottom: 'var(--space-sm)' }}>
            How did the day go? What worked, what didn't?
          </p>
          <Textarea
            value={eveningReflection}
            onChange={(e) => setEveningReflection(e.target.value)}
            placeholder="e.g. Stayed off Instagram until noon. Felt restless but got more done."
            rows={3}
          />
        </section>

        <Button block size="lg" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save check-in'}
        </Button>
      </div>

      {recentCheckIns.filter((c) => c.mood != null).length >= 2 && (
        <section className="section" style={{ marginTop: 'var(--space-xl)' }}>
          <h2 className="section-title">Mood trend</h2>
          <MoodTrendChart checkIns={recentCheckIns} />
        </section>
      )}

      <section className="section">
        <h2 className="section-title">Pattern insight</h2>
        <div className="insight-box">
          {insight.text}
        </div>
        {!insight.ready && (
          <p className="input-hint" style={{ marginTop: 'var(--space-sm)' }}>
            Log mood and scroll hours for a few more days to unlock insights.
          </p>
        )}
      </section>
    </AppShell>
  );
}
