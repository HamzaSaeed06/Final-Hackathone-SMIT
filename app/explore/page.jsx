"use client";
import { useEffect, useState } from "react";
import HeroBanner from "../../components/HeroBanner";
import RequestCard from "../../components/RequestCard";
import { db } from "../../lib/firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";

export default function ExplorePage() {
  const [requests, setRequests] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [urgencyFilter, setUrgencyFilter] = useState("All");
  const [skillsFilter, setSkillsFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");

  useEffect(() => {
    const q = query(collection(db, "requests"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      setRequests(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, []);

  const filteredRequests = requests.filter(req => {
    if (categoryFilter !== "All" && req.category !== categoryFilter) return false;
    if (urgencyFilter !== "All" && req.urgency !== urgencyFilter) return false;
    if (skillsFilter) {
      if (!req.tags || !req.tags.some(t => t.toLowerCase().includes(skillsFilter.toLowerCase()))) return false;
    }
    if (locationFilter && req.location) {
      if (!req.location.toLowerCase().includes(locationFilter.toLowerCase())) return false;
    }
    return true;
  });

  return (
    <div className="pb-24">
      <HeroBanner 
        label="EXPLORE / FEED"
        heading="Browse help requests with filterable community context."
        subheading="Filter by category, urgency, skills, and location to surface the best matches."
      />

      <div className="flex flex-col md:flex-row gap-8">
        {/* LEFT COLUMN: FILTERS */}
        <div className="w-full md:w-[30%]">
          <div className="bg-white rounded-[16px] p-[28px] shadow-[0_1px_3px_rgba(0,0,0,0.08),0_4px_16px_rgba(0,0,0,0.04)] sticky top-6">
            <p className="text-[11px] font-semibold text-teal-primary uppercase tracking-[0.1em] mb-2">FILTERS</p>
            <h2 className="text-[28px] font-extrabold text-gray-900 mb-6">Refine the feed</h2>

            <div className="space-y-5">
              <div className="flex flex-col gap-2">
                <label className="text-[14px] font-semibold text-gray-700">Category</label>
                <select value={categoryFilter} onChange={e=>setCategoryFilter(e.target.value)} className="w-full bg-white border-[1.5px] border-gray-200 rounded-[10px] px-4 py-3 text-[15px] focus:border-teal-primary outline-none">
                  <option value="All">All categories</option>
                  <option value="Web Development">Web Development</option>
                  <option value="Design">Design</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Math">Math</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[14px] font-semibold text-gray-700">Urgency</label>
                <select value={urgencyFilter} onChange={e=>setUrgencyFilter(e.target.value)} className="w-full bg-white border-[1.5px] border-gray-200 rounded-[10px] px-4 py-3 text-[15px] focus:border-teal-primary outline-none">
                  <option value="All">All urgency levels</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[14px] font-semibold text-gray-700">Skills</label>
                <input type="text" value={skillsFilter} onChange={e=>setSkillsFilter(e.target.value)} placeholder="React, Figma, Git..." className="w-full bg-white border-[1.5px] border-gray-200 rounded-[10px] px-4 py-3 text-[15px] focus:border-teal-primary outline-none" />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[14px] font-semibold text-gray-700">Location</label>
                <input type="text" value={locationFilter} onChange={e=>setLocationFilter(e.target.value)} placeholder="Karachi, Remote..." className="w-full bg-white border-[1.5px] border-gray-200 rounded-[10px] px-4 py-3 text-[15px] focus:border-teal-primary outline-none" />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: FEED */}
        <div className="w-full md:w-[70%] flex flex-col gap-5">
          {filteredRequests.length === 0 ? (
            <div className="bg-white rounded-[16px] p-8 text-center border border-gray-100">
              <p className="text-gray-500 font-medium tracking-wide">No requests found matching filters.</p>
            </div>
          ) : (
            filteredRequests.map(req => (
              <RequestCard key={req.id} request={req} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
