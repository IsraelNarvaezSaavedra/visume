import { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const API_URL = 'http://localhost:8080/api/auth/login';

interface LoginFormProps {
  onLoginSuccess: () => void;
}

export default function LoginForm({ onLoginSuccess }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email.trim() || !formData.password) {
      setError('Por favor, completa todos los campos.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('📤 Enviando petición...');
      const response = await axios.post(API_URL, {
        email: formData.email.trim(),
        contrasena: formData.password,
      });
      console.log('📥 Respuesta:', response.data);

      const data = response.data;
      login(data.token, {
        username: data.nombreUsuario,
        email: data.email,
        nombre: data.nombre,
        estaPagando: data.estaPagando,
      });

      console.log('✅ Redirigiendo...');
      onLoginSuccess();

    } catch (err: any) {
      console.error('❌ Error:', err);
      setError(err.response?.data || 'El correo o la contraseña son incorrectos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block mb-2 text-sm text-cyan-400">Correo electrónico</label>
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-violet-500/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative flex items-center">
            <Mail className="absolute left-4 text-slate-500 group-focus-within:text-cyan-400 transition-colors" size={20} />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="tu@email.com"
              className="w-full pl-12 pr-4 py-3 bg-slate-950/50 border border-cyan-500/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all"
              required
              disabled={loading}
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block mb-2 text-sm text-cyan-400">Contraseña</label>
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-violet-500/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative flex items-center">
            <Lock className="absolute left-4 text-slate-500 group-focus-within:text-cyan-400 transition-colors" size={20} />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full pl-12 pr-12 py-3 bg-slate-950/50 border border-cyan-500/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all"
              required
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 text-slate-500 hover:text-cyan-400 transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-400 text-sm text-center pt-2"
        >
          {error}
        </motion.p>
      )}

      <motion.button
        type="submit"
        disabled={loading}
        whileHover={{ scale: loading ? 1 : 1.02, boxShadow: '0 0 30px rgba(6, 182, 212, 0.6)' }}
        whileTap={{ scale: 0.98 }}
        className={`w-full py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-violet-600 transition-all shadow-lg shadow-cyan-500/30 text-white
          ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:from-cyan-400 hover:to-violet-500'}`}
      >
        {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
      </motion.button>
    </form>
  );
}