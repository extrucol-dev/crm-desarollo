import { useNavigate } from 'react-router-dom'
import AppLayout from '../../../shared/components/AppLayout'
import Topbar from '../../../shared/components/Topbar'
import KanbanBoard from '../components/KanbanBoard'
import { LoadingSpinner } from '../../../shared/components/FormField'
import { useOportunidades, TIPOS } from '../hooks/useOportunidades'

const TIPO_LABEL = {
  COTIZACION:     'Cotización',
  VENTA:          'Venta',
  ACOMPANAMIENTO: 'Acompañamiento',
  PROYECTO:       'Proyecto',
}

export default function OportunidadesKanbanPage() {
  const navigate = useNavigate()
  const { porEstado, loading, error, filtroTipo, setFiltroTipo } = useOportunidades()

  return (
    <AppLayout>
      <Topbar title="Mis Oportunidades">
        <button
          onClick={() => navigate('/oportunidades/nueva')}
          className="px-3 sm:px-4 py-[7px] rounded-md text-[13px] font-semibold text-white bg-[#24388C] hover:bg-[#1B2C6B] transition-all whitespace-nowrap"
        >
          + Nueva
        </button>
      </Topbar>

      <div className="p-4 sm:p-6">
        {/* Filtro por tipo — CE-30 */}
        <div className="flex items-center gap-2 flex-wrap mb-5">
          <button
            onClick={() => setFiltroTipo('')}
            className={`px-3 py-1.5 rounded-full text-[12.5px] font-semibold border transition-all ${
              !filtroTipo
                ? 'bg-[#24388C] text-white border-[#24388C]'
                : 'text-[#4A4A4A] border-[#D5D5D5] hover:border-[#24388C] hover:text-[#24388C]'
            }`}
          >
            Todos
          </button>
          {TIPOS.map(tipo => (
            <button
              key={tipo}
              onClick={() => setFiltroTipo(filtroTipo === tipo ? '' : tipo)}
              className={`px-3 py-1.5 rounded-full text-[12.5px] font-semibold border transition-all ${
                filtroTipo === tipo
                  ? 'bg-[#24388C] text-white border-[#24388C]'
                  : 'text-[#4A4A4A] border-[#D5D5D5] hover:border-[#24388C] hover:text-[#24388C]'
              }`}
            >
              {TIPO_LABEL[tipo]}
            </button>
          ))}
          {filtroTipo && (
            <button
              onClick={() => setFiltroTipo('')}
              className="text-[12px] text-[#6B6B6B] hover:text-[#C0392B] transition-colors ml-1 underline"
            >
              Limpiar filtro
            </button>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="text-sm text-[#C0392B] bg-[#FDECEA] border border-[#f5c6c6] rounded-md px-4 py-3 mb-4">
            {error}
          </div>
        )}

        {/* Kanban */}
        {loading
          ? <LoadingSpinner label="Cargando oportunidades..." />
          : <KanbanBoard porEstado={porEstado} />
        }
      </div>
    </AppLayout>
  )
}
