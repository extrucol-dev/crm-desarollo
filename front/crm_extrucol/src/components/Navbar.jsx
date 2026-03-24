import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { usuario } = useAuth();

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <h1 className="text-sm font-medium text-gray-700">CRM Extrucol</h1>
      <span className="text-sm text-gray-500">{usuario}</span>
    </header>
  );
}
