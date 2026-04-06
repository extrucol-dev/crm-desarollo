import { useState, useEffect } from 'react'
import { oportunidadesAPI } from '../services/oportunidadesAPI'
import { clientesAPI } from '../../clientes/services/clientesAPI'
import { ESTADOS_CERRADOS } from './useOportunidades'

const INITIAL = {
  nombre:         '',
  descripcion:    '',
  tipo:           '',
  cliente:        '',
  valor_estimado: '',
  fecha_cierre:   '',
  motivo_cierre:  '',
  estado:         'PROSPECTO',
}

const validate = (form) => {
  const e = {}
  if (!form.nombre.trim())      e.nombre         = 'El nombre es obligatorio'
  if (!form.cliente)            e.cliente        = 'Selecciona un cliente'
  if (!form.tipo)               e.tipo           = 'Selecciona un tipo'
  if (!form.descripcion.trim()) e.descripcion    = 'La descripción es obligatoria'
  if (!form.valor_estimado || isNaN(form.valor_estimado) || Number(form.valor_estimado) <= 0)
                                e.valor_estimado = 'Ingresa un valor estimado válido'
  return e
}

export function useOportunidadForm({ id, clienteIdInicial, onSuccess }) {
  const [form, setForm]         = useState({ ...INITIAL, cliente: clienteIdInicial ?? '' })
  const [errors, setErrors]     = useState({})
  const [loading, setLoading]   = useState(false)
  const [fetching, setFetching] = useState(false)
  const [apiError, setApiError] = useState('')
  const [clientes, setClientes] = useState([])
  const [cerrada, setCerrada]   = useState(false)

  useEffect(() => {
    clientesAPI.listar().then(setClientes).catch(() => {})
  }, [])

  useEffect(() => {
    if (!id) return
    setFetching(true)
    oportunidadesAPI.buscar(id)
      .then(op => {
        setCerrada(ESTADOS_CERRADOS.includes(op.estado))
        setForm({
          nombre:         op.nombre         ?? '',
          descripcion:    op.descripcion    ?? '',
          tipo:           op.tipo           ?? '',
          cliente:        op.cliente?.id    ?? '',
          valor_estimado: op.valor_estimado ?? '',
          fecha_cierre:   op.fecha_cierre   ?? '',
          motivo_cierre:  op.motivo_cierre  ?? '',
          estado:         op.estado         ?? 'PROSPECTO',
        })
      })
      .catch(() => setApiError('No se pudo cargar la oportunidad.'))
      .finally(() => setFetching(false))
  }, [id])

  const setField = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.value }))
    setErrors(er => ({ ...er, [field]: '' }))
  }

  const submit = async (e) => {
    e.preventDefault(); setApiError('')
    const errs = validate(form)
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    try {
      const payload = {
        nombre:         form.nombre,
        descripcion:    form.descripcion,
        tipo:           form.tipo,
        estado:         form.estado,
        cliente:        Number(form.cliente),
        valor_estimado: Number(form.valor_estimado),
        fecha_cierre:   form.fecha_cierre || undefined,
        motivo_cierre:  form.motivo_cierre || undefined,
      }
      if (id) await oportunidadesAPI.actualizar(id, payload)
      else    await oportunidadesAPI.crear(payload)
      onSuccess?.()
    } catch (err) {
      const msg = err.response?.data?.message ?? err.response?.data
      setApiError(typeof msg === 'string' ? msg : 'Error al guardar. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return { form, errors, loading, fetching, apiError, clientes, cerrada, setField, submit }
}
