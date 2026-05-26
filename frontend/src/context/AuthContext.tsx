import { createContext, useContext, useState, ReactNode } from 'react';
import { apiUrl } from '../config/api';

interface Usuario {
  username: string;
  email: string;
  nombre: string;
  estaPagando: boolean;
  rol: string;
  maxFotosCv?: number;
}

interface AuthContextType {
  usuario: Usuario | null;
  token: string | null;
  plan: 'free' | 'premium' | null;
  maxFotosCv: number;
  login: (token: string, usuario: Usuario) => void;
  logout: () => void;
  setPlan: (plan: 'free' | 'premium') => void;
  refreshUsuario: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('visume_token')
  );
  const [usuario, setUsuario] = useState<Usuario | null>(() => {
    const saved = localStorage.getItem('visume_usuario');
    return saved ? JSON.parse(saved) : null;
  });
  const plan: 'free' | 'premium' | null = usuario
  ? (usuario.estaPagando ? 'premium' : 'free')
  : null;
  const maxFotosCv = usuario?.maxFotosCv ?? (plan === 'premium' ? 6 : 1);

  const login = (newToken: string, newUsuario: Usuario) => {
    setToken(newToken);
    setUsuario(newUsuario);
    localStorage.setItem('visume_token', newToken);
    localStorage.setItem('visume_usuario', JSON.stringify(newUsuario));
  };

  const logout = () => {
    setToken(null);
    setUsuario(null);
    localStorage.removeItem('visume_token');
    localStorage.removeItem('visume_usuario');
  };

  const setPlan = (newPlan: 'free' | 'premium') => {
  setUsuario(prev => {
    if (!prev) return prev;
    const updated = { ...prev, estaPagando: newPlan === 'premium' };
    localStorage.setItem('visume_usuario', JSON.stringify(updated));
    return updated;
  });
};

  const refreshUsuario = async () => {
    if (!token) return;

    const res = await fetch(apiUrl('/api/perfil'), {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      throw new Error('No se pudo refrescar el usuario');
    }

    const perfil = await res.json();
    const updated: Usuario = {
      username: perfil.username,
      email: perfil.email,
      nombre: perfil.nombre,
      estaPagando: perfil.estaPagando,
      rol: perfil.rol,
      maxFotosCv: perfil.estaPagando ? 6 : 1,
    };

    setUsuario(updated);
    localStorage.setItem('visume_usuario', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{
      usuario,
      token,
      plan,
      maxFotosCv,
      login,
      logout,
      setPlan,
      refreshUsuario,
      isAuthenticated: !!token,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}