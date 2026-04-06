import { useState, useEffect } from 'react'
import { actividadesAPI } from '../services/actividadesAPI'

const TIPOS = ['VISITA', 'REUNION', 'LLAMADA', 'COTIZACION', 'PRESENTACION', 'DEMOSTRACION']

const INITIAL = {
  tipo:            '',
  descripcion:     '',
  virtual:         false,
  fecha_actividad: '',
  oportunidad:     '',
}

const validate = (form) => {
  const e = {}
  if (!form.tipo)                  e.tipo        = 'Selecciona un tipo'
  if (!form.descripcion.trim())    e.descripcion = 'La descripción es obligatoria'
  if (form.descripcion.length < 10) e.descripcion = 'Mínimo 10 caracteres'
  if (!form.fecha_actividad)       e.fecha_actividad = 'La fecha es obligatoria'
  if (!form.oportunidad)           e.oportunidad = 'La oportunidad es obligatoria'
  return e
}

export function useActividadForm({ id, oportunidadIdInicial, onSuccess }) {
  const [form, setForm]         = useState({ ...INITIAL, oportunidad: oportunidadIdInicial ?? '' })
  const [errors, setErrors]     = useState({})
  const [loading, setLoading]   = useState(false)
  const [fetching, setFetching] = useState(false)
  const [apiError, setApiError] = useState('')

  // Si hay id, cargar datos para edición (CE-31)
  useEffect(() => {
    if (!id) return
    setFetching(true)
    actividadesAPI.buscar(id)
      .then(a => setForm({
        tipo:            a.tipo             ?? '',
        descripcion:     a.descripcion      ?? '',
        virtual:         a.virtual          ?? false,
        fecha_actividad: a.fecha_actividad?.slice(0, 16) ?? '',
        oportunidad:     a.oportunidad?.id  ?? '',
      }))
      .catch(() => setApiError('No se pudo cargar la actividad.'))
      .finally(() => setFetching(false))
  }, [id])

  const setField = (field) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm(f => ({ ...f, [field]: val }))
    setErrors(er => ({ ...er, [field]: '' }))
  }

  const submit = async (e) => {
    e.preventDefault(); setApiError('')
    const errs = validate(form)
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    try {
      const payload = {
        ...form,
        // fecha_actividad debe ser ISO 8601 con segundos
        fecha_actividad: new Date(form.fecha_actividad).toISOString(),
      }
      if (id) await actividadesAPI.actualizar(id, payload)
      else    await actividadesAPI.crear(payload)
      onSuccess?.()
    } catch (err) {
      const msg = err.response?.data?.message ?? err.response?.data
      setApiError(typeof msg === 'string' ? msg : 'Error al guardar la actividad.')
    } finally {
      setLoading(false)
    }
  }

  return { form, errors, loading, fetching, apiError, setField, submit, TIPOS }
}
