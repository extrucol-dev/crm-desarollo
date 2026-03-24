import { useNavigate } from "react-router-dom";

export default function NoAutorizado() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <h1 className="text-6xl font-semibold text-gray-300">403</h1>
      <p className="text-gray-500 mt-2 text-lg">No tienes permiso para ver esta página.</p>
      <button
        onClick={() => navigate(-1)}
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition"
      >
        Volver
      </button>
    </div>
  );
}
