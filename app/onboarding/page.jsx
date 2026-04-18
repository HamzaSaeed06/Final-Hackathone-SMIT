"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { slideIn } from "../../lib/animations";
import { suggestSkillsForUser } from "../../lib/aiHelpers";
import { useRouter } from "next/navigation";
import { doc, setDoc } from "firebase/firestore";
import { db, auth } from "../../lib/firebase";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  
  // Form State — pre-filled from auth localStorage
  const [name, setName] = useState(() => {
    if (typeof window !== "undefined") return localStorage.getItem("helphub_name") || "";
    return "";
  });
  const [location, setLocation] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  
  const [needs, setNeeds] = useState([]);
  const [needInput, setNeedInput] = useState("");
  
  const progressPercent = (step / 3) * 100;

  const nextStep = () => {
    setDirection(1);
    setStep(s => Math.min(3, s + 1));
  };
  const prevStep = () => {
    setDirection(-1);
    setStep(s => Math.max(1, s - 1));
  };

  const handleAddSkill = (e) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      if (!skills.includes(skillInput.trim())) {
        setSkills([...skills, skillInput.trim()]);
      }
      setSkillInput("");
    }
  };

  const handleAddNeed = (e) => {
    if (e.key === 'Enter' && needInput.trim()) {
      e.preventDefault();
      if (!needs.includes(needInput.trim())) {
        setNeeds([...needs, needInput.trim()]);
      }
      setNeedInput("");
    }
  };

  const completeOnboarding = async () => {
    const user = auth.currentUser;
    const savedRole = typeof window !== "undefined" ? localStorage.getItem("helphub_role") || "Both" : "Both";
    if (user) {
      await setDoc(doc(db, "users", user.uid), {
        name: name || user.email?.split("@")[0] || "Member",
        email: user.email,
        location,
        photoUrl,
        skills,
        needsHelpWith: needs,
        role: savedRole,
        trustScore: 50,
        helpCount: 0,
        requestsCreated: 0,
        badgesEarned: [],
        createdAt: new Date().toISOString()
      }, { merge: true });
      localStorage.removeItem("helphub_role");
      localStorage.removeItem("helphub_name");
    }
    router.push("/dashboard");
  };

  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [isSuggesting, setIsSuggesting] = useState(false);

  useEffect(() => {
    const fetchAI = async () => {
      if (step === 2 && skills.length >= 2) {
        setIsSuggesting(true);
        const suggs = await suggestSkillsForUser(skills);
        setAiSuggestions(suggs);
        setIsSuggesting(false);
      }
    };
    const timer = setTimeout(() => {
      fetchAI();
    }, 1000);
    return () => clearTimeout(timer);
  }, [skills, step]);

  return (
    <div className="max-w-[700px] mx-auto mt-12 mb-24">
      {/* Progress Bar */}
      <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden mb-12">
        <motion.div 
          className="h-full bg-teal-primary"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 p-[48px] overflow-hidden relative min-h-[400px]">
        <AnimatePresence mode="wait" custom={direction}>
          
          {step === 1 && (
            <motion.div key="step1" custom={direction} variants={slideIn} initial="enter" animate="center" exit="exit" className="absolute top-[48px] left-[48px] right-[48px]">
              <p className="text-[11px] font-semibold text-teal-primary uppercase tracking-widest mb-2">STEP 1 OF 3</p>
              <h2 className="text-[32px] font-extrabold text-gray-900 leading-[1.2] mb-8">Let's set up your basic identity</h2>
              
              <div className="space-y-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[14px] font-semibold text-gray-700">Display Name</label>
                  <input type="text" value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Ayesha Khan" className="w-full border-[1.5px] border-gray-200 rounded-[10px] px-4 py-3 text-[15px] focus:border-teal-primary focus:outline-none" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[14px] font-semibold text-gray-700">Location</label>
                  <input type="text" value={location} onChange={e=>setLocation(e.target.value)} placeholder="e.g. Karachi, Remote" className="w-full border-[1.5px] border-gray-200 rounded-[10px] px-4 py-3 text-[15px] focus:border-teal-primary focus:outline-none" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[14px] font-semibold text-gray-700">Profile Photo URL (Optional - Cloudinary config later)</label>
                  <input type="text" value={photoUrl} onChange={e=>setPhotoUrl(e.target.value)} placeholder="https://..." className="w-full border-[1.5px] border-gray-200 rounded-[10px] px-4 py-3 text-[15px] focus:border-teal-primary focus:outline-none text-gray-500 bg-gray-50" />
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" custom={direction} variants={slideIn} initial="enter" animate="center" exit="exit" className="absolute top-[48px] left-[48px] right-[48px]">
              <p className="text-[11px] font-semibold text-teal-primary uppercase tracking-widest mb-2">STEP 2 OF 3</p>
              <h2 className="text-[32px] font-extrabold text-gray-900 leading-[1.2] mb-8">What are your strong skills?</h2>
              
              <div className="space-y-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[14px] font-semibold text-gray-700">Type a skill and press Enter</label>
                  <input type="text" value={skillInput} onChange={e=>setSkillInput(e.target.value)} onKeyDown={handleAddSkill} placeholder="React, Python, Figma..." className="w-full border-[1.5px] border-gray-200 rounded-[10px] px-4 py-3 text-[15px] focus:border-teal-primary focus:outline-none" />
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {skills.map(s => (
                    <span key={s} className="bg-teal-primary text-white rounded-full px-4 py-1.5 text-[14px] font-medium flex items-center gap-2">
                      {s} <button onClick={() => setSkills(skills.filter(i => i!==s))} className="hover:text-teal-200">&times;</button>
                    </span>
                  ))}
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <p className="text-[13px] text-gray-500 mb-3">Popular suggestions:</p>
                  <div className="flex flex-wrap gap-2">
                    {['React', 'UI/UX', 'Python', 'Machine Learning'].map(s => (
                      <button key={s} onClick={() => !skills.includes(s) && setSkills([...skills, s])} className="bg-gray-100 text-gray-600 rounded-full px-3 py-1.5 text-[13px] font-medium hover:bg-gray-200 transition-colors">
                        + {s}
                      </button>
                    ))}
                  </div>
                </div>

                {skills.length >= 2 && aiSuggestions.length > 0 && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-teal-50 border border-teal-100 rounded-[12px] p-5 mt-4">
                    <p className="text-[11px] font-bold text-teal-primary uppercase tracking-widest mb-2">AI SUGGESTIONS</p>
                    <p className="text-[14px] text-gray-700 mb-3 font-medium">
                      {isSuggesting ? <span className="animate-pulse text-teal-primary font-bold">Gemini is analyzing...</span> : "Based on your skills, you may also be able to help with:"}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {aiSuggestions.map(s => (
                        <button key={s} onClick={() => !skills.includes(s) && setSkills([...skills, s])} className="bg-white border border-teal-200 text-teal-dark hover:bg-teal-primary hover:text-white rounded-full px-3 py-1.5 text-[13px] font-medium transition-colors">
                          + {s}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" custom={direction} variants={slideIn} initial="enter" animate="center" exit="exit" className="absolute top-[48px] left-[48px] right-[48px]">
              <p className="text-[11px] font-semibold text-teal-primary uppercase tracking-widest mb-2">STEP 3 OF 3</p>
              <h2 className="text-[32px] font-extrabold text-gray-900 leading-[1.2] mb-8">What do you typically need help with?</h2>
              
              <div className="space-y-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[14px] font-semibold text-gray-700">Type an area and press Enter</label>
                  <input type="text" value={needInput} onChange={e=>setNeedInput(e.target.value)} onKeyDown={handleAddNeed} placeholder="Deployment, Resume Review, CSS..." className="w-full border-[1.5px] border-gray-200 rounded-[10px] px-4 py-3 text-[15px] focus:border-teal-primary focus:outline-none" />
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {needs.map(s => (
                    <span key={s} className="bg-gray-800 text-white rounded-full px-4 py-1.5 text-[14px] font-medium flex items-center gap-2">
                      {s} <button onClick={() => setNeeds(needs.filter(i => i!==s))} className="hover:text-gray-300">&times;</button>
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>

        {/* Navigation Buttons (Absolute bottom to stay fixed relative to card) */}
        <div className="absolute bottom-[48px] left-[48px] right-[48px] flex justify-between items-center pt-6 border-t border-gray-100 bg-white">
          <button 
            type="button" 
            onClick={prevStep}
            className={`px-6 py-2.5 rounded-full font-semibold border-[1.5px] border-gray-200 text-gray-700 transition-colors hover:bg-gray-50 ${step === 1 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
          >
            Back
          </button>
          
          <button 
            type="button" 
            onClick={step === 3 ? completeOnboarding : nextStep}
            className="bg-teal-primary text-white px-8 py-2.5 rounded-full font-semibold hover:bg-teal-dark transition-colors"
          >
            {step === 3 ? "Complete Setup" : "Next Step"}
          </button>
        </div>
      </div>
    </div>
  );
}
