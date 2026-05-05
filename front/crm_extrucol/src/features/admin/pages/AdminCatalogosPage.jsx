import { useState, useMemo, useEffect, useCallback } from 'react'
import AppLayout from '../../../shared/components/AppLayout'
import Topbar from '../../../shared/components/Topbar'
import { adminAPI } from '../services/adminAPI'

const CATALOGOS = [
  { id: 'paises',      title: 'Países',                desc: 'Países habilitados',           table: 'CRM_PAIS',               categoria: 'ubicacion', icon: 'globe',     editable: false },
  { id: 'dptos',       title: 'Departamentos',          desc: 'División territorial',          table: 'CRM_DEPARTAMENTO',       categoria: 'ubicacion', icon: 'map',       editable: false },
  { id: 'mpios',       title: 'Municipios',             desc: 'Municipios del país',           table: 'CRM_MUNICIPIO',          categoria: 'ubicacion', icon: 'map',       editable: false },
  { id: 'sectores',    title: 'Sectores económicos',    desc: 'Clasificación de empresas',     table: 'CRM_SECTOR',             categoria: 'comercial', icon: 'building',  editable: true  },
  { id: 'modalidades', title: 'Modalidades',            desc: 'Interior / Exterior',           table: 'CRM_MODALIDAD',          categoria: 'comercial', icon: 'tag',       editable: false },
  { id: 'tipdocs',     title: 'Tipos de documento',     desc: 'NIT, Cédula, Extranjería',      table: 'CRM_DOCUMENTO',          categoria: 'comercial', icon: 'document',  editable: false },
  { id: 'origenes',    title: 'Orígenes de Lead',       desc: 'Canales de captación',          table: 'CRM_ORIGEN_LEAD',        categoria: 'estados',   icon: 'globe',     editable: true  },
  { id: 'estlead',     title: 'Estados de Lead',        desc: 'Ciclo de vida del lead',        table: 'CRM_ESTADO_LEAD',        categoria: 'estados',   icon: 'flag',      editable: false },
  { id: 'estopor',     title: 'Estados de Oportunidad', desc: 'Etapas del pipeline',           table: 'CRM_ESTADO_OPORTUNIDAD', categoria: 'estados',   icon: 'flag',      editable: false },
  { id: 'motivos',     title: 'Motivos de cierre',      desc: 'Razones ganada / perdida',      table: 'CRM_MOTIVO_CIERRE',      categoria: 'estados',   icon: 'flag',      editable: true  },
  { id: 'intereses',   title: 'Intereses',              desc: 'Áreas de interés del cliente',  table: 'CRM_INTERES',            categoria: 'comercial', icon: 'sparkles',  editable: true  },
  { id: 'productos',   title: 'Productos',              desc: 'Catálogo comercial',            table: 'CRM_PRODUCTO',           categoria: 'comercial', icon: 'archive',   editable: true  },
  { id: 'tipopor',     title: 'Tipos de oportunidad',   desc: 'Modalidades de negociación',    table: 'CRM_TIPO_OPORTUNIDAD',   categoria: 'comercial', icon: 'briefcase', editable: true  },
]

const CATEGORIAS = [
  { id: 'todos',     label: 'Todos'     },
  { id: 'ubicacion', label: 'Ubicación' },
  { id: 'comercial', label: 'Comercial' },
  { id: 'estados',   label: 'Estados'   },
]

const ICON_PATH = {
  globe:     'M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253M3 12c0 .778.099 1.533.284 2.253',
  map:       'M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z',
  building:  'M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21',
  tag:       'M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3zM6 6h.008v.008H6V6z',
  document:  'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z',
  flag:      'M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 01-.005-10.499l-3.11.732a9 9 0 01-6.085-.711l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5',
  sparkles:  'M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z',
  archive:   'M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z',
  briefcase: 'M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0',
}

function CatIcon({ name }) {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
      <path strokeLinecap="round" strokeLinejoin="round" d={ICON_PATH[name] ?? ICON_PATH.document} />
    </svg>
  )
}

