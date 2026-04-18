export default function BadgeChip({ label, type = 'category' }) {
  const styles = {
    category: "bg-[#F3F4F6] text-[#374151]",
    high: "bg-[#FEE2E2] text-[#DC2626]",
    medium: "bg-[#FEF9C3] text-[#B45309]",
    low: "bg-[#DCFCE7] text-[#16A34A]",
    solved: "bg-[#E0F2F1] text-[#0D9488]",
    open: "bg-[#F3F4F6] text-[#6B7280]"
  };

  return (
    <span className={`inline-block rounded-full px-[12px] py-[4px] text-[13px] font-medium ${styles[type.toLowerCase()] || styles.category}`}>
      {label}
    </span>
  );
}
