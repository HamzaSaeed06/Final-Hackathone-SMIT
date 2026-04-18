"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  // If we are on landing page, we might want landing navLinks, but we'll include all dashboard routes globally for simplicity as per standard app headers
  const isLanding = pathname === '/';

  const navLinks = isLanding ? [
    { name: 'Home', path: '/' },
    { name: 'Explore', path: '/explore' },
    { name: 'Leaderboard', path: '/leaderboard' },
    { name: 'AI Center', path: '/ai-center' },
  ] : [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Explore', path: '/explore' },
    { name: 'Create', path: '/create' },
    { name: 'Messages', path: '/messages' },
    { name: 'Leaderboard', path: '/leaderboard' },
    { name: 'Notifications', path: '/notifications' },
  ];

  return (
    <nav className="h-[56px] bg-transparent flex items-center justify-between py-4">
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-[36px] h-[36px] bg-teal-primary text-white font-bold rounded-[10px] flex items-center justify-center text-lg">
            H
          </div>
          <span className="font-bold text-gray-900 text-[18px]">HelpHub AI</span>
        </Link>
      </div>

      <div className="flex items-center gap-2">
        {navLinks.map((link) => {
          const isActive = pathname === link.path;
          return (
            <Link
              key={link.name}
              href={link.path}
              className={`text-[15px] transition-colors ${
                isActive 
                  ? 'bg-[#E5E7EB] text-gray-900 rounded-full px-[14px] py-[6px] font-medium' 
                  : 'text-[#374151] px-[14px] py-[6px] hover:text-gray-900'
              }`}
            >
              {link.name}
            </Link>
          );
        })}
      </div>

      <div className="flex items-center gap-4">
        {isLanding ? (
          <>
            <span className="text-[13px] text-gray-500 hidden md:block">Live community signals</span>
            <Link href="/auth" className="bg-teal-primary hover:bg-teal-dark transition-colors text-white rounded-full px-[20px] py-[8px] font-semibold text-[15px]">
              Join the platform
            </Link>
          </>
        ) : (
          <div className="w-8 h-8 rounded-full bg-teal-200 text-teal-dark flex items-center justify-center font-bold text-sm">
            ME
          </div>
        )}
      </div>
    </nav>
  );
}
