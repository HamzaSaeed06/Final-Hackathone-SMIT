"use client";
import { useState, useEffect } from "react";
import HeroBanner from "../../components/HeroBanner";
import { db, auth } from "../../lib/firebase";
import { collection, query, onSnapshot, getDocs, addDoc, orderBy } from "firebase/firestore";

export default function MessagesPage() {
  const [threads, setThreads] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cu = auth.currentUser;
    setCurrentUser(cu);
    getDocs(collection(db, "users")).then(snap => {
      if (!snap.empty) setUsers(snap.docs.map(d => ({ uid: d.id, ...d.data() })));
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const q = query(collection(db, "chats"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, snapshot => {
      setThreads(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }, () => { setLoading(false); });
    return () => unsub();
  }, []);

  const handleSend = async e => {
    e.preventDefault();
    if (!message.trim()) return;
    setSent(true);
    const senderName = users.find(u => u.uid === currentUser?.uid)?.name || "Me";
    const receiverName = users.find(u => u.uid === selectedUser)?.name || "Community Member";
    await addDoc(collection(db, "chats"), {
      participants: [currentUser?.uid || "guest", selectedUser || "community"],
      senderName,
      receiverName,
      lastMessage: message,
      lastTimestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      createdAt: new Date().toISOString(),
    });
    setMessage("");
    setTimeout(() => setSent(false), 2000);
  };

  const inputCls = "w-full bg-white border-[1.5px] border-[#E5E7EB] rounded-[10px] px-4 py-3 text-[15px] text-[#374151] focus:border-teal-primary outline-none";

  return (
    <div className="pb-24">
      <HeroBanner
        label="INTERACTION / MESSAGING"
        heading="Keep support moving through direct communication."
        subheading="Basic messaging gives helpers and requesters a clear follow-up path once a match happens."
      />

      <div className="flex flex-col md:flex-row gap-6">
        {/* CONVERSATION STREAM */}
        <div className="w-full md:w-[55%] bg-white rounded-[16px] p-8 shadow-card">
          <p className="text-[11px] font-semibold text-teal-primary uppercase tracking-[0.1em] mb-3">CONVERSATION STREAM</p>
          <h2 className="text-[28px] font-black text-[#0F1A17] mb-6">Recent messages</h2>

          {loading ? (
            <div className="flex items-center justify-center py-10">
              <div className="w-6 h-6 border-2 border-teal-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : threads.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-[#6B7280] font-medium">No conversations yet. Start one on the right!</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {threads.map(thread => (
                <div key={thread.id} className="border border-[#E5E7EB] rounded-[12px] p-4 hover:shadow-sm transition-shadow cursor-pointer">
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-bold text-[15px] text-[#0F1A17]">
                      {thread.senderName} &rarr; {thread.receiverName}
                    </p>
                    <span className="bg-gray-100 text-[#6B7280] rounded-full px-3 py-[3px] text-[12px] font-medium whitespace-nowrap ml-2">
                      {thread.lastTimestamp}
                    </span>
                  </div>
                  <p className="text-[14px] text-[#6B7280] line-clamp-2 leading-relaxed">
                    {thread.lastMessage}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SEND MESSAGE */}
        <div className="w-full md:w-[45%] bg-white rounded-[16px] p-8 shadow-card h-max">
          <p className="text-[11px] font-semibold text-teal-primary uppercase tracking-[0.1em] mb-3">SEND MESSAGE</p>
          <h2 className="text-[28px] font-black text-[#0F1A17] mb-6">Start a conversation</h2>
          <form onSubmit={handleSend} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-[14px] font-semibold text-[#374151]">To</label>
              <select value={selectedUser} onChange={e => setSelectedUser(e.target.value)} className={inputCls}>
                <option value="">Select a community member</option>
                {users.filter(u => u.uid !== currentUser?.uid).map(u => (
                  <option key={u.uid} value={u.uid}>{u.name}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[14px] font-semibold text-[#374151]">Message</label>
              <textarea
                rows={5} required value={message} onChange={e => setMessage(e.target.value)}
                placeholder="Share support details, ask for files, or suggest next steps."
                className={`${inputCls} resize-y`}
              />
            </div>
            <button type="submit" className="w-full bg-teal-primary hover:bg-teal-dark transition-colors text-white rounded-full py-[13px] font-semibold text-[15px]">
              {sent ? "Message sent ✓" : "Send"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
