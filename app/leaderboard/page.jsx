"use client";
import { useEffect, useState } from "react";
import HeroBanner from "../../components/HeroBanner";
import { db } from "../../lib/firebase";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { motion } from "framer-motion";
import { fadeUp } from "../../lib/animations";

export default function LeaderboardPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        const q = query(collection(db, "users"), orderBy("helpCount", "desc"), limit(10));
        const snap = await getDocs(q);
        setUsers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (_) {}
      setLoading(false);
    };
    fetchLeaders();
  }, []);

  const getInitials = name => {
    if (!name) return "US";
    return name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
  };

  const getAvatarColor = name => {
    if (!name) return "bg-gray-100 text-gray-700";
    const colors = [
      "bg-indigo-100 text-indigo-700",
      "bg-orange-100 text-orange-700",
      "bg-pink-100 text-pink-700",
      "bg-teal-100 text-teal-700",
    ];
    return colors[name.length % colors.length];
  };

  if (loading) {
    return (
      <div className="pb-24">
        <HeroBanner
          label="LEADERBOARD"
          heading="Recognize the people who keep the community moving."
          subheading="Trust score, contribution count, and badges create visible momentum for reliable helpers."
        />
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-teal-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24">
      <HeroBanner
        label="LEADERBOARD"
        heading="Recognize the people who keep the community moving."
        subheading="Trust score, contribution count, and badges create visible momentum for reliable helpers."
      />

      {users.length === 0 ? (
        <div className="bg-white rounded-[16px] p-12 text-center shadow-card">
          <p className="text-[#6B7280] font-medium text-[15px]">No community members yet. Be the first to join!</p>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-8">
          {/* LEFT: RANKINGS */}
          <div className="w-full md:w-[55%] bg-white rounded-[16px] p-8 shadow-card">
            <p className="text-[11px] font-semibold text-teal-primary uppercase tracking-[0.1em] mb-4">TOP HELPERS</p>
            <h2 className="text-[28px] font-black text-[#0F1A17] mb-6">Rankings</h2>
            <div className="flex flex-col">
              {users.map((u, i) => (
                <motion.div
                  key={u.id} custom={i} initial="hidden" animate="visible" variants={fadeUp}
                  className="flex items-center border-b border-gray-100 py-4 last:border-0"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`w-12 h-12 rounded-full font-bold flex items-center justify-center text-sm ${getAvatarColor(u.name)}`}>
                      {getInitials(u.name)}
                    </div>
                    <div>
                      <h3 className="font-bold text-[16px] text-[#0F1A17] leading-tight">#{i + 1} {u.name}</h3>
                      <p className="text-[13px] text-[#6B7280] mt-1 line-clamp-1">
                        {u.skills?.join(", ") || "Community Member"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-[16px] text-[#0F1A17] leading-tight">{u.trustScore || 50}%</p>
                    <p className="text-[12px] text-[#6B7280] mt-1">{u.helpCount || 0} contributions</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* RIGHT: BADGE SYSTEM */}
          <div className="w-full md:w-[45%] bg-white rounded-[16px] p-8 shadow-card h-max">
            <p className="text-[11px] font-semibold text-teal-primary uppercase tracking-[0.1em] mb-4">BADGE SYSTEM</p>
            <h2 className="text-[28px] font-black text-[#0F1A17] mb-6">Trust and achievement</h2>
            <div className="flex flex-col gap-6">
              {users.map((u, i) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline mb-2">
                    <p className="font-bold text-[15px] text-[#0F1A17]">{u.name}</p>
                    <p className="text-[12px] text-[#6B7280] truncate ml-4">
                      {u.badgesEarned?.length > 0 ? u.badgesEarned.join(" • ") : "New Helper"}
                    </p>
                  </div>
                  <div className="w-full h-[6px] bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, Math.max(10, u.trustScore || 0))}%` }}
                      transition={{ delay: i * 0.1, duration: 0.8, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-amber-500 to-teal-primary rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
