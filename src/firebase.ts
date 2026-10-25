import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  getDocs,
  getDocFromServer,
  query,
  orderBy,
  limit,
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import { LearnerUser, Question, QuizAttempt } from './types';

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// CRITICAL: getFirestore must pass firestoreDatabaseId if specified
export const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

export const auth = getAuth(app);

// Test connection on boot
(async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firestore offline fallback activated.');
    }
  }
})();

// Real-time synchronization listeners
export function subscribeToCloudLearners(
  onData: (learners: LearnerUser[]) => void,
  onError?: (err: any) => void
): () => void {
  try {
    const learnersCol = collection(db, 'learners');
    return onSnapshot(
      learnersCol,
      (snapshot) => {
        const learners: LearnerUser[] = [];
        snapshot.forEach((docSnap) => {
          learners.push(docSnap.data() as LearnerUser);
        });
        onData(learners);
      },
      (error) => {
        console.warn('Realtime learners subscription error:', error);
        if (onError) onError(error);
      }
    );
  } catch (err) {
    console.warn('Could not subscribe to learners:', err);
    return () => {};
  }
}

export function subscribeToCloudAttempts(
  onData: (attempts: QuizAttempt[]) => void,
  onError?: (err: any) => void
): () => void {
  try {
    const attemptsCol = collection(db, 'quiz_attempts');
    const q = query(attemptsCol, orderBy('timestamp', 'desc'), limit(100));
    return onSnapshot(
      q,
      (snapshot) => {
        const attempts: QuizAttempt[] = [];
        snapshot.forEach((docSnap) => {
          attempts.push(docSnap.data() as QuizAttempt);
        });
        onData(attempts);
      },
      (error) => {
        console.warn('Realtime attempts subscription error:', error);
        if (onError) onError(error);
      }
    );
  } catch (err) {
    console.warn('Could not subscribe to attempts:', err);
    return () => {};
  }
}

export function subscribeToCloudQuestions(
  onData: (questions: Question[]) => void,
  onError?: (err: any) => void
): () => void {
  try {
    const questionsCol = collection(db, 'questions');
    return onSnapshot(
      questionsCol,
      (snapshot) => {
        const questions: Question[] = [];
        snapshot.forEach((docSnap) => {
          questions.push(docSnap.data() as Question);
        });
        onData(questions);
      },
      (error) => {
        console.warn('Realtime questions subscription error:', error);
        if (onError) onError(error);
      }
    );
  } catch (err) {
    console.warn('Could not subscribe to questions:', err);
    return () => {};
  }
}

// Cloud Mutation Operations
export async function syncLearnerToCloud(learner: LearnerUser): Promise<void> {
  try {
    await setDoc(doc(db, 'learners', learner.id), learner, { merge: true });
  } catch (err) {
    console.warn('Failed to sync learner to cloud:', err);
  }
}

export async function syncAttemptToCloud(attempt: QuizAttempt): Promise<void> {
  try {
    await setDoc(doc(db, 'quiz_attempts', attempt.id), attempt);
  } catch (err) {
    console.warn('Failed to sync attempt to cloud:', err);
  }
}

export async function syncQuestionToCloud(question: Question): Promise<void> {
  try {
    await setDoc(doc(db, 'questions', question.id), question);
  } catch (err) {
    console.warn('Failed to sync question to cloud:', err);
  }
}

export async function deleteQuestionFromCloud(questionId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'questions', questionId));
  } catch (err) {
    console.warn('Failed to delete question from cloud:', err);
  }
}
