"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useState } from "react";

const PUBLIC_NAV = [
  { name: "Home", path: "/" },
  { name: "Explore", path: "/explore" },
  { name: "Leaderboard", path: "/leaderboard" },
  { name: "AI Center", path: "/ai-center" },
];

const AUTH_NAV_CONFIGS = {
  "/dashboard": [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Create Request", path: "/create" },
    { name: "AI Center", path: "/ai-center" },
  ],
  "/explore": [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Explore", path: "/explore" },
    { name: "Leaderboard", path: "/leaderboard" },
    { name: "Notifications", path: "/notifications" },
  ],
  "/create": [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Explore", path: "/explore" },
    { name: "Create Request", path: "/create" },
  ],
  "/messages": [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Explore", path: "/explore" },
    { name: "Messages", path: "/messages" },
  ],
  "/leaderboard": [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Explore", path: "/explore" },
    { name: "Leaderboard", path: "/leaderboard" },
  ],
  "/notifications": [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Explore", path: "/explore" },
    { name: "Notifications", path: "/notifications" },
  ],
  "/ai-center": [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Create Request", path: "/create" },
    { name: "AI Center", path: "/ai-center" },
  ],
  "/onboarding": [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Onboarding", path: "/onboarding" },
  ],
  "/admin": [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Explore", path: "/explore" },
    { name: "Admin", path: "/admin" },
  ],
};

function getNavLinks(pathname, isLoggedIn, isAdmin) {
  if (!isLoggedIn) return PUBLIC_NAV;
  if (AUTH_NAV_CONFIGS[pathname]) {
    const links = [...AUTH_NAV_CONFIGS[pathname]];
    if (isAdmin && !links.find(l => l.path === "/admin")) {
      links.push({ name: "Admin", path: "/admin" });
    }
    return links;
  }
  if (pathname.startsWith("/profile")) return [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Onboarding", path: "/onboarding" },
    { name: "Profile", path: pathname },
    ...(isAdmin ? [{ name: "Admin", path: "/admin" }] : []),
  ];
  if (pathname.startsWith("/request")) return [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Explore", path: "/explore" },
    { name: "Messages", path: "/messages" },
  ];
  if (pathname === "/auth") return PUBLIC_NAV;
  return [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Explore", path: "/explore" },
    { name: "AI Center", path: "/ai-center" },
    ...(isAdmin ? [{ name: "Admin", path: "/admin" }] : []),
  ];
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  const isLoggedIn = !!user;
  const isAdmin = profile?.isAdmin === true;
  const navLinks = getNavLinks(pathname, isLoggedIn, isAdmin);

  const initials = profile?.name
    ? profile.name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase()
    : user?.email
    ? user.email.substring(0, 2).toUpperCase()
    : "HH";

  const profilePath = user ? `/profile/${user.uid}` : "/auth";

  const handleLogout = async () => {
    setShowMenu(false);
    await signOut(auth);
    router.push("/");
  };

  return (
    <nav className="h-[56px] flex items-center justify-between py-2">
      {/* LOGO */}
      <Link href={isLoggedIn ? "/dashboard" : "/"} className="flex items-center gap-2.5 shrink-0">
        <div className="w-[36px] h-[36px] bg-teal-primary text-white font-black rounded-[10px] flex items-center justify-center text-[18px]">
          H
        </div>
        <span className="font-bold text-[#0F1A17] text-[17px] tracking-tight">HelpHub AI</span>
      </Link>

      {/* NAV LINKS */}
      <div className="flex items-center gap-1">
        {navLinks.map(link => {
          const isActive = pathname === link.path || (pathname.startsWith(link.path) && link.path !== "/");
          return (
            <Link
              key={link.name}
              href={link.path}
              className={`text-[14px] transition-colors px-[14px] py-[6px] rounded-full ${
                isActive
                  ? "bg-[#E5E7EB] text-[#0F1A17] font-medium"
                  : "text-[#374151] hover:text-[#0F1A17]"
              }`}
            >
              {link.name}
            </Link>
          );
        })}
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-3 shrink-0">
        {!isLoggedIn ? (
          <>
            <span className="text-[13px] text-[#9CA3AF] hidden md:block">Live community signals</span>
            <Link
              href="/auth"
              className="bg-teal-primary hover:bg-teal-dark transition-colors text-white rounded-full px-[20px] py-[8px] font-semibold text-[14px]"
            >
              Join the platform
            </Link>
          </>
        ) : (
          <div className="relative">
            <button
              onClick={() => setShowMenu(prev => !prev)}
              className="w-8 h-8 rounded-full bg-teal-primary text-white flex items-center justify-center font-bold text-[13px] hover:bg-teal-dark transition-colors"
            >
              {initials}
            </button>
            {showMenu && (
              <div className="absolute right-0 top-10 w-[180px] bg-white rounded-[12px] shadow-[0_8px_24px_rgba(0,0,0,0.12)] border border-[#E5E7EB] py-2 z-50">
                <Link
                  href={profilePath}
                  onClick={() => setShowMenu(false)}
                  className="block px-4 py-2.5 text-[14px] text-[#374151] hover:bg-gray-50 font-medium"
                >
                  My Profile
                </Link>
                <Link
                  href="/dashboard"
                  onClick={() => setShowMenu(false)}
                  className="block px-4 py-2.5 text-[14px] text-[#374151] hover:bg-gray-50 font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  href="/notifications"
                  onClick={() => setShowMenu(false)}
                  className="block px-4 py-2.5 text-[14px] text-[#374151] hover:bg-gray-50 font-medium"
                >
                  Notifications
                </Link>
                <Link
                  href="/messages"
                  onClick={() => setShowMenu(false)}
                  className="block px-4 py-2.5 text-[14px] text-[#374151] hover:bg-gray-50 font-medium"
                >
                  Messages
                </Link>
                <hr className="my-1 border-[#E5E7EB]" />
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2.5 text-[14px] text-red-500 hover:bg-red-50 font-medium"
                >
                  Log out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
