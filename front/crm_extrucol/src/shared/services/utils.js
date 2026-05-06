// Constante de compilación — Vite reemplaza import.meta.env.VITE_APEX_MODE
// con el literal "true"/"false" en build time, habilitando tree-shaking del branch muerto.
export const APEX_MODE = String(import.meta.env.VITE_APEX_MODE) === 'true'

// Convierte recursivamente todas las claves de un objeto a minúsculas.
// Oracle devuelve nombres de columna en MAYÚSCULAS; React espera minúsculas.
export const toLower = (val) => {
  if (Array.isArray(val)) return val.map(toLower)
  if (val !== null && typeof val === 'object')
    return Object.fromEntries(Object.entries(val).map(([k, v]) => [k.toLowerCase(), toLower(v)]))
  return val
}

// ── Mapeo de campos APEX → nombres que la app espera ───────────────
// APEX devuelve nombres en español y valores en español/código mixto.
// Esta función normaliza tanto las claves como los valores discretos.
const ESTADO_MAP = {
  // Oportunidades
  'especificación': 'PROSPECTO',
  'calificación':   'CALIFICACION',
  'propuesta':      'PROPUESTA',
  'negociación':    'NEGOCIACION',
  'ganada':         'GANADA',
  'perdida':        'PERDIDA',
  // Leads
  'nuevo':          'NUEVO',
  'interesado':     'CALIFICADO',
  'contactado':     'CONTACTADO',
  'no interesado':  'DESCARTADO',
  'convertido':     'CONVERTIDO',
}

const TIPO_MAP = {
  'licitación pública':    'COTIZACION',
  'suministro directo':    'VENTA',
  'proyecto a medida':     'PROYECTO',
  'acompañamiento técnico': 'ACOMPANAMIENTO',
}

