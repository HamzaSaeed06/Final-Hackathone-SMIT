export default function AIPanel({ title, children }) {
  return (
    <div className="bg-teal-primary/5 rounded-[16px] p-[24px]">
      <p className="text-[11px] font-semibold tracking-[0.1em] text-teal-primary uppercase mb-2">AI ASSISTANT</p>
      <h2 className="text-[28px] font-extrabold text-gray-900 leading-[1.2] mb-4">{title}</h2>
      {children}
    </div>
  );
}
