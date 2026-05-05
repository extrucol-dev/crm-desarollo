import { useState, useEffect, createPortal } from 'react'
import AppLayout from '../../../shared/components/AppLayout'
import Topbar from '../../../shared/components/Topbar'
import { LoadingSpinner } from '../../../shared/components/FormField'
import { coordinadorAPI } from '../services/coordinadorAPI'

// ── Modal helper ──────────────────────────────────────────────────────────────
function Modal({ open, onClose, title, subtitle, iconColor = '#24388C', iconBg = '#EEF1FA', icon, wide, children, footer }) {
  if (!open) return null
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 pt-16 px-4"
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={`bg-white rounded-xl shadow-xl w-full flex flex-col max-h-[85vh] ${wide ? 'max-w-3xl' : 'max-w-lg'}`}>
        <div className="flex items-center gap-3 px-6 py-4 border-b border-[#F0F0F0]">
          {icon && (
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: iconBg, color: iconColor }}>
              {icon}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="text-[15px] font-bold text-[#1A1A1A]">{title}</div>
            {subtitle && <div className="text-[12px] text-[#6B6B6B]">{subtitle}</div>}
          </div>
          <button onClick={onClose} className="text-[#ABABAB] hover:text-[#4A4A4A] text-xl leading-none">×</button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-4">{children}</div>
        {footer && (
          <div className="px-6 py-4 border-t border-[#F0F0F0] flex justify-end gap-3 bg-[#F7F7F7]">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  )
}

// ── Iconos SVG ────────────────────────────────────────────────────────────────
const IcoBell    = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" /></svg>
const IcoCoin    = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
const IcoCheck   = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
const IcoClock   = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
const IcoSearch  = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
const IcoPlus    = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
const IcoPencil  = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" /></svg>
const IcoTrash   = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
const IcoBuilding = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" /></svg>
const IcoFlag    = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 01-.005-10.499l-3.11.732a9 9 0 01-6.085-.711l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5" /></svg>
const IcoXCircle = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
const IcoGlobe   = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253" /></svg>

// ── Datos de variables ────────────────────────────────────────────────────────
const ICONO_CAT = { building: <IcoBuilding />, flag: <IcoFlag />, xcircle: <IcoXCircle />, globe: <IcoGlobe /> }
const ICONO_GRUPO = { bell: <IcoBell />, coin: <IcoCoin /> }

const TIPO_STYLE = {
  error:   { bg: '#FDECEA', color: '#C0392B' },
  accent:  { bg: '#FFF4E0', color: '#C7770D' },
  success: { bg: '#E8F5EE', color: '#1A8754' },
  primary: { bg: '#EEF1FA', color: '#24388C' },
}

// ── Componentes ───────────────────────────────────────────────────────────────
function VariableRow({ variable, onChange, onHistorial }) {
  return (
    <div className="grid items-center gap-4 px-5 py-3.5 border-b border-[#F0F0F0] last:border-0 hover:bg-[#FAFAFA] transition"
      style={{ gridTemplateColumns: '1fr 180px 100px 44px' }}>
      <div>
        <div className="text-[13.5px] font-semibold text-[#1A1A1A]">{variable.name}</div>
        <div className="text-[11.5px] text-[#6B6B6B] mt-0.5">{variable.desc}</div>
        <code className="text-[10.5px] bg-[#F7F7F7] text-[#ABABAB] px-1.5 py-0.5 rounded mt-1 inline-block">
          {variable.key}
        </code>
      </div>
      <input
        value={variable.value}
        onChange={e => onChange(variable.key, e.target.value)}
        className="text-right font-bold text-[#24388C] border border-[#E5E5E5] rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:border-[#24388C] transition bg-white"
      />
      <span className="text-[11.5px] text-[#ABABAB] text-center">{variable.unit}</span>
      <button onClick={() => onHistorial(variable)}
        className="w-9 h-9 flex items-center justify-center rounded-lg text-[#ABABAB] hover:bg-[#F0F0F0] hover:text-[#4A4A4A] transition">
        <IcoClock />
      </button>
    </div>
  )
}

function GrupoVariables({ grupo, onChange, onHistorial }) {
  const style = TIPO_STYLE[grupo.tipo] ?? TIPO_STYLE.primary
  return (
    <div className="bg-white rounded-xl border border-[#F0F0F0] shadow-sm overflow-hidden mb-4">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-[#F0F0F0] bg-gradient-to-b from-white to-[#FAFAFA]">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
          style={style}>
          {ICONO_GRUPO[grupo.icono]}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[14px] font-bold text-[#1A1A1A]">{grupo.titulo}</div>
          <div className="text-[12px] text-[#6B6B6B]">{grupo.desc}</div>
        </div>
        <span className="text-[11px] font-semibold text-[#ABABAB] bg-[#F0F0F0] px-2 py-0.5 rounded-full">
          {grupo.variables.length} variables
        </span>
      </div>
      {grupo.variables.map(v => (
        <VariableRow key={v.key} variable={v} onChange={onChange} onHistorial={onHistorial} />
      ))}
    </div>
  )
}

function CatalogoCard({ catKey, cat, onClick }) {
  return (
    <button onClick={() => onClick(catKey)}
      className="bg-white rounded-xl border border-[#F0F0F0] shadow-sm p-4 text-left hover:border-[#24388C] hover:shadow-md transition-all group">
      <div className="w-10 h-10 rounded-lg bg-[#EEF1FA] text-[#24388C] flex items-center justify-center mb-3">
        {ICONO_CAT[cat.icono] ?? <IcoFlag />}
      </div>
      <div className="text-[13.5px] font-bold text-[#1A1A1A] mb-1">{cat.titulo}</div>
      <div className="border-t border-[#F0F0F0] mt-3 pt-3 flex items-center justify-between">
        <div>
          <span className="text-[22px] font-extrabold text-[#24388C]">{cat.count}</span>
          <span className="text-[11px] text-[#ABABAB] ml-1">registros</span>
        </div>
        <span className="text-[11.5px] font-semibold text-[#24388C] group-hover:underline">Ver →</span>
      </div>
    </button>
  )
}

// ── Página principal ──────────────────────────────────────────────────────────
export default function VariablesSistemaPage() {
  const [loading, setLoading]   = useState(true)
  const [tab, setTab]           = useState('variables')
  const [grupos, setGrupos]     = useState([])
  const [catalogos]           = useState({})
  const [dirty, setDirty]       = useState(false)

  // Modales
  const [modalGuardar,  setModalGuardar]  = useState(false)
  const [modalHistorial, setModalHistorial] = useState(null) // variable obj
  const [modalCatalogo, setModalCatalogo] = useState(null)  // catKey

  useEffect(() => {
    coordinadorAPI.variablesSistema()
      .then(data => {
        if (data?.grupos) setGrupos(data.grupos)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleChange = (key, value) => {
    setGrupos(prev => prev.map(g => ({
      ...g,
      variables: g.variables.map(v => v.key === key ? { ...v, value } : v),
    })))
    setDirty(true)
  }

  const handleGuardar = () => {
    setModalGuardar(false)
    setDirty(false)
  }

  const changedVars = []
  const catActivo = modalCatalogo ? catalogos[modalCatalogo] : null

  return (
    <AppLayout>
      <Topbar title="Variables y catálogos" />
      <div className="p-4 sm:p-6 max-w-5xl mx-auto">
        {loading && <LoadingSpinner label="Cargando configuración..." />}
        {!loading && (
          <>
            {/* Alerta sensible */}
            <div className="flex items-start gap-3 bg-[#FFF8E5] border border-[#F5D98C] rounded-xl px-4 py-3 mb-5">
              <svg className="w-5 h-5 text-[#B87E15] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
              <div className="text-[13px] text-[#92610A]">
                <strong>Área sensible.</strong> Los cambios en variables y catálogos afectan el comportamiento del sistema en tiempo real.
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 border-b border-[#F0F0F0] mb-5">
              {[['variables', 'Variables del sistema'], ['catalogos', 'Catálogos']].map(([key, label]) => (
                <button key={key} onClick={() => setTab(key)}
                  className={`px-4 py-2.5 text-[13.5px] font-semibold border-b-2 transition ${
                    tab === key
                      ? 'text-[#24388C] border-[#24388C]'
                      : 'text-[#ABABAB] border-transparent hover:text-[#4A4A4A]'
                  }`}>
                  {label}
                </button>
              ))}
            </div>

            {/* ── TAB: Variables ── */}
            {tab === 'variables' && (
              <>
                <div className="flex flex-wrap items-center gap-3 mb-5">
                  <div className="relative flex-1 min-w-[220px] max-w-sm">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-[#ABABAB]">
                      <IcoSearch />
                    </div>
                    <input placeholder="Buscar variable por nombre o clave..."
                      className="pl-9 pr-4 py-2 w-full border border-[#E5E5E5] rounded-lg text-[12.5px] focus:outline-none focus:border-[#24388C] transition bg-white" />
                  </div>
                  <div className="ml-auto flex items-center gap-2">
                    {dirty && (
                      <span className="text-[11.5px] font-semibold text-[#F39610]">
                        {changedVars.length} cambio{changedVars.length !== 1 ? 's' : ''} sin guardar
                      </span>
                    )}
                    <button
                      onClick={() => setModalGuardar(true)}
                      disabled={!dirty}
                      className="flex items-center gap-1.5 text-[13px] font-semibold text-white px-4 py-2 rounded-lg transition disabled:opacity-40"
                      style={{ background: '#24388C' }}>
                      <IcoCheck /> Guardar cambios
                    </button>
                  </div>
                </div>

                {grupos.map((g, i) => (
                  <GrupoVariables key={i} grupo={g} onChange={handleChange} onHistorial={setModalHistorial} />
                ))}
              </>
            )}

            {/* ── TAB: Catálogos ── */}
            {tab === 'catalogos' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(catalogos).map(([key, cat]) => (
                  <CatalogoCard key={key} catKey={key} cat={cat} onClick={setModalCatalogo} />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Modal: Confirmar guardar ── */}
      <Modal
        open={modalGuardar}
        onClose={() => setModalGuardar(false)}
        title="Guardar cambios"
        subtitle="Confirmar modificaciones al sistema"
        icon={<IcoCheck />}
        iconBg="#E8F5EE"
        iconColor="#1A8754"
        footer={
          <>
            <button onClick={() => setModalGuardar(false)}
              className="px-4 py-2 text-[13px] font-semibold text-[#4A4A4A] bg-white border border-[#E5E5E5] rounded-lg hover:bg-[#F7F7F7] transition">
              Cancelar
            </button>
            <button onClick={handleGuardar}
              className="flex items-center gap-1.5 px-4 py-2 text-[13px] font-semibold text-white rounded-lg transition"
              style={{ background: '#1A8754' }}>
              <IcoCheck /> Confirmar y guardar
            </button>
          </>
        }>
        <p className="text-[13.5px] text-[#4A4A4A] mb-4">
          Hay cambios sin guardar en las variables del sistema.
        </p>
        <div className="flex items-start gap-2 bg-[#FFF8E5] border border-[#F5D98C] rounded-lg px-3 py-2.5 text-[12.5px] text-[#92610A]">
          <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          Las alertas existentes se recalcularán automáticamente al guardar.
        </div>
      </Modal>

      {/* ── Modal: Historial de variable ── */}
      <Modal
        open={!!modalHistorial}
        onClose={() => setModalHistorial(null)}
        title="Historial de cambios"
        subtitle={modalHistorial?.name}
        icon={<IcoClock />}
        iconBg="#EEF1FA"
        iconColor="#24388C"
        footer={
          <button onClick={() => setModalHistorial(null)}
            className="px-4 py-2 text-[13px] font-semibold text-[#4A4A4A] bg-white border border-[#E5E5E5] rounded-lg hover:bg-[#F7F7F7] transition">
            Cerrar
          </button>
        }>
        <div className="divide-y divide-[#F0F0F0]">
          {[].map((h, i) => (
            <div key={i} className="flex items-center gap-3 py-3">
              <div className="w-8 h-8 rounded-full bg-[#F39610] flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0">
                {h.ini}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[12.5px] font-semibold text-[#1A1A1A]">{h.usuario}</div>
                <div className="text-[11.5px] text-[#6B6B6B]">{h.fecha}</div>
              </div>
              <code className="text-[12px] text-[#ABABAB]">
                {h.desde} → <strong className="text-[#1A8754]">{h.hacia}</strong>
              </code>
            </div>
          ))}
        </div>
      </Modal>

      {/* ── Modal: Catálogo detalle ── */}
      {catActivo && (
        <Modal
          open={!!modalCatalogo}
          onClose={() => setModalCatalogo(null)}
          title={catActivo.titulo}
          subtitle={`${catActivo.count} registros`}
          icon={ICONO_CAT[catActivo.icono] ?? <IcoFlag />}
          iconBg="#EEF1FA"
          iconColor="#24388C"
          wide
          footer={
            <>
              <button onClick={() => setModalCatalogo(null)}
                className="px-4 py-2 text-[13px] font-semibold text-[#4A4A4A] bg-white border border-[#E5E5E5] rounded-lg hover:bg-[#F7F7F7] transition">
                Cerrar
              </button>
              <button className="flex items-center gap-1.5 px-4 py-2 text-[13px] font-semibold text-white rounded-lg"
                style={{ background: '#24388C' }}>
                <IcoPlus /> Nuevo
              </button>
            </>
          }>
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-[#ABABAB]">
              <IcoSearch />
            </div>
            <input placeholder="Buscar..." className="pl-9 pr-4 py-2 w-full border border-[#E5E5E5] rounded-lg text-[12.5px] focus:outline-none focus:border-[#24388C] transition" />
          </div>
          <div className="bg-white rounded-xl border border-[#F0F0F0] overflow-hidden">
            <div className="grid px-4 py-2.5 bg-[#F7F7F7] border-b border-[#F0F0F0] text-[10.5px] font-semibold text-[#ABABAB] uppercase tracking-wider"
              style={{ gridTemplateColumns: '1fr 1fr auto auto' }}>
              <span>Nombre</span>
              <span>Descripción</span>
              <span>Estado</span>
              <span />
            </div>
            {catActivo.items.map(item => (
              <div key={item.id} className="grid items-center px-4 py-3 border-b border-[#F0F0F0] last:border-0 hover:bg-[#FAFAFA] gap-3"
                style={{ gridTemplateColumns: '1fr 1fr auto auto' }}>
                <div className="flex items-center gap-2">
                  {item.color && (
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: item.color }} />
                  )}
                  <span className="text-[13px] font-semibold text-[#1A1A1A]">{item.nombre}</span>
                  {item.tipo && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                      style={item.tipo === 'ganada'
                        ? { background: '#E8F5EE', color: '#1A8754' }
                        : { background: '#FDECEA', color: '#C0392B' }}>
                      {item.tipo}
                    </span>
                  )}
                </div>
                <span className="text-[12px] text-[#6B6B6B] truncate">{item.desc ?? '—'}</span>
                <span className="text-[10.5px] font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: '#E8F5EE', color: '#1A8754' }}>Activo</span>
                <div className="flex items-center gap-1">
                  <button className="w-8 h-8 flex items-center justify-center rounded-lg text-[#ABABAB] hover:bg-[#F0F0F0] hover:text-[#4A4A4A] transition">
                    <IcoPencil />
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center rounded-lg text-[#ABABAB] hover:bg-[#FDECEA] hover:text-[#C0392B] transition">
                    <IcoTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Modal>
      )}
    </AppLayout>
  )
}
