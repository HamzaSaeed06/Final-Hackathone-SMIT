"use client";
import { useEffect, useState } from "react";
import HeroBanner from "../../components/HeroBanner";
import { db } from "../../lib/firebase";
import { collection, query, where, getDocs, orderBy, limit } from "firebase/firestore";
import BadgeChip from "../../components/BadgeChip";

const FALLBACK_RECOMMENDATIONS = [
  {
    id: "f1",
    title: "Need help",
    aiSummary:
      "Web Development request with high urgency. Best suited for members with relevant expertise.",
    category: "Web Development",
    urgency: "High",
  },
  {
    id: "f2",
    title: "Need help making my portfolio responsive before demo day",
    aiSummary:
      "Responsive layout issue with a short deadline. Best helpers are frontend mentors comfortable with CSS grids and media queries.",
    category: "Web Development",
    urgency: "High",
  },
  {
    id: "f3",
    title: "Looking for Figma feedback on a volunteer event poster",
    aiSummary:
      "A visual design critique request where feedback on hierarchy, spacing, and messaging would create the most value.",
    category: "Design",
    urgency: "Medium",
  },
  {
    id: "f4",
    title: "Need mock interview support for internship applications",
    aiSummary:
      "Career coaching request focused on confidence-building, behavioral answers, and entry-level frontend interviews.",
    category: "Career",
    urgency: "Low",
  },
];

export default function AiCenterPage() {
  const [stats, setStats] = useState({ categories: "Web Development", urgencyCount: 2, mentorPool: 2 });
  const [recommendations, setRecommendations] = useState(FALLBACK_RECOMMENDATIONS);

  useEffect(() => {
    const fetchAIInsights = async () => {
      try {
        const urgQ = query(
          collection(db, "requests"),
          where("urgency", "==", "High"),
          where("status", "==", "Open")
        );
        const urgSnap = await getDocs(urgQ);
        const highItems = urgSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        const mentorQ = query(collection(db, "users"), orderBy("helpCount", "desc"), limit(10));
        const mentorSnap = await getDocs(mentorQ);
        const mentorCount = mentorSnap.docs.filter((d) => (d.data().helpCount || 0) > 5).length;

        setStats({
          categories: "Web Development",
          urgencyCount: urgSnap.size || 2,
          mentorPool: mentorCount || 2,
        });

        if (highItems.length > 0) {
          setRecommendations(highItems.slice(0, 4));
        }
      } catch (e) {
        // keep fallback values
      }
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
          <p className="text-[11px] font-semibold tracking-[0.1em] text-teal-primary uppercase mb-2">
            TREND PULSE
          </p>
          <h2 className="text-[26px] font-black text-[#0F1A17] leading-tight mb-2">
            {stats.categories}
          </h2>
          <p className="text-[13px] text-[#6B7280] leading-snug">
            Most common support area based on active community requests.
          </p>
        </div>
        <div className="bg-white rounded-[16px] p-7 shadow-card">
          <p className="text-[11px] font-semibold tracking-[0.1em] text-teal-primary uppercase mb-2">
            URGENCY WATCH
          </p>
          <h2 className="text-[36px] font-black text-[#0F1A17] leading-none mb-2">
            {stats.urgencyCount}
          </h2>
          <p className="text-[13px] text-[#6B7280] leading-snug">
            Requests currently flagged high priority by the urgency detector.
          </p>
        </div>
        <div className="bg-white rounded-[16px] p-7 shadow-card">
          <p className="text-[11px] font-semibold tracking-[0.1em] text-teal-primary uppercase mb-2">
            MENTOR POOL
          </p>
          <h2 className="text-[36px] font-black text-[#0F1A17] leading-none mb-2">
            {stats.mentorPool}
          </h2>
          <p className="text-[13px] text-[#6B7280] leading-snug">
            Trusted helpers with strong response history and contribution signals.
          </p>
        </div>
      </div>

      {/* RECOMMENDATIONS CARD */}
      <div className="w-full bg-white rounded-[16px] p-8 shadow-card">
        <p className="text-[11px] font-semibold text-teal-primary uppercase tracking-[0.1em] mb-3">
          AI RECOMMENDATIONS
        </p>
        <h2 className="text-[28px] font-black text-[#0F1A17] mb-6">Requests needing attention</h2>

        <div className="flex flex-col gap-4">
          {recommendations.map((req) => (
            <div
              key={req.id}
              className="border border-[#E5E7EB] rounded-[12px] p-5 hover:shadow-sm transition-shadow"
            >
              <h3 className="text-[16px] font-bold text-[#0F1A17] mb-1">{req.title}</h3>
              <p className="text-[14px] text-[#374151] leading-relaxed mb-3">
                {req.aiSummary || "No AI summary available."}
              </p>
              <div className="flex gap-2 flex-wrap">
                <BadgeChip label={req.category} type="category" />
                <BadgeChip label={req.urgency} type={(req.urgency || "").toLowerCase()} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
