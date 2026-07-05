import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { auth } from '../config/firebase';
import { signUp, signIn } from '../services/auth';
import { saveOnboarding } from '../services/firestore';
import { generateDetoxPath } from '../utils/detoxPath';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import onboardingOptions from '../content/onboarding-options.json';

const STEPS = ['age', 'auth', 'apps', 'hours', 'goals', 'path'];

export default function Onboarding() {
  const { user, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedApps, setSelectedApps] = useState([]);
  const [hoursPerDay, setHoursPerDay] = useState(3);
  const [reclaimedGoals, setReclaimedGoals] = useState([]);
  const [detoxPath, setDetoxPath] = useState(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const toggleApp = (id) => {
    setSelectedApps((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const toggleGoal = (id) => {
    setReclaimedGoals((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    );
  };

  const handleAuth = async () => {
    setError('');
    setSubmitting(true);
    try {
      if (user) {
        setStep(2);
      } else {
        await signUp(email, password);
        setStep(2);
      }
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        try {
          await signIn(email, password);
          setStep(2);
        } catch {
          setError('Invalid email or password.');
        }
      } else {
        setError(err.message || 'Authentication failed.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleGeneratePath = () => {
    const path = generateDetoxPath({
      apps: selectedApps,
      hoursPerDay,
      reclaimedGoals,
    });
    setDetoxPath(path);
    setStep(5);
  };

  const handleFinish = async () => {
    setSubmitting(true);
    setError('');
    try {
      const uid = auth.currentUser?.uid;
      if (!uid) throw new Error('Not authenticated');
      await saveOnboarding(uid, {
        apps: selectedApps,
        hoursPerDay,
        reclaimedGoals,
      }, detoxPath);
      await refreshProfile();
      navigate('/wizard');
    } catch (err) {
      setError(err.message || 'Failed to save onboarding.');
    } finally {
      setSubmitting(false);
    }
  };

  const canProceed = () => {
    switch (STEPS[step]) {
      case 'age': return ageConfirmed;
      case 'auth': return user || (email && password.length >= 6);
      case 'apps': return selectedApps.length > 0;
      case 'hours': return hoursPerDay > 0;
      case 'goals': return reclaimedGoals.length > 0;
      default: return true;
    }
  };

  return (
    <div className="app-shell">
      <main className="app-shell__main app-shell__main--narrow">
        <div className="page-header">
          <h1>Im Not Lazy</h1>
          <p>Reclaim your time, gradually and without shame.</p>
        </div>

        <ProgressIndicator current={step} total={STEPS.length} />

        {error && <div className="alert alert--error" role="alert">{error}</div>}

        <div className="onboarding-step">
          {STEPS[step] === 'age' && (
            <section className="stack">
              <h2>Age confirmation</h2>
              <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)' }}>
                This app is designed for adults 18 and older. We collect only the data needed
                to personalize your experience.
              </p>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={ageConfirmed}
                  onChange={(e) => setAgeConfirmed(e.target.checked)}
                />
                <span>I confirm that I am 18 years of age or older.</span>
              </label>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                By continuing, you agree to our{' '}
                <a href="/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
                {' '}and{' '}
                <a href="/terms" target="_blank" rel="noopener noreferrer">Terms of Service</a>.
              </p>
            </section>
          )}

          {STEPS[step] === 'auth' && !user && (
            <section className="stack auth-form">
              <h2>Create your account</h2>
              <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)' }}>
                We only store your email and app-related data. No social login tracking.
              </p>
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                hint="At least 6 characters"
                autoComplete="new-password"
                required
              />
            </section>
          )}

          {STEPS[step] === 'auth' && user && (
            <section className="stack">
              <h2>Welcome back</h2>
              <p>Signed in as {user.email}. Let's continue your setup.</p>
            </section>
          )}

          {STEPS[step] === 'apps' && (
            <section className="stack">
              <h2>Which apps waste your time?</h2>
              <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)' }}>
                Select all that apply. No judgment — just honesty.
              </p>
              <div className="quiz-options">
                {onboardingOptions.apps.map((app) => (
                  <button
                    key={app.id}
                    type="button"
                    className={`quiz-option ${selectedApps.includes(app.id) ? 'quiz-option--selected' : ''}`}
                    onClick={() => toggleApp(app.id)}
                  >
                    <input
                      type="checkbox"
                      checked={selectedApps.includes(app.id)}
                      readOnly
                      tabIndex={-1}
                    />
                    <span>{app.label}</span>
                  </button>
                ))}
              </div>
            </section>
          )}

          {STEPS[step] === 'hours' && (
            <section className="stack">
              <h2>How many hours per day do you scroll?</h2>
              <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)' }}>
                Estimate honestly. This sets your baseline for tracking progress.
              </p>
              <div className="quiz-options">
                {onboardingOptions.hoursOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    className={`quiz-option ${hoursPerDay === opt.value ? 'quiz-option--selected' : ''}`}
                    onClick={() => setHoursPerDay(opt.value)}
                  >
                    <input type="radio" checked={hoursPerDay === opt.value} readOnly tabIndex={-1} />
                    <span>{opt.label}</span>
                  </button>
                ))}
              </div>
            </section>
          )}

          {STEPS[step] === 'goals' && (
            <section className="stack">
              <h2>What would you do with reclaimed time?</h2>
              <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)' }}>
                Pick what matters most to you right now.
              </p>
              <div className="quiz-options">
                {onboardingOptions.reclaimedGoals.map((goal) => (
                  <button
                    key={goal.id}
                    type="button"
                    className={`quiz-option ${reclaimedGoals.includes(goal.id) ? 'quiz-option--selected' : ''}`}
                    onClick={() => toggleGoal(goal.id)}
                  >
                    <input
                      type="checkbox"
                      checked={reclaimedGoals.includes(goal.id)}
                      readOnly
                      tabIndex={-1}
                    />
                    <span>{goal.label}</span>
                  </button>
                ))}
              </div>
            </section>
          )}

          {STEPS[step] === 'path' && detoxPath && (
            <section className="stack">
              <h2>Your personalized path</h2>
              <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)' }}>
                {detoxPath.summary}
              </p>
              <div className="card card--highlight">
                <h3>{detoxPath.title}</h3>
                <ul style={{ paddingLeft: '20px', marginTop: '12px' }}>
                  {detoxPath.recommendations.map((rec) => (
                    <li key={rec.id} style={{ fontSize: 'var(--font-size-sm)', marginBottom: '8px' }}>
                      <span style={{
                        fontSize: 'var(--font-size-xs)',
                        fontWeight: 600,
                        color: rec.priority === 'high' ? 'var(--color-error)' : 'var(--color-accent)',
                        marginRight: '6px',
                      }}>
                        {rec.priority}
                      </span>
                      {rec.text}
                    </li>
                  ))}
                </ul>
              </div>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                This path is generated from your answers, not AI. You can revisit recommendations anytime.
              </p>
            </section>
          )}
        </div>

        <div className="stack" style={{ marginTop: 'var(--space-lg)' }}>
          {STEPS[step] === 'auth' && !user ? (
            <Button block size="lg" onClick={handleAuth} disabled={!canProceed() || submitting}>
              {submitting ? 'Creating account...' : 'Continue'}
            </Button>
          ) : STEPS[step] === 'goals' ? (
            <Button block size="lg" onClick={handleGeneratePath} disabled={!canProceed()}>
              Generate my path
            </Button>
          ) : STEPS[step] === 'path' ? (
            <Button block size="lg" onClick={handleFinish} disabled={submitting}>
              {submitting ? 'Saving...' : 'Start my journey'}
            </Button>
          ) : (
            <Button
              block
              size="lg"
              onClick={() => setStep((s) => s + 1)}
              disabled={!canProceed()}
            >
              Continue
            </Button>
          )}
          {step > 0 && STEPS[step] !== 'path' && (
            <Button variant="ghost" block onClick={() => setStep((s) => s - 1)}>
              Back
            </Button>
          )}
        </div>
      </main>
    </div>
  );
}

function ProgressIndicator({ current, total }) {
  return (
    <div style={{ marginBottom: 'var(--space-lg)' }}>
      <ProgressBar value={current + 1} max={total} />
      <p className="input-hint" style={{ marginTop: '4px' }}>
        Step {current + 1} of {total}
      </p>
    </div>
  );
}

function ProgressBar({ value, max }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div className="progress-bar" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
      <div className="progress-bar__fill" style={{ width: `${pct}%` }} />
    </div>
  );
}
