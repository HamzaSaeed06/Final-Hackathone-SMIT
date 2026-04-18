"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db, auth } from "../../../lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import BadgeChip from "../../../components/BadgeChip";
import { writeNotification, updateUserHelpStats } from "../../../lib/firestore";

export default function RequestDetailPage() {
  const { id } = useParams();
  const [req, setReq] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setCurrentUser(auth.currentUser);
    const fetchReq = async () => {
      try {
        const snap = await getDoc(doc(db, "requests", id));
        if (snap.exists()) setReq({ id: snap.id, ...snap.data() });
      } catch (_) {}
      setLoading(false);
    };
    if (id) fetchReq();
  }, [id]);

  const isOwner = currentUser?.uid === req?.userId;
  const isHelper = req?.helpers?.some(h => h.uid === currentUser?.uid);

  const handleHelp = async () => {
    if (!currentUser) return alert("You must be logged in to offer help.");
    let userData = { name: "Volunteer", skills: [], trustScore: 50 };
    try {
      const snap = await getDoc(doc(db, "users", currentUser.uid));
      if (snap.exists()) userData = snap.data();
    } catch (_) {}

    const newHelpers = [
      ...(req.helpers || []),
      { uid: currentUser.uid, name: userData.name, skills: userData.skills, trustScore: userData.trustScore },
    ];
    await updateDoc(doc(db, "requests", req.id), { helpers: newHelpers });
    setReq(prev => ({ ...prev, helpers: newHelpers }));

    // Update helper's stats and write notifications
    await updateUserHelpStats(currentUser.uid);
    if (req.userId) {
      await writeNotification(req.userId, `${userData.name} offered help on "${req.title}"`, "Match");
    }
    await writeNotification(currentUser.uid, `You offered help on "${req.title}"`, "Match");
  };

  const markSolved = async () => {
    if (!isOwner) return;
    await updateDoc(doc(db, "requests", req.id), { status: "Solved" });
    setReq(prev => ({ ...prev, status: "Solved" }));

    // Write notifications to requester and all helpers
    if (req.userId) {
      await writeNotification(req.userId, `"${req.title}" was marked as solved`, "Status");
    }
    for (const h of req.helpers || []) {
      if (h.uid) {
        await writeNotification(h.uid, `"${req.title}" you helped with was marked as solved`, "Status");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-teal-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!req) {
    return (
      <div className="py-20 text-center">
        <p className="text-[#6B7280] font-medium text-[16px]">Request not found.</p>
      </div>
    );
  }

  return (
    <div className="pb-24">
      {/* Dark Hero Banner */}
      <div className="bg-hero rounded-[20px] px-[56px] py-[48px] mt-[24px] mb-[32px]">
        <div className="flex gap-2 mb-4 flex-wrap">
          <BadgeChip label={req.category} type="category" />
          <BadgeChip label={req.urgency} type={(req.urgency || "").toLowerCase()} />
          <BadgeChip label={req.status} type={req.status === "Solved" ? "solved" : "open"} />
        </div>
        <h1 className="text-[clamp(28px,3.5vw,48px)] font-black text-white leading-[1.2] mb-4">
          {req.title}
        </h1>
        <p className="text-[16px] text-gray-400 font-normal max-w-3xl leading-relaxed whitespace-pre-wrap">
          {req.description}
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* LEFT COLUMN */}
        <div className="w-full md:w-[60%] flex flex-col gap-6">
          {/* AI SUMMARY */}
          <div className="bg-white rounded-[16px] p-8 shadow-card">
            <p className="text-[11px] font-semibold text-teal-primary uppercase tracking-[0.1em] mb-4">AI SUMMARY</p>
            <div className="flex gap-3 items-center mb-3 text-[#0F1A17] font-bold">
              <div className="w-8 h-8 rounded-lg bg-teal-primary text-white flex items-center justify-center font-black text-[15px]">H</div>
              HelpHub AI
            </div>
            <p className="text-[#374151] text-[15px] leading-relaxed mb-6 whitespace-pre-wrap">
              {req.aiSummary || "No AI summary available for this request."}
            </p>
            <div className="flex flex-wrap gap-2">
              {req.tags?.map((tag, i) => (
                <span key={i} className="bg-gray-100 text-[#374151] rounded-full px-3 py-1 text-[13px] font-medium">{tag}</span>
              ))}
            </div>
          </div>

          {/* ACTIONS */}
          <div className="bg-white rounded-[16px] p-8 shadow-card">
            <p className="text-[11px] font-semibold text-teal-primary uppercase tracking-[0.1em] mb-4">ACTIONS</p>
            <div className="flex gap-4 flex-wrap">
              {!isOwner && req.status !== "Solved" && (
                <button
                  onClick={handleHelp} disabled={isHelper}
                  className={`px-[28px] py-[12px] rounded-full font-semibold transition-colors text-[15px] ${isHelper ? "bg-gray-100 text-[#6B7280]" : "bg-teal-primary text-white hover:bg-teal-dark"}`}
                >
                  {isHelper ? "Help Offered ✓" : "I can help"}
                </button>
              )}
              {isOwner && req.status !== "Solved" && (
                <button
                  onClick={markSolved}
                  className="bg-white text-[#0F1A17] border-[1.5px] border-[#E5E7EB] px-[28px] py-[12px] rounded-full font-semibold hover:bg-gray-50 transition-colors text-[15px]"
                >
                  Mark as solved
                </button>
              )}
              {req.status === "Solved" && (
                <span className="text-teal-primary font-bold py-[12px] text-[15px]">Request Solved ✓</span>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="w-full md:w-[40%] flex flex-col gap-6">
          {/* REQUESTER */}
          <div className="bg-white rounded-[16px] p-8 shadow-card">
            <p className="text-[11px] font-semibold text-teal-primary uppercase tracking-[0.1em] mb-4">REQUESTER</p>
            <div className="flex items-center gap-4 border-b border-gray-100 pb-4 mb-4">
              <div className="w-14 h-14 rounded-full bg-orange-100 text-orange-600 font-bold flex items-center justify-center text-xl">
                {req.userName?.substring(0, 2).toUpperCase() || "US"}
              </div>
              <div>
                <h3 className="text-[18px] font-bold text-[#0F1A17]">{req.userName}</h3>
                <p className="text-[#6B7280] text-[14px]">{req.userLocation || "Community Member"}</p>
              </div>
            </div>
            <p className="text-[13px] text-[#6B7280]">Community member • {req.status === "Solved" ? "Resolved" : "Seeking help"}</p>
          </div>

          {/* HELPERS */}
          <div className="bg-white rounded-[16px] p-8 shadow-card">
            <p className="text-[11px] font-semibold text-teal-primary uppercase tracking-[0.1em] mb-4">HELPERS</p>
            <h3 className="text-[20px] font-black text-[#0F1A17] mb-6">People ready to support</h3>
            <div className="flex flex-col gap-4">
              {!req.helpers || req.helpers.length === 0 ? (
                <p className="text-[#6B7280] text-[14px]">No helpers yet. Be the first to offer support!</p>
              ) : (
                req.helpers.map((h, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-sm">
                      {h.name?.substring(0, 2).toUpperCase() || "HL"}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-[#0F1A17] text-[14px]">{h.name}</p>
                      <p className="text-[#6B7280] text-[12px] truncate">{h.skills?.join(", ") || "Community helper"}</p>
                    </div>
                    <div className="bg-[#F0FBF9] text-teal-primary rounded-full px-3 py-1 font-semibold text-[11px] whitespace-nowrap">
                      Trust {h.trustScore || 50}%
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
