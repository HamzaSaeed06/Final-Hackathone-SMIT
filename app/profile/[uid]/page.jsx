"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db, auth } from "../../../lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default function ProfilePage() {
  const { uid } = useParams();
  const [profile, setProfile] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  
  // Edit form state
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [skillsStr, setSkillsStr] = useState("");
  const [interestsStr, setInterestsStr] = useState("");

  useEffect(() => {
    setCurrentUser(auth.currentUser);

    const fetchProfile = async () => {
      // Allow mock uid fallback if database is empty 
      const fetchUid = uid || (auth.currentUser ? auth.currentUser.uid : "mock_uid");
      const snap = await getDoc(doc(db, "users", fetchUid));
      if (snap.exists()) {
        const data = snap.data();
        setProfile(data);
        setName(data.name || "");
        setLocation(data.location || "");
        setSkillsStr(data.skills?.join(', ') || "");
        setInterestsStr(data.interests?.join(', ') || "");
      } else {
        // Fallback mock profile
        const mockData = { name: "Ayesha Khan", role: "Both", location: "Karachi", trustScore: 98, helpCount: 35, skills: ["Figma", "UI/UX", "HTML/CSS", "Career Guidance"], badgesEarned: ["Design Ally", "Fast Responder", "Top Mentor"] };
        setProfile(mockData);
        setName(mockData.name);
        setLocation(mockData.location);
        setSkillsStr(mockData.skills.join(', '));
      }
    };
    fetchProfile();
  }, [uid]);

  const handleSave = async () => {
    if (!currentUser) return;
    const skills = skillsStr.split(',').map(s=>s.trim()).filter(Boolean);
    const interests = interestsStr.split(',').map(s=>s.trim()).filter(Boolean);

    await updateDoc(doc(db, "users", currentUser.uid), {
      name, location, skills, interests
    });
    
    setProfile(prev => ({ ...prev, name, location, skills, interests }));
    alert("Profile saved successfully");
  };

  if (!profile) return <div className="py-20 text-center text-gray-500">Loading Profile...</div>;

  const isOwner = currentUser?.uid === uid || !uid; // Assume owner if no specific UID provided in param mock

  return (
    <div className="pb-24">
      {/* Full width Dark Hero Banner */}
      <div className="bg-hero rounded-[20px] px-[56px] py-[48px] mt-[24px] mb-[32px] w-full text-center">
        <p className="text-[11px] font-semibold tracking-[0.1em] text-gray-400 uppercase mb-3 text-left">PROFILE</p>
        <h1 className="text-[48px] font-extrabold text-white leading-[1.1] mb-2 text-left">
          {profile.name}
        </h1>
        <p className="text-[16px] text-gray-400 font-normal text-left">
          {profile.role || "Community Member"} &bull; {profile.location || "Remote"}
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* LEFT COLUMN: PUBLIC PROFILE */}
        <div className={`w-full ${isOwner ? 'md:w-[60%]' : 'w-full'} flex flex-col gap-6`}>
          <div className="bg-white rounded-[16px] p-8 shadow-[0_1px_3px_rgba(0,0,0,0.08),0_4px_16px_rgba(0,0,0,0.04)]">
            <p className="text-[11px] font-semibold text-teal-primary uppercase tracking-[0.1em] mb-4">PUBLIC PROFILE</p>
            <h2 className="text-[28px] font-extrabold text-gray-900 mb-8">Skills and reputation</h2>
            
            <div className="flex flex-col gap-6">
              <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                <span className="text-[15px] font-medium text-gray-600">Trust score</span>
                <span className="text-[18px] font-bold text-gray-900">{profile.trustScore || 50}%</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                <span className="text-[15px] font-medium text-gray-600">Contributions</span>
                <span className="text-[18px] font-bold text-gray-900">{profile.helpCount || 0}</span>
              </div>

              <div>
                <p className="text-[15px] font-bold text-gray-900 mb-3">Skills</p>
                <div className="flex flex-wrap gap-2">
                  {profile.skills?.length > 0 ? profile.skills.map((s,i) => (
                    <span key={i} className="bg-gray-100 text-gray-600 rounded-full px-4 py-1.5 text-[13px] font-medium">{s}</span>
                  )) : <span className="text-gray-400 text-sm">No specific skills listed.</span>}
                </div>
              </div>

              <div>
                <p className="text-[15px] font-bold text-gray-900 mb-3 mt-2">Badges</p>
                <div className="flex flex-wrap gap-2">
                  {profile.badgesEarned?.length > 0 ? profile.badgesEarned.map((b,i) => (
                    <span key={i} className="bg-amber-50 text-amber-600 border border-amber-100 rounded-full px-4 py-1.5 text-[13px] font-semibold">{b}</span>
                  )) : <span className="text-gray-400 text-sm">No badges yet.</span>}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: EDIT PROFILE (Only visible strictly to owner) */}
        {isOwner && (
          <div className="w-full md:w-[40%]">
            <div className="bg-white rounded-[16px] p-8 shadow-[0_1px_3px_rgba(0,0,0,0.08),0_4px_16px_rgba(0,0,0,0.04)] h-full">
              <p className="text-[11px] font-semibold text-teal-primary uppercase tracking-[0.1em] mb-4">EDIT PROFILE</p>
              <h2 className="text-[28px] font-extrabold text-gray-900 mb-6">Update your identity</h2>
              
              <div className="flex flex-col gap-4">
                <div className="flex flex-col xl:flex-row gap-4">
                  <div className="flex flex-col gap-2 flex-1">
                    <label className="text-[14px] font-semibold text-gray-700">Name</label>
                    <input type="text" value={name} onChange={e=>setName(e.target.value)} className="bg-white border-[1.5px] border-gray-200 rounded-[10px] px-4 py-3 text-[15px] focus:border-teal-primary outline-none" />
                  </div>
                  <div className="flex flex-col gap-2 flex-1">
                    <label className="text-[14px] font-semibold text-gray-700">Location</label>
                    <input type="text" value={location} onChange={e=>setLocation(e.target.value)} className="bg-white border-[1.5px] border-gray-200 rounded-[10px] px-4 py-3 text-[15px] focus:border-teal-primary outline-none" />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[14px] font-semibold text-gray-700">Skills (comma separated)</label>
                  <input type="text" value={skillsStr} onChange={e=>setSkillsStr(e.target.value)} className="bg-white border-[1.5px] border-gray-200 rounded-[10px] px-4 py-3 text-[15px] focus:border-teal-primary outline-none" />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[14px] font-semibold text-gray-700">Interests (comma separated)</label>
                  <input type="text" value={interestsStr} onChange={e=>setInterestsStr(e.target.value)} className="bg-white border-[1.5px] border-gray-200 rounded-[10px] px-4 py-3 text-[15px] focus:border-teal-primary outline-none" />
                </div>

                <button onClick={handleSave} className="w-full bg-teal-primary hover:bg-teal-dark transition-colors text-white rounded-full py-[12px] font-semibold text-[15px] mt-4">
                  Save profile
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
