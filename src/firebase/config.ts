import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

export const app = initializeApp(firebaseConfig);
/* Connect to custom firestore database or default if (default) */
const customDbId = (firebaseConfig.firestoreDatabaseId && 
  firebaseConfig.firestoreDatabaseId !== '(default)' && 
  firebaseConfig.firestoreDatabaseId !== 'ai-studio-codepath-f262c1d3-483a-454d-99c6-bc65059b73ea')
  ? firebaseConfig.firestoreDatabaseId 
  : undefined;

export const db = customDbId ? getFirestore(app, customDbId) : getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Validate connection to Firestore at boot
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client is offline or operating in local offline cache mode.');
    }
  }
}

testConnection();
