import { useState, useEffect, useCallback, useMemo } from 'react'
import { leadsAPI } from '../services/leadsAPI'

export const ESTADOS_ACTIVOS = ['NUEVO', 'CONTACTADO', 'CALIFICADO', 'DESCARTADO']

export const ESTADO_CONFIG = {
  NUEVO:      { label: 'Nuevo',          dot: '#3B82F6' },
  CONTACTADO: { label: 'Contactado',     dot: '#A855F7' },
  CALIFICADO: { label: 'Interesado',     dot: '#F39610' },
  DESCARTADO: { label: 'No interesado',  dot: '#EF4444' },
  CONVERTIDO: { label: 'Convertido',     dot: '#1A8754' },
}

export function useLeads() {
  const [leads, setLeads]               = useState([])
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState('')
  const [busqueda, setBusqueda]         = useState('')
  const [filtroOrigen, setFiltroOrigen] = useState('')

  const cargar = useCallback(() => {
    setLoading(true); setError('')
    leadsAPI.listar()
      .then(setLeads)
      .catch(() => setError('No se pudieron cargar los leads.'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { cargar() }, [cargar])

  const moverOptimista = useCallback((leadId, nuevoEstado) => {
    setLeads(prev =>
      prev.map(l => String(l.id) === String(leadId) ? { ...l, estado: nuevoEstado } : l)
    )
  }, [])

  const leadsFiltrados = useMemo(() => {
    let res = leads
    if (busqueda) {
      const q = busqueda.toLowerCase()
      res = res.filter(l =>
        (l.nombre ?? '').toLowerCase().includes(q) ||
        (l.empresa ?? '').toLowerCase().includes(q)
      )
    }
    if (filtroOrigen) {
      res = res.filter(l => l.origen === filtroOrigen)
    }
    return res
  }, [leads, busqueda, filtroOrigen])

  const porEstado = useMemo(() =>
    [...ESTADOS_ACTIVOS, 'CONVERTIDO'].reduce((acc, estado) => {
      acc[estado] = leadsFiltrados.filter(l => l.estado === estado)
      return acc
    }, {}),
  [leadsFiltrados])

  const totalActivos = useMemo(() =>
    leads.filter(l => !['CONVERTIDO'].includes(l.estado)).length,
  [leads])

  return {
    leads, porEstado, loading, error,
    busqueda, setBusqueda,
    filtroOrigen, setFiltroOrigen,
    totalActivos, moverOptimista, cargar,
  }
}
