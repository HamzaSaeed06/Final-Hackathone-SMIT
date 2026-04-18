export default function RequestCard({ request }) {
  return (
    <div className="bg-white rounded-[16px] p-[24px] shadow-sm">
      {/* Top row */}
      <div className="flex items-center gap-2">
        {/* Badges */}
      </div>
      {/* Title & Desc */}
      <h3 className="text-[18px] font-bold text-gray-900 mt-2">Request Title</h3>
      <p className="text-[14px] text-gray-500 mt-[6px] leading-[1.5]">Description goes here...</p>
      
      {/* Meta */}
      <div className="mt-4 flex items-center justify-between">
        <div>
          <p className="text-[14px] font-semibold text-gray-900">Requester Name</p>
          <p className="text-[13px] text-gray-400">Location &bull; Helpers</p>
        </div>
        <button className="text-[14px] font-medium text-gray-900">Open details</button>
      </div>
    </div>
  );
}
