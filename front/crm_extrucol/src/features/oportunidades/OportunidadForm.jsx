import { useState } from "react";

const ETAPAS = ["Prospección", "Calificación", "Propuesta", "Negociación", "Cierre"];

export default function OportunidadForm({ inicial = {}, clientes = [], onGuardar, onCancelar }) {
  const [form, setForm] = useState({
    nombre:     inicial.nombre     || "",
    clienteId:  inicial.clienteId  || "",
    valor:      inicial.valor      || "",
    etapa:      inicial.etapa      || "Prospección",
    fechaCierre: inicial.fechaCierre || "",
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onGuardar(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
        <input name="nombre" value={form.nombre} onChange={handleChange} required
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
        <select name="clienteId" value={form.clienteId} onChange={handleChange} required
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">Seleccionar cliente</option>
          {clientes.map((c) => (
            <option key={c.id} value={c.id}>{c.nombre}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Valor estimado</label>
          <input name="valor" type="number" value={form.valor} onChange={handleChange}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de cierre</label>
          <input name="fechaCierre" type="date" value={form.fechaCierre} onChange={handleChange}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Etapa</label>
        <select name="etapa" value={form.etapa} onChange={handleChange}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          {ETAPAS.map((e) => <option key={e} value={e}>{e}</option>)}
        </select>
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
