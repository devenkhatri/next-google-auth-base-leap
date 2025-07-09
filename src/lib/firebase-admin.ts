import admin from 'firebase-admin';
import { getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

if (!getApps().length) {
  // Check if all required service account properties are present
  if (serviceAccount.projectId && serviceAccount.clientEmail && serviceAccount.privateKey) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } else {
    console.warn("Firebase Admin SDK not initialized. Missing credentials in .env.local file.");
  }
}

const db = getFirestore();

export { db };
