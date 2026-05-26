import { useState } from 'react';
import { motion } from 'motion/react';
import { Crown, Loader2, CreditCard, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiUrl } from '../config/api';

interface StripeCheckoutProps {
  onClose: () => void;
}

export default function StripeCheckout({ onClose }: StripeCheckoutProps) {
  const { token, usuario } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(apiUrl('/api/stripe/checkout'), {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      // Redirige a Stripe
      window.location.href = data.url;
    } catch (e: any) {
      setError(e.message);
      setLoading(false);
    }
  };

  const handlePortal = async () => {
    setLoading(true);
    try {
      const res = await fetch(apiUrl('/api/stripe/portal'), {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      window.location.href = data.url;
    } catch (e: any) {
      setError(e.message);
      setLoading(false);
    }
  };

  const isPremium = usuario?.estaPagando;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md p-8 rounded-3xl bg-slate-900 border border-violet-500/30 shadow-2xl shadow-violet-500/20 relative">

        <button onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors">
          <X size={20} />
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-violet-500/30">
            <Crown size={32} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            {isPremium ? 'Gestionar suscripción' : 'Hazte Premium'}
          </h2>
          <p className="text-slate-400 text-sm">
            {isPremium
              ? 'Gestiona o cancela tu suscripción desde el portal de Stripe'
              : 'Desbloquea todas las funciones de Visume'}
          </p>
        </div>

        {!isPremium && (
          <div className="space-y-3 mb-8">
            {[
              'Hasta 3 curriculums simultáneos',
              'Templates animados premium',
              'Hasta 6 fotos de galería',
              'URL personalizada',
              'Sin marca de agua',
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 text-slate-300 text-sm">
                <div className="w-5 h-5 rounded-full bg-violet-500/20 border border-violet-500/40 flex items-center justify-center flex-shrink-0">
                  <span className="text-violet-400 text-xs">✓</span>
                </div>
                {feature}
              </div>
            ))}
          </div>
        )}

        {!isPremium && (
          <div className="text-center mb-6">
            <span className="text-4xl font-bold text-white">9.99€</span>
            <span className="text-slate-400 text-sm">/mes</span>
            <p className="text-slate-500 text-xs mt-1">Cancela cuando quieras</p>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-sm">
            {error}
          </div>
        )}

        {isPremium ? (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handlePortal}
            disabled={loading}
            className="w-full py-4 rounded-xl bg-slate-800 border border-slate-700 hover:border-violet-500/50 text-white transition-all flex items-center justify-center gap-2">
            {loading ? <Loader2 className="animate-spin" size={20} /> : <CreditCard size={20} />}
            Gestionar suscripción
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.02, boxShadow: '0 0 40px rgba(139,92,246,0.4)' }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCheckout}
            disabled={loading}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white font-semibold transition-all flex items-center justify-center gap-2 shadow-lg shadow-violet-500/30 disabled:opacity-70">
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Crown size={20} />}
            {loading ? 'Redirigiendo a Stripe...' : 'Suscribirse ahora'}
          </motion.button>
        )}
      </motion.div>
    </div>
  );
}