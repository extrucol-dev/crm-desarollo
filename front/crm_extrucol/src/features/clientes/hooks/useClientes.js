import { useState, useEffect, useCallback, useMemo } from 'react'
import { clientesAPI } from '../services/clientesAPI'

export function useClientes() {
  const [clientes, setClientes] = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState('')
  const [busqueda, setBusqueda] = useState('')
  const [sector, setSector]     = useState('')
  const [ciudad, setCiudad]     = useState('')

  const cargar = useCallback(() => {
    setLoading(true); setError('')
    clientesAPI.listar()
      .then(setClientes)
      .catch(() => setError('No se pudieron cargar los clientes.'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { cargar() }, [cargar])

  // Extraer valores únicos — ciudad viene como { id, nombre }
  const sectores = useMemo(() =>
    [...new Set(clientes.map(c => c.sector).filter(Boolean))].sort(), [clientes])

  const ciudades = useMemo(() =>
    [...new Map(clientes
      .filter(c => c.ciudad?.id)
      .map(c => [c.ciudad.id, c.ciudad.nombre])
    ).entries()].map(([id, nombre]) => ({ id, nombre }))
    .sort((a, b) => a.nombre.localeCompare(b.nombre)), [clientes])

  // CE-27: filtro por búsqueda, sector y ciudad (client-side)
  const filtrados = useMemo(() => clientes.filter(c => {
    const q = busqueda.toLowerCase()
    const matchBusqueda = !q ||
      c.nombre?.toLowerCase().includes(q) ||
      c.empresa?.toLowerCase().includes(q)
    const matchSector = !sector || c.sector === sector
    const matchCiudad = !ciudad || String(c.ciudad?.id) === String(ciudad)
    return matchBusqueda && matchSector && matchCiudad
  }), [clientes, busqueda, sector, ciudad])

  return { clientes, filtrados, loading, error, sectores, ciudades,
    busqueda, setBusqueda, sector, setSector, ciudad, setCiudad, cargar }
}