const mapApexFields = (record) => {
  if (!record || typeof record !== 'object') return record

  const r = { ...record }

  // ── IDs genéricos ─────────────────────────────────────────────────
  if ('id_oportunidad' in r) { r.id = r.id_oportunidad; delete r.id_oportunidad }
  else if ('id_lead'     in r) { r.id = r.id_lead;         delete r.id_lead }
  else if ('id_empresa'   in r) { r.id = r.id_empresa;      delete r.id_empresa }
  else if ('id_actividad' in r) { r.id = r.id_actividad;   delete r.id_actividad }
  else if ('id_proyecto'  in r) { r.id = r.id_proyecto;    delete r.id_proyecto }
  else if ('id_usuario'   in r) { r.id = r.id_usuario;     delete r.id_usuario }
  else if ('id_meta'      in r) { r.id = r.id_meta;         delete r.id_meta }
  else if ('id_notificacion' in r) { r.id = r.id_notificacion; delete r.id_notificacion }

  // ── Oportunidades ────────────────────────────────────────────────
  if ('id_estado'            in r) delete r.id_estado
  if ('estado_tipo'          in r) delete r.estado_tipo
  if ('estado_color'         in r) delete r.estado_color
  if ('estado_orden'         in r) delete r.estado_orden
  if ('sector_color'         in r) delete r.sector_color
  if ('tipo_oportunidad'     in r) { r.tipo = r.tipo_oportunidad; delete r.tipo_oportunidad }
  if ('id_tipo_oportunidad'  in r) delete r.id_tipo_oportunidad
  if ('id_sector'            in r) delete r.id_sector
  if ('descripcion_cierre'   in r) { r.resultado  = r.descripcion_cierre; delete r.descripcion_cierre }
  if ('id_lead_origen'       in r) delete r.id_lead_origen

  // titulo → nombre (viene de pkg_oportunidades:p_abrir_cursor_opp)
  if ('titulo' in r) { r.nombre = r.titulo; delete r.titulo }
  if ('probabilidad_cierre' in r) { r.probabilidad = r.probabilidad_cierre; delete r.probabilidad_cierre }
  if ('fecha_cierre_estimada' in r) { r.fecha_cierre = r.fecha_cierre_estimada; delete r.fecha_cierre_estimada }
  if ('motivo_cierre'         in r) delete r.motivo_cierre

  // empresa + id_empresa → cliente:{id, nombre, empresa}
  if ('id_empresa' in r || 'empresa' in r) {
    const rawEmpresa   = r.empresa
    const rawIdEmpresa = r.id_empresa
    r.cliente = {
      id:      rawIdEmpresa ?? r.cliente?.id,
      nombre:  rawEmpresa   ?? r.cliente?.nombre,
      empresa:  rawEmpresa   ?? r.cliente?.nombre,
    }
    delete r.id_empresa
    delete r.empresa
  }

  if ('ejecutivo'    in r) { r.usuario   = { nombre: r.ejecutivo }; delete r.ejecutivo }
  if ('ejecutivo_id' in r) { r.usuario = r.usuario || {}; r.usuario.id = r.ejecutivo_id; delete r.ejecutivo_id }

  // ── Leads ─────────────────────────────────────────────────────────
  if ('id_estado_lead'   in r) delete r.id_estado_lead
  if ('id_origen_lead'   in r) delete r.id_origen_lead
  if ('estado_color'     in r) delete r.estado_color
  if ('origen_color'     in r) delete r.origen_color
  if ('fecha_actualizacion' in r) delete r.fecha_actualizacion
  if ('id_oportunidad_generada' in r) delete r.id_oportunidad_generada
  if ('motivo_descalificacion' in r) delete r.motivo_descalificacion
  if ('motivo_descalificacion_obs' in r) delete r.motivo_descalificacion_obs

  if ('nombre_empresa'   in r) { r.empresa   = r.nombre_empresa; delete r.nombre_empresa }
  if ('nombre_contacto'  in r) { r.contacto   = r.nombre_contacto; delete r.nombre_contacto }
  if ('telefono_contacto' in r) { r.telefono  = r.telefono_contacto; delete r.telefono_contacto }
  if ('email_contacto'  in r) { r.email     = r.email_contacto; delete r.email_contacto }

  if ('intereses' in r && typeof r.intereses === 'string') {
    try { r.intereses = JSON.parse(r.intereses) } catch { r.intereses = [] }
  }

  // ── Clientes / Empresas ───────────────────────────────────────────
  if ('no_documento'    in r) delete r.no_documento
  if ('nuevo'            in r) delete r.nuevo
  if ('id_municipio'     in r) delete r.id_municipio
  if ('id_departamento'  in r) delete r.id_departamento
  if ('contacto_nombre'  in r) { r.contacto_nombre = r.contacto_nombre }
  if ('contacto_cargo'   in r) { r.contacto_cargo   = r.contacto_cargo }
  if ('contacto_email'   in r) { r.contacto_email   = r.contacto_email }
  if ('contacto_telefono' in r) { r.contacto_telefono = r.contacto_telefono }
  if ('contacto_tel'     in r) { r.contacto_telefono = r.contacto_tel; delete r.contacto_tel }
  if ('total_oportunidades' in r) delete r.total_oportunidades
  if ('opps_abiertas'    in r) delete r.opps_abiertas
  if ('tipo_documento'   in r) delete r.tipo_documento
  if ('modalidad'        in r) delete r.modalidad
  if ('departamento'     in r) delete r.departamento

  // ciudades
  if ('ciudad_id'        in r) { /* passthrough */ }
  if ('municipio'        in r && !'ciudad_id' in r) { /* not used */ }

  // ── Actividades ───────────────────────────────────────────────────
  if ('oportunidad_titulo' in r) { r.oportunidad = r.oportunidad_titulo; delete r.oportunidad_titulo }
  if ('lead_titulo'      in r) { r.lead_titulo   = r.lead_titulo;      delete r.lead_titulo }
  if ('oportunidad_id'   in r) { r.oportunidad   = r.oportunidad_id;  delete r.oportunidad_id }
  if ('id_oportunidad'   in r && !('oportunidad' in r)) { r.oportunidad = r.id_oportunidad; delete r.id_oportunidad }
  if ('id_lead'          in r && !('lead_id'      in r)) { r.lead_id     = r.id_lead;         delete r.id_lead }
  if ('usuario_nombre'   in r) { r.usuario = { nombre: r.usuario_nombre }; delete r.usuario_nombre }
  if ('precision_m'      in r) delete r.precision_m

  // ── Proyectos ─────────────────────────────────────────────────────
  if ('oportunidad_titulo' in r) { r.oportunidad = r.oportunidad_titulo; delete r.oportunidad_titulo }
  if ('total_hitos'     in r) delete r.total_hitos
  if ('hitos_completados' in r) delete r.hitos_completados
  if ('fecha_actualizacion' in r) delete r.fecha_actualizacion

  // ── Usuarios ──────────────────────────────────────────────────────
  if ('apex_username'   in r) delete r.apex_username
  if ('ultimo_acceso'   in r) delete r.ultimo_acceso
  if ('total_leads'      in r) delete r.total_leads
  if ('total_opps'       in r) delete r.total_opps
  if ('opps_ganadas'    in r) delete r.opps_ganadas
  if ('ventas_historico' in r) delete r.ventas_historico
  if ('actividades_mes'  in r && !('total_actividades_mes' in r)) { /* keep for stats */ }
  if ('departamento'    in r) delete r.departamento

  // ── Metas ─────────────────────────────────────────────────────────
  if ('valor_meta'       in r) { r.meta_valor  = r.valor_meta; delete r.valor_meta }
  if ('pct_cumplimiento' in r) { r.cumplimiento = r.pct_cumplimiento; delete r.pct_cumplimiento }
  if ('fecha_calculo'   in r) delete r.fecha_calculo

  // ── Alertas / Notificaciones ──────────────────────────────────────
  if ('canal'            in r) delete r.canal
  if ('fecha_lectura'    in r) delete r.fecha_lectura
  if ('origen_nombre'    in r) delete r.origen_nombre
  if ('id_lead'          in r) delete r.id_lead
  if ('id_oportunidad'   in r) delete r.id_oportunidad

  // ── Equipo ────────────────────────────────────────────────────────
  if ('leads_mes'        in r) delete r.leads_mes
  if ('opps_abiertas'    in r) delete r.opps_abiertas

  // ── Monitoreo ──────────────────────────────────────────────────────
  if ('depto'            in r) delete r.depto
  if ('comp'             in r) delete r.comp
  if ('ventas'           in r) delete r.ventas
  if ('opp'              in r) delete r.opp
  if ('leads'            in r) delete r.leads
  if ('act'              in r) delete r.act
  if ('estancados'       in r) delete r.estancados
  if ('sin_actividad'    in r) delete r.sin_actividad
  if ('estado'           in r && ['red','yellow','green'].includes(r.estado)) delete r.estado

  // ── Análisis ──────────────────────────────────────────────────────
  if ('opp_activas'      in r) delete r.opp_activas
  if ('ventas_mes'       in r) delete r.ventas_mes
  if ('ganadas_mes'      in r) delete r.ganadas_mes
  if ('perdidas_mes'     in r) delete r.perdidas_mes
  if ('tasa_conversion'  in r) delete r.tasa_conversion

// Forecast: keep charting fields (renamed below)
  if ('esperada'         in r) { /* keep */ }
  if ('optimista'        in r) { /* keep */ }
  if ('pesimista'        in r) { /* keep */ }
  if ('real'             in r) { /* keep */ }
  // Forecast APEX field names → app names (inside data array items)
  if ('forecast_ponderado' in r) { r.ponderado = r.forecast_ponderado; delete r.forecast_ponderado }
  if ('valor_bruto'      in r) { r.bruto      = r.valor_bruto;    delete r.valor_bruto }
  if ('mes'              in r) { r.month      = r.mes;           delete r.mes }
  if ('num_opps'         in r) delete r.num_opps
  if ('num_mes'          in r) delete r.num_mes
  if ('num_anio'         in r) delete r.num_anio
  if ('meses_proyectados' in r) delete r.meses_proyectados

  // ── Reportes ──────────────────────────────────────────────────────
  if ('titulo'           in r && !('nombre' in r)) { r.nombre = r.titulo; delete r.titulo }
  if ('descripcion'      in r && !('desc'   in r)) { /* passthrough */ }

  // ── Configuración ─────────────────────────────────────────────────
  if ('clave'            in r) delete r.clave
  if ('unidad'           in r) delete r.unidad

  // ── Valores discretos — estado y tipo ──────────────────────────────
  if (r.estado) {
    const estadoLower = String(r.estado).toLowerCase()
    if (ESTADO_MAP[estadoLower]) r.estado = ESTADO_MAP[estadoLower]
  }
  if (r.tipo) {
    const tipoLower = String(r.tipo).toLowerCase()
    if (TIPO_MAP[tipoLower]) r.tipo = TIPO_MAP[tipoLower]
  }

  return r
}

