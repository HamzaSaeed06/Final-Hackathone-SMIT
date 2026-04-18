"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../context/AuthContext";

const NAV_CONFIGS = {
  "/": {
    links: [
      { name: "Home", path: "/" },
      { name: "Explore", path: "/explore" },
      { name: "Leaderboard", path: "/leaderboard" },
      { name: "AI Center", path: "/ai-center" },
    ],
    right: "landing",
  },
  "/auth": { links: [
    { name: "Home", path: "/" },
    { name: "Explore", path: "/explore" },
    { name: "Leaderboard", path: "/leaderboard" },
  ], right: "none" },
  "/dashboard": { links: [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Create Request", path: "/create" },
    { name: "AI Center", path: "/ai-center" },
  ], right: "user" },
  "/explore": { links: [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Explore", path: "/explore" },
    { name: "Leaderboard", path: "/leaderboard" },
    { name: "Notifications", path: "/notifications" },
  ], right: "user" },
  "/create": { links: [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Explore", path: "/explore" },
    { name: "Create Request", path: "/create" },
  ], right: "user" },
  "/messages": { links: [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Explore", path: "/explore" },
    { name: "Messages", path: "/messages" },
  ], right: "user" },
  "/leaderboard": { links: [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Explore", path: "/explore" },
    { name: "Leaderboard", path: "/leaderboard" },
  ], right: "user" },
  "/notifications": { links: [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Explore", path: "/explore" },
    { name: "Notifications", path: "/notifications" },
  ], right: "user" },
  "/ai-center": { links: [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Create Request", path: "/create" },
    { name: "AI Center", path: "/ai-center" },
  ], right: "user" },
  "/onboarding": { links: [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Onboarding", path: "/onboarding" },
  ], right: "user" },
  "/admin": { links: [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Explore", path: "/explore" },
    { name: "Admin", path: "/admin" },
  ], right: "user" },
};

function getConfig(pathname) {
  if (NAV_CONFIGS[pathname]) return NAV_CONFIGS[pathname];
  if (pathname.startsWith("/profile")) return {
    links: [
      { name: "Dashboard", path: "/dashboard" },
      { name: "Onboarding", path: "/onboarding" },
      { name: "Profile", path: pathname },
    ],
    right: "user",
  };
  if (pathname.startsWith("/request")) return {
    links: [
      { name: "Dashboard", path: "/dashboard" },
      { name: "Explore", path: "/explore" },
      { name: "Messages", path: "/messages" },
    ],
    right: "user",
  };
  return NAV_CONFIGS["/"];
}

export default function Navbar() {
  const pathname = usePathname();
  const config = getConfig(pathname);
  const { user, profile } = useAuth();

  const initials = profile?.name
    ? profile.name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase()
    : user?.email
    ? user.email.substring(0, 2).toUpperCase()
    : "AK";

  const profilePath = user ? `/profile/${user.uid}` : "/profile/me";

  return (
    <nav className="h-[56px] flex items-center justify-between py-2">
      {/* LOGO */}
      <Link href="/" className="flex items-center gap-2.5 shrink-0">
        <div className="w-[36px] h-[36px] bg-teal-primary text-white font-black rounded-[10px] flex items-center justify-center text-[18px]">
          H
        </div>
        <span className="font-bold text-[#0F1A17] text-[17px] tracking-tight">HelpHub AI</span>
      </Link>

      {/* NAV LINKS */}
      <div className="flex items-center gap-1">
        {config.links.map((link) => {
          const isActive = pathname === link.path;
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
      <div className="flex items-center gap-4 shrink-0">
        {config.right === "landing" && (
          <>
            <span className="text-[13px] text-[#9CA3AF] hidden md:block">Live community signals</span>
            <Link
              href="/auth"
              className="bg-teal-primary hover:bg-teal-dark transition-colors text-white rounded-full px-[20px] py-[8px] font-semibold text-[14px]"
            >
              Join the platform
            </Link>
          </>
        )}
        {config.right === "user" && (
          <Link href={profilePath} className="w-8 h-8 rounded-full bg-teal-primary text-white flex items-center justify-center font-bold text-[13px]">
            {initials}
          </Link>
        )}
      </div>
    </nav>
  );
}
