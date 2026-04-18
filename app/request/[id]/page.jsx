"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db, auth } from "../../../lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import BadgeChip from "../../../components/BadgeChip";

export default function RequestDetailPage() {
  const { id } = useParams();
  const [req, setReq] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    setCurrentUser(auth.currentUser);

    const fetchReq = async () => {
      const snap = await getDoc(doc(db, "requests", id));
      if (snap.exists()) {
        setReq({ id: snap.id, ...snap.data() });
      }
    };
    if (id) fetchReq();
  }, [id]);

  if (!req) return <div className="py-20 text-center text-gray-500">Loading Request...</div>;

  const isOwner = currentUser?.uid === req.userId;
  const isHelper = req.helpers?.some(h => h.uid === currentUser?.uid);

  const handleHelp = async () => {
    if (!currentUser) return alert("Must be logged in to help.");
    const snap = await getDoc(doc(db, "users", currentUser.uid));
    const userData = snap.exists() ? snap.data() : { name: "Volunteer", skills: [], trustScore: 50 };
    
    const newHelpers = [...(req.helpers || []), {
      uid: currentUser.uid,
      name: userData.name,
      skills: userData.skills,
      trustScore: userData.trustScore
    }];

    await updateDoc(doc(db, "requests", req.id), { helpers: newHelpers });
    setReq({ ...req, helpers: newHelpers });
  };

  const markSolved = async () => {
    await updateDoc(doc(db, "requests", req.id), { status: "Solved" });
    setReq({ ...req, status: "Solved" });
  };

  return (
    <div className="pb-24">
      {/* Dark Hero Banner specific for detail page */}
      <div className="bg-hero rounded-[20px] px-[56px] py-[48px] mt-[24px] mb-[32px]">
        <div className="flex gap-2 mb-4">
          <BadgeChip label={req.category} type="category" />
          <BadgeChip label={req.urgency} type={req.urgency} />
          <BadgeChip label={req.status} type={req.status === 'Solved' ? 'solved' : 'open'} />
        </div>
        <h1 className="text-[clamp(32px,3.5vw,48px)] font-extrabold text-white leading-[1.2] mb-4">
          {req.title}
        </h1>
        <p className="text-[16px] text-gray-400 font-normal max-w-3xl leading-relaxed whitespace-pre-wrap">
          {req.description}
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* LEFT COLUMN */}
        <div className="w-full md:w-[60%] flex flex-col gap-6">
          {/* AI SUMMARY CARD */}
          <div className="bg-white rounded-[16px] p-8 shadow-[0_1px_3px_rgba(0,0,0,0.08),0_4px_16px_rgba(0,0,0,0.04)]">
            <p className="text-[11px] font-semibold text-teal-primary uppercase tracking-[0.1em] mb-4">AI SUMMARY</p>
            <div className="flex gap-3 items-center mb-3 text-gray-900 font-bold">
              <div className="w-8 h-8 rounded-lg bg-teal-primary text-white flex items-center justify-center font-bold">H</div>
              HelpHub AI
            </div>
            <p className="text-[#374151] text-[15px] leading-relaxed mb-6 whitespace-pre-wrap">
              {req.aiSummary || "The Gemini AI overview for this request will appear here upon evaluation."}
            </p>
            <div className="flex flex-wrap gap-2">
              {req.tags?.map((tag, i) => (
                <span key={i} className="bg-gray-100 text-gray-600 rounded-full px-3 py-1 text-[13px] font-medium">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* ACTIONS CARD */}
          <div className="bg-white rounded-[16px] p-8 shadow-[0_1px_3px_rgba(0,0,0,0.08),0_4px_16px_rgba(0,0,0,0.04)]">
            <p className="text-[11px] font-semibold text-teal-primary uppercase tracking-[0.1em] mb-4">ACTIONS</p>
            <div className="flex gap-4">
              {!isOwner && req.status !== "Solved" && (
                <button 
                  onClick={handleHelp} disabled={isHelper}
                  className={`px-[28px] py-[12px] rounded-full font-semibold transition-colors ${isHelper ? 'bg-gray-100 text-gray-400' : 'bg-teal-primary text-white hover:bg-teal-dark'}`}
                >
                  {isHelper ? "Help Offered" : "I can help"}
                </button>
              )}
              {isOwner && req.status !== "Solved" && (
                <button 
                  onClick={markSolved}
                  className="bg-white text-gray-900 border-[1.5px] border-gray-200 px-[28px] py-[12px] rounded-full font-semibold hover:bg-gray-50 transition-colors"
                >
                  Mark as solved
                </button>
              )}
              {req.status === "Solved" && (
                <span className="text-teal-primary font-bold py-[12px]">Request Solved ✓</span>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="w-full md:w-[40%] flex flex-col gap-6">
          {/* REQUESTER CARD */}
          <div className="bg-white rounded-[16px] p-8 shadow-[0_1px_3px_rgba(0,0,0,0.08),0_4px_16px_rgba(0,0,0,0.04)]">
            <p className="text-[11px] font-semibold text-teal-primary uppercase tracking-[0.1em] mb-4">REQUESTER</p>
            <div className="flex items-center gap-4 border-b border-gray-100 pb-4 mb-4">
              <div className="w-14 h-14 rounded-full bg-orange-100 text-orange-600 font-bold flex items-center justify-center text-xl">
                {req.userName?.substring(0,2).toUpperCase() || "US"}
              </div>
              <div>
                <h3 className="text-[18px] font-bold text-gray-900">{req.userName}</h3>
                <p className="text-gray-500 text-[14px]">{req.userLocation || "Community Member"}</p>
              </div>
            </div>
            <p className="text-sm text-gray-500">Joined recently • Need Help Role</p>
          </div>

          {/* HELPERS CARD */}
          <div className="bg-white rounded-[16px] p-8 shadow-[0_1px_3px_rgba(0,0,0,0.08),0_4px_16px_rgba(0,0,0,0.04)]">
            <p className="text-[11px] font-semibold text-teal-primary uppercase tracking-[0.1em] mb-4">HELPERS</p>
            <h3 className="text-[20px] font-extrabold text-gray-900 mb-6">People ready to support</h3>
            
            <div className="flex flex-col gap-4">
              {!req.helpers || req.helpers.length === 0 ? (
                <p className="text-gray-500 text-sm">No helpers yet. Be the first!</p>
              ) : (
                req.helpers.map((h, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-sm">
                      {h.name?.substring(0,2).toUpperCase() || 'HL'}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-900 text-[14px]">{h.name}</p>
                      <p className="text-gray-500 text-[12px] truncate">{h.skills?.join(', ') || 'Community helper'}</p>
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
