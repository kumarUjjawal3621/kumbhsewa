import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyCiIjpYf1OrJbZezvWzQJIxwuqNnkA8OE0',
  authDomain: 'kumbhseva-a1172.firebaseapp.com',
  projectId: 'kumbhseva-a1172',
  storageBucket: 'kumbhseva-a1172.firebasestorage.app',
  messagingSenderId: '357892305281',
  appId: '1:357892305281:web:95a94677fdd5020c78b880',
  measurementId: 'G-69MWM8QXBV',
};

export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
