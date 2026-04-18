"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db, auth } from "../../../lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default function ProfilePage() {
  const { uid } = useParams();
  const [profile, setProfile] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [skillsStr, setSkillsStr] = useState("");
  const [interestsStr, setInterestsStr] = useState("");

  useEffect(() => {
    const cu = auth.currentUser;
    setCurrentUser(cu);
    const fetchUid = uid === "me" ? cu?.uid : uid;
    if (!fetchUid) { setLoading(false); return; }

    const fetchProfile = async () => {
      try {
        const snap = await getDoc(doc(db, "users", fetchUid));
        if (snap.exists()) {
          const data = snap.data();
          setProfile(data);
          setName(data.name || "");
          setLocation(data.location || "");
          setSkillsStr(data.skills?.join(", ") || "");
          setInterestsStr(data.interests?.join(", ") || "");
        } else {
          setProfile(null);
        }
      } catch (_) {}
      setLoading(false);
    };
    fetchProfile();
  }, [uid]);

  const handleSave = async () => {
    if (!currentUser) return;
    const skills = skillsStr.split(",").map(s => s.trim()).filter(Boolean);
    const interests = interestsStr.split(",").map(s => s.trim()).filter(Boolean);
    await updateDoc(doc(db, "users", currentUser.uid), { name, location, skills, interests });
    setProfile(prev => ({ ...prev, name, location, skills, interests }));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const isOwner = currentUser?.uid === uid || uid === "me";

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-teal-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="py-20 text-center">
        <p className="text-[#6B7280] font-medium text-[16px]">Profile not found.</p>
      </div>
    );
  }

  return (
    <div className="pb-24">
      <div className="bg-hero rounded-[20px] px-[56px] py-[48px] mt-[24px] mb-[32px] w-full">
        <p className="text-[11px] font-semibold tracking-[0.1em] text-gray-400 uppercase mb-3">PROFILE</p>
        <h1 className="text-[48px] font-black text-white leading-[1.1] mb-2">{profile.name}</h1>
        <p className="text-[16px] text-gray-400 font-normal">
          {profile.role || "Community Member"} &bull; {profile.location || "Remote"}
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* PUBLIC PROFILE */}
        <div className={`w-full ${isOwner ? "md:w-[60%]" : ""} flex flex-col gap-6`}>
          <div className="bg-white rounded-[16px] p-8 shadow-card">
            <p className="text-[11px] font-semibold text-teal-primary uppercase tracking-[0.1em] mb-4">PUBLIC PROFILE</p>
            <h2 className="text-[28px] font-black text-[#0F1A17] mb-8">Skills and reputation</h2>
            <div className="flex flex-col gap-6">
              <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                <span className="text-[15px] font-medium text-[#374151]">Trust score</span>
                <span className="text-[18px] font-bold text-[#0F1A17]">{profile.trustScore || 50}%</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                <span className="text-[15px] font-medium text-[#374151]">Contributions</span>
                <span className="text-[18px] font-bold text-[#0F1A17]">{profile.helpCount || 0}</span>
              </div>
              <div>
                <p className="text-[15px] font-bold text-[#0F1A17] mb-3">Skills</p>
                <div className="flex flex-wrap gap-2">
                  {profile.skills?.length > 0
                    ? profile.skills.map((s, i) => (
                        <span key={i} className="bg-gray-100 text-[#374151] rounded-full px-4 py-1.5 text-[13px] font-medium">{s}</span>
                      ))
                    : <span className="text-[#6B7280] text-[14px]">No skills listed yet.</span>}
                </div>
              </div>
              <div>
                <p className="text-[15px] font-bold text-[#0F1A17] mb-3 mt-2">Badges</p>
                <div className="flex flex-wrap gap-2">
                  {profile.badgesEarned?.length > 0
                    ? profile.badgesEarned.map((b, i) => (
                        <span key={i} className="bg-amber-50 text-amber-600 border border-amber-100 rounded-full px-4 py-1.5 text-[13px] font-semibold">{b}</span>
                      ))
                    : <span className="text-[#6B7280] text-[14px]">No badges earned yet.</span>}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* EDIT PROFILE */}
        {isOwner && (
          <div className="w-full md:w-[40%]">
            <div className="bg-white rounded-[16px] p-8 shadow-card h-full">
              <p className="text-[11px] font-semibold text-teal-primary uppercase tracking-[0.1em] mb-4">EDIT PROFILE</p>
              <h2 className="text-[28px] font-black text-[#0F1A17] mb-6">Update your identity</h2>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col xl:flex-row gap-4">
                  <div className="flex flex-col gap-2 flex-1">
                    <label className="text-[14px] font-semibold text-[#374151]">Name</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} className="bg-white border-[1.5px] border-[#E5E7EB] rounded-[10px] px-4 py-3 text-[15px] focus:border-teal-primary outline-none" />
                  </div>
                  <div className="flex flex-col gap-2 flex-1">
                    <label className="text-[14px] font-semibold text-[#374151]">Location</label>
                    <input type="text" value={location} onChange={e => setLocation(e.target.value)} className="bg-white border-[1.5px] border-[#E5E7EB] rounded-[10px] px-4 py-3 text-[15px] focus:border-teal-primary outline-none" />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[14px] font-semibold text-[#374151]">Skills (comma separated)</label>
                  <input type="text" value={skillsStr} onChange={e => setSkillsStr(e.target.value)} className="bg-white border-[1.5px] border-[#E5E7EB] rounded-[10px] px-4 py-3 text-[15px] focus:border-teal-primary outline-none" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[14px] font-semibold text-[#374151]">Interests (comma separated)</label>
                  <input type="text" value={interestsStr} onChange={e => setInterestsStr(e.target.value)} className="bg-white border-[1.5px] border-[#E5E7EB] rounded-[10px] px-4 py-3 text-[15px] focus:border-teal-primary outline-none" />
                </div>
                <button
                  onClick={handleSave}
                  className="w-full bg-teal-primary hover:bg-teal-dark transition-colors text-white rounded-full py-[12px] font-semibold text-[15px] mt-4"
                >
                  {saved ? "Profile saved ✓" : "Save profile"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
