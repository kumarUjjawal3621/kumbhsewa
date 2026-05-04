import {
  collection,
  addDoc,
  query,
  orderBy,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  increment,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';

export async function submitContributor(data: {
  fullName: string;
  email: string;
  whatsappNumber: string;
  pinCode: string;
  preferredLanguage: string;
  intents: string[];
}) {
  try {
    const contributorsRef = collection(db, 'contributors');
    await addDoc(contributorsRef, {
      full_name: data.fullName,
      email: data.email,
      whatsapp_number: data.whatsappNumber,
      pin_code: data.pinCode,
      preferred_language: data.preferredLanguage,
      intents: data.intents,
      created_at: serverTimestamp(),
    });
  } catch (error) {
    throw error;
  }
}

export async function incrementPledgeCount(categoryId: string) {
  try {
    const analyticsRef = doc(db, 'pledge_analytics', categoryId);
    const analyticsDoc = await getDoc(analyticsRef);

    if (analyticsDoc.exists()) {
      await updateDoc(analyticsRef, {
        count: increment(1),
        last_pledged_at: serverTimestamp(),
      });
    } else {
      await addDoc(collection(db, 'pledge_analytics'), {
        id: categoryId,
        category: categoryId,
        count: 1,
        last_pledged_at: serverTimestamp(),
      });
    }
  } catch (error) {
    throw error;
  }
}

export async function getContributors() {
  try {
    const contributorsRef = collection(db, 'contributors');
    const q = query(contributorsRef, orderBy('created_at', 'desc'));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      fullName: doc.data().full_name,
      email: doc.data().email,
      whatsappNumber: doc.data().whatsapp_number,
      pinCode: doc.data().pin_code,
      preferredLanguage: doc.data().preferred_language,
      intents: doc.data().intents || [],
      createdAt: doc.data().created_at?.toDate?.().toISOString() || '',
    }));
  } catch (error) {
    throw error;
  }
}

export async function getPledgeAnalytics() {
  try {
    const analyticsRef = collection(db, 'pledge_analytics');
    const q = query(analyticsRef, orderBy('count', 'desc'));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      category: doc.data().category,
      count: doc.data().count || 0,
      lastPledgedAt: doc.data().last_pledged_at?.toDate?.().toISOString() || '',
    }));
  } catch (error) {
    throw error;
  }
}
