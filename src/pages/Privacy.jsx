import { Link } from 'react-router-dom';

export default function Privacy() {
  return (
    <div className="legal-page">
      <h1>Privacy Policy</h1>
      <p className="updated">Last updated: July 5, 2026</p>

      <p>
        Im Not Lazy ("we", "us", "the app") is committed to protecting your privacy.
        This policy explains what data we collect, why, and your rights regarding that data.
      </p>

      <h2>Who this app is for</h2>
      <p>
        Im Not Lazy is intended for users aged 18 and older. We do not knowingly collect
        data from anyone under 18.
      </p>

      <h2>What we collect</h2>
      <p>We collect only data necessary to provide the app experience:</p>
      <ul>
        <li><strong>Account data:</strong> Email address and authentication credentials (managed by Firebase Auth).</li>
        <li><strong>Onboarding data:</strong> Your selected apps, estimated scroll hours, and reclaimed-time goals.</li>
        <li><strong>App progress:</strong> Setup wizard completion, badges, and streak statistics.</li>
        <li><strong>Daily check-ins:</strong> Morning intentions, evening reflections, mood ratings, and self-reported scroll hours.</li>
        <li><strong>Usage logs:</strong> Self-reported daily scroll time for trend tracking.</li>
      </ul>
      <p>We do not collect location data, contacts, photos, or device identifiers beyond what Firebase Auth requires.</p>

      <h2>How we use your data</h2>
      <ul>
        <li>Personalize your detox path and recommendations</li>
        <li>Track your progress, streaks, and mood trends</li>
        <li>Display insights based on your self-reported data</li>
        <li>Authenticate your account</li>
      </ul>
      <p>We do not sell, rent, or share your personal data with third parties for marketing purposes.</p>

      <h2>Data storage</h2>
      <p>
        Your data is stored in Google Firebase (Firestore and Authentication), hosted in
        the United States. Firebase provides industry-standard encryption in transit and at rest.
      </p>

      <h2>Your rights (GDPR / CCPA)</h2>
      <p>Depending on your location, you may have the right to:</p>
      <ul>
        <li><strong>Access</strong> the personal data we hold about you</li>
        <li><strong>Delete</strong> your account and all associated data (available in Settings)</li>
        <li><strong>Correct</strong> inaccurate data by updating your check-ins or re-doing onboarding</li>
        <li><strong>Portability:</strong> Contact us to request an export of your data</li>
        <li><strong>Opt out</strong> of any data processing (by deleting your account)</li>
      </ul>

      <h2>Data retention</h2>
      <p>
        We retain your data for as long as your account is active. When you delete your account
        through Settings, we remove your Firestore documents and authentication record.
        Residual backups may persist for up to 30 days per Firebase's standard retention.
      </p>

      <h2>Cookies and local storage</h2>
      <p>
        We use browser local storage to save your theme preference (light/dark mode).
        Firebase Auth may use session cookies for authentication. We do not use tracking
        cookies or third-party analytics.
      </p>

      <h2>Children's privacy</h2>
      <p>
        This app is not directed at children under 18. If we learn we have collected data
        from someone under 18, we will delete it promptly.
      </p>

      <h2>Changes to this policy</h2>
      <p>
        We may update this policy as the app evolves. Material changes will be noted with
        an updated date at the top of this page.
      </p>

      <h2>Contact</h2>
      <p>
        For privacy-related questions or data requests, contact us at{' '}
        <a href="mailto:privacy@imnotlazy.app">privacy@imnotlazy.app</a>.
      </p>

      <p style={{ marginTop: 'var(--space-lg)' }}>
        <Link to="/settings">← Back to Settings</Link>
      </p>
    </div>
  );
}
