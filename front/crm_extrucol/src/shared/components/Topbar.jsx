export default function Topbar({ title, breadcrumb, children }) {
  return (
    <div className="h-[60px] bg-white border-b border-[#F0F0F0] flex items-center px-4 sm:px-6 gap-4 sticky top-0 z-40">
      <div className="min-w-0">
        {breadcrumb
          ? <div className="text-[13px] text-[#6B6B6B] flex items-center gap-1.5 flex-wrap">{breadcrumb}</div>
          : <div className="text-[16px] sm:text-[17px] font-bold text-[#1A1A1A] tracking-tight truncate">{title}</div>
        }
      </div>
      {children && (
        <div className="ml-auto flex items-center gap-2 flex-shrink-0">{children}</div>
      )}
    </div>
  )
}