// Keys that contain nested records needing field mapping and lowercase
const NESTED_OBJECT_KEYS = new Set([
  'kpis',
  'actividades_proximas',
  'oportunidades',
  'leads_recientes',
  'equipo',
  'alertas',
  'hitos',
])

// Recursively process nested objects inside dashboard-style responses
const mapNestedObjects = (obj) => {
  if (!obj || typeof obj !== 'object') return obj
  for (const key of Object.keys(obj)) {
    const val = obj[key]
    if (NESTED_OBJECT_KEYS.has(key) && Array.isArray(val)) {
      obj[key] = val.map(item => mapApexFields(toLower(item)))
    } else if (val && typeof val === 'object' && !Array.isArray(val)) {
      mapNestedObjects(val)
    }
  }
  return obj
}

// Extrae el array/objeto del envelope que devuelve APEX (data/items/rows/result).
// Si no hay envelope reconocido, normaliza claves y devuelve el payload tal cual.
// Aplica mapApexFields recursivamente también a objetos anidados (dashboard).
export const unwrap = (payload) => {
  if (!payload || typeof payload !== 'object') return payload
  const envelope = payload.data ?? payload.items ?? payload.rows ?? payload.result
  let normalized
  if (envelope !== undefined) {
    normalized = toLower(envelope)
    if (Array.isArray(normalized)) {
      return normalized.map(mapApexFields)
    }
    // It's a single object — map it and also descend into nested objects
    const mapped = mapApexFields(normalized)
    return mapNestedObjects(mapped)
  } else {
    normalized = toLower(payload)
    if (Array.isArray(normalized)) {
      return normalized.map(mapApexFields)
    }
    const mapped = mapApexFields(normalized)
    return mapNestedObjects(mapped)
  }
}

// Garantiza que operaciones de lista devuelvan siempre un array,
// aunque el proceso APEX devuelva null o un objeto vacío.
export const unwrapList = (p) => {
  const r = unwrap(p)
  return Array.isArray(r) ? r : (r ? [r] : [])
}

// Garantiza que operaciones de un elemento devuelvan objeto o null.
export const unwrapSingle = (p) => {
  const r = unwrap(p)
  return Array.isArray(r) ? (r[0] ?? null) : r
}
