import { collection, doc, query, where, getDocs, getDoc, addDoc, updateDoc, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";

// Basic CRUD helpers. Enhance as needed.
export const getCollection = async (collectionName) => {
  const q = query(collection(db, collectionName));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const subscribeToCollection = (collectionName, callback) => {
  const q = query(collection(db, collectionName));
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  });
};
