"use client";
import { useEffect, useState } from "react";
import HeroBanner from "../../components/HeroBanner";
import { db } from "../../lib/firebase";
import { collection, query, where, getDocs, orderBy, limit } from "firebase/firestore";
import BadgeChip from "../../components/BadgeChip";

export default function AiCenterPage() {
  const [stats, setStats] = useState({ category: "—", urgencyCount: 0, mentorPool: 0 });
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAIInsights = async () => {
      try {
        const [allRequestsSnap, urgSnap, mentorSnap] = await Promise.all([
          getDocs(collection(db, "requests")),
          getDocs(query(collection(db, "requests"), where("urgency", "==", "High"), where("status", "==", "Open"))),
          getDocs(query(collection(db, "users"), orderBy("helpCount", "desc"), limit(20))),
        ]);

        // Find most common category
        const catCounts = {};
        allRequestsSnap.docs.forEach(d => {
          const cat = d.data().category || "Other";
          catCounts[cat] = (catCounts[cat] || 0) + 1;
        });
        const topCategory = Object.entries(catCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";
        const mentorCount = mentorSnap.docs.filter(d => (d.data().helpCount || 0) > 3).length;

        setStats({
          category: topCategory,
          urgencyCount: urgSnap.size,
          mentorPool: mentorCount,
        });

        // Use high urgency items as recommendations; fall back to any open items
        const highItems = urgSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        if (highItems.length > 0) {
          setRecommendations(highItems.slice(0, 4));
        } else {
          const openSnap = await getDocs(query(collection(db, "requests"), where("status", "==", "Open"), limit(4)));
          setRecommendations(openSnap.docs.map(d => ({ id: d.id, ...d.data() })));
        }
      } catch (_) {}
      setLoading(false);
    };
    fetchAIInsights();
  }, []);

  return (
    <div className="pb-24">
      <HeroBanner
        label="AI CENTER"
        heading="See what the platform intelligence is noticing."
        subheading="AI-like insights summarize demand trends, helper readiness, urgency signals, and request recommendations."
      />

      {/* STATS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        <div className="bg-white rounded-[16px] p-7 shadow-card">
          <p className="text-[11px] font-semibold tracking-[0.1em] text-teal-primary uppercase mb-2">TREND PULSE</p>
          <h2 className="text-[26px] font-black text-[#0F1A17] leading-tight mb-2">{stats.category}</h2>
          <p className="text-[13px] text-[#6B7280] leading-snug">Most common support area based on active community requests.</p>
        </div>
        <div className="bg-white rounded-[16px] p-7 shadow-card">
          <p className="text-[11px] font-semibold tracking-[0.1em] text-teal-primary uppercase mb-2">URGENCY WATCH</p>
          <h2 className="text-[36px] font-black text-[#0F1A17] leading-none mb-2">{stats.urgencyCount}</h2>
          <p className="text-[13px] text-[#6B7280] leading-snug">Requests currently flagged high priority by the urgency detector.</p>
        </div>
        <div className="bg-white rounded-[16px] p-7 shadow-card">
          <p className="text-[11px] font-semibold tracking-[0.1em] text-teal-primary uppercase mb-2">MENTOR POOL</p>
          <h2 className="text-[36px] font-black text-[#0F1A17] leading-none mb-2">{stats.mentorPool}</h2>
          <p className="text-[13px] text-[#6B7280] leading-snug">Trusted helpers with strong response history and contribution signals.</p>
        </div>
      </div>

      {/* RECOMMENDATIONS */}
      <div className="w-full bg-white rounded-[16px] p-8 shadow-card">
        <p className="text-[11px] font-semibold text-teal-primary uppercase tracking-[0.1em] mb-3">AI RECOMMENDATIONS</p>
        <h2 className="text-[28px] font-black text-[#0F1A17] mb-6">Requests needing attention</h2>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-7 h-7 border-2 border-teal-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : recommendations.length === 0 ? (
          <p className="text-[#6B7280] text-center py-8 font-medium">No open requests need attention right now.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {recommendations.map(req => (
              <div key={req.id} className="border border-[#E5E7EB] rounded-[12px] p-5 hover:shadow-sm transition-shadow">
                <h3 className="text-[16px] font-bold text-[#0F1A17] mb-1">{req.title}</h3>
                <p className="text-[14px] text-[#374151] leading-relaxed mb-3">
                  {req.aiSummary || `${req.category} request with ${(req.urgency || "medium").toLowerCase()} urgency. Best suited for members with relevant expertise.`}
                </p>
                <div className="flex gap-2 flex-wrap">
                  <BadgeChip label={req.category} type="category" />
                  <BadgeChip label={req.urgency} type={(req.urgency || "").toLowerCase()} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
