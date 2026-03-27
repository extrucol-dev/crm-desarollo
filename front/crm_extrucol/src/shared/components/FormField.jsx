/**
 * Campo de formulario reutilizable — mantiene estilos consistentes en todos los módulos.
 */
export function FormField({ label, required, error, hint, children }) {
  return (
    <div>
      {label && (
        <label className="block text-[13px] font-semibold text-[#4A4A4A] mb-1.5">
          {label}
          {required && <span className="text-[#C0392B] ml-0.5">*</span>}
        </label>
      )}
      {children}
      {error && (
        <p className="text-[11.5px] text-[#C0392B] mt-1 flex items-center gap-1">{error}</p>
      )}
      {hint && !error && (
        <p className="text-[11.5px] text-[#6B6B6B] mt-1">{hint}</p>
      )}
    </div>
  )
}

const inputBase =
  'w-full px-3 py-[9px] text-[13.5px] text-[#1A1A1A] bg-white border rounded-md outline-none placeholder:text-[#ABABAB] transition-all duration-150'
const inputNormal = 'border-[#D5D5D5] focus:border-[#24388C] focus:ring-2 focus:ring-[#24388C]/15'
const inputError  = 'border-[#C0392B] ring-2 ring-[#C0392B]/10'

export function Input({ error, className = '', ...props }) {
  return (
    <input
      className={`${inputBase} ${error ? inputError : inputNormal} ${className}`}
      {...props}
    />
  )
}

export function Select({ error, children, className = '', ...props }) {
  return (
    <select
      className={`${inputBase} ${error ? inputError : inputNormal} ${className} appearance-none pr-8`}
      {...props}
    >
      {children}
    </select>
  )
}

export function Textarea({ error, className = '', ...props }) {
  return (
    <textarea
      className={`${inputBase} ${error ? inputError : inputNormal} resize-none ${className}`}
      {...props}
    />
  )
}

/** Contenedor de formulario centrado y responsive */
export function FormCard({ title, children }) {
  return (
    <div className="flex-1 flex items-start justify-center p-4 sm:p-6">
      <div className="w-full max-w-2xl bg-white rounded-xl border border-[#F0F0F0] shadow-sm overflow-hidden">
        {title && (
          <div className="px-6 py-4 border-b border-[#F0F0F0]">
            <span className="text-[15px] font-bold text-[#1A1A1A]">{title}</span>
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

/** Botones de acción de formulario */
export function FormActions({ onCancel, loading, submitLabel = 'Guardar' }) {
  return (
    <div className="flex gap-2.5 justify-end pt-2">
      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2.5 rounded-md text-[13px] font-semibold text-[#4A4A4A] border border-[#D5D5D5] hover:bg-[#F7F7F7] transition-all"
        >
          Cancelar
        </button>
      )}
      <button
        type="submit"
        disabled={loading}
        className="px-5 py-2.5 rounded-md text-[13px] font-semibold text-white bg-[#24388C] hover:bg-[#1B2C6B] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Guardando...
          </>
        ) : submitLabel}
      </button>
    </div>
  )
}

/** Alerta de error API */
export function ApiErrorAlert({ message }) {
  if (!message) return null
  return (
    <div className="flex items-start gap-2 text-sm text-[#C0392B] bg-[#FDECEA] border border-[#f5c6c6] rounded-md px-4 py-3 mb-5">
      <span className="flex-shrink-0 mt-px">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
      </span>
      <span>{message}</span>
    </div>
  )
}

/** Loading spinner centrado */
export function LoadingSpinner({ label = 'Cargando...' }) {
  return (
    <div className="flex items-center justify-center py-16 text-[#ABABAB] text-sm gap-2">
      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
      </svg>
      {label}
    </div>
  )
}

/** Estado vacío */
export function EmptyState({ title, description, action }) {
  return (
    <div className="text-center py-16 px-4">
      <div className="w-12 h-12 rounded-full bg-[#F0F0F0] flex items-center justify-center mx-auto mb-3">
        <svg className="w-6 h-6 text-[#ABABAB]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
        </svg>
      </div>
      <div className="text-[15px] font-bold text-[#4A4A4A] mb-1">{title}</div>
      {description && <div className="text-[13px] text-[#6B6B6B] mb-5 max-w-xs mx-auto">{description}</div>}
      {action}
    </div>
  )
}

/** Badge de estado */
export function Badge({ variant = 'gray', children }) {
  const variants = {
    blue:   'bg-[#EEF1FA] text-[#24388C]',
    green:  'bg-[#E8F5EE] text-[#1A8754]',
    red:    'bg-[#FDECEA] text-[#C0392B]',
    orange: 'bg-[#FFF4E0] text-[#C7770D]',
    gray:   'bg-[#F0F0F0] text-[#6B6B6B]',
    purple: 'bg-[#F3E8FF] text-[#7C3AED]',
  }
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[11.5px] font-semibold ${variants[variant]}`}>
      {children}
    </span>
  )
}
