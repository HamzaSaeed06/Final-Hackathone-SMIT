"use client";
import { useState, useEffect } from "react";
import HeroBanner from "../../components/HeroBanner";
import { db, auth } from "../../lib/firebase";
import { collection, query, where, onSnapshot, getDocs, addDoc } from "firebase/firestore";

export default function MessagesPage() {
  const [threads, setThreads] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    setCurrentUser(auth.currentUser);
    // Fetch users for dropdown (mock or real)
    getDocs(collection(db, "users")).then((snap) => {
      setUsers(snap.docs.map(doc => ({ uid: doc.id, ...doc.data() })));
    });
  }, []);

  useEffect(() => {
    if (currentUser?.uid) {
      const q = query(
        collection(db, "chats"), 
        where("participants", "array-contains", currentUser.uid)
      );
      const unsub = onSnapshot(q, (snapshot) => {
        setThreads(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      });
      return () => unsub();
    }
  }, [currentUser]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!selectedUser || !message || !currentUser) return;

    // Standard group ID logic for mock purposes:
    const chatRef = collection(db, "chats");
    await addDoc(chatRef, {
      participants: [currentUser.uid, selectedUser],
      lastMessage: message,
      lastTimestamp: "Just now",
      senderName: "Me", // Should map to actual profile in production
      receiverName: users.find(u => u.uid === selectedUser)?.name || "User"
    });
    
    setMessage("");
  };

  return (
    <div className="pb-24">
      <HeroBanner 
        label="INTERACTION / MESSAGING"
        heading="Keep support moving through direct communication."
        subheading="Basic messaging gives helpers and requesters a clear follow-up path once a match happens."
      />

      <div className="flex flex-col md:flex-row gap-8">
        {/* LEFT COLUMN: CONVERSATION STREAM */}
        <div className="w-full md:w-[50%] bg-white rounded-[16px] p-8 shadow-[0_1px_3px_rgba(0,0,0,0.08),0_4px_16px_rgba(0,0,0,0.04)]">
          <p className="text-[11px] font-semibold text-teal-primary uppercase tracking-[0.1em] mb-4">CONVERSATION STREAM</p>
          <h2 className="text-[28px] font-extrabold text-gray-900 mb-6">Recent messages</h2>
          
          <div className="flex flex-col gap-4">
            {threads.length === 0 ? (
              <p className="text-gray-500 text-sm">No ongoing conversations.</p>
            ) : (
              threads.map(thread => (
                <div key={thread.id} className="bg-white border border-gray-100 rounded-[12px] p-4 hover:shadow-sm transition-shadow cursor-pointer">
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-bold text-[15px] text-gray-900">
                      {thread.senderName} &rarr; {thread.receiverName}
                    </p>
                    <span className="bg-gray-100 text-gray-600 rounded-full px-[10px] py-[3px] text-[11px] font-medium hidden sm:inline-block whitespace-nowrap">
                      {thread.lastTimestamp}
                    </span>
                  </div>
                  <p className="text-[14px] text-gray-500 line-clamp-2 leading-relaxed">
                    {thread.lastMessage}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: SEND MESSAGE */}
        <div className="w-full md:w-[50%] bg-white rounded-[16px] p-8 shadow-[0_1px_3px_rgba(0,0,0,0.08),0_4px_16px_rgba(0,0,0,0.04)] h-max">
          <p className="text-[11px] font-semibold text-teal-primary uppercase tracking-[0.1em] mb-4">SEND MESSAGE</p>
          <h2 className="text-[28px] font-extrabold text-gray-900 mb-6">Start a conversation</h2>
          
          <form onSubmit={handleSend} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-[14px] font-semibold text-gray-700">To</label>
              <select value={selectedUser} onChange={e=>setSelectedUser(e.target.value)} className="bg-white border-[1.5px] border-gray-200 rounded-[10px] px-4 py-3 text-[15px] focus:border-teal-primary outline-none">
                <option value="">Select a user...</option>
                {users.map(u => (
                  <option key={u.uid} value={u.uid}>{u.name}</option>
                ))}
              </select>
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-[14px] font-semibold text-gray-700">Message</label>
              <textarea 
                rows={4} required value={message} onChange={e=>setMessage(e.target.value)} 
                placeholder="Share support details, ask for files, or suggest next steps." 
                className="bg-white border-[1.5px] border-gray-200 rounded-[10px] px-4 py-3 text-[15px] focus:border-teal-primary outline-none resize-y"
              />
            </div>

            <button type="submit" className="w-full bg-teal-primary hover:bg-teal-dark transition-colors text-white rounded-full py-[12px] font-semibold text-[15px] mt-2">
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
