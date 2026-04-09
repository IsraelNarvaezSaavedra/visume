import { useState } from 'react';
import { motion } from 'motion/react';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';


export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');

  const handleLoginSubmit = (formData: { email: string; password: string }) => {
    console.log('Login submitted:', formData);
    // Aquí iría la lógica de autenticación
  };

  const handleRegisterSubmit = (formData: { name: string; email: string; password: string; confirmPassword: string }) => {
    console.log('Register submitted:', formData);
    // Aquí iría la lógica de registro
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

            {/* Formularios */}
            {mode === 'login' ? (
              <LoginForm onSubmit={handleLoginSubmit} />
            ) : (
              <RegisterForm onSubmit={handleRegisterSubmit} />
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
            { label: 'Sincronización en la nube', icon: '☁️' },
            { label: 'Currículums premium', icon: '⭐' },
            { label: 'Máxima velocidad', icon: '🌀' }
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
