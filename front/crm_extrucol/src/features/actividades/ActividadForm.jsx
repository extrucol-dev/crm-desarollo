import { useState } from "react";

const TIPOS = ["Llamada", "Reunión", "Email", "Visita", "Otro"];

export default function ActividadForm({ inicial = {}, oportunidades = [], onGuardar, onCancelar }) {
  const [form, setForm] = useState({
    tipo:           inicial.tipo           || "Llamada",
    oportunidadId:  inicial.oportunidadId  || "",
    descripcion:    inicial.descripcion    || "",
    fecha:          inicial.fecha          || new Date().toISOString().slice(0, 10),
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onGuardar(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
          <select name="tipo" value={form.tipo} onChange={handleChange}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            {TIPOS.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
          <input name="fecha" type="date" value={form.fecha} onChange={handleChange}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Oportunidad</label>
        <select name="oportunidadId" value={form.oportunidadId} onChange={handleChange}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">Sin oportunidad asociada</option>
          {oportunidades.map((o) => (
            <option key={o.id} value={o.id}>{o.nombre}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
        <textarea name="descripcion" value={form.descripcion} onChange={handleChange} rows={3}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
      </div>

      <div className="flex gap-3 pt-2">
        <button type="submit"
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg text-sm font-medium transition">
          Guardar
        </button>
        <button type="button" onClick={onCancelar}
          className="flex-1 border border-gray-300 text-gray-600 hover:bg-gray-50 py-2.5 rounded-lg text-sm transition">
          Cancelar
        </button>
      </div>
    </form>
  );
}
