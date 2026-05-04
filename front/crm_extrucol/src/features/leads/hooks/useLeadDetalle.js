import { useState, useEffect, useCallback } from 'react'
import { leadsAPI } from '../services/leadsAPI'

export function useLeadDetalle(id) {
  const [lead, setLead]         = useState(null)
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState('')
  const [saving, setSaving]     = useState(false)
  const [apiError, setApiError] = useState('')

  const cargar = useCallback(() => {
    if (!id) return
    setLoading(true); setError('')
    leadsAPI.buscar(id)
      .then(setLead)
      .catch(() => setError('No se pudo cargar el lead.'))
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => { cargar() }, [cargar])

  const cambiarEstado = useCallback(async (estado) => {
    setSaving(true); setApiError('')
    try {
      await leadsAPI.cambiarEstado(id, estado)
      setLead(prev => ({ ...prev, estado }))
      return true
    } catch {
      setApiError('No se pudo cambiar el estado.')
      return false
    } finally {
      setSaving(false)
    }
  }, [id])

  const guardar = useCallback(async (datos) => {
    setSaving(true); setApiError('')
    try {
      await leadsAPI.actualizar(id, datos)
      setLead(prev => ({ ...prev, ...datos }))
      return true
    } catch {
      setApiError('No se pudo guardar el lead.')
      return false
    } finally {
      setSaving(false)
    }
  }, [id])

  const convertir = useCallback(async (datos) => {
    setSaving(true); setApiError('')
    try {
      const result = await leadsAPI.convertir(id, datos)
      return result
    } catch {
      setApiError('No se pudo convertir el lead.')
      return null
    } finally {
      setSaving(false)
    }
  }, [id])

  return {
    lead, loading, error,
    saving, apiError,
    cambiarEstado, guardar, convertir, cargar,
  }
}
