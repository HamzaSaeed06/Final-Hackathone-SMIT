"use client";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

const PUBLIC_ROUTES = ["/", "/auth", "/explore", "/leaderboard", "/ai-center"];

const isPublic = (pathname) => {
  if (PUBLIC_ROUTES.includes(pathname)) return true;
  if (pathname.startsWith("/request/")) return true;
  return false;
};

export default function RouteGuard({ children }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    // Not logged in trying to access protected route → send to auth
    if (!user && !isPublic(pathname)) {
      router.replace("/auth");
      return;
    }

    // Already logged in going to /auth → send to dashboard
    if (user && pathname === "/auth") {
      router.replace("/dashboard");
      return;
    }
  }, [user, loading, pathname, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-teal-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Block render of protected page while redirecting
  if (!user && !isPublic(pathname)) return null;

  return <>{children}</>;
}
