"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../lib/firebase";

const DEMO_USERS = [
  { label: "Ayesha Khan", email: "ayesha@helplytics.ai", password: "password123", role: "Both" },
  { label: "Hassan Ali", email: "hassan@helplytics.ai", password: "password123", role: "Can Help" },
  { label: "Sara Noor", email: "sara@helplytics.ai", password: "password123", role: "Both" },
];

export default function AuthPage() {
  const [mode, setMode] = useState("login");
  const [selectedDemo, setSelectedDemo] = useState("Ayesha Khan");
  const [role, setRole] = useState("Both");
  const [email, setEmail] = useState("community@helplytics.ai");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDemoSelect = (e) => {
    const name = e.target.value;
    setSelectedDemo(name);
    const found = DEMO_USERS.find((u) => u.label === name);
    if (found) {
      setEmail(found.email);
      setPassword(found.password);
      setRole(found.role);
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "login") {
        await signInWithEmailAndPassword(auth, email, password);
        router.push("/dashboard");
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        router.push("/onboarding");
      }
    } catch (err) {
      if (err.code === "auth/user-not-found" || err.code === "auth/invalid-credential") {
        setError("Demo account not found. Try signing up first.");
      } else {
        setError(err.message.replace("Firebase: ", "").replace(/ \(auth.*\)\.?/, ""));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-100px)] py-12">
      <div className="flex flex-col md:flex-row w-full max-w-[900px] rounded-[20px] overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.10)]">
        {/* LEFT — dark card */}
        <div className="w-full md:w-[45%] bg-hero p-10 flex flex-col justify-center text-white">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-[0.1em] mb-4">
            COMMUNITY ACCESS
          </p>
          <h1 className="text-[38px] font-black leading-[1.1] mb-5">
            Enter the support network.
          </h1>
          <p className="text-[14px] text-gray-400 mb-8 leading-relaxed">
            Choose a demo identity, set your role, and jump into a multi-page product flow designed
            for asking, offering, and tracking help with a premium interface.
          </p>
          <ul className="space-y-4">
            {[
              "Role-based entry for Need Help, Can Help, or Both",
              "Direct path into dashboard, requests, AI Center, and community feed",
              "Persistent demo session powered by LocalStorage",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-[6px] w-[5px] h-[5px] rounded-full bg-gray-400 shrink-0" />
                <span className="text-[14px] text-gray-400 leading-snug">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* RIGHT — white card */}
        <div className="w-full md:w-[55%] bg-white p-10 flex flex-col justify-center">
          <p className="text-[11px] font-semibold text-teal-primary uppercase tracking-[0.1em] mb-2">
            {mode === "login" ? "LOGIN / SIGNUP" : "CREATE ACCOUNT"}
          </p>
          <h2 className="text-[30px] font-black text-[#0F1A17] leading-[1.2] mb-7">
            Authenticate your community profile
          </h2>

          <form onSubmit={handleAuth} className="flex flex-col gap-5">
            {mode === "login" && (
              <div className="flex flex-col gap-2">
                <label className="text-[14px] font-semibold text-[#374151]">Select demo user</label>
                <select
                  value={selectedDemo}
                  onChange={handleDemoSelect}
                  className="w-full bg-white border-[1.5px] border-[#E5E7EB] rounded-[10px] px-4 py-3 text-[15px] text-[#374151] focus:border-teal-primary focus:outline-none appearance-none"
                >
                  {DEMO_USERS.map((u) => (
                    <option key={u.label} value={u.label}>
                      {u.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label className="text-[14px] font-semibold text-[#374151]">Role selection</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-white border-[1.5px] border-[#E5E7EB] rounded-[10px] px-4 py-3 text-[15px] text-[#374151] focus:border-teal-primary focus:outline-none appearance-none"
              >
                <option>Need Help</option>
                <option>Can Help</option>
                <option>Both</option>
              </select>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex flex-col gap-2 flex-1">
                <label className="text-[14px] font-semibold text-[#374151]">Email</label>
                <input
                  type="email"
                  required
                  placeholder="community@helplytics.ai"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white border-[1.5px] border-[#E5E7EB] rounded-[10px] px-4 py-3 text-[15px] text-[#374151] focus:border-teal-primary focus:outline-none placeholder:text-gray-300"
                />
              </div>
              <div className="flex flex-col gap-2 flex-1">
                <label className="text-[14px] font-semibold text-[#374151]">Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white border-[1.5px] border-[#E5E7EB] rounded-[10px] px-4 py-3 text-[15px] text-[#374151] focus:border-teal-primary focus:outline-none"
                />
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-[13px] bg-red-50 border border-red-100 rounded-[8px] px-4 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-primary hover:bg-teal-dark transition-colors text-white rounded-full py-[13px] font-semibold text-[15px] mt-2 disabled:opacity-60"
            >
              {loading ? "Please wait..." : mode === "login" ? "Continue to dashboard" : "Create account"}
            </button>
          </form>

          <p className="text-[13px] text-[#6B7280] mt-5 text-center">
            {mode === "login" ? "New to HelpHub?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => {
                setMode(mode === "login" ? "signup" : "login");
                setError("");
              }}
              className="font-semibold text-teal-primary hover:underline"
            >
              {mode === "login" ? "Sign up" : "Log in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
