import { useState } from "react";

export default function ProyectoForm({ inicial = {}, onGuardar, onCancelar }) {
  const [form, setForm] = useState({
    nombre:       inicial.nombre       || "",
    descripcion:  inicial.descripcion  || "",
    fechaInicio:  inicial.fechaInicio  || "",
    fechaCierre:  inicial.fechaCierre  || "",
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onGuardar(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del proyecto</label>
        <input name="nombre" value={form.nombre} onChange={handleChange} required
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
        <textarea name="descripcion" value={form.descripcion} onChange={handleChange} rows={3}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fecha inicio</label>
          <input name="fechaInicio" type="date" value={form.fechaInicio} onChange={handleChange}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fecha cierre</label>
          <input name="fechaCierre" type="date" value={form.fechaCierre} onChange={handleChange}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
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
