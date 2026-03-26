import { useNavigate } from 'react-router-dom'
import AppLayout from '../../../shared/components/AppLayout'
import Topbar from '../../../shared/components/Topbar'
import ClientesTable from '../components/ClientesTable'
import { useClientes } from '../hooks/useClientes'

export default function ClientesListaPage() {
  const navigate = useNavigate()
  const { filtrados, loading, error, sectores, busqueda, setBusqueda, sector, setSector } = useClientes()

  return (
    <AppLayout>
      <Topbar title="Mis Clientes">
        <div className="flex items-center gap-2 px-3 py-[7px] border border-[#D5D5D5] rounded-md bg-white focus-within:border-[#24388C] focus-within:ring-2 focus-within:ring-[#24388C]/15 transition-all">
          <span className="text-[#ABABAB] text-sm">🔍</span>
          <input
            className="outline-none text-[13.5px] text-[#1A1A1A] bg-transparent w-44 placeholder:text-[#ABABAB]"
            placeholder="Nombre o empresa..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        <select
          className="text-[13px] px-3 py-[7px] border border-[#D5D5D5] rounded-md bg-white outline-none text-[#4A4A4A] focus:border-[#24388C] transition-all"
          value={sector}
          onChange={(e) => setSector(e.target.value)}
        >
          <option value="">Todos los sectores</option>
          {sectores.map((s) => <option key={s}>{s}</option>)}
        </select>
        <button onClick={() => navigate('/clientes/nuevo')} className="px-4 py-[7px] rounded-md text-[13px] font-semibold text-white bg-[#24388C] hover:bg-[#1B2C6B] transition-all">
          + Registrar cliente
        </button>
      </Topbar>

      <div className="p-6">
        {error && (
          <div className="text-sm text-[#C0392B] bg-[#FDECEA] border border-[#f5c6c6] rounded-md px-4 py-3 mb-4">
            ⚠️ {error}
          </div>
        )}

        <div className="bg-white rounded-xl border border-[#F0F0F0] shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-[#F0F0F0] flex items-center gap-3">
            <span className="text-[15px] font-bold text-[#1A1A1A]">Cartera de clientes</span>
            <span className="text-[11.5px] font-semibold px-2.5 py-1 rounded-full bg-[#EEF1FA] text-[#24388C]">{filtrados.length}</span>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-16 text-[#ABABAB] text-sm gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
              </svg>
              Cargando...
            </div>
          )}

          {!loading && filtrados.length === 0 && (
            <div className="text-center py-16">
              <div className="text-5xl mb-3 opacity-30">👥</div>
              <div className="text-[15px] font-bold text-[#4A4A4A] mb-1">
                {busqueda || sector ? 'Sin resultados' : 'Aún no tienes clientes'}
              </div>
              <div className="text-[13px] text-[#6B6B6B] mb-5">
                {busqueda || sector ? 'Intenta con otros criterios' : 'Registra tu primer cliente para comenzar'}
              </div>
              {!busqueda && !sector && (
                <button onClick={() => navigate('/clientes/nuevo')} className="px-5 py-2.5 rounded-md text-[13px] font-semibold text-white bg-[#24388C] hover:bg-[#1B2C6B] transition-all">
                  + Registrar cliente
                </button>
              )}
            </div>
          )}

          {!loading && filtrados.length > 0 && <ClientesTable clientes={filtrados} />}
        </div>
      </div>
    </AppLayout>
  )
}
