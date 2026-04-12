import { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';

//const API_URL = 'http://isra.francecentral.cloudapp.azure.com:8080/api/auth/login';
const API_URL = 'http://localhost:8080/api/auth/login';

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones básicas en frontend
    if (!formData.email.trim() || !formData.password) {
      setError('Por favor, completa todos los campos.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const payload = {
        email: formData.email.trim(),
        contrasena: formData.password
      };

      const response = await axios.post(API_URL, payload, {
        headers: { 'Content-Type': 'application/json' },
      });

      setSuccess('Sesión iniciada correctamente.');
      //Limpiar el formulario después de un inicio de sesión exitoso
      setFormData({ email: '', password: '' });
      setShowPassword(false);

    } catch (err: any) {
      let mensaje = 'Error al iniciar sesión. Intenta nuevamente.';

      if (err.response?.data) {
        // Manejo típico de errores de Spring 
        if (typeof err.response.data === 'string') {
          mensaje = err.response.data;
        } else if (err.response.data.message) {
          mensaje = 'Error al iniciar sesión. Intenta nuevamente.';
        } else if (err.response.data.includes('unique')) {
          mensaje = 'El email o nombre de usuario ya está registrado.';
        }
        setError(mensaje);
        console.error('Error en login: ', err);
      }
      
    } finally {
      setLoading(false);
    }
  };



  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block mb-2 text-sm text-cyan-400">
          Correo electrónico
        </label>
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
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block mb-2 text-sm text-cyan-400">
          Contraseña
        </label>
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

      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            className="w-4 h-4 rounded border-cyan-500/30 bg-slate-950/50 text-cyan-500 focus:ring-cyan-500/20 focus:ring-2"
          />
          <span className="text-slate-400">Recuérdame</span>
        </label>
        <button
          type="button"
          className="text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          ¿Olvidaste tu contraseña?
        </button>
      </div>

      {/* Mensajes de feedback */}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-400 text-sm text-center pt-2"
        >
          {error}
        </motion.p>
      )}

      {success && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-green-400 text-sm text-center pt-2"
        >
          {success}
        </motion.p>
      )}

      <motion.button
        type="submit"
        whileHover={{
          scale: 1.02,
          boxShadow: '0 0 30px rgba(6, 182, 212, 0.6)'
        }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 transition-all shadow-lg shadow-cyan-500/30"
      >
        Iniciar sesión
      </motion.button>
    </form>
  );
}
