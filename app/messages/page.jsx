"use client";
import { useState, useEffect } from "react";
import HeroBanner from "../../components/HeroBanner";
import { db, auth } from "../../lib/firebase";
import { collection, query, where, onSnapshot, getDocs, addDoc } from "firebase/firestore";

const MOCK_THREADS = [
  {
    id: "t1",
    senderName: "Ayesha Khan",
    receiverName: "Sara Noor",
    lastMessage:
      "I checked your portfolio request. Share the breakpoint screenshots and I can suggest fixes.",
    lastTimestamp: "09:45 AM",
  },
  {
    id: "t2",
    senderName: "Hassan Ali",
    receiverName: "Ayesha Khan",
    lastMessage:
      "Your event poster concept is solid. I would tighten the CTA and reduce the background texture.",
    lastTimestamp: "11:10 AM",
  },
];

export default function MessagesPage() {
  const [threads, setThreads] = useState(MOCK_THREADS);
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const cu = auth.currentUser;
    setCurrentUser(cu);
    getDocs(collection(db, "users")).then((snap) => {
      if (!snap.empty) setUsers(snap.docs.map((doc) => ({ uid: doc.id, ...doc.data() })));
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (currentUser?.uid) {
      const q = query(
        collection(db, "chats"),
        where("participants", "array-contains", currentUser.uid)
      );
      const unsub = onSnapshot(q, (snapshot) => {
        const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        if (items.length > 0) setThreads(items);
      });
      return () => unsub();
    }
  }, [currentUser]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message) return;
    setSent(true);

    const senderName =
      users.find((u) => u.uid === currentUser?.uid)?.name || "Me";
    const receiverName =
      users.find((u) => u.uid === selectedUser)?.name || "User";
    const newThread = {
      id: `t${Date.now()}`,
      senderName,
      receiverName: receiverName || "Community Member",
      lastMessage: message,
      lastTimestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setThreads((prev) => [newThread, ...prev]);

    if (currentUser && selectedUser) {
      await addDoc(collection(db, "chats"), {
        participants: [currentUser.uid, selectedUser],
        senderName,
        receiverName,
        lastMessage: message,
        lastTimestamp: "Just now",
      });
    }

    setMessage("");
    setTimeout(() => setSent(false), 2000);
  };

  const inputCls =
    "w-full bg-white border-[1.5px] border-[#E5E7EB] rounded-[10px] px-4 py-3 text-[15px] text-[#374151] focus:border-teal-primary outline-none";

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
          <p className="text-[11px] font-semibold text-teal-primary uppercase tracking-[0.1em] mb-3">
            CONVERSATION STREAM
          </p>
          <h2 className="text-[28px] font-black text-[#0F1A17] mb-6">Recent messages</h2>

          <div className="flex flex-col gap-3">
            {threads.map((thread) => (
              <div
                key={thread.id}
                className="border border-[#E5E7EB] rounded-[12px] p-4 hover:shadow-sm transition-shadow cursor-pointer"
              >
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
        </div>

        {/* SEND MESSAGE */}
        <div className="w-full md:w-[45%] bg-white rounded-[16px] p-8 shadow-card h-max">
          <p className="text-[11px] font-semibold text-teal-primary uppercase tracking-[0.1em] mb-3">
            SEND MESSAGE
          </p>
          <h2 className="text-[28px] font-black text-[#0F1A17] mb-6">Start a conversation</h2>

          <form onSubmit={handleSend} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-[14px] font-semibold text-[#374151]">To</label>
              <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className={inputCls}
              >
                <option value="">Ayesha Khan</option>
                {users.map((u) => (
                  <option key={u.uid} value={u.uid}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[14px] font-semibold text-[#374151]">Message</label>
              <textarea
                rows={5}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Share support details, ask for files, or suggest next steps."
                className={`${inputCls} resize-y`}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-teal-primary hover:bg-teal-dark transition-colors text-white rounded-full py-[13px] font-semibold text-[15px]"
            >
              {sent ? "Message sent ✓" : "Send"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
