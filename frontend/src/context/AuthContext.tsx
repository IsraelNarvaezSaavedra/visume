import { createContext, useContext, useState, ReactNode } from 'react';

interface Usuario {
  username: string;
  email: string;
  nombre: string;
  estaPagando: boolean;
}

interface AuthContextType {
  usuario: Usuario | null;
  token: string | null;
  plan: 'free' | 'premium' | null;
  login: (token: string, usuario: Usuario) => void;
  logout: () => void;
  setPlan: (plan: 'free' | 'premium') => void;
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
  const [plan, setPlanState] = useState<'free' | 'premium' | null>(() => {
    return localStorage.getItem('visume_plan') as 'free' | 'premium' | null;
  });

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
    setPlanState(newPlan);
    localStorage.setItem('visume_plan', newPlan);
  };

  return (
    <AuthContext.Provider value={{
      usuario,
      token,
      plan,
      login,
      logout,
      setPlan,
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