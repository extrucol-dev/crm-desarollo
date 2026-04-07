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
  const { porEstado, oportunidades, loading, error, filtroTipo, setFiltroTipo } = useOportunidades()

  const activas = oportunidades.filter(op => !['GANADA', 'PERDIDA'].includes(op.estado)).length

  return (
    <AppLayout>
      <Topbar title="Oportunidades">
        <button
          onClick={() => navigate('/oportunidades/nueva')}
          className="px-4 py-[7px] rounded-md text-[13px] font-semibold text-white bg-[#24388C] hover:bg-[#1B2C6B] transition-all whitespace-nowrap"
        >
          Nueva
        </button>
      </Topbar>

      <div className="overflow-hidden p-4 md:p-5 w-screen md:w-auto">
        {/* Barra de filtro — mínima, una sola línea */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex gap-1 flex-wrap">
            <button
              onClick={() => setFiltroTipo('')}
              className={`px-2.5 py-1 rounded-md text-[12px] font-semibold transition-all ${
                !filtroTipo
                  ? 'bg-[#24388C] text-white'
                  : 'text-[#6B6B6B] hover:text-[#1A1A1A] hover:bg-[#F0F0F0]'
              }`}
            >
              Todos
            </button>
            {TIPOS.map(t => (
              <button key={t} onClick={() => setFiltroTipo(filtroTipo === t ? '' : t)}
                className={`px-2.5 py-1 rounded-md text-[12px] font-semibold transition-all ${
                  filtroTipo === t
                    ? 'bg-[#24388C] text-white'
                    : 'text-[#6B6B6B] hover:text-[#1A1A1A] hover:bg-[#F0F0F0]'
                }`}
              >
                {TIPO_LABEL[t]}
              </button>
            ))}
          </div>

          {/* Contador activas */}
          <span className="ml-auto text-[12px] text-[#ABABAB] whitespace-nowrap flex-shrink-0">
            {activas} activa{activas !== 1 ? 's' : ''}
          </span>
        </div>

        {error && (
          <div className="text-sm text-[#C0392B] bg-[#FDECEA] border border-[#f5c6c6] rounded-lg px-4 py-3 mb-4">
            {error}
          </div>
        )}

        {loading
          ? <LoadingSpinner label="Cargando oportunidades..." />
          : <KanbanBoard className="overflow-x-scroll" porEstado={porEstado} />
        }
      </div>
    </AppLayout>
  )
}