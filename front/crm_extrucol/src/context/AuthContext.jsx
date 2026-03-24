import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token,   setToken]   = useState(null);
  const [rol,     setRol]     = useState(null);
  const [usuario, setUsuario] = useState(null);

  const login = (token, rol, usuario) => {
    setToken(token);
    setRol(rol);
    setUsuario(usuario);
  };

  const logout = () => {
    setToken(null);
    setRol(null);
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ token, rol, usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
