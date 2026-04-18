export default function HeroBanner({ label, heading, subheading }) {
  return (
    <div className="bg-hero rounded-[20px] px-[56px] py-[48px] mt-[24px] mb-[32px]">
      {label && <p className="text-[11px] font-semibold tracking-[0.1em] text-gray-400 uppercase mb-3">{label}</p>}
      <h1 className="text-[clamp(32px,4vw,52px)] font-extrabold text-white leading-[1.1]">
        {heading}
      </h1>
      {subheading && <p className="text-[16px] text-gray-400 mt-3 font-normal">{subheading}</p>}
    </div>
  );
}
