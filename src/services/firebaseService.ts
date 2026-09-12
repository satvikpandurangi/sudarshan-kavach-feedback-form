import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  User,
  signOut,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDocs,
  onSnapshot,
  query,
  orderBy,
  getDocFromServer,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { FeedbackSubmission } from '../types';

// Initialize Firebase App
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Use provisioned firestoreDatabaseId if defined
export const db = (firebaseConfig as any).firestoreDatabaseId
  ? getFirestore(app, (firebaseConfig as any).firestoreDatabaseId)
  : getFirestore(app);

// Test Firestore Connection on Boot
(async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.info('Firebase Firestore connected successfully.');
  } catch (error: any) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firestore offline status:', error.message);
    }
  }
})();

export const SUBMISSIONS_COLLECTION = 'feedback_submissions';

/**
 * Save or update feedback submission in Firestore
 */
export const saveFeedbackToFirestore = async (submission: FeedbackSubmission): Promise<void> => {
  try {
    const docRef = doc(db, SUBMISSIONS_COLLECTION, submission.id);
    await setDoc(docRef, submission, { merge: true });
  } catch (err) {
    console.warn('Failed to save submission to Firestore:', err);
    throw err;
  }
};

/**
 * Batch seed or sync submissions to Firestore
 */
export const syncSubmissionsToFirestore = async (submissions: FeedbackSubmission[]): Promise<void> => {
  try {
    const promises = submissions.map((sub) => {
      const docRef = doc(db, SUBMISSIONS_COLLECTION, sub.id);
      return setDoc(docRef, sub, { merge: true });
    });
    await Promise.all(promises);
  } catch (err) {
    console.warn('Failed to sync submissions to Firestore:', err);
  }
};

/**
 * Subscribe in real-time to feedback submissions from Firestore
 */
export const subscribeToSubmissions = (
  callback: (submissions: FeedbackSubmission[]) => void,
  onError?: (error: Error) => void
) => {
  const q = query(collection(db, SUBMISSIONS_COLLECTION), orderBy('submittedAt', 'desc'));
  return onSnapshot(
    q,
    (snapshot) => {
      const results: FeedbackSubmission[] = [];
      snapshot.forEach((docSnap) => {
        results.push(docSnap.data() as FeedbackSubmission);
      });
      callback(results);
    },
    (err) => {
      console.warn('Firestore subscription warning:', err);
      if (onError) onError(err);
    }
  );
};
