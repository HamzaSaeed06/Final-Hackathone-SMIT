import BadgeChip from "./BadgeChip";
import Link from "next/link";

export default function RequestCard({ request }) {
  const req = request || {
    id: "1",
    title: "Request Title",
    category: "Category",
    urgency: "Medium",
    status: "Open",
    description: "Description goes here...",
    userName: "Requester Name",
    userLocation: "Location",
    helpers: [],
    tags: [],
  };

  const helperCount = Array.isArray(req.helpers) ? req.helpers.length : (req.helpers || 0);
  const desc = req.description || req.desc || "";

  return (
    <div className="bg-white rounded-[16px] p-6 shadow-card flex flex-col h-full">
      <div className="flex items-center gap-2 flex-wrap">
        <BadgeChip label={req.category} type="category" />
        <BadgeChip label={req.urgency} type={(req.urgency || "").toLowerCase()} />
        <BadgeChip
          label={req.status}
          type={req.status === "Solved" ? "solved" : "open"}
        />
      </div>

      <h3 className="text-[17px] font-bold text-[#0F1A17] mt-3 mb-1 line-clamp-2 leading-snug">
        {req.title}
      </h3>
      <p className="text-[14px] text-[#6B7280] leading-[1.55] line-clamp-3 mb-4 flex-1">{desc}</p>

      {req.tags && req.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {req.tags.map((tag, idx) => (
            <span
              key={idx}
              className="bg-[#F3F4F6] text-[#374151] rounded-full px-3 py-[3px] text-[12px] font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="mt-auto pt-4 border-t border-[#F3F4F6] flex items-end justify-between">
        <div>
          <p className="text-[14px] font-semibold text-[#0F1A17]">{req.userName}</p>
          <p className="text-[13px] text-[#9CA3AF]">
            {req.userLocation || req.location} &bull; {helperCount} helper
            {helperCount !== 1 ? "s" : ""} interested
          </p>
        </div>
        <Link
          href={`/request/${req.id}`}
          className="text-[14px] font-semibold text-[#0F1A17] hover:text-teal-primary transition-colors shrink-0 ml-2"
        >
          Open<br />details
        </Link>
      </div>
    </div>
  );
}
