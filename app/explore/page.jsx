"use client";
import { useEffect, useState } from "react";
import HeroBanner from "../../components/HeroBanner";
import RequestCard from "../../components/RequestCard";
import { db } from "../../lib/firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";

const MOCK_REQUESTS = [
  {
    id: "m1",
    title: "Need help",
    category: "Web Development",
    urgency: "High",
    status: "Solved",
    description: "helpn needed",
    userName: "Ayesha Khan",
    userLocation: "Karachi",
    helpers: [{}],
    tags: [],
  },
  {
    id: "m2",
    title: "Need help making my portfolio responsive before demo day",
    category: "Web Development",
    urgency: "High",
    status: "Solved",
    description:
      "My HTML/CSS portfolio breaks on tablets and I need layout guidance before tomorrow evening.",
    userName: "Sara Noor",
    userLocation: "Karachi",
    helpers: [{}],
    tags: ["HTML/CSS", "Responsive", "Portfolio"],
  },
  {
    id: "m3",
    title: "Looking for Figma feedback on a volunteer event poster",
    category: "Design",
    urgency: "Medium",
    status: "Open",
    description:
      "I have a draft poster for a campus community event and want sharper hierarchy, spacing, and CTA copy.",
    userName: "Ayesha Khan",
    userLocation: "Lahore",
    helpers: [{}],
    tags: ["Figma", "Poster", "Design Review"],
  },
  {
    id: "m4",
    title: "Need mock interview support for internship applications",
    category: "Career",
    urgency: "Low",
    status: "Solved",
    description:
      "Applying to frontend internships and need someone to practice behavioral and technical interview questions with me.",
    userName: "Sara Noor",
    userLocation: "Remote",
    helpers: [{}, {}],
    tags: ["Interview Prep", "Career", "Frontend"],
  },
];

export default function ExplorePage() {
  const [requests, setRequests] = useState(MOCK_REQUESTS);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [urgencyFilter, setUrgencyFilter] = useState("All");
  const [skillsFilter, setSkillsFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");

  useEffect(() => {
    const q = query(collection(db, "requests"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      if (items.length > 0) setRequests(items);
    }, () => {});
    return () => unsub();
  }, []);

  const filteredRequests = requests.filter((req) => {
    if (categoryFilter !== "All" && req.category !== categoryFilter) return false;
    if (urgencyFilter !== "All" && req.urgency !== urgencyFilter) return false;
    if (skillsFilter) {
      if (!req.tags || !req.tags.some((t) => t.toLowerCase().includes(skillsFilter.toLowerCase())))
        return false;
    }
    if (locationFilter && (req.userLocation || req.location)) {
      const loc = req.userLocation || req.location || "";
      if (!loc.toLowerCase().includes(locationFilter.toLowerCase())) return false;
    }
    return true;
  });

  const inputCls =
    "w-full bg-white border-[1.5px] border-[#E5E7EB] rounded-[10px] px-4 py-3 text-[15px] text-[#374151] focus:border-teal-primary outline-none";

  return (
    <div className="pb-24">
      <HeroBanner
        label="EXPLORE / FEED"
        heading="Browse help requests with filterable community context."
        subheading="Filter by category, urgency, skills, and location to surface the best matches."
      />

      <div className="flex flex-col md:flex-row gap-6">
        {/* FILTERS */}
        <div className="w-full md:w-[28%]">
          <div className="bg-white rounded-[16px] p-7 shadow-card sticky top-6">
            <p className="text-[11px] font-semibold text-teal-primary uppercase tracking-[0.1em] mb-2">
              FILTERS
            </p>
            <h2 className="text-[26px] font-black text-[#0F1A17] mb-6">Refine the feed</h2>

            <div className="space-y-5">
              <div className="flex flex-col gap-2">
                <label className="text-[14px] font-semibold text-[#374151]">Category</label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className={inputCls}
                >
                  <option value="All">All categories</option>
                  <option value="Web Development">Web Development</option>
                  <option value="Design">Design</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Math">Math</option>
                  <option value="Career">Career</option>
                  <option value="Language">Language</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[14px] font-semibold text-[#374151]">Urgency</label>
                <select
                  value={urgencyFilter}
                  onChange={(e) => setUrgencyFilter(e.target.value)}
                  className={inputCls}
                >
                  <option value="All">All urgency levels</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[14px] font-semibold text-[#374151]">Skills</label>
                <textarea
                  rows={3}
                  value={skillsFilter}
                  onChange={(e) => setSkillsFilter(e.target.value)}
                  placeholder="React, Figma, Git/GitHub"
                  className={`${inputCls} resize-none`}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[14px] font-semibold text-[#374151]">Location</label>
                <textarea
                  rows={3}
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  placeholder="Karachi, Lahore, Remote"
                  className={`${inputCls} resize-none`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* FEED */}
        <div className="w-full md:w-[72%] flex flex-col gap-5">
          {filteredRequests.length === 0 ? (
            <div className="bg-white rounded-[16px] p-10 text-center shadow-card">
              <p className="text-[#6B7280] font-medium">No requests match your filters.</p>
            </div>
          ) : (
            filteredRequests.map((req) => <RequestCard key={req.id} request={req} />)
          )}
        </div>
      </div>
    </div>
  );
}
