import { useState, useEffect } from 'react'
import { usuariosAPI } from '../services/usuariosAPI'
import { authService } from '../../auth/services/authService'

const INITIAL = { nombre: '', email: '', password: '', rol: '', activo: true }

const validate = (form, isEdit) => {
  const e = {}
  if (!form.nombre.trim() || form.nombre.trim().length < 5)
    e.nombre = 'El nombre debe tener al menos 5 caracteres'
  if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    e.email = 'Correo electrónico inválido'
  if (!isEdit && (!form.password || form.password.length < 6))
    e.password = 'La contraseña debe tener al menos 6 caracteres'
  if (!form.rol)
    e.rol = 'Selecciona un rol'
  return e
}

export function useUsuarioForm({ id, onSuccess }) {
  const [form, setForm]         = useState(INITIAL)
  const [errors, setErrors]     = useState({})
  const [loading, setLoading]   = useState(false)
  const [fetching, setFetching] = useState(false)
  const [apiError, setApiError] = useState('')

  const myId = (() => {
    try {
      const payload = JSON.parse(atob(authService.getToken().split('.')[1]))
      return payload.id ?? payload.sub
    } catch { return null }
  })()

  useEffect(() => {
    if (!id) return
    setFetching(true)
    usuariosAPI.buscar(id)
      .then(data => setForm({ nombre: data.nombre, email: data.email, password: '', rol: data.rol, activo: data.activo }))
      .catch(() => setApiError('No se pudo cargar el usuario.'))
      .finally(() => setFetching(false))
  }, [id])

  const setField = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm(f => ({ ...f, [field]: value }))
    setErrors(er => ({ ...er, [field]: '' }))
    // CE-22: advertir si el admin intenta cambiar su propio rol
    if (field === 'rol' && id && String(id) === String(myId)) {
      setApiError('No puedes cambiar tu propio rol.')
      return
    }
    if (field !== 'rol') setApiError('')
  }

  const submit = async (e) => {
    e.preventDefault()
    // CE-22: bloquear autoedición de rol
    if (id && String(id) === String(myId) && form.rol !== (form._originalRol ?? form.rol)) {
      setApiError('No puedes cambiar tu propio rol.'); return
    }
    setApiError('')
    const errs = validate(form, !!id)
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    try {
      const payload = { nombre: form.nombre, email: form.email, rol: form.rol, activo: form.activo }
      if (!id || form.password) payload.password = form.password
      if (id) await usuariosAPI.actualizar(id, payload)
      else    await usuariosAPI.crear({ ...payload, activo: true })
      onSuccess?.()
    } catch (err) {
      const msg = err.response?.data?.message ?? err.response?.data
      setApiError(typeof msg === 'string' ? msg : 'Error al guardar. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return { form, errors, loading, fetching, apiError, setField, submit, myId }
}
