import { useNavigate } from 'react-router-dom'
import AppLayout from '../../../shared/components/AppLayout'
import Topbar from '../../../shared/components/Topbar'
import ClientesTable from '../components/ClientesTable'
import { LoadingSpinner, EmptyState } from '../../../shared/components/FormField'
import { useClientes } from '../hooks/useClientes'

export default function ClientesListaPage() {
  const navigate = useNavigate()
  const { filtrados, loading, error, sectores, ciudades,
    busqueda, setBusqueda, sector, setSector, ciudad, setCiudad } = useClientes()

  return (
    <AppLayout>
      <Topbar title="Mis Clientes">
        <button onClick={() => navigate('/clientes/nuevo')}
          className="px-3 sm:px-4 py-[7px] rounded-md text-[13px] font-semibold text-white bg-[#24388C] hover:bg-[#1B2C6B] transition-all whitespace-nowrap">
          + Registrar
        </button>
      </Topbar>

      <div className="p-4 sm:p-6">
        {/* CE-27: búsqueda + filtros sector/ciudad */}
        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <div className="flex items-center gap-2 px-3 py-[7px] border border-[#D5D5D5] rounded-md bg-white focus-within:border-[#24388C] focus-within:ring-2 focus-within:ring-[#24388C]/15 transition-all flex-1">
            <svg className="w-4 h-4 text-[#ABABAB] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input className="outline-none text-[13.5px] text-[#1A1A1A] bg-transparent w-full placeholder:text-[#ABABAB]"
              placeholder="Buscar por nombre o empresa..."
              value={busqueda} onChange={e => setBusqueda(e.target.value)} />
          </div>
          <select className="text-[13px] px-3 py-[7px] border border-[#D5D5D5] rounded-md bg-white outline-none text-[#4A4A4A] focus:border-[#24388C] transition-all sm:w-44"
            value={sector} onChange={e => setSector(e.target.value)}>
            <option value="">Todos los sectores</option>
            {sectores.map(s => <option key={s}>{s}</option>)}
          </select>
          <select className="text-[13px] px-3 py-[7px] border border-[#D5D5D5] rounded-md bg-white outline-none text-[#4A4A4A] focus:border-[#24388C] transition-all sm:w-40"
            value={ciudad} onChange={e => setCiudad(e.target.value)}>
            <option value="">Todas las ciudades</option>
            {ciudades.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
          </select>
        </div>

        {error && (
          <div className="text-sm text-[#C0392B] bg-[#FDECEA] border border-[#f5c6c6] rounded-md px-4 py-3 mb-4">{error}</div>
        )}

        <div className="bg-white rounded-xl border border-[#F0F0F0] shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-[#F0F0F0] flex items-center gap-3">
            <span className="text-[15px] font-bold text-[#1A1A1A]">Cartera de clientes</span>
            <span className="text-[11.5px] font-semibold px-2.5 py-1 rounded-full bg-[#EEF1FA] text-[#24388C]">
              {filtrados.length}
            </span>
          </div>
          {loading && <LoadingSpinner />}
          {!loading && filtrados.length === 0 && (
            <EmptyState
              title={busqueda || sector || ciudad ? 'Sin resultados' : 'Aún no tienes clientes'}
              description={busqueda || sector || ciudad ? 'Intenta con otros criterios' : 'Registra tu primer cliente para comenzar'}
              action={!busqueda && !sector && !ciudad && (
                <button onClick={() => navigate('/clientes/nuevo')}
                  className="px-5 py-2.5 rounded-md text-[13px] font-semibold text-white bg-[#24388C] hover:bg-[#1B2C6B] transition-all">
                  + Registrar cliente
                </button>
              )}
            />
          )}
          {!loading && filtrados.length > 0 && <ClientesTable clientes={filtrados} />}
        </div>
      </div>
    </AppLayout>
  )
}
