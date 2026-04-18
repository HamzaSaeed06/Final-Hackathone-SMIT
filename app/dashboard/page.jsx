"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../lib/firebase";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import RequestCard from "../../components/RequestCard";

export default function DashboardPage() {
  const { user, profile } = useAuth();
  const [recentRequests, setRecentRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "requests"), orderBy("createdAt", "desc"), limit(6));
    const unsub = onSnapshot(q, (snapshot) => {
      setRecentRequests(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }, () => { setLoading(false); });
    return () => unsub();
  }, []);

  const displayName = profile?.name?.split(" ")[0] || user?.email?.split("@")[0] || "User";

  const stats = [
    { label: "MY REQUESTS", value: profile?.requestsCreated ?? 0, desc: "Open or solved items" },
    { label: "REQUESTS HELPED", value: profile?.helpCount ?? 0, desc: "Total community assists" },
    { label: "TRUST SCORE", value: `${profile?.trustScore ?? 50}%`, desc: "Based on successful help" },
    { label: "BADGES EARNED", value: profile?.badgesEarned?.length ?? 0, desc: "Total achievement badges" },
  ];

  return (
    <div className="pb-24 pt-6">
      <div className="mb-8">
        <p className="text-[11px] font-semibold text-teal-primary uppercase tracking-[0.1em] mb-2">DASHBOARD</p>
        <h1 className="text-[36px] font-black text-[#0F1A17]">Good morning, {displayName} 👋</h1>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-7">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-[16px] p-7 shadow-card">
            <p className="text-[11px] font-semibold tracking-[0.1em] text-teal-primary uppercase mb-2">{stat.label}</p>
            <p className="text-[32px] font-black text-[#0F1A17] leading-none mb-1">{stat.value}</p>
            <p className="text-[13px] text-[#6B7280]">{stat.desc}</p>
          </div>
        ))}
      </div>

      {/* AI Insight */}
      <div className="bg-[#F0FBF9] rounded-[16px] p-7 mb-7 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.1em] text-teal-primary uppercase mb-2">AI INSIGHTS</p>
          <p className="text-[16px] font-semibold text-teal-dark">
            Based on your skills, people near you need help with{" "}
            {profile?.skills?.[0] || "Web Development"}. You are a match!
          </p>
        </div>
        <Link href="/explore" className="text-teal-primary font-bold hover:underline text-[15px] whitespace-nowrap">
          Browse matching requests &rarr;
        </Link>
      </div>

      {/* Recent Requests */}
      <div className="mb-10">
        <p className="text-[11px] font-semibold tracking-[0.1em] text-teal-primary uppercase mb-2">RECENT REQUESTS</p>
        <h2 className="text-[28px] font-black text-[#0F1A17] mb-6">Open in community</h2>
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-2 border-teal-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : recentRequests.length === 0 ? (
          <div className="bg-white rounded-[16px] p-10 text-center shadow-card">
            <p className="text-[#6B7280] font-medium">No community requests yet.</p>
            <Link href="/create" className="mt-3 inline-block text-teal-primary font-semibold hover:underline">
              Post the first request →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {recentRequests.map(req => <RequestCard key={req.id} request={req} />)}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="flex gap-4 border-t border-[#E5E7EB] pt-8">
        <Link href="/create" className="bg-teal-primary text-white font-semibold px-[28px] py-[12px] rounded-full hover:bg-teal-dark transition-colors">
          Create Request
        </Link>
        <Link href="/explore" className="bg-white text-[#0F1A17] border-[1.5px] border-[#E5E7EB] font-semibold px-[28px] py-[11px] rounded-full hover:bg-gray-50 transition-colors">
          Browse Feed
        </Link>
        <Link href="/messages" className="bg-white text-[#0F1A17] border-[1.5px] border-[#E5E7EB] font-semibold px-[28px] py-[11px] rounded-full hover:bg-gray-50 transition-colors">
          Messages
        </Link>
      </div>
    </div>
  );
}
