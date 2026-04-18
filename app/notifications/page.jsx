"use client";
import { useEffect, useState } from "react";
import HeroBanner from "../../components/HeroBanner";
import { db, auth } from "../../lib/firebase";
import { collection, query, where, orderBy, onSnapshot, doc, updateDoc } from "firebase/firestore";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const cu = auth.currentUser;
    setCurrentUser(cu);
    if (!cu) { setLoading(false); return; }

    const q = query(
      collection(db, "notifications"),
      where("userId", "==", cu.uid),
      orderBy("createdAt", "desc")
    );
    const unsub = onSnapshot(q, snap => {
      setNotifications(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }, () => { setLoading(false); });
    return () => unsub();
  }, []);

  const markRead = async id => {
    try {
      await updateDoc(doc(db, "notifications", id), { read: true });
    } catch (_) {}
  };

  const formatTime = createdAt => {
    if (!createdAt) return "Just now";
    const diff = Date.now() - new Date(createdAt).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins} min ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} hr ago`;
    return "Today";
  };

  return (
    <div className="pb-24">
      <HeroBanner
        label="NOTIFICATIONS"
        heading="Stay updated on requests, helpers, and trust signals."
        subheading=""
      />

      <div className="max-w-[760px] mx-auto w-full">
        <div className="bg-white rounded-[16px] p-8 shadow-card">
          <p className="text-[11px] font-semibold text-teal-primary uppercase tracking-[0.1em] mb-3">LIVE UPDATES</p>
          <h2 className="text-[28px] font-black text-[#0F1A17] mb-6">Notification feed</h2>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-7 h-7 border-2 border-teal-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : !currentUser ? (
            <p className="text-[#6B7280] text-center py-8 font-medium">Please log in to view your notifications.</p>
          ) : notifications.length === 0 ? (
            <p className="text-[#6B7280] text-center py-8 font-medium">No notifications yet. Activity will appear here.</p>
          ) : (
            <div className="flex flex-col">
              {notifications.map(n => (
                <div
                  key={n.id}
                  className="flex items-center justify-between border-b border-[#E5E7EB] py-5 last:border-0 gap-4 cursor-pointer"
                  onClick={() => !n.read && markRead(n.id)}
                >
                  <div className="flex-1 min-w-0">
                    <p className={`text-[15px] leading-snug ${!n.read ? "font-semibold text-[#0F1A17]" : "font-normal text-[#374151]"}`}>
                      {n.text}
                    </p>
                    <p className="text-[13px] text-[#9CA3AF] mt-1">
                      {n.type} &bull; {formatTime(n.createdAt)}
                    </p>
                  </div>
                  <div className="shrink-0">
                    <span className={`px-4 py-1.5 rounded-full text-[12px] font-semibold ${!n.read ? "text-[#0F1A17]" : "text-[#9CA3AF]"}`}>
                      {!n.read ? "Unread" : "Read"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
