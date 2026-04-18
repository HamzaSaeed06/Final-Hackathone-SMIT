"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../lib/firebase";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Both");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleAuth = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        router.push("/dashboard");
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        // During signup, user would normally proceed to onboarding
        router.push("/onboarding");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const setDemoUser = (userType) => {
    if (userType === 'ayesha') {
      setEmail('ayesha@helplytics.ai');
      setPassword('password123');
      setRole('Both');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-100px)]">
      <div className="flex flex-col md:flex-row w-full max-w-[900px] shadow-[0_8px_30px_rgb(0,0,0,0.08)] rounded-[20px] overflow-hidden">
        
        {/* LEFT COLUMN */}
        <div className="w-full md:w-[45%] bg-hero p-[40px] flex flex-col justify-center text-white">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-4">COMMUNITY ACCESS</p>
          <h1 className="text-[40px] font-extrabold leading-[1.1] mb-6">Enter the support network.</h1>
          <p className="text-gray-400 text-[15px] mb-8 leading-relaxed">
            Join the collective brainpower of SMIT. Ask clearly, help effectively, and level up your community reputation score.
          </p>
          
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-teal-primary shrink-0" />
              <span className="text-[14px] text-gray-400">Role-based entry for Need Help, Can Help, or Both</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-teal-primary shrink-0" />
              <span className="text-[14px] text-gray-400">Direct path into dashboard, requests, AI Center, and community feed</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-teal-primary shrink-0" />
              <span className="text-[14px] text-gray-400">Persistent demo session powered by Firebase Auth</span>
            </li>
          </ul>
        </div>

        {/* RIGHT COLUMN */}
        <div className="w-full md:w-[55%] bg-white p-[48px] flex flex-col justify-center">
          <p className="text-[11px] font-semibold text-teal-primary uppercase tracking-widest mb-2">
            {isLogin ? "LOGIN" : "SIGNUP"}
          </p>
          <h2 className="text-[32px] font-extrabold text-gray-900 leading-[1.2] mb-8">
            Authenticate your community profile
          </h2>

          <form onSubmit={handleAuth} className="flex flex-col gap-5">
            {!isLogin && (
              <div className="flex flex-col gap-2">
                <label className="text-[14px] font-semibold text-gray-700">Role selection</label>
                <select 
                  value={role} onChange={(e)=>setRole(e.target.value)}
                  className="w-full bg-white border-[1.5px] border-gray-200 rounded-[10px] px-4 py-3 text-[15px] text-gray-700 focus:border-teal-primary focus:outline-none appearance-none"
                >
                  <option>Need Help</option>
                  <option>Can Help</option>
                  <option>Both</option>
                </select>
              </div>
            )}

            <div className="flex flex-col md:flex-row gap-5">
              <div className="flex flex-col gap-2 flex-1">
                <label className="text-[14px] font-semibold text-gray-700">Email</label>
                <input 
                  type="email" required placeholder="community@helplytics.ai"
                  value={email} onChange={(e)=>setEmail(e.target.value)}
                  className="w-full bg-white border-[1.5px] border-gray-200 rounded-[10px] px-4 py-3 text-[15px] text-gray-700 focus:border-teal-primary focus:outline-none placeholder:text-gray-400"
                />
              </div>
              <div className="flex flex-col gap-2 flex-1">
                <label className="text-[14px] font-semibold text-gray-700">Password</label>
                <input 
                  type="password" required placeholder="••••••••"
                  value={password} onChange={(e)=>setPassword(e.target.value)}
                  className="w-full bg-white border-[1.5px] border-gray-200 rounded-[10px] px-4 py-3 text-[15px] text-gray-700 focus:border-teal-primary focus:outline-none placeholder:text-gray-400"
                />
              </div>
            </div>

            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

            <button type="submit" className="w-full bg-teal-primary hover:bg-teal-dark transition-colors text-white rounded-full py-[12px] font-semibold text-[15px] mt-4">
              {isLogin ? "Continue to dashboard" : "Create account"}
            </button>
          </form>

          <div className="mt-6 flex flex-col items-center gap-4">
            <p className="text-[14px] text-gray-500">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button type="button" onClick={() => setIsLogin(!isLogin)} className="font-semibold text-teal-primary hover:underline">
                {isLogin ? "Sign up" : "Log in"}
              </button>
            </p>
            
            <div className="text-[13px] text-gray-400 pt-4 border-t border-gray-100 w-full text-center">
              Quick Demo Login: <button type="button" onClick={()=>setDemoUser('ayesha')} className="text-gray-600 font-medium hover:text-teal-primary underline decoration-gray-300">Ayesha Khan (Demo)</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
