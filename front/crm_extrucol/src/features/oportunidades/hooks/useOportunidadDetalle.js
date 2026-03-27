import { useState, useEffect, useCallback } from 'react'
import { oportunidadesAPI } from '../services/oportunidadesAPI'
import { ESTADO_SIGUIENTE, ESTADOS_CERRADOS } from './useOportunidades'

export function useOportunidadDetalle(id) {
  const [oportunidad, setOportunidad] = useState(null)
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState('')
  const [avanzando, setAvanzando]     = useState(false)
  const [cerrando, setCerrando]       = useState(false)
  const [actionError, setActionError] = useState('')

  const cargar = useCallback(() => {
    if (!id) return
    setLoading(true); setError('')
    oportunidadesAPI.buscar(id)
      .then(setOportunidad)
      .catch(() => setError('No se pudo cargar la oportunidad.'))
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => { cargar() }, [cargar])

  const esCerrada = oportunidad ? ESTADOS_CERRADOS.includes(oportunidad.estado) : false
  const siguienteEstado = oportunidad ? ESTADO_SIGUIENTE[oportunidad.estado] : null

  // CE-17: avanzar al siguiente estado del pipeline
  const avanzar = async () => {
    if (!siguienteEstado || esCerrada) {
      setActionError('Esta oportunidad no puede avanzar de estado.')
      return
    }
    setAvanzando(true); setActionError('')
    try {
      const updated = await oportunidadesAPI.avanzarEstado(id, siguienteEstado)
      setOportunidad(updated)
    } catch {
      setActionError('No se pudo avanzar el estado. Intenta de nuevo.')
    } finally {
      setAvanzando(false)
    }
  }

  // CE-18: cerrar como ganada o perdida
  const cerrar = async ({ estado, fecha_cierre, motivo_cierre }) => {
    if (esCerrada) {
      setActionError('Esta oportunidad ya está cerrada.')
      return
    }
    setCerrando(true); setActionError('')
    try {
      const updated = await oportunidadesAPI.cerrar(id, { estado, fecha_cierre, motivo_cierre })
      setOportunidad(updated)
      return true
    } catch {
      setActionError('No se pudo cerrar la oportunidad. Intenta de nuevo.')
      return false
    } finally {
      setCerrando(false)
    }
  }

  return {
    oportunidad, loading, error,
    esCerrada, siguienteEstado,
    avanzando, cerrando, actionError, setActionError,
    avanzar, cerrar, cargar,
  }
}
