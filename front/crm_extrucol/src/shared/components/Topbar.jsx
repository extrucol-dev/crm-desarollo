export default function Topbar({ title, breadcrumb, children }) {
  return (
    <div className="bg-white border-b border-[#F0F0F0] sticky top-0 z-30
      px-4 sm:px-6 py-3 sm:py-0 sm:h-[60px]
      flex flex-wrap md:flex-nowrap items-center gap-x-4 gap-y-2">

      {/* Título o breadcrumb — ocupa todo el ancho en móvil */}
      <div className="min-w-0 flex-1 w-full sm:w-auto order-1">
        {breadcrumb
          ? <div className="text-[13px] text-[#6B6B6B] flex items-center gap-1.5 flex-wrap leading-snug">
              {breadcrumb}
            </div>
          : <div className="text-[16px] sm:text-[17px] font-bold text-[#1A1A1A] tracking-tight truncate">
              {title}
            </div>
        }
      </div>

      {/* Acciones — segunda línea en móvil, misma línea en desktop */}
      {children && (
        <div className="flex items-center gap-2 flex-wrap order-2 sm:ml-auto sm:flex-shrink-0">
          {children}
        </div>
      )}
    </div>
  )
}
