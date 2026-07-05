import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  writeBatch,
} from 'firebase/firestore';
import { db } from '../config/firebase';

export async function getUserProfile(uid) {
  const ref = doc(db, 'users', uid);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
}

export async function createUserProfile(uid, email) {
  const ref = doc(db, 'users', uid);
  await setDoc(ref, {
    email,
    createdAt: new Date().toISOString(),
    onboardingComplete: false,
    ageConfirmedAt: null,
    onboarding: null,
    detoxPath: null,
    stats: {
      currentStreak: 0,
      bestStreak: 0,
      lastCheckInDate: null,
      baselineHours: null,
    },
    badges: {},
  });
}

export async function updateUserProfile(uid, data) {
  const ref = doc(db, 'users', uid);
  await updateDoc(ref, data);
}

export async function saveOnboarding(uid, onboarding, detoxPath) {
  const ref = doc(db, 'users', uid);
  await updateDoc(ref, {
    onboardingComplete: true,
    ageConfirmedAt: new Date().toISOString(),
    onboarding: { ...onboarding, completedAt: new Date().toISOString() },
    detoxPath,
    'stats.baselineHours': onboarding.hoursPerDay,
  });
}

export async function getWizardProgress(uid, platformId) {
  const ref = doc(db, 'users', uid, 'wizardProgress', platformId);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : { completedSteps: [], completedAt: null };
}

export async function saveWizardStep(uid, platformId, completedSteps) {
  const ref = doc(db, 'users', uid, 'wizardProgress', platformId);
  await setDoc(ref, {
    completedSteps,
    updatedAt: new Date().toISOString(),
  }, { merge: true });
}

export async function completeWizard(uid, platformId, completedSteps) {
  const ref = doc(db, 'users', uid, 'wizardProgress', platformId);
  const badgeKey = `${platformId}WizardComplete`;
  await setDoc(ref, {
    completedSteps,
    completedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }, { merge: true });
  await updateDoc(doc(db, 'users', uid), {
    [`badges.${badgeKey}`]: true,
  });
}

export async function saveCheckIn(uid, dateKey, data) {
  const ref = doc(db, 'users', uid, 'checkIns', dateKey);
  await setDoc(ref, {
    ...data,
    updatedAt: new Date().toISOString(),
  }, { merge: true });
}

export async function getCheckIn(uid, dateKey) {
  const ref = doc(db, 'users', uid, 'checkIns', dateKey);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
}

export async function getRecentCheckIns(uid, days = 30) {
  const ref = collection(db, 'users', uid, 'checkIns');
  const q = query(ref, orderBy('updatedAt', 'desc'), limit(days));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function saveUsageLog(uid, dateKey, hours) {
  const ref = doc(db, 'users', uid, 'usageLogs', dateKey);
  await setDoc(ref, {
    hours,
    updatedAt: new Date().toISOString(),
  }, { merge: true });
}

export async function getRecentUsageLogs(uid, days = 7) {
  const ref = collection(db, 'users', uid, 'usageLogs');
  const q = query(ref, orderBy('updatedAt', 'desc'), limit(days));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function updateStreak(uid, stats) {
  const ref = doc(db, 'users', uid);
  await updateDoc(ref, { stats });
}

export async function deleteAllUserData(uid) {
  const batch = writeBatch(db);

  const subcollections = ['wizardProgress', 'checkIns', 'usageLogs'];
  for (const sub of subcollections) {
    const colRef = collection(db, 'users', uid, sub);
    const snap = await getDocs(colRef);
    snap.docs.forEach((d) => batch.delete(d.ref));
  }

  batch.delete(doc(db, 'users', uid));
  await batch.commit();
}
