import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, User, Eye, EyeOff, Github, Chrome } from 'lucide-react';

export default function Auth() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Aquí iría la lógica de autenticación
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section className="relative min-h-screen py-24 px-4 flex items-center justify-center">
      {/* Efectos de fondo */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="relative w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          {/* Efecto de brillo */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-violet-500/20 rounded-3xl blur-xl" />

          {/* Contenedor principal */}
          <div className="relative p-8 rounded-3xl bg-slate-900/70 backdrop-blur-md border border-cyan-500/30 shadow-2xl">
            {/* Logo y título */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 10 }}
                className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center shadow-lg shadow-cyan-500/50"
              >
                <span className="text-3xl">✨</span>
              </motion.div>
              <h2 className="mb-2 text-3xl bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
                {mode === 'login' ? 'Bienvenido de nuevo' : 'Crea tu cuenta'}
              </h2>
              <p className="text-slate-400">
                {mode === 'login' 
                  ? 'Inicia sesión para continuar con Visume'
                  : 'Únete a miles de profesionales que ya usan Visume'
                }
              </p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 p-1 mb-8 rounded-xl bg-slate-950/50 border border-cyan-500/20">
              <button
                onClick={() => setMode('login')}
                className="relative flex-1 py-2 rounded-lg transition-all"
              >
                <span className={`relative z-10 ${mode === 'login' ? 'text-white' : 'text-slate-400'}`}>
                  Iniciar sesión
                </span>
                {mode === 'login' && (
                  <motion.div
                    layoutId="authTab"
                    className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-violet-600 rounded-lg shadow-lg shadow-cyan-500/30"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
              <button
                onClick={() => setMode('register')}
                className="relative flex-1 py-2 rounded-lg transition-all"
              >
                <span className={`relative z-10 ${mode === 'register' ? 'text-white' : 'text-slate-400'}`}>
                  Registrarse
                </span>
                {mode === 'register' && (
                  <motion.div
                    layoutId="authTab"
                    className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-violet-600 rounded-lg shadow-lg shadow-cyan-500/30"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <AnimatePresence mode="wait">
                {mode === 'register' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <label className="block mb-2 text-sm text-cyan-400">
                      Nombre completo
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-violet-500/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="relative flex items-center">
                        <User className="absolute left-4 text-slate-500 group-focus-within:text-cyan-400 transition-colors" size={20} />
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Juan Pérez"
                          className="w-full pl-12 pr-4 py-3 bg-slate-950/50 border border-cyan-500/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                          required={mode === 'register'}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

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

              <AnimatePresence mode="wait">
                {mode === 'register' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <label className="block mb-2 text-sm text-cyan-400">
                      Confirmar contraseña
                    </label>
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
                          required={mode === 'register'}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {mode === 'login' && (
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
                {mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
              </motion.button>
            </form>

            {/* Divisor */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
              <span className="text-sm text-slate-500">o continúa con</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
            </div>

            {/* Botones de redes sociales */}
            <div className="grid grid-cols-2 gap-3">
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center gap-2 py-3 rounded-lg bg-slate-950/50 border border-cyan-500/30 hover:border-cyan-500/50 hover:bg-slate-900/50 transition-all"
              >
                <Github size={20} />
                <span>GitHub</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center gap-2 py-3 rounded-lg bg-slate-950/50 border border-cyan-500/30 hover:border-cyan-500/50 hover:bg-slate-900/50 transition-all"
              >
                <Chrome size={20} />
                <span>Google</span>
              </motion.button>
            </div>

            {/* Términos */}
            {mode === 'register' && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-6 text-xs text-center text-slate-500"
              >
                Al registrarte, aceptas nuestros{' '}
                <button className="text-cyan-400 hover:text-cyan-300 transition-colors">
                  Términos de Servicio
                </button>
                {' '}y{' '}
                <button className="text-cyan-400 hover:text-cyan-300 transition-colors">
                  Política de Privacidad
                </button>
              </motion.p>
            )}
          </div>
        </motion.div>

        {/* Características adicionales */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 grid grid-cols-3 gap-4"
        >
          {[
            { label: 'Currículums ilimitados', icon: '∞' },
            { label: 'Sincronización en la nube', icon: '☁️' },
            { label: 'Plantillas premium', icon: '⭐' },
          ].map((feature, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-900/50 backdrop-blur-md border border-cyan-500/20 text-center"
            >
              <div className="text-2xl mb-2">{feature.icon}</div>
              <p className="text-xs text-slate-400">{feature.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}