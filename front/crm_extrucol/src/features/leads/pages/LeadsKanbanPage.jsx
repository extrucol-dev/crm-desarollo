import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../../../shared/components/AppLayout'
import Topbar from '../../../shared/components/Topbar'
import { LoadingSpinner } from '../../../shared/components/FormField'
import { useLeads } from '../hooks/useLeads'
import { leadsAPI } from '../services/leadsAPI'
import LeadsKanban from '../components/LeadsKanban'

const IconSearch = () => (
  <svg className="w-4 h-4 text-[#ABABAB]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
  </svg>
)

export default function LeadsKanbanPage() {
  const navigate = useNavigate()
  const {
    porEstado, totalActivos, loading, error,
    busqueda, setBusqueda,
    filtroOrigen, setFiltroOrigen,
    moverOptimista, cargar,
  } = useLeads()

  const handleMover = useCallback(async (leadId, nuevoEstado) => {
    moverOptimista(leadId, nuevoEstado)
    try {
      await leadsAPI.cambiarEstado(leadId, nuevoEstado)
    } catch {
      cargar()
    }
  }, [moverOptimista, cargar])

  return (
    <AppLayout>
      <Topbar title="Mis Leads">
        <button
          onClick={() => navigate('/leads/nuevo')}
          className="px-4 py-[7px] rounded-md text-[13px] font-semibold text-white bg-[#24388C] hover:bg-[#1B2C6B] transition-all whitespace-nowrap"
        >
          + Nuevo lead
        </button>
      </Topbar>

      <div className="overflow-hidden p-4 md:p-5 w-screen md:w-auto">
        {/* Barra de filtros */}
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <p className="text-[12px] text-[#6B6B6B] mr-auto">
            {totalActivos} lead{totalActivos !== 1 ? 's' : ''} en seguimiento
          </p>

          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <IconSearch />
            </div>
            <input
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              placeholder="Buscar por título o empresa..."
              className="pl-9 pr-4 py-2 border border-[#E5E5E5] rounded-lg text-[12.5px] text-[#1A1A1A] bg-white focus:outline-none focus:border-[#24388C] transition w-56"
            />
          </div>

          <select
            value={filtroOrigen}
            onChange={e => setFiltroOrigen(e.target.value)}
            className="border border-[#E5E5E5] rounded-lg text-[12.5px] text-[#4A4A4A] bg-white px-3 py-2 focus:outline-none focus:border-[#24388C] transition"
          >
            <option value="">Todos los orígenes</option>
            <option value="WhatsApp">WhatsApp</option>
            <option value="Instagram">Instagram</option>
            <option value="Facebook">Facebook</option>
            <option value="Web">Web</option>
            <option value="Referido">Referido</option>
            <option value="Feria">Feria</option>
            <option value="Llamada">Llamada</option>
          </select>
        </div>

        {error && (
          <div className="text-sm text-[#C0392B] bg-[#FDECEA] border border-[#f5c6c6] rounded-lg px-4 py-3 mb-4">
            {error}
          </div>
        )}

        {loading
          ? <LoadingSpinner label="Cargando leads..." />
          : <LeadsKanban porEstado={porEstado} onMover={handleMover} />
        }
      </div>
    </AppLayout>
  )
}
