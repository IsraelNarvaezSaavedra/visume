import { motion } from 'motion/react';
import { Github, Chrome } from 'lucide-react';

export default function SocialAuth() {
  return (
    <>
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
    </>
  );
}
