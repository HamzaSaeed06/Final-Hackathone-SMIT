"use client";
import HeroBanner from "../../components/HeroBanner";

export default function NotificationsPage() {
  const notifs = [
    { id: 1, type: "Status", message: '"Need help getting my app deployed" was marked as solved', time: "Just now", read: false },
    { id: 2, type: "Match", message: 'Hassan Ali offered to help with your JavaScript request', time: "2 hours ago", read: false },
    { id: 3, type: "Reputation", message: 'Your trust score increased to 100%!', time: "1 day ago", read: true },
    { id: 4, type: "Insight", message: 'AI matched 3 open requests suited perfectly for your skills', time: "1 day ago", read: true }
  ];

  return (
    <div className="pb-24">
      <HeroBanner 
        label="NOTIFICATIONS"
        heading="Stay updated on requests, helpers, and trust signals."
        subheading=""
      />

      <div className="max-w-[700px] mx-auto w-full">
        <div className="bg-white rounded-[16px] p-8 shadow-[0_1px_3px_rgba(0,0,0,0.08),0_4px_16px_rgba(0,0,0,0.04)]">
          <p className="text-[11px] font-semibold text-teal-primary uppercase tracking-[0.1em] mb-4">LIVE UPDATES</p>
          <h2 className="text-[28px] font-extrabold text-gray-900 mb-6">Notification feed</h2>
          
          <div className="flex flex-col">
            {notifs.map((n, i) => (
              <div key={n.id} className="flex items-center justify-between border-b border-gray-100 py-5 last:border-0">
                <div>
                  <p className={`text-[15px] ${!n.read ? 'font-extrabold text-gray-900' : 'font-semibold text-gray-700'}`}>
                    {n.message}
                  </p>
                  <p className="text-[13px] text-gray-400 mt-1 font-medium tracking-wide">
                    {n.type} &bull; {n.time}
                  </p>
                </div>
                <div className="pl-4">
                  <span className={`px-4 py-1.5 rounded-full text-[12px] font-semibold transition-colors ${!n.read ? 'bg-gray-100 text-gray-700' : 'bg-gray-50 text-gray-400 font-medium'}`}>
                    {!n.read ? "Unread" : "Read"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
