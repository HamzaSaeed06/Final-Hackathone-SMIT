import { collection, doc, query, where, orderBy, getDocs, getDoc, addDoc, updateDoc, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";

export const getCollection = async (collectionName) => {
  const q = query(collection(db, collectionName));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const subscribeToCollection = (collectionName, callback) => {
  const q = query(collection(db, collectionName));
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
  });
};

export async function writeNotification(userId, text, type = "Status") {
  if (!userId) return;
  try {
    await addDoc(collection(db, "notifications"), {
      userId,
      text,
      type,
      read: false,
      createdAt: new Date().toISOString(),
    });
  } catch (e) {
    console.error("writeNotification error:", e);
  }
}

export async function updateUserHelpStats(uid) {
  if (!uid) return;
  try {
    const snap = await getDoc(doc(db, "users", uid));
    if (!snap.exists()) return;
    const data = snap.data();
    const newHelpCount = (data.helpCount || 0) + 1;
    const newTrustScore = Math.min(100, 50 + newHelpCount * 2);
    const badges = [];
    if (newHelpCount >= 1) badges.push("First Helper");
    if (newHelpCount >= 5) badges.push("Fast Responder");
    if (newHelpCount >= 10) badges.push("Top Mentor");
    if (data.skills?.includes("Figma") || data.skills?.includes("UI/UX")) badges.push("Design Ally");
    if (data.skills?.includes("React") || data.skills?.includes("JavaScript")) badges.push("Code Rescuer");
    await updateDoc(doc(db, "users", uid), {
      helpCount: newHelpCount,
      trustScore: newTrustScore,
      badgesEarned: badges,
    });
  } catch (e) {
    console.error("updateUserHelpStats error:", e);
  }
}
