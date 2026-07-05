import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getWizardProgress, saveWizardStep, completeWizard } from '../services/firestore';
import { AppShell } from '../components/layout/AppShell';
import { Button } from '../components/ui/Button';
import { Checkbox } from '../components/ui/Checkbox';
import { ProgressBar } from '../components/ui/ProgressBar';
import { LoadingState } from '../components/ui/States';
import wizardData from '../content/wizard-steps.json';

export default function Wizard() {
  const { user, profile, refreshProfile } = useAuth();
  const [activePlatform, setActivePlatform] = useState('instagram');
  const [completedSteps, setCompletedSteps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const platform = wizardData.platforms.find((p) => p.id === activePlatform);
  const totalSteps = platform?.steps.length || 0;
  const isComplete = profile?.badges?.[`${activePlatform}WizardComplete`];

  useEffect(() => {
    if (!user) return;
    (async () => {
      setLoading(true);
      const progress = await getWizardProgress(user.uid, activePlatform);
      setCompletedSteps(progress.completedSteps || []);
      setLoading(false);
    })();
  }, [user, activePlatform]);

  const toggleStep = async (stepId) => {
    const updated = completedSteps.includes(stepId)
      ? completedSteps.filter((s) => s !== stepId)
      : [...completedSteps, stepId];

    setCompletedSteps(updated);
    setSaving(true);
    await saveWizardStep(user.uid, activePlatform, updated);

    if (updated.length === totalSteps) {
      await completeWizard(user.uid, activePlatform, updated);
      await refreshProfile();
    }
    setSaving(false);
  };

  if (loading) return <AppShell><LoadingState message="Loading wizard..." /></AppShell>;

  return (
    <AppShell>
      <div className="page-header">
        <h1>Setup Wizard</h1>
        <p>Step-by-step hardening for the apps that pull you in most.</p>
      </div>

      <div className="wizard-platform-tabs" role="tablist">
        {wizardData.platforms.map((p) => (
          <button
            key={p.id}
            role="tab"
            aria-selected={activePlatform === p.id}
            className={`wizard-platform-tab ${activePlatform === p.id ? 'wizard-platform-tab--active' : ''}`}
            onClick={() => setActivePlatform(p.id)}
          >
            {p.title}
            {profile?.badges?.[`${p.id}WizardComplete`] && ' ✓'}
          </button>
        ))}
      </div>

      {isComplete && (
        <div className="alert alert--success" style={{ marginBottom: 'var(--space-md)' }}>
          <span className="badge-display">Completed</span>
          {' '}You finished the {platform.title} setup. These changes compound over time.
        </div>
      )}

      {platform && (
        <>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-md)' }}>
            {platform.intro}
          </p>

          <div style={{ marginBottom: 'var(--space-md)' }}>
            <div className="row-between" style={{ marginBottom: '4px' }}>
              <span className="input-hint">
                {completedSteps.length} of {totalSteps} steps done
              </span>
              {saving && <span className="input-hint">Saving...</span>}
            </div>
            <ProgressBar value={completedSteps.length} max={totalSteps} />
          </div>

          {platform.steps.length === 0 ? (
            <p style={{ color: 'var(--color-text-muted)' }}>Steps coming soon.</p>
          ) : (
            platform.steps.map((step) => {
              const done = completedSteps.includes(step.id);
              return (
                <div key={step.id} className={`wizard-step ${done ? 'wizard-step--done' : ''}`}>
                  <div className="wizard-step__header">
                    <Checkbox
                      id={step.id}
                      label=""
                      checked={done}
                      onChange={() => toggleStep(step.id)}
                    />
                    <div>
                      <div className="wizard-step__title">{step.title}</div>
                    </div>
                  </div>
                  <div className="wizard-step__body">{step.body}</div>
                  {step.tip && <div className="wizard-step__tip">{step.tip}</div>}
                  {step.warning && <div className="wizard-step__warning">{step.warning}</div>}
                </div>
              );
            })
          )}
        </>
      )}
    </AppShell>
  );
}
