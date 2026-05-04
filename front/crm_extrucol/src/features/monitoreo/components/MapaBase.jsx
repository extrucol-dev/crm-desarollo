import 'leaflet/dist/leaflet.css'
import { divIcon } from 'leaflet'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import { useEffect } from 'react'

// Fixes Leaflet's broken default icon URLs in Vite/Webpack bundles
// by switching every marker to divIcon, so we never touch the PNG paths.

export function createPinIcon(color, text) {
  return divIcon({
    className: '',
    html: `<div style="
      width:32px;height:32px;border-radius:50%;
      background:${color};border:3px solid #fff;
      box-shadow:0 2px 8px rgba(0,0,0,.25);
      display:flex;align-items:center;justify-content:center;
      color:#fff;font-size:11px;font-weight:700;font-family:Roboto,sans-serif;
    ">${text}</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -18],
  })
}

// Allows externally changing the map view after mount
function FlyToController({ center, zoom }) {
  const map = useMap()
  useEffect(() => {
    if (center) map.flyTo(center, zoom ?? map.getZoom(), { duration: 0.8 })
  }, [center, zoom, map])
  return null
}

export default function MapaBase({ center, zoom = 6, style, className, flyTo, flyZoom, children }) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={style ?? { height: '100%', width: '100%' }}
      className={className}
      scrollWheelZoom
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {flyTo && <FlyToController center={flyTo} zoom={flyZoom} />}
      {children}
    </MapContainer>
  )
}

export { Marker, Popup }
