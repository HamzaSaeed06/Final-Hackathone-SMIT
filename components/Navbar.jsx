export default function Navbar() {
  return (
    <nav className="h-[56px] bg-transparent flex items-center justify-between px-6">
      {/* Navbar implementation here */}
      <div className="flex items-center gap-2">
        <div className="w-[36px] h-[36px] bg-teal-primary text-white font-bold rounded-[10px] flex items-center justify-center">H</div>
        <span className="font-bold text-gray-800">HelpHub AI</span>
      </div>
      <div className="flex items-center gap-6">
        {/* Nav links */}
      </div>
    </nav>
  );
}
