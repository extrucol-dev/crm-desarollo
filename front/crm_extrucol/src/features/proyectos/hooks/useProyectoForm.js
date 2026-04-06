import { useState, useEffect } from 'react'
import { proyectosAPI } from '../services/proyectosAPI'

const INITIAL = { nombre: '', descripcion: '', estado: 'ACTIVO', oportunidad: '' }

const validate = (form) => {
  const e = {}
  if (!form.nombre.trim())          e.nombre      = 'El nombre es obligatorio'
  if (!form.descripcion.trim())     e.descripcion = 'La descripción es obligatoria'
  if (form.descripcion.length < 10) e.descripcion = 'Mínimo 10 caracteres'
  if (!form.oportunidad)            e.oportunidad = 'La oportunidad es obligatoria'
  return e
}

export function useProyectoForm({ id, oportunidadId, onSuccess }) {
  const [form, setForm]         = useState({ ...INITIAL, oportunidad: oportunidadId ?? '' })
  const [errors, setErrors]     = useState({})
  const [loading, setLoading]   = useState(false)
  const [fetching, setFetching] = useState(false)
  const [apiError, setApiError] = useState('')

  useEffect(() => {
    if (!id) return
    setFetching(true)
    proyectosAPI.buscar(id)
      .then(p => setForm({
        nombre:      p.nombre      ?? '',
        descripcion: p.descripcion ?? '',
        estado:      p.estado      ?? 'ACTIVO',
        oportunidad: p.oportunidad?.id ?? '',
      }))
      .catch(() => setApiError('No se pudo cargar el proyecto.'))
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
      if (id) await proyectosAPI.actualizar(id, form)
      else    await proyectosAPI.crear(form)
      onSuccess?.()
    } catch (err) {
      const msg = err.response?.data?.message ?? err.response?.data
      setApiError(typeof msg === 'string' ? msg : 'Error al guardar el proyecto.')
    } finally {
      setLoading(false)
    }
  }

  return { form, errors, loading, fetching, apiError, setField, submit }
}
