import BadgeChip from "./BadgeChip";
import Link from "next/link";

export default function RequestCard({ request }) {
  // If request prop is not provided, provide a default object to avoid crashing
  const req = request || {
    id: 1,
    title: "Request Title",
    category: "Category",
    urgency: "Medium",
    status: "Open",
    desc: "Description goes here...",
    name: "Requester Name",
    location: "Location",
    helpers: 0,
    tags: []
  };

  return (
    <div className="bg-white rounded-[16px] p-[24px] shadow-sm border border-gray-100 flex flex-col h-full">
      <div className="flex items-center gap-2 flex-wrap">
        <BadgeChip label={req.category} type="category" />
        <BadgeChip label={req.urgency} type={req.urgency.toLowerCase()} />
        <BadgeChip label={req.status} type={req.status === 'Solved' ? 'solved' : 'open'} />
      </div>
      
      <h3 className="text-[18px] font-bold text-gray-900 mt-3 line-clamp-2">{req.title}</h3>
      <p className="text-[14px] text-gray-500 mt-[6px] leading-[1.5] line-clamp-3 mb-4 flex-1">
        {req.desc}
      </p>
      
      {req.tags && req.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {req.tags.map((tag, idx) => (
             <span key={idx} className="bg-gray-100 text-gray-600 rounded-full px-3 py-1 text-[12px] font-medium">
               {tag}
             </span>
          ))}
        </div>
      )}

      <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
        <div>
          <p className="text-[14px] font-semibold text-gray-900">{req.name}</p>
          <p className="text-[13px] text-gray-400">{req.location} &bull; {req.helpers} helpers interested</p>
        </div>
        <Link href={`/request/${req.id}`} className="text-[14px] font-medium text-gray-900 hover:text-teal-primary transition-colors">
          Open details &rarr;
        </Link>
      </div>
    </div>
  );
}
