import { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

interface LoginFormProps {
  onSubmit: (formData: { email: string; password: string }) => void;
}

export default function LoginForm({ onSubmit }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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
