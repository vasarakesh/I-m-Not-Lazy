import { isFirebaseConfigured } from '../config/firebase';
import { Button } from './ui/Button';

export function FirebaseSetupNotice() {
  return (
    <div className="app-shell">
      <main className="app-shell__main app-shell__main--narrow">
        <div className="page-header">
          <h1>Firebase setup required</h1>
          <p>The app is deployed but Firebase environment variables are not configured yet.</p>
        </div>
        <div className="card">
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', marginBottom: '16px' }}>
            Add these variables in your Vercel project under Settings → Environment Variables, then redeploy:
          </p>
          <ul style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', paddingLeft: '20px' }}>
            <li>VITE_FIREBASE_API_KEY</li>
            <li>VITE_FIREBASE_AUTH_DOMAIN</li>
            <li>VITE_FIREBASE_PROJECT_ID</li>
            <li>VITE_FIREBASE_STORAGE_BUCKET</li>
            <li>VITE_FIREBASE_MESSAGING_SENDER_ID</li>
            <li>VITE_FIREBASE_APP_ID</li>
          </ul>
        </div>
        <Button block size="lg" variant="secondary" onClick={() => { window.location.href = '/'; }}>
          Back to homepage
        </Button>
      </main>
    </div>
  );
}

export function requireFirebase() {
  if (!isFirebaseConfigured) {
    throw new Error('Firebase is not configured. Add VITE_FIREBASE_* environment variables.');
  }
}
