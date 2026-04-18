"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../lib/firebase";
import { collection, query, orderBy, limit, onSnapshot, doc, getDoc } from "firebase/firestore";
import RequestCard from "../../components/RequestCard";

export default function DashboardPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [recentRequests, setRecentRequests] = useState([]);

  useEffect(() => {
    if (user?.uid) {
      getDoc(doc(db, "users", user.uid)).then(snap => {
        if(snap.exists()) setProfile(snap.data());
      });
    }

    const q = query(collection(db, "requests"), orderBy("createdAt", "desc"), limit(5));
    const unsub = onSnapshot(q, (snapshot) => {
      setRecentRequests(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, [user]);

  const stats = [
    { label: "MY REQUESTS", value: profile?.requestsCreated || 0, desc: "Open or solved items" },
    { label: "REQUESTS HELPED", value: profile?.helpCount || 0, desc: "Total community assists" },
    { label: "TRUST SCORE", value: `${profile?.trustScore || 50}%`, desc: "Based on successful help" },
    { label: "BADGES EARNED", value: profile?.badgesEarned?.length || 0, desc: "Total achievement badges" }
  ];

  return (
    <div className="max-w-[1100px] mx-auto py-8 mb-24">
      <h2 className="text-[32px] font-extrabold text-gray-900 mb-8">
        Good morning, {profile?.name?.split(' ')[0] || user?.email?.split('@')[0] || 'User'} 👋
      </h2>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-[16px] p-[28px] shadow-[0_1px_3px_rgba(0,0,0,0.08),0_4px_16px_rgba(0,0,0,0.04)]">
            <p className="text-[11px] font-semibold tracking-[0.1em] text-teal-primary uppercase mb-2">{stat.label}</p>
            <p className="text-[32px] font-extrabold text-gray-900 leading-none mb-1">{stat.value}</p>
            <p className="text-[13px] text-gray-500">{stat.desc}</p>
          </div>
        ))}
      </div>

      {/* AI Insight Card */}
      <div className="bg-[#F0FBF9] rounded-[16px] p-[28px] mb-8 flex flex-col md:flex-row md:items-center justify-between shadow-sm">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.1em] text-teal-primary uppercase mb-2">AI INSIGHTS</p>
          <p className="text-[16px] font-medium text-teal-dark">
            Based on your skills, 3 people near you need help with React.
          </p>
        </div>
        <Link href="/explore?skill=react" className="text-teal-primary font-bold hover:underline mt-4 md:mt-0 text-[15px]">
          Browse matching requests &rarr;
        </Link>
      </div>

      {/* Recent Requests */}
      <div className="mb-10">
        <p className="text-[11px] font-semibold tracking-[0.1em] text-teal-primary uppercase mb-2">RECENT REQUESTS</p>
        <h2 className="text-[28px] font-extrabold text-gray-900 mb-6">Open in community</h2>
        <div className="flex flex-col gap-4">
          {recentRequests.length === 0 ? (
            <p className="text-gray-500">No requests live at the moment.</p>
          ) : (
             recentRequests.map(req => (
               <div key={req.id}>
                 <RequestCard request={req} />
               </div>
             ))
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-4 border-t border-gray-200 pt-8">
        <Link href="/create" className="bg-teal-primary text-white font-semibold px-[28px] py-[12px] rounded-full hover:bg-teal-dark transition-colors">
          Create Request
        </Link>
        <Link href="/explore" className="bg-white text-gray-900 border-[1.5px] border-gray-200 font-semibold px-[28px] py-[11px] rounded-full hover:bg-gray-50 transition-colors">
          Browse Feed
        </Link>
      </div>
    </div>
  );
}
