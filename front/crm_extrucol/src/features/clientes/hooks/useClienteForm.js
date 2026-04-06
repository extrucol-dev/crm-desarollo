import { useState, useEffect } from 'react'
import { clientesAPI } from '../services/clientesAPI'
import { ciudadesAPI } from '../../../shared/services/ciudadesAPI'

const INITIAL = { nombre: '', empresa: '', sector: '', ciudad: '', telefono: '', email: '' }

const validate = (form) => {
  const e = {}
  if (!form.nombre.trim())   e.nombre   = 'El nombre es obligatorio'
  if (!form.empresa.trim())  e.empresa  = 'La empresa es obligatoria'
  if (!form.sector)          e.sector   = 'Selecciona un sector'
  if (!form.ciudad)          e.ciudad   = 'Selecciona una ciudad'
  if (!form.telefono.trim()) e.telefono = 'El teléfono es obligatorio'
  else if (!/^[0-9]{7,15}$/.test(form.telefono)) e.telefono = 'Solo números, 7-15 dígitos'
  if (!form.email.trim())    e.email    = 'El correo es obligatorio'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Correo inválido'
  return e
}

export function useClienteForm({ id, onSuccess }) {
  const [form, setForm]         = useState(INITIAL)
  const [errors, setErrors]     = useState({})
  const [loading, setLoading]   = useState(false)
  const [fetching, setFetching] = useState(false)
  const [apiError, setApiError] = useState('')
  const [ciudades, setCiudades] = useState([])

  // Cargar ciudades desde API
  useEffect(() => {
    ciudadesAPI.listar().then(setCiudades).catch(() => {})
  }, [])

  // Si hay id, cargar datos existentes
  useEffect(() => {
    if (!id) return
    setFetching(true)
    clientesAPI.buscar(id)
      .then(data => setForm({
        nombre:   data.nombre       ?? '',
        empresa:  data.empresa      ?? '',
        sector:   data.sector       ?? '',
        // ciudad viene como { id, nombre } — guardamos el id para el select
        ciudad:   data.ciudad?.id   ?? '',
        telefono: data.telefono     ?? '',
        email:    data.email        ?? '',
      }))
      .catch(() => setApiError('No se pudo cargar el cliente.'))
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
        nombre:   form.nombre,
        empresa:  form.empresa,
        sector:   form.sector,
        ciudad:   Number(form.ciudad), // API espera int
        telefono: form.telefono,
        email:    form.email,
      }
      if (id) await clientesAPI.actualizar(id, payload)
      else    await clientesAPI.crear(payload)
      onSuccess?.()
    } catch (err) {
      const msg = err.response?.data?.message ?? err.response?.data
      setApiError(typeof msg === 'string' ? msg : 'Error al guardar. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return { form, errors, loading, fetching, apiError, ciudades, setField, submit }
}
