"use client";
import { useEffect, useState } from "react";
import HeroBanner from "../../components/HeroBanner";
import { db, auth } from "../../lib/firebase";
import { collection, getDocs, doc, deleteDoc, setDoc, addDoc, updateDoc, query, where } from "firebase/firestore";
import { SEED_USERS, SEED_REQUESTS, SEED_MESSAGES, SEED_NOTIFICATIONS } from "../../lib/seedData";
import { useAuth } from "../../context/AuthContext";

export default function AdminPage() {
  const { user, profile, refreshProfile } = useAuth();
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [seedDone, setSeedDone] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [adminExists, setAdminExists] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [reqSnap, usrSnap, adminSnap] = await Promise.all([
        getDocs(collection(db, "requests")),
        getDocs(collection(db, "users")),
        getDocs(query(collection(db, "users"), where("isAdmin", "==", true))),
      ]);
      setRequests(reqSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      setUsers(usrSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      setAdminExists(adminSnap.size > 0);
    } catch (_) {}
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const isAdmin = profile?.isAdmin === true;

  const handleClaimAdmin = async () => {
    if (!user) return;
    setClaiming(true);
    try {
      await updateDoc(doc(db, "users", user.uid), { isAdmin: true });
      await refreshProfile();
      await fetchData();
    } catch (_) {}
    setClaiming(false);
  };

  const handleDelete = async id => {
    if (!window.confirm("Delete this request?")) return;
    await deleteDoc(doc(db, "requests", id));
    setRequests(prev => prev.filter(r => r.id !== id));
  };

  const handleToggleAdmin = async (userId, currentStatus) => {
    if (userId === user?.uid) return;
    await updateDoc(doc(db, "users", userId), { isAdmin: !currentStatus });
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, isAdmin: !currentStatus } : u));
  };

  const handleSeedDatabase = async () => {
    if (!window.confirm("Populate the database with demo data?")) return;
    setSeeding(true);
    try {
      const userIds = ["demo_ayesha", "demo_hassan", "demo_sara"];
      for (let i = 0; i < SEED_USERS.length; i++) {
        await setDoc(doc(db, "users", userIds[i]), SEED_USERS[i], { merge: true });
      }
      for (const req of SEED_REQUESTS) {
        const userId = req.userName === "Ayesha Khan" ? "demo_ayesha"
          : req.userName === "Hassan Ali" ? "demo_hassan" : "demo_sara";
        await addDoc(collection(db, "requests"), { ...req, userId });
      }
      for (const msg of SEED_MESSAGES) {
        await addDoc(collection(db, "chats"), msg);
      }
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

  // NOT ADMIN — show claim or access denied
  if (!isAdmin) {
    return (
      <div className="pb-24">
        <HeroBanner label="ADMIN" heading="Platform oversight and content management." subheading="" />
        <div className="max-w-[600px] mx-auto bg-white rounded-[20px] p-12 shadow-card text-center">
          {!adminExists ? (
            <>
              <div className="w-16 h-16 bg-teal-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🔑</span>
              </div>
              <p className="text-[11px] font-semibold text-teal-primary uppercase tracking-[0.1em] mb-3">FIRST ADMIN SETUP</p>
              <h2 className="text-[28px] font-black text-[#0F1A17] mb-3">Claim admin status</h2>
              <p className="text-[15px] text-[#6B7280] leading-relaxed mb-8">
                No admin exists yet. Since you are the first user, you can claim admin status for your account. This gives you full access to manage all content and users on the platform.
              </p>
              <button
                onClick={handleClaimAdmin}
                disabled={claiming}
                className="bg-teal-primary hover:bg-teal-dark text-white font-semibold px-[36px] py-[14px] rounded-full transition-colors disabled:opacity-60 text-[15px]"
              >
                {claiming ? "Setting up..." : "Claim admin status"}
              </button>
            </>
          ) : (
            <>
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🔒</span>
              </div>
              <h2 className="text-[28px] font-black text-[#0F1A17] mb-3">Access restricted</h2>
              <p className="text-[15px] text-[#6B7280] leading-relaxed">
                Admin access is restricted to approved administrators. Contact an existing admin to grant you access.
              </p>
            </>
          )}
        </div>
      </div>
    );
  }

  // ADMIN DASHBOARD
  return (
    <div className="pb-24">
      <HeroBanner
        label="ADMIN PANEL"
        heading="Platform oversight and content management."
        subheading={`Logged in as admin: ${profile?.name || user?.email}`}
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
          <p className="text-[11px] font-semibold text-teal-primary uppercase tracking-widest mb-1">Total Users</p>
          <h3 className="text-[36px] font-black text-[#0F1A17] leading-none">{users.length}</h3>
        </div>
      </div>

      {/* SEED TOOL */}
      <div className="bg-white rounded-[16px] p-8 shadow-card mb-8">
        <p className="text-[11px] font-semibold text-teal-primary uppercase tracking-[0.1em] mb-3">DATABASE TOOLS</p>
        <h2 className="text-[22px] font-black text-[#0F1A17] mb-2">Seed Demo Data</h2>
        <p className="text-[14px] text-[#6B7280] mb-5 leading-relaxed">
          Populate Firestore with demo users, requests, messages, and notifications so the platform looks live immediately.
        </p>
        <button
          onClick={handleSeedDatabase} disabled={seeding}
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
                  <th className="py-3 text-right text-[13px] font-bold text-[#6B7280] uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.length === 0 ? (
                  <tr><td colSpan={4} className="py-8 text-center text-[#6B7280] text-[14px]">No requests yet. Use the seed tool above.</td></tr>
                ) : (
                  requests.slice(0, 8).map(r => (
                    <tr key={r.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="py-4 text-[14px] font-bold text-[#0F1A17] pr-4 max-w-[220px] truncate">{r.title}</td>
                      <td className="py-4 text-[14px] text-[#374151]">{r.category}</td>
                      <td className="py-4">
                        <span className={`px-2 py-1 rounded text-[12px] font-semibold ${r.status === "Solved" ? "bg-[#E0F2F1] text-[#0D9488]" : "bg-gray-100 text-[#374151]"}`}>{r.status}</span>
                      </td>
                      <td className="py-4 text-right">
                        <button onClick={() => handleDelete(r.id)} className="border border-red-200 text-red-500 px-3 py-1 rounded hover:bg-red-50 text-[12px] font-bold transition-colors">Delete</button>
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
                  <th className="py-3 text-[13px] font-bold text-[#6B7280] uppercase tracking-wider text-center">Role</th>
                  <th className="py-3 text-[13px] font-bold text-[#6B7280] uppercase tracking-wider text-right">Admin</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr><td colSpan={3} className="py-8 text-center text-[#6B7280] text-[14px]">No users yet.</td></tr>
                ) : (
                  users.map(u => (
                    <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="py-4 text-[14px] font-bold text-[#0F1A17] pr-2 max-w-[120px] truncate">
                        {u.name || "—"}
                        {u.id === user?.uid && <span className="ml-2 text-[11px] text-teal-primary font-semibold">(you)</span>}
                      </td>
                      <td className="py-4 text-[13px] text-[#6B7280] text-center">{u.role || "—"}</td>
                      <td className="py-4 text-right">
                        {u.id === user?.uid ? (
                          <span className="text-[13px] text-teal-primary font-semibold">Admin</span>
                        ) : (
                          <button
                            onClick={() => handleToggleAdmin(u.id, u.isAdmin)}
                            className={`px-3 py-1 rounded text-[12px] font-bold transition-colors ${u.isAdmin ? "bg-teal-primary/10 text-teal-primary hover:bg-red-50 hover:text-red-500" : "bg-gray-100 text-[#374151] hover:bg-teal-primary/10 hover:text-teal-primary"}`}
                          >
                            {u.isAdmin ? "Revoke" : "Grant"}
                          </button>
                        )}
                      </td>
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