// Drawer lateral para ver y editar ítems de un catálogo
function CatalogoDrawer({ catalogo, onClose }) {
  const [items,      setItems]      = useState([])
  const [loading,    setLoading]    = useState(true)
  const [editando,   setEditando]   = useState(null)   // { id, nombre, descripcion } | null
  const [nuevo,      setNuevo]      = useState(false)
  const [form,       setForm]       = useState({ nombre: '', descripcion: '' })
  const [guardando,  setGuardando]  = useState(false)
  const [error,      setError]      = useState('')

  const cargar = useCallback(async () => {
    setLoading(true)
    try {
      const data = await adminAPI.catalogoList(catalogo.table)
      setItems(data)
    } finally {
      setLoading(false)
    }
  }, [catalogo.table])

  useEffect(() => { cargar() }, [cargar])

  const abrirNuevo = () => {
    setEditando(null)
    setForm({ nombre: '', descripcion: '' })
    setError('')
    setNuevo(true)
  }

  const abrirEditar = (item) => {
    setNuevo(false)
    setForm({ nombre: item.nombre ?? '', descripcion: item.descripcion ?? '' })
    setError('')
    setEditando(item)
  }

  const cancelar = () => { setNuevo(false); setEditando(null); setError('') }

  const guardar = async () => {
    if (!form.nombre.trim()) { setError('El nombre es obligatorio.'); return }
    setGuardando(true)
    setError('')
    try {
      if (editando) {
        await adminAPI.catalogoUpdate(catalogo.table, editando.id, form.nombre.trim(), form.descripcion.trim())
      } else {
        await adminAPI.catalogoCreate(catalogo.table, form.nombre.trim(), form.descripcion.trim())
      }
      cancelar()
      await cargar()
    } catch {
      setError('No se pudo guardar. Inténtalo de nuevo.')
    } finally {
      setGuardando(false)
    }
  }

  const mostrarForm = nuevo || editando !== null

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]" onClick={onClose} />

      {/* Panel */}
      <div className="relative bg-white w-full max-w-md shadow-2xl flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#F0F0F0]">
          <div>
            <div className="text-[15px] font-bold text-[#1A1A1A]">{catalogo.title}</div>
            <div className="font-mono text-[10.5px] text-[#ABABAB] mt-0.5">{catalogo.table}</div>
          </div>
          <div className="flex items-center gap-2">
            {catalogo.editable && !mostrarForm && (
              <button onClick={abrirNuevo}
                className="px-3 py-[6px] text-[12.5px] font-semibold bg-[#24388C] text-white rounded-md hover:bg-[#1C2E6E] transition-all flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Nuevo
              </button>
            )}
            <button onClick={onClose}
              className="w-8 h-8 rounded-md flex items-center justify-center text-[#6B6B6B] hover:bg-[#F7F7F7] transition-all">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Form inline */}
        {mostrarForm && (
          <div className="px-5 py-4 border-b border-[#F0F0F0] bg-[#F7F8FB]">
            <div className="text-[12.5px] font-semibold text-[#24388C] mb-3">
              {editando ? 'Editar registro' : 'Nuevo registro'}
            </div>
            <div className="space-y-2.5">
              <div>
                <label className="block text-[11.5px] font-semibold text-[#4A4A4A] mb-1">Nombre *</label>
                <input
                  className="w-full border border-[#D5D5D5] rounded-md px-3 py-2 text-[13px] outline-none focus:border-[#24388C] focus:ring-2 focus:ring-[#24388C]/15 transition-all"
                  value={form.nombre}
                  onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))}
                  placeholder="Nombre del registro"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-[11.5px] font-semibold text-[#4A4A4A] mb-1">Descripción</label>
                <input
                  className="w-full border border-[#D5D5D5] rounded-md px-3 py-2 text-[13px] outline-none focus:border-[#24388C] focus:ring-2 focus:ring-[#24388C]/15 transition-all"
                  value={form.descripcion}
                  onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))}
                  placeholder="Descripción opcional"
                />
              </div>
              {error && <p className="text-[12px] text-[#C0392B]">{error}</p>}
            </div>
            <div className="flex gap-2 mt-3">
              <button onClick={guardar} disabled={guardando}
                className="px-4 py-[7px] text-[12.5px] font-semibold bg-[#24388C] text-white rounded-md hover:bg-[#1C2E6E] transition-all disabled:opacity-50">
                {guardando ? 'Guardando…' : 'Guardar'}
              </button>
              <button onClick={cancelar}
                className="px-4 py-[7px] text-[12.5px] font-semibold border border-[#D5D5D5] rounded-md text-[#4A4A4A] hover:bg-[#F7F7F7] transition-all">
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Lista */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-6 h-6 border-2 border-[#24388C] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-16 text-[#ABABAB] text-[13.5px]">
              Sin registros
            </div>
          ) : (
            <div>
              {items.map((item, i) => (
                <div key={item.id ?? i}
                  className={`flex items-center gap-3 px-5 py-3.5 ${i < items.length - 1 ? 'border-b border-[#F0F0F0]' : ''}`}>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13.5px] font-semibold text-[#1A1A1A]">{item.nombre}</div>
                    {item.descripcion && (
                      <div className="text-[11.5px] text-[#6B6B6B] mt-0.5">{item.descripcion}</div>
                    )}
                    {item.extra && (
                      <div className="mt-1 font-mono text-[10px] text-[#ABABAB] bg-[#F7F7F7] px-1.5 py-0.5 rounded inline-block">
                        {item.extra}
                      </div>
                    )}
                  </div>
                  {catalogo.editable && (
                    <button onClick={() => abrirEditar(item)}
                      className="w-7 h-7 rounded-md flex items-center justify-center text-[#ABABAB] hover:bg-[#F7F7F7] hover:text-[#24388C] transition-all flex-shrink-0">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.9}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer count */}
        <div className="px-5 py-3 border-t border-[#F0F0F0] text-[11.5px] text-[#ABABAB]">
          {loading ? '…' : `${items.length} registro${items.length !== 1 ? 's' : ''}`}
        </div>
      </div>
    </div>
  )
}

export default function AdminCatalogosPage() {
  const [busqueda,   setBusqueda]   = useState('')
  const [categoria,  setCategoria]  = useState('todos')
  const [seleccion,  setSeleccion]  = useState(null)

  const visibles = useMemo(() =>
    CATALOGOS.filter(c => {
      const okCat    = categoria === 'todos' || c.categoria === categoria
      const q        = busqueda.toLowerCase()
      const okSearch = !busqueda || c.title.toLowerCase().includes(q) || c.table.toLowerCase().includes(q)
      return okCat && okSearch
    })
  , [busqueda, categoria])

  return (
    <AppLayout>
      <Topbar title="Catálogos maestros">
        <button className="px-3 py-[7px] text-[13px] font-semibold border border-[#D5D5D5] rounded-md bg-white text-[#4A4A4A] hover:bg-[#F7F7F7] transition-all flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          Exportar todos
        </button>
      </Topbar>

      <div className="p-4 sm:p-6">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-2 mb-5 flex-wrap">
          <div className="flex items-center gap-2 px-3 py-[7px] border border-[#D5D5D5] rounded-md bg-white focus-within:border-[#24388C] focus-within:ring-2 focus-within:ring-[#24388C]/15 transition-all flex-1 max-w-sm">
            <svg className="w-4 h-4 text-[#ABABAB] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input
              className="outline-none text-[13.5px] text-[#1A1A1A] bg-transparent w-full placeholder:text-[#ABABAB]"
              placeholder="Buscar catálogo o tabla..."
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
            />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {CATEGORIAS.map(c => (
              <button key={c.id}
                onClick={() => setCategoria(c.id)}
                className={`px-3 py-[7px] text-[12.5px] font-semibold rounded-md transition-all ${
                  categoria === c.id
                    ? 'bg-[#24388C] text-white'
                    : 'bg-white border border-[#D5D5D5] text-[#4A4A4A] hover:bg-[#F7F7F7]'
                }`}>
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {visibles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {visibles.map(c => (
              <div key={c.id}
                onClick={() => setSeleccion(c)}
                className="bg-white rounded-xl border border-[#F0F0F0] shadow-sm p-5 hover:border-[#24388C] hover:shadow-md transition-all cursor-pointer group">
                <div className="w-11 h-11 rounded-xl bg-[#EEF1FA] text-[#24388C] flex items-center justify-center mb-3 group-hover:bg-[#24388C] group-hover:text-white transition-all">
                  <CatIcon name={c.icon} />
                </div>
                <div className="text-[14.5px] font-bold text-[#1A1A1A] mb-1">{c.title}</div>
                <div className="text-[12.5px] text-[#6B6B6B] mb-3">{c.desc}</div>
                <div className="flex items-center justify-between pt-3 border-t border-[#F0F0F0]">
                  <div className="flex items-center gap-1.5">
                    {c.editable ? (
                      <span className="text-[11px] text-[#1A8754] font-semibold bg-[#E8F5EE] px-2 py-0.5 rounded-full">Editable</span>
                    ) : (
                      <span className="text-[11px] text-[#ABABAB] font-semibold bg-[#F7F7F7] px-2 py-0.5 rounded-full">Solo lectura</span>
                    )}
                  </div>
                  <button
                    onClick={e => { e.stopPropagation(); setSeleccion(c) }}
                    className="px-2.5 py-1 text-[12px] font-semibold border border-[#D5D5D5] rounded-md text-[#4A4A4A] hover:bg-[#F7F7F7] transition-all">
                    Ver
                  </button>
                </div>
                <div className="mt-2 font-mono text-[10px] text-[#ABABAB] bg-[#F7F7F7] px-2 py-1 rounded inline-block">
                  {c.table}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-[#ABABAB] text-[14px]">
            No se encontraron catálogos
          </div>
        )}
      </div>

      {/* Drawer */}
      {seleccion && (
        <CatalogoDrawer
          catalogo={seleccion}
          onClose={() => setSeleccion(null)}
        />
      )}
    </AppLayout>
  )
}
