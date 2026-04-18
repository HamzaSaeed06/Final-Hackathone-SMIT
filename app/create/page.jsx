"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import HeroBanner from "../../components/HeroBanner";
import AIPanel from "../../components/AIPanel";
import { autoAnalyzeRequest, generateAISummary } from "../../lib/aiHelpers";
import { db, auth } from "../../lib/firebase";
import { collection, addDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { writeNotification } from "../../lib/firestore";

export default function CreateRequestPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Other");
  const [urgency, setUrgency] = useState("Medium");
  const [tagsInput, setTagsInput] = useState("");

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiCat, setAiCat] = useState("Community");
  const [aiUrg, setAiUrg] = useState("Low");
  const [aiTags, setAiTags] = useState([]);
  const [aiRewrite, setAiRewrite] = useState("Start describing the challenge to generate a stronger version.");
  const [isPublishing, setIsPublishing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (description.length > 10) {
        setIsAnalyzing(true);
        const data = await autoAnalyzeRequest(description);
        if (data) {
          setAiCat(data.category || "Community");
          setAiUrg(data.urgency || "Low");
          setAiTags(data.tags || []);
          if (data.rewrite) setAiRewrite(data.rewrite);
        }
        setIsAnalyzing(false);
      } else {
        setAiCat("Community");
        setAiUrg("Low");
        setAiTags([]);
        setAiRewrite("Start describing the challenge to generate a stronger version.");
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [description]);

  const applyAISuggestions = () => {
    if (aiCat !== "Community" && aiCat !== "Other") setCategory(aiCat);
    setUrgency(aiUrg);
    if (aiTags.length > 0) setTagsInput(aiTags.join(", "));
  };

  const handlePublish = async () => {
    if (!title || !description) return alert("Title and Description are required.");
    setIsPublishing(true);

    const user = auth.currentUser;
    let userName = "Community Member";
    let userLocation = "Remote";
    let userId = user?.uid || null;

    if (user) {
      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        if (snap.exists()) {
          userName = snap.data().name || userName;
          userLocation = snap.data().location || userLocation;
        }
      } catch (_) {}
    }

    const tagsArray = tagsInput.split(",").map(t => t.trim()).filter(Boolean);
    const finalSummary = await generateAISummary({ title, description, category, urgency });

    const docRef = await addDoc(collection(db, "requests"), {
      title,
      description,
      category,
      urgency,
      tags: tagsArray,
      aiSummary: finalSummary,
      userId,
      userName,
      userLocation,
      helpers: [],
      status: "Open",
      createdAt: new Date().toISOString(),
    });

    // Update user's requestsCreated count
    if (user) {
      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        if (snap.exists()) {
          await updateDoc(doc(db, "users", user.uid), {
            requestsCreated: (snap.data().requestsCreated || 0) + 1,
          });
        }
        // Write notification for the requester
        await writeNotification(
          user.uid,
          `Your request "${title}" is now live in the community feed`,
          "Request"
        );
      } catch (_) {}
    }

    setIsPublishing(false);
    router.push("/explore");
  };

  return (
    <div className="pb-24">
      <HeroBanner
        label="CREATE REQUEST"
        heading="Turn a rough problem into a clear help request."
        subheading="Use built-in AI suggestions for category, urgency, tags, and a stronger description rewrite."
      />

      <div className="flex flex-col md:flex-row gap-8">
        {/* FORM */}
        <div className="w-full md:w-[60%] bg-white rounded-[16px] p-[32px] shadow-card">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[14px] font-semibold text-[#374151]">Title</label>
              <input
                type="text" value={title} onChange={e => setTitle(e.target.value)}
                placeholder="Need review on my JavaScript quiz app before submission"
                className="border-[1.5px] border-[#E5E7EB] rounded-[10px] px-4 py-3 focus:border-teal-primary outline-none text-[15px]"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[14px] font-semibold text-[#374151]">Description</label>
              <textarea
                rows={5} value={description} onChange={e => setDescription(e.target.value)}
                placeholder="Explain the challenge, your current progress, deadline, and what kind of help would be useful."
                className="border-[1.5px] border-[#E5E7EB] rounded-[10px] px-4 py-3 focus:border-teal-primary outline-none resize-y text-[15px]"
              />
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex flex-col gap-2 flex-1">
                <label className="text-[14px] font-semibold text-[#374151]">Tags (comma separated)</label>
                <input
                  type="text" value={tagsInput} onChange={e => setTagsInput(e.target.value)}
                  placeholder="JavaScript, Debugging, Review"
                  className="border-[1.5px] border-[#E5E7EB] rounded-[10px] px-4 py-3 focus:border-teal-primary outline-none text-[15px]"
                />
              </div>
              <div className="flex flex-col gap-2 flex-1">
                <label className="text-[14px] font-semibold text-[#374151]">Category</label>
                <select value={category} onChange={e => setCategory(e.target.value)} className="border-[1.5px] border-[#E5E7EB] rounded-[10px] px-4 py-3 focus:border-teal-primary outline-none text-[15px]">
                  <option>Web Development</option>
                  <option>Design</option>
                  <option>Math</option>
                  <option>Language</option>
                  <option>Career</option>
                  <option>Data Science</option>
                  <option>Other</option>
                </select>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[14px] font-semibold text-[#374151]">Urgency</label>
              <select value={urgency} onChange={e => setUrgency(e.target.value)} className="border-[1.5px] border-[#E5E7EB] rounded-[10px] px-4 py-3 w-max focus:border-teal-primary outline-none text-[15px]">
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>
            <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
              <button
                type="button" onClick={applyAISuggestions} disabled={isAnalyzing}
                className="bg-white border-[1.5px] border-[#E5E7EB] text-[#0F1A17] font-semibold px-[28px] py-[11px] rounded-full hover:bg-gray-50 transition-colors disabled:opacity-50 text-[15px]"
              >
                Apply AI suggestions
              </button>
              <button
                type="button" onClick={handlePublish} disabled={isPublishing}
                className="bg-teal-primary text-white font-semibold px-[28px] py-[11px] rounded-full hover:bg-teal-dark transition-colors disabled:opacity-50 min-w-[150px] text-[15px]"
              >
                {isPublishing ? "Publishing..." : "Publish request"}
              </button>
            </div>
          </div>
        </div>

        {/* AI ASSISTANT */}
        <div className="w-full md:w-[40%]">
          <AIPanel title="Smart request guidance">
            {isAnalyzing ? (
              <div className="py-6 flex flex-col items-center justify-center text-teal-primary">
                <div className="w-6 h-6 border-2 border-teal-primary border-t-transparent rounded-full animate-spin mb-3" />
                <p className="text-[13px] font-bold tracking-wide animate-pulse">Gemini analyzing...</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <div className="pb-4 border-b border-teal-primary/10 flex justify-between">
                  <span className="text-[14px] text-[#374151] font-medium">Suggested category</span>
                  <span className="text-[14px] text-[#0F1A17] font-bold">{aiCat}</span>
                </div>
                <div className="pb-4 border-b border-teal-primary/10 flex justify-between">
                  <span className="text-[14px] text-[#374151] font-medium">Detected urgency</span>
                  <span className="text-[14px] text-[#0F1A17] font-bold">{aiUrg}</span>
                </div>
                <div className="pb-4 border-b border-teal-primary/10 flex justify-between">
                  <span className="text-[14px] text-[#374151] font-medium">Suggested tags</span>
                  <span className="text-[13px] text-[#6B7280] italic text-right max-w-[150px]">
                    {aiTags.length > 0 ? aiTags.join(", ") : "Add more detail for smarter tags"}
                  </span>
                </div>
                <div className="flex flex-col gap-1 pt-2">
                  <span className="text-[14px] text-[#374151] font-medium">Rewrite suggestion</span>
                  <span className="text-[14px] text-[#6B7280] mt-1 leading-relaxed">{aiRewrite}</span>
                </div>
              </div>
            )}
          </AIPanel>
        </div>
      </div>
    </div>
  );
}
