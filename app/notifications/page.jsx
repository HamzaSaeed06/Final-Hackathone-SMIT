"use client";
import HeroBanner from "../../components/HeroBanner";

const NOTIFICATIONS = [
  {
    id: 1,
    type: "Status",
    message: '"Need help" was marked as solved',
    time: "Just now",
    read: false,
  },
  {
    id: 2,
    type: "Match",
    message: 'Ayesha Khan offered help on "Need help"',
    time: "Just now",
    read: false,
  },
  {
    id: 3,
    type: "Request",
    message: 'Your request "Need help" is now live in the community feed',
    time: "Just now",
    read: false,
  },
  {
    id: 4,
    type: "Status",
    message: '"Need help making my portfolio responsive before demo day" was marked as solved',
    time: "Just now",
    read: false,
  },
  {
    id: 5,
    type: "Status",
    message: '"Need help making my portfolio responsive before demo day" was marked as solved',
    time: "Just now",
    read: false,
  },
  {
    id: 6,
    type: "Status",
    message: '"Need help making my portfolio responsive before demo day" was marked as solved',
    time: "Just now",
    read: false,
  },
  {
    id: 7,
    type: "Match",
    message: "New helper matched to your responsive portfolio request",
    time: "12 min ago",
    read: false,
  },
  {
    id: 8,
    type: "Reputation",
    message: "Your trust score increased after a solved request",
    time: "1 hr ago",
    read: false,
  },
  {
    id: 9,
    type: "Insight",
    message: "AI Center detected rising demand for interview prep",
    time: "Today",
    read: true,
  },
];

export default function NotificationsPage() {
  return (
    <div className="pb-24">
      <HeroBanner
        label="NOTIFICATIONS"
        heading="Stay updated on requests, helpers, and trust signals."
        subheading=""
      />

      <div className="max-w-[760px] mx-auto w-full">
        <div className="bg-white rounded-[16px] p-8 shadow-card">
          <p className="text-[11px] font-semibold text-teal-primary uppercase tracking-[0.1em] mb-3">
            LIVE UPDATES
          </p>
          <h2 className="text-[28px] font-black text-[#0F1A17] mb-6">Notification feed</h2>

          <div className="flex flex-col">
            {NOTIFICATIONS.map((n) => (
              <div
                key={n.id}
                className="flex items-center justify-between border-b border-[#E5E7EB] py-5 last:border-0 gap-4"
              >
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-[15px] leading-snug ${
                      !n.read ? "font-semibold text-[#0F1A17]" : "font-normal text-[#374151]"
                    }`}
                  >
                    {n.message}
                  </p>
                  <p className="text-[13px] text-[#9CA3AF] mt-1">
                    {n.type} &bull; {n.time}
                  </p>
                </div>
                <div className="shrink-0">
                  <span
                    className={`px-4 py-1.5 rounded-full text-[12px] font-semibold ${
                      !n.read
                        ? "text-[#0F1A17]"
                        : "text-[#9CA3AF]"
                    }`}
                  >
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
