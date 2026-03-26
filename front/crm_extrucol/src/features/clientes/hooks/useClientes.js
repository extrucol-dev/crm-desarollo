import { useState, useEffect, useCallback } from 'react'
import { clientesAPI } from '../services/clientesAPI'

export function useClientes() {
  const [clientes, setClientes] = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState('')
  const [busqueda, setBusqueda] = useState('')
  const [sector, setSector]     = useState('')

  const cargar = useCallback(() => {
    setLoading(true)
    setError('')
    clientesAPI.listar()
      .then(setClientes)
      .catch(() => setError('No se pudieron cargar los clientes.'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { cargar() }, [cargar])

  const sectores = [...new Set(clientes.map((c) => c.sector).filter(Boolean))]

  const filtrados = clientes.filter((c) => {
    const q = busqueda.toLowerCase()
    return (
      (!busqueda || c.nombre?.toLowerCase().includes(q) || c.empresa?.toLowerCase().includes(q)) &&
      (!sector || c.sector === sector)
    )
  })

  return { filtrados, loading, error, sectores, busqueda, setBusqueda, sector, setSector, cargar }
}
