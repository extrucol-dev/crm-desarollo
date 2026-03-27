import { useState } from 'react'

export default function CierreModal({ onConfirm, onCancel, loading }) {
  const [estado, setEstado]             = useState('')      // 'GANADA' | 'PERDIDA'
  const [motivo_cierre, setMotivo]      = useState('')
  const [fecha_cierre, setFecha]        = useState('')
  const [error, setError]               = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    if (!estado)          { setError('Selecciona si la oportunidad fue ganada o perdida.'); return }
    if (!motivo_cierre.trim()) { setError('El motivo de cierre es obligatorio.'); return }
    onConfirm({ estado, motivo_cierre, fecha_cierre: fecha_cierre || undefined })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">

        {/* Header */}
        <div className="px-6 py-5 border-b border-[#F0F0F0]">
          <h2 className="text-[16px] font-bold text-[#1A1A1A]">Cerrar oportunidad</h2>
          <p className="text-[13px] text-[#6B6B6B] mt-0.5">
            Esta acción es permanente. La oportunidad no podrá cambiar de estado después.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5">

          {/* Ganada / Perdida */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <button
              type="button"
              onClick={() => { setEstado('GANADA'); setError('') }}
              className={`py-3 rounded-xl text-[13px] font-bold border-2 transition-all ${
                estado === 'GANADA'
                  ? 'border-[#22C55E] bg-[#F0FDF4] text-[#16A34A]'
                  : 'border-[#E5E5E5] text-[#4A4A4A] hover:border-[#22C55E] hover:bg-[#F0FDF4]'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Ganada
              </div>
            </button>
            <button
              type="button"
              onClick={() => { setEstado('PERDIDA'); setError('') }}
              className={`py-3 rounded-xl text-[13px] font-bold border-2 transition-all ${
                estado === 'PERDIDA'
                  ? 'border-[#EF4444] bg-[#FFF1F2] text-[#DC2626]'
                  : 'border-[#E5E5E5] text-[#4A4A4A] hover:border-[#EF4444] hover:bg-[#FFF1F2]'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Perdida
              </div>
            </button>
          </div>

          {/* Motivo */}
          <div className="mb-4">
            <label className="block text-[13px] font-semibold text-[#4A4A4A] mb-1.5">
              Motivo de cierre <span className="text-[#C0392B]">*</span>
            </label>
            <textarea
              rows={3}
              placeholder={estado === 'GANADA'
                ? 'Ej: Precio competitivo y entrega a tiempo'
                : 'Ej: El cliente eligió otro proveedor por precio'}
              value={motivo_cierre}
              onChange={e => { setMotivo(e.target.value); setError('') }}
              className="w-full px-3 py-2.5 text-[13.5px] text-[#1A1A1A] bg-white border border-[#D5D5D5] rounded-md outline-none placeholder:text-[#ABABAB] resize-none transition-all focus:border-[#24388C] focus:ring-2 focus:ring-[#24388C]/15"
            />
          </div>

          {/* Fecha de cierre real */}
          <div className="mb-5">
            <label className="block text-[13px] font-semibold text-[#4A4A4A] mb-1.5">
              Fecha de cierre real
            </label>
            <input
              type="date"
              value={fecha_cierre}
              onChange={e => setFecha(e.target.value)}
              className="w-full px-3 py-[9px] text-[13.5px] text-[#1A1A1A] bg-white border border-[#D5D5D5] rounded-md outline-none transition-all focus:border-[#24388C] focus:ring-2 focus:ring-[#24388C]/15"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="text-[12.5px] text-[#C0392B] bg-[#FDECEA] border border-[#f5c6c6] rounded-md px-3 py-2 mb-4">
              {error}
            </div>
          )}

          {/* Acciones */}
          <div className="flex gap-2.5">
            <button type="button" onClick={onCancel}
              className="flex-1 py-2.5 rounded-md text-[13px] font-semibold text-[#4A4A4A] border border-[#D5D5D5] hover:bg-[#F7F7F7] transition-all">
              Cancelar
            </button>
            <button type="submit" disabled={loading}
              className={`flex-1 py-2.5 rounded-md text-[13px] font-semibold text-white transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                estado === 'PERDIDA' ? 'bg-[#EF4444] hover:bg-[#DC2626]' : 'bg-[#22C55E] hover:bg-[#16A34A]'
              }`}>
              {loading ? (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                </svg>
              ) : 'Confirmar cierre'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
