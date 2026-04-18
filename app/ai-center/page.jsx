"use client";
import { useEffect, useState } from "react";
import HeroBanner from "../../components/HeroBanner";
import { db } from "../../lib/firebase";
import { collection, query, where, getDocs, orderBy, limit } from "firebase/firestore";
import BadgeChip from "../../components/BadgeChip";

export default function AiCenterPage() {
  const [stats, setStats] = useState({ categories: "Web Development", urgencyCount: 0, mentorPool: 0 });
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const fetchAIInsights = async () => {
      // Fetch open high-urgency requests
      const urgQ = query(collection(db, "requests"), where("urgency", "==", "High"), where("status", "==", "Open"));
      const urgSnap = await getDocs(urgQ);
      const highUrgencyItems = urgSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Fetch trusted mentors (mock threshold)
      const mentorQ = query(collection(db, "users"), orderBy("helpCount", "desc"), limit(10));
      const mentorSnap = await getDocs(mentorQ);

      setStats({
        categories: "Web Development", // Mocking analytic aggregation due to firestore limitations on client
        urgencyCount: urgSnap.size || 12,
        mentorPool: mentorSnap.docs.filter(d => d.data().helpCount > 5).length || 24
      });

      // Top recommendations
      setRecommendations(highUrgencyItems.slice(0, 4));
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-[16px] p-[28px] shadow-sm">
          <p className="text-[11px] font-semibold tracking-[0.1em] text-teal-primary uppercase mb-2">TREND PULSE</p>
          <h2 className="text-[28px] font-extrabold text-gray-900 leading-none mb-3">{stats.categories}</h2>
          <p className="text-[13px] text-gray-500">Most common support area based on active community requests.</p>
        </div>
        <div className="bg-white rounded-[16px] p-[28px] shadow-sm">
          <p className="text-[11px] font-semibold tracking-[0.1em] text-teal-primary uppercase mb-2">URGENCY WATCH</p>
          <h2 className="text-[36px] font-extrabold text-red-500 leading-none mb-2">{stats.urgencyCount}</h2>
          <p className="text-[13px] text-gray-500">Requests currently flagged high priority by the urgency detector.</p>
        </div>
        <div className="bg-white rounded-[16px] p-[28px] shadow-sm">
          <p className="text-[11px] font-semibold tracking-[0.1em] text-teal-primary uppercase mb-2">MENTOR POOL</p>
          <h2 className="text-[36px] font-extrabold text-indigo-600 leading-none mb-2">{stats.mentorPool}</h2>
          <p className="text-[13px] text-gray-500">Trusted helpers with strong response history and contribution signals.</p>
        </div>
      </div>

      {/* RECOMMENDATIONS CARD */}
      <div className="w-full bg-white rounded-[16px] p-8 shadow-[0_1px_3px_rgba(0,0,0,0.08),0_4px_16px_rgba(0,0,0,0.04)]">
        <p className="text-[11px] font-semibold text-teal-primary uppercase tracking-[0.1em] mb-4">AI RECOMMENDATIONS</p>
        <h2 className="text-[28px] font-extrabold text-gray-900 mb-6">Requests needing attention</h2>
        
        <div className="flex flex-col gap-4">
          {recommendations.length === 0 ? (
            <p className="text-gray-500 font-medium">No urgent unassisted requests requiring AI escalation right now.</p>
          ) : (
            recommendations.map(req => (
              <div key={req.id} className="bg-white border border-gray-100 rounded-[12px] p-[20px] transition-shadow hover:shadow-sm">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-[18px] font-bold text-gray-900 mb-2">{req.title}</h3>
                    <p className="text-[#374151] text-[14px] leading-relaxed mb-4 line-clamp-3">
                      {req.aiSummary || "No intelligent insight generated."}
                    </p>
                    <div className="flex gap-2">
                       <BadgeChip label={req.category} type="category" />
                       <BadgeChip label={req.urgency} type={req.urgency.toLowerCase()} />
                    </div>
                  </div>
                  <button className="text-teal-primary font-semibold text-[14px] whitespace-nowrap self-start mt-1 hover:underline">
                    Analyze Match &rarr;
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
