import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

export const isFirebaseConfigured = Boolean(
  import.meta.env.VITE_FIREBASE_API_KEY &&
  import.meta.env.VITE_FIREBASE_PROJECT_ID
);

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

let app = null;
let auth = null;
let db = null;

if (isFirebaseConfigured) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
}

export { auth, db };

/*
 * Firestore data model:
 *
 * users/{uid}
 *   email, createdAt, onboardingComplete, ageConfirmedAt
 *   onboarding: { apps[], hoursPerDay, reclaimedGoals[], completedAt }
 *   detoxPath: { id, title, summary, recommendations[], generatedAt }
 *   stats: { currentStreak, bestStreak, lastCheckInDate, baselineHours }
 *   badges: { instagramWizardComplete, ... }
 *
 * users/{uid}/wizardProgress/{platformId}
 *   completedSteps[], completedAt, updatedAt
 *
 * users/{uid}/checkIns/{YYYY-MM-DD}
 *   morningIntention, eveningReflection, mood, reportedScrollHours, updatedAt
 *
 * users/{uid}/usageLogs/{YYYY-MM-DD}
 *   hours, updatedAt
 */
