// RegisterForm.tsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, AtSign, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';

const API_URL = 'http://isra.francecentral.cloudapp.azure.com:8080/api/auth/register';

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    nombre: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Limpiar mensajes al escribir
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones básicas en frontend
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (formData.username.length < 3) {
      setError('El nombre de usuario debe tener al menos 3 caracteres');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Payload que coincide exactamente con tu entidad Java
      const payload = {
        username: formData.username.trim(),
        email: formData.email.trim(),
        nombre: formData.nombre.trim(),
        contrasena: formData.password,     // ← nombre del campo en tu entidad
      };

      const response = await axios.post(API_URL, payload, {
        headers: { 'Content-Type': 'application/json' },
      });

      setSuccess('¡Cuenta creada exitosamente! Ya puedes iniciar sesión.');
      // Limpiar formulario tras éxito
      setFormData({
        username: '',
        email: '',
        nombre: '',
        password: '',
        confirmPassword: '',
      });
      setShowPassword(false);

    } catch (err: any) {
      let mensaje = 'Error al crear la cuenta. Intenta nuevamente.';

      if (err.response?.data) {
        // Manejo típico de errores de Spring (puedes personalizar según lo que devuelva tu backend)
        if (typeof err.response.data === 'string') {
          mensaje = err.response.data;
        } else if (err.response.data.message) {
          mensaje = err.response.data.message;
        } else if (err.response.data.includes('unique')) {
          mensaje = 'El email o nombre de usuario ya está registrado.';
        }
      }

      setError(mensaje);
      console.error('Error en registro:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Campo: Nombre completo */}
      <div>
        <label className="block mb-2 text-sm text-cyan-400">Nombre completo</label>
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-violet-500/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative flex items-center">
            <User className="absolute left-4 text-slate-500 group-focus-within:text-cyan-400 transition-colors" size={20} />
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Juan Pérez"
              className="w-full pl-12 pr-4 py-3 bg-slate-950/50 border border-cyan-500/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all"
              required
              disabled={loading}
            />
          </div>
        </div>
      </div>

      {/* Campo: Nombre de usuario */}
      <div>
        <label className="block mb-2 text-sm text-cyan-400">Nombre de usuario</label>
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-violet-500/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative flex items-center">
            <AtSign className="absolute left-4 text-slate-500 group-focus-within:text-cyan-400 transition-colors" size={20} />
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="juanperez123"
              className="w-full pl-12 pr-4 py-3 bg-slate-950/50 border border-cyan-500/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all"
              required
              minLength={3}
              disabled={loading}
            />
          </div>
        </div>
      </div>

      {/* Campo: Email */}
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
              placeholder="juan@example.com"
              className="w-full pl-12 pr-4 py-3 bg-slate-950/50 border border-cyan-500/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all"
              required
              disabled={loading}
            />
          </div>
        </div>
      </div>

      {/* Campo: Contraseña */}
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
              minLength={6}
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 text-slate-500 hover:text-cyan-400 transition-colors"
              disabled={loading}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>
      </div>

      <div>
  <label className="block mb-2 text-sm text-cyan-400">Confirmar contraseña</label>
  <div className="relative group">
    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-violet-500/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity" />
    <div className="relative flex items-center">
      <Lock className="absolute left-4 text-slate-500 group-focus-within:text-cyan-400 transition-colors" size={20} />
      <input
        type={showPassword ? 'text' : 'password'}
        name="confirmPassword"
        value={formData.confirmPassword}
        onChange={handleChange}
        placeholder="••••••••"
        className="w-full pl-12 pr-4 py-3 bg-slate-950/50 border border-cyan-500/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all"
        required
        minLength={6}
        disabled={loading}
      />
    </div>
  </div>
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

      {/* Botón de submit */}
      <motion.button
        type="submit"
        disabled={loading}
        whileHover={{
          scale: loading ? 1 : 1.02,
          boxShadow: loading ? 'none' : '0 0 30px rgba(6, 182, 212, 0.6)',
        }}
        whileTap={{ scale: 0.98 }}
        className={`w-full py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-violet-600 transition-all shadow-lg shadow-cyan-500/30 font-medium
          ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:from-cyan-400 hover:to-violet-500'}`}
      >
        {loading ? 'Creando cuenta...' : 'Crear cuenta'}
      </motion.button>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mt-6 text-xs text-center text-slate-500"
      >
        Al registrarte, aceptas nuestros{' '}
        <button type="button" className="text-cyan-400 hover:text-cyan-300 transition-colors">
          Términos de Servicio
        </button>{' '}
        y{' '}
        <button type="button" className="text-cyan-400 hover:text-cyan-300 transition-colors">
          Política de Privacidad
        </button>
      </motion.p>
    </form>
  );
}