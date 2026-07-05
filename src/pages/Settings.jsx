import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { logOut } from '../services/auth';
import { deleteAccount } from '../services/accountDeletion';
import { AppShell } from '../components/layout/AppShell';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export default function Settings() {
  const { user, profile } = useAuth();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  const handleLogout = async () => {
    await logOut();
    navigate('/onboarding');
  };

  const handleDelete = async () => {
    if (deleteConfirmText !== 'DELETE') return;
    setDeleting(true);
    setError('');
    try {
      await deleteAccount(user.uid);
      navigate('/onboarding');
    } catch (err) {
      setError(err.message || 'Failed to delete account. You may need to sign in again first.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AppShell narrow>
      <div className="page-header">
        <h1>Settings</h1>
        <p>Manage your account and preferences.</p>
      </div>

      {error && <div className="alert alert--error" role="alert">{error}</div>}

      <section className="settings-section">
        <h3>Account</h3>
        <p>Signed in as <strong>{user?.email}</strong></p>
        <p className="input-hint">
          Member since {profile?.createdAt
            ? new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
            : '—'}
        </p>
      </section>

      <section className="settings-section">
        <h3>Appearance</h3>
        <p>Currently using <strong>{theme}</strong> mode.</p>
        <Button variant="secondary" onClick={toggle}>
          Switch to {theme === 'light' ? 'dark' : 'light'} mode
        </Button>
      </section>

      <section className="settings-section">
        <h3>Your data</h3>
        <p>We store only what's needed for the app to work:</p>
        <ul style={{ paddingLeft: '20px', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>
          <li>Email address (for authentication)</li>
          <li>Onboarding answers and personalized path</li>
          <li>Setup wizard progress</li>
          <li>Daily check-ins (intentions, reflections, mood, scroll time)</li>
          <li>Streak and usage statistics</li>
        </ul>
        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>
          We do not sell your data. See our{' '}
          <Link to="/privacy">Privacy Policy</Link> for details.
        </p>
      </section>

      <section className="settings-section">
        <h3>Legal</h3>
        <div className="stack-sm">
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms of Service</Link>
        </div>
      </section>

      <section className="settings-section">
        <h3>Sign out</h3>
        <Button variant="secondary" onClick={handleLogout}>
          Sign out
        </Button>
      </section>

      <section className="settings-section danger-zone">
        <h3>Delete my account and data</h3>
        <p>
          This permanently removes your account, all check-ins, progress, and personal data
          from our systems. This action cannot be undone.
        </p>
        {!showDeleteConfirm ? (
          <Button variant="danger" onClick={() => setShowDeleteConfirm(true)}>
            Delete account
          </Button>
        ) : (
          <div className="stack">
            <p style={{ fontSize: 'var(--font-size-sm)' }}>
              Type <strong>DELETE</strong> to confirm.
            </p>
            <Input
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder="DELETE"
              aria-label="Type DELETE to confirm account deletion"
            />
            <div className="row">
              <Button
                variant="danger"
                onClick={handleDelete}
                disabled={deleteConfirmText !== 'DELETE' || deleting}
              >
                {deleting ? 'Deleting...' : 'Permanently delete'}
              </Button>
              <Button variant="ghost" onClick={() => { setShowDeleteConfirm(false); setDeleteConfirmText(''); }}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </section>
    </AppShell>
  );
}
