import { Link } from 'react-router-dom';

export default function Terms() {
  return (
    <div className="legal-page">
      <h1>Terms of Service</h1>
      <p className="updated">Last updated: July 5, 2026</p>

      <p>
        By using Im Not Lazy ("the app"), you agree to these Terms of Service.
        If you do not agree, please do not use the app.
      </p>

      <h2>Eligibility</h2>
      <p>
        You must be at least 18 years old to use this app. By creating an account,
        you confirm that you meet this age requirement.
      </p>

      <h2>What the app provides</h2>
      <p>
        Im Not Lazy is a free self-help tool designed to help adults reduce compulsive
        social media use through gradual, non-shame-based strategies. The app provides:
      </p>
      <ul>
        <li>Personalized recommendations based on your self-reported habits</li>
        <li>Step-by-step setup guides for reducing app friction</li>
        <li>Daily check-in tracking and mood visualization</li>
        <li>Educational content about attention and habit formation</li>
      </ul>

      <h2>What the app is not</h2>
      <p>
        Im Not Lazy is not a medical device, clinical treatment, or substitute for
        professional mental health care. The mood insights and correlation patterns
        shown in the app are based on your self-reported data and are intended for
        personal reflection — not as diagnostic or therapeutic guidance.
      </p>
      <p>
        If you are experiencing a mental health crisis, please contact a qualified
        professional or crisis helpline in your area.
      </p>

      <h2>Your account</h2>
      <p>
        You are responsible for maintaining the security of your account credentials.
        You may delete your account and all associated data at any time through Settings.
      </p>

      <h2>Acceptable use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>Use the app if you are under 18</li>
        <li>Attempt to access other users' data</li>
        <li>Reverse-engineer, scrape, or automate access to the app</li>
        <li>Use the app for any unlawful purpose</li>
      </ul>

      <h2>Intellectual property</h2>
      <p>
        The app's design, content, and code are owned by Im Not Lazy. Educational content
        in the Learn feed is provided for personal, non-commercial use.
      </p>

      <h2>Disclaimer of warranties</h2>
      <p>
        The app is provided "as is" without warranties of any kind. We do not guarantee
        specific outcomes from using the app. Your results depend on your individual
        habits, consistency, and circumstances.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        To the fullest extent permitted by law, Im Not Lazy shall not be liable for any
        indirect, incidental, or consequential damages arising from your use of the app.
      </p>

      <h2>Changes to these terms</h2>
      <p>
        We may update these terms as the app evolves. Continued use after changes
        constitutes acceptance of the updated terms.
      </p>

      <h2>Governing law</h2>
      <p>
        These terms are governed by the laws of the United States. Any disputes shall
        be resolved in accordance with applicable local jurisdiction.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about these terms? Contact us at{' '}
        <a href="mailto:legal@imnotlazy.app">legal@imnotlazy.app</a>.
      </p>

      <p style={{ marginTop: 'var(--space-lg)' }}>
        <Link to="/settings">← Back to Settings</Link>
      </p>
    </div>
  );
}
