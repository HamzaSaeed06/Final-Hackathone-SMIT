"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "../../lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

export default function AuthPage() {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [role, setRole] = useState("Both");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const inputCls = "w-full bg-white border-[1.5px] border-[#E5E7EB] rounded-[10px] px-4 py-3 text-[15px] text-[#374151] focus:border-teal-primary focus:outline-none";

  const createProfile = async (user, displayName, userRole) => {
    const snap = await getDoc(doc(db, "users", user.uid));
    if (!snap.exists()) {
      await setDoc(doc(db, "users", user.uid), {
        name: displayName || user.email.split("@")[0],
        email: user.email,
        role: userRole,
        location: "",
        skills: [],
        needsHelpWith: [],
        interests: [],
        trustScore: 50,
        helpCount: 0,
        requestsCreated: 0,
        badgesEarned: [],
        isAdmin: false,
        createdAt: new Date().toISOString(),
      });
      return false; // new user → go to onboarding
    }
    return true; // existing user → go to dashboard
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "login") {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        const profileExists = await createProfile(cred.user, "", role);
        router.push(profileExists ? "/dashboard" : "/onboarding");
      } else {
        if (!name.trim()) { setError("Please enter your name."); setLoading(false); return; }
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        await createProfile(cred.user, name.trim(), role);
        localStorage.setItem("helphub_name", name.trim());
        localStorage.setItem("helphub_role", role);
        router.push("/onboarding");
      }
    } catch (err) {
      const msg = err.message || "";
      if (msg.includes("user-not-found") || msg.includes("invalid-credential") || msg.includes("invalid-login-credentials")) {
        setError("No account found. Please sign up first.");
      } else if (msg.includes("wrong-password")) {
        setError("Incorrect password. Please try again.");
      } else if (msg.includes("email-already-in-use")) {
        setError("This email is already registered. Please log in.");
      } else if (msg.includes("weak-password")) {
        setError("Password must be at least 6 characters.");
      } else {
        setError(msg.replace("Firebase: ", "").replace(/ \(auth.*\)\.?/, ""));
      }
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setMode(m => m === "login" ? "signup" : "login");
    setError("");
    setName("");
    setEmail("");
    setPassword("");
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-100px)] py-12">
      <div className="flex flex-col md:flex-row w-full max-w-[900px] rounded-[20px] overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.10)]">

        {/* LEFT — dark info card */}
        <div className="w-full md:w-[45%] bg-hero p-10 flex flex-col justify-center text-white">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-[0.1em] mb-4">
            COMMUNITY ACCESS
          </p>
          <h1 className="text-[38px] font-black leading-[1.1] mb-5">
            Enter the support network.
          </h1>
          <p className="text-[14px] text-gray-400 mb-8 leading-relaxed">
            {mode === "login"
              ? "Welcome back. Sign in with your email and password to continue where you left off."
              : "Create your account, choose your role, and complete onboarding to unlock the full platform experience."}
          </p>
          <ul className="space-y-4">
            {[
              "Need Help — post requests, find helpers, track progress",
              "Can Help — browse the feed, offer support, earn trust",
              "Both — full access to every feature on the platform",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-[6px] w-[5px] h-[5px] rounded-full bg-gray-400 shrink-0" />
                <span className="text-[14px] text-gray-400 leading-snug">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* RIGHT — white form */}
        <div className="w-full md:w-[55%] bg-white p-10 flex flex-col justify-center">
          <p className="text-[11px] font-semibold text-teal-primary uppercase tracking-[0.1em] mb-2">
            {mode === "login" ? "SIGN IN" : "CREATE ACCOUNT"}
          </p>
          <h2 className="text-[30px] font-black text-[#0F1A17] leading-[1.2] mb-7">
            {mode === "login" ? "Welcome back" : "Set up your profile"}
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">

            {mode === "signup" && (
              <div className="flex flex-col gap-2">
                <label className="text-[14px] font-semibold text-[#374151]">Full Name</label>
                <input
                  type="text" required value={name} onChange={e => setName(e.target.value)}
                  placeholder="e.g. Hassan Ali"
                  className={inputCls}
                />
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label className="text-[14px] font-semibold text-[#374151]">Email</label>
              <input
                type="email" required value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com" autoComplete="email"
                className={inputCls}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[14px] font-semibold text-[#374151]">Password</label>
              <input
                type="password" required value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••" minLength={6}
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                className={inputCls}
              />
            </div>

            {mode === "signup" && (
              <div className="flex flex-col gap-2">
                <label className="text-[14px] font-semibold text-[#374151]">Your Role</label>
                <select value={role} onChange={e => setRole(e.target.value)} className={inputCls}>
                  <option value="Need Help">Need Help — I want to ask for support</option>
                  <option value="Can Help">Can Help — I want to help others</option>
                  <option value="Both">Both — I want to do both</option>
                </select>
              </div>
            )}

            {error && (
              <p className="text-red-500 text-[13px] bg-red-50 border border-red-100 rounded-[8px] px-4 py-2">
                {error}
              </p>
            )}

            <button
              type="submit" disabled={loading}
              className="w-full bg-teal-primary hover:bg-teal-dark transition-colors text-white rounded-full py-[13px] font-semibold text-[15px] mt-2 disabled:opacity-60"
            >
              {loading
                ? mode === "login" ? "Signing in..." : "Creating account..."
                : mode === "login" ? "Sign in" : "Create account & continue"}
            </button>
          </form>

          <p className="text-[13px] text-[#6B7280] mt-5 text-center">
            {mode === "login" ? "New to HelpHub?" : "Already have an account?"}{" "}
            <button type="button" onClick={switchMode} className="font-semibold text-teal-primary hover:underline">
              {mode === "login" ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
