"use client";
import { useEffect, useState } from "react";
import HeroBanner from "../../components/HeroBanner";
import { db, auth } from "../../lib/firebase";
import { collection, getDocs, doc, deleteDoc, setDoc, addDoc } from "firebase/firestore";
import { SEED_USERS, SEED_REQUESTS, SEED_MESSAGES, SEED_NOTIFICATIONS } from "../../lib/seedData";

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [seedDone, setSeedDone] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [reqSnap, usrSnap] = await Promise.all([
        getDocs(collection(db, "requests")),
        getDocs(collection(db, "users")),
      ]);
      setRequests(reqSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      setUsers(usrSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (_) {}
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async id => {
    if (!window.confirm("Delete this request?")) return;
    await deleteDoc(doc(db, "requests", id));
    setRequests(prev => prev.filter(r => r.id !== id));
  };

  const handleSeedDatabase = async () => {
    if (!window.confirm("This will populate the database with demo data. Continue?")) return;
    setSeeding(true);
    try {
      // Seed users (use fixed IDs for demo)
      const userIds = ["demo_ayesha", "demo_hassan", "demo_sara"];
      for (let i = 0; i < SEED_USERS.length; i++) {
        await setDoc(doc(db, "users", userIds[i]), SEED_USERS[i], { merge: true });
      }

      // Seed requests
      for (const req of SEED_REQUESTS) {
        const userId = req.userName === "Ayesha Khan" ? "demo_ayesha"
          : req.userName === "Hassan Ali" ? "demo_hassan" : "demo_sara";
        await addDoc(collection(db, "requests"), { ...req, userId });
      }

      // Seed messages
      for (const msg of SEED_MESSAGES) {
        await addDoc(collection(db, "chats"), msg);
      }

      // Seed notifications for demo_ayesha
      for (const notif of SEED_NOTIFICATIONS) {
        await addDoc(collection(db, "notifications"), { ...notif, userId: "demo_ayesha" });
      }

      setSeedDone(true);
      await fetchData();
      setTimeout(() => setSeedDone(false), 4000);
    } catch (e) {
      alert("Seed failed: " + e.message);
    }
    setSeeding(false);
  };

  const totalRequests = requests.length;
  const solvedRequests = requests.filter(r => r.status === "Solved").length;
  const solvedPercent = totalRequests > 0 ? Math.round((solvedRequests / totalRequests) * 100) : 0;
  const activeUsers = users.length;

  return (
    <div className="pb-24">
      <HeroBanner
        label="ADMIN"
        heading="Platform oversight and content management."
        subheading=""
      />

      {/* STATS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-[16px] p-[28px] shadow-card">
          <p className="text-[11px] font-semibold text-teal-primary uppercase tracking-widest mb-1">Total Requests</p>
          <h3 className="text-[36px] font-black text-[#0F1A17] leading-none">{totalRequests}</h3>
        </div>
        <div className="bg-white rounded-[16px] p-[28px] shadow-card">
          <p className="text-[11px] font-semibold text-teal-primary uppercase tracking-widest mb-1">Solved %</p>
          <h3 className="text-[36px] font-black text-[#0F1A17] leading-none">{solvedPercent}%</h3>
        </div>
        <div className="bg-white rounded-[16px] p-[28px] shadow-card">
          <p className="text-[11px] font-semibold text-teal-primary uppercase tracking-widest mb-1">Active Users</p>
          <h3 className="text-[36px] font-black text-[#0F1A17] leading-none">{activeUsers}</h3>
        </div>
      </div>

      {/* SEED TOOL */}
      <div className="bg-white rounded-[16px] p-8 shadow-card mb-8">
        <p className="text-[11px] font-semibold text-teal-primary uppercase tracking-[0.1em] mb-3">DATABASE TOOLS</p>
        <h2 className="text-[22px] font-black text-[#0F1A17] mb-2">Seed Demo Data</h2>
        <p className="text-[14px] text-[#6B7280] mb-5 leading-relaxed">
          Populate Firestore with real demo users, requests, messages, and notifications so the platform looks live immediately.
          Safe to run multiple times — uses merge for users.
        </p>
        <button
          onClick={handleSeedDatabase}
          disabled={seeding}
          className="bg-teal-primary hover:bg-teal-dark text-white font-semibold px-[28px] py-[12px] rounded-full transition-colors disabled:opacity-60 text-[15px]"
        >
          {seeding ? "Seeding database..." : seedDone ? "Database seeded ✓" : "Seed database with demo data"}
        </button>
      </div>

      <div className="flex flex-col xl:flex-row gap-8">
        {/* REQUESTS TABLE */}
        <div className="w-full xl:w-[60%] bg-white rounded-[16px] p-8 shadow-card overflow-auto">
          <p className="text-[11px] font-semibold text-teal-primary uppercase tracking-[0.1em] mb-4">CONTENT GOVERNANCE</p>
          <h2 className="text-[24px] font-black text-[#0F1A17] mb-6">Requests Table</h2>
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <div className="w-6 h-6 border-2 border-teal-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[500px]">
              <thead>
                <tr className="border-b-[2px] border-gray-100">
                  <th className="py-3 text-[13px] font-bold text-[#6B7280] uppercase tracking-wider">Title</th>
                  <th className="py-3 text-[13px] font-bold text-[#6B7280] uppercase tracking-wider">Category</th>
                  <th className="py-3 text-[13px] font-bold text-[#6B7280] uppercase tracking-wider">Status</th>
                  <th className="py-3 text-[13px] font-bold text-[#6B7280] uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.length === 0 ? (
                  <tr><td colSpan={4} className="py-8 text-center text-[#6B7280] text-[14px]">No requests yet. Seed the database above.</td></tr>
                ) : (
                  requests.slice(0, 8).map(r => (
                    <tr key={r.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="py-4 text-[14px] font-bold text-[#0F1A17] pr-4 max-w-[220px] truncate">{r.title}</td>
                      <td className="py-4 text-[14px] text-[#374151]">{r.category}</td>
                      <td className="py-4 text-[14px]">
                        <span className={`px-2 py-1 rounded text-[12px] font-semibold ${r.status === "Solved" ? "bg-[#E0F2F1] text-[#0D9488]" : "bg-gray-100 text-[#374151]"}`}>
                          {r.status}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <button
                          onClick={() => handleDelete(r.id)}
                          className="border border-red-200 text-red-600 px-3 py-1 rounded hover:bg-red-50 text-[12px] font-bold transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* USERS TABLE */}
        <div className="w-full xl:w-[40%] bg-white rounded-[16px] p-8 shadow-card overflow-auto">
          <p className="text-[11px] font-semibold text-teal-primary uppercase tracking-[0.1em] mb-4">USER MANAGEMENT</p>
          <h2 className="text-[24px] font-black text-[#0F1A17] mb-6">Users Directory</h2>
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <div className="w-6 h-6 border-2 border-teal-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-[2px] border-gray-100">
                  <th className="py-3 text-[13px] font-bold text-[#6B7280] uppercase tracking-wider">Name</th>
                  <th className="py-3 text-[13px] font-bold text-[#6B7280] uppercase tracking-wider text-right">Trust</th>
                  <th className="py-3 text-[13px] font-bold text-[#6B7280] uppercase tracking-wider text-right">Helps</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr><td colSpan={3} className="py-8 text-center text-[#6B7280] text-[14px]">No users yet.</td></tr>
                ) : (
                  users.map(u => (
                    <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="py-4 text-[14px] font-bold text-[#0F1A17] pr-2">{u.name || "—"}</td>
                      <td className="py-4 text-[14px] font-semibold text-teal-primary text-right">{u.trustScore || 50}%</td>
                      <td className="py-4 text-[14px] text-[#6B7280] text-right">{u.helpCount || 0}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
