import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import { apiUrl } from '../../config/api';
import { Users, FileText, Trash2, Shield, CreditCard, User, Check, X, AlertTriangle, Crown, Sparkles } from 'lucide-react';
import axios from 'axios';

interface AdminUsuario {
  username: string;
  email: string;
  nombre: string;
  rol: 'USUARIO' | 'ADMINISTRADOR';
  estaPagando: boolean;
  fechaRegistro: string;
  numCurriculums: number;
}

interface AdminCurriculum {
  id: number;
  titulo: string;
  fechaCreacion: string;
  username: string;
}

export default function AdminPanel() {
  const { token, usuario } = useAuth();
  const [activeTab, setActiveTab] = useState<'usuarios' | 'curriculums'>('usuarios');
  
  const [usuarios, setUsuarios] = useState<AdminUsuario[]>([]);
  const [curriculums, setCurriculums] = useState<AdminCurriculum[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [confirmDeleteUser, setConfirmDeleteUser] = useState<string | null>(null);
  const [confirmDeleteCv, setConfirmDeleteCv] = useState<number | null>(null);

  useEffect(() => {
    cargarDatos();
  }, [activeTab]);

  const cargarDatos = async () => {
    setLoading(true);
    setError(null);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      if (activeTab === 'usuarios') {
        const res = await axios.get(apiUrl('/api/admin/usuarios'), { headers });
        setUsuarios(res.data);
      } else {
        const res = await axios.get(apiUrl('/api/admin/curriculums'), { headers });
        setCurriculums(res.data);
      }
    } catch (e: any) {
      setError(e.response?.data || 'Error cargando datos');
    } finally {
      setLoading(false);
    }
  };

  const showSuccess = (msg: string) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(null), 3000);
  };

  const toggleUserRole = async (targetUsername: string, currentRole: string) => {
    if (targetUsername === usuario?.username) {
      setError('No puedes quitarte el rol de administrador');
      return;
    }
    try {
      const newRole = currentRole === 'ADMINISTRADOR' ? 'USUARIO' : 'ADMINISTRADOR';
      await axios.put(apiUrl(`/api/admin/usuarios/${targetUsername}`), 
        { rol: newRole }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showSuccess(`Rol actualizado para ${targetUsername}`);
      cargarDatos();
    } catch (e: any) {
      setError(e.response?.data || 'Error actualizando rol');
    }
  };

  const toggleUserPlan = async (targetUsername: string, isPremium: boolean) => {
    try {
      await axios.put(apiUrl(`/api/admin/usuarios/${targetUsername}`), 
        { estaPagando: !isPremium }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showSuccess(`Plan actualizado para ${targetUsername}`);
      cargarDatos();
    } catch (e: any) {
      setError(e.response?.data || 'Error actualizando plan');
    }
  };

  const handleEliminarUsuario = async (targetUsername: string) => {
    try {
      await axios.delete(apiUrl(`/api/admin/usuarios/${targetUsername}`), {
        headers: { Authorization: `Bearer ${token}` }
      });
      showSuccess(`Usuario ${targetUsername} eliminado`);
      setConfirmDeleteUser(null);
      cargarDatos();
    } catch (e: any) {
      setError(e.response?.data || 'Error eliminando usuario');
    }
  };

  const handleEliminarCurriculum = async (id: number) => {
    try {
      await axios.delete(apiUrl(`/api/admin/curriculums/${id}`), {
        headers: { Authorization: `Bearer ${token}` }
      });
      showSuccess(`Curriculum ${id} eliminado`);
      setConfirmDeleteCv(null);
      cargarDatos();
    } catch (e: any) {
      setError(e.response?.data || 'Error eliminando curriculum');
    }
  };

  if (usuario?.rol !== 'ADMINISTRADOR') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 bg-red-500/10 border border-red-500/30 rounded-2xl max-w-md">
          <AlertTriangle className="mx-auto mb-4 text-red-500" size={48} />
          <h2 className="text-xl font-bold text-red-400 mb-2">Acceso Denegado</h2>
          <p className="text-red-300">No tienes permisos para ver esta página.</p>
        </div>
      </div>
    );
  }

  return (
    <section className="relative min-h-screen py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">
            Panel de Administración
          </h1>
          <p className="text-slate-400">
            Gestiona los usuarios y curriculums de la plataforma.
          </p>
        </motion.div>

        <AnimatePresence>
          {success && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="mb-6 p-4 rounded-xl bg-green-500/20 border border-green-500/40 text-green-300 flex items-center gap-2 text-sm">
              <Check size={16} /> {success}
            </motion.div>
          )}
          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="mb-6 p-4 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 flex items-center gap-2 text-sm">
              <X size={16} /> {error}
              <button onClick={() => setError(null)} className="ml-auto"><X size={14} /></button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tabs */}
        <div className="flex gap-2 p-1 mb-8 rounded-xl bg-slate-900/50 border border-cyan-500/20 max-w-md">
          {[
            { id: 'usuarios' as const, icon: Users, label: 'Usuarios' },
            { id: 'curriculums' as const, icon: FileText, label: 'Curriculums' },
          ].map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className="relative flex-1 flex items-center justify-center gap-2 py-3 rounded-lg transition-all text-sm font-medium">
              <span className={`relative z-10 flex items-center gap-2 ${activeTab === tab.id ? "text-white" : "text-slate-400"}`}>
                <tab.icon size={16} /> {tab.label}
              </span>
              {activeTab === tab.id && (
                <motion.div layoutId="adminTab" className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-violet-600 rounded-lg"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }} />
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-slate-900/70 backdrop-blur-md border border-cyan-500/30 rounded-2xl overflow-hidden shadow-2xl">
          {loading ? (
            <div className="p-12 flex justify-center">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="w-10 h-10 rounded-full border-4 border-cyan-500/20 border-t-cyan-500" />
            </div>
          ) : activeTab === 'usuarios' ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-950/50 border-b border-cyan-500/30">
                    <th className="p-4 text-sm font-medium text-cyan-400">Usuario</th>
                    <th className="p-4 text-sm font-medium text-cyan-400">Email</th>
                    <th className="p-4 text-sm font-medium text-cyan-400">Rol</th>
                    <th className="p-4 text-sm font-medium text-cyan-400">Plan</th>
                    <th className="p-4 text-sm font-medium text-cyan-400">CVs</th>
                    <th className="p-4 text-sm font-medium text-cyan-400 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {usuarios.map(u => (
                    <motion.tr key={u.username} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-slate-800/30 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
                            <User size={14} />
                          </div>
                          <div>
                            <div className="font-medium text-white">{u.username}</div>
                            <div className="text-xs text-slate-500">{new Date(u.fechaRegistro).toLocaleDateString('es-ES')}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-slate-300">{u.email}</td>
                      <td className="p-4">
                        <button onClick={() => toggleUserRole(u.username, u.rol)}
                          disabled={u.username === usuario?.username}
                          title={u.username === usuario?.username ? 'No puedes cambiar tu propio rol' : ''}
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
                            u.rol === 'ADMINISTRADOR' 
                              ? 'bg-violet-500/20 text-violet-300 border-violet-500/30 hover:bg-violet-500/30' 
                              : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
                          } ${u.username === usuario?.username ? 'opacity-50 cursor-not-allowed' : ''}`}>
                          <Shield size={12} /> {u.rol}
                        </button>
                      </td>
                      <td className="p-4">
                        <button onClick={() => toggleUserPlan(u.username, u.estaPagando)}
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
                            u.estaPagando 
                              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30 hover:bg-cyan-500/30' 
                              : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
                          }`}>
                          {u.estaPagando ? <Crown size={12} /> : <Sparkles size={12} />}
                          {u.estaPagando ? 'Premium' : 'Free'}
                        </button>
                      </td>
                      <td className="p-4 text-sm text-slate-300">
                        <span className="flex items-center gap-1">
                          <FileText size={14} className="text-slate-500" /> {u.numCurriculums}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        {confirmDeleteUser === u.username ? (
                          <div className="flex items-center justify-end gap-2">
                            <span className="text-red-400 text-xs">¿Seguro?</span>
                            <button onClick={() => handleEliminarUsuario(u.username)} className="text-red-400 hover:text-red-300 text-xs font-bold px-2">Sí</button>
                            <button onClick={() => setConfirmDeleteUser(null)} className="text-slate-400 hover:text-slate-300 text-xs px-2">No</button>
                          </div>
                        ) : (
                          <button onClick={() => setConfirmDeleteUser(u.username)} disabled={u.username === usuario?.username}
                            className={`p-2 rounded-lg border transition-all ${
                              u.username === usuario?.username 
                                ? 'border-slate-800 text-slate-600 cursor-not-allowed' 
                                : 'border-red-500/30 text-red-400 hover:border-red-500/50 hover:bg-red-500/10'
                            }`}>
                            <Trash2 size={16} />
                          </button>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                  {usuarios.length === 0 && (
                    <tr><td colSpan={6} className="p-8 text-center text-slate-500">No hay usuarios</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-950/50 border-b border-cyan-500/30">
                    <th className="p-4 text-sm font-medium text-cyan-400">ID</th>
                    <th className="p-4 text-sm font-medium text-cyan-400">Título</th>
                    <th className="p-4 text-sm font-medium text-cyan-400">Propietario</th>
                    <th className="p-4 text-sm font-medium text-cyan-400">Fecha</th>
                    <th className="p-4 text-sm font-medium text-cyan-400 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {curriculums.map(cv => (
                    <motion.tr key={cv.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-slate-800/30 transition-colors">
                      <td className="p-4 text-sm text-slate-400">#{cv.id}</td>
                      <td className="p-4 font-medium text-white">{cv.titulo}</td>
                      <td className="p-4 text-sm">
                        <span className="bg-slate-800/50 text-slate-300 px-2 py-1 rounded-md">@{cv.username}</span>
                      </td>
                      <td className="p-4 text-sm text-slate-400">
                        {new Date(cv.fechaCreacion).toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </td>
                      <td className="p-4 text-right">
                        {confirmDeleteCv === cv.id ? (
                          <div className="flex items-center justify-end gap-2">
                            <span className="text-red-400 text-xs">¿Seguro?</span>
                            <button onClick={() => handleEliminarCurriculum(cv.id)} className="text-red-400 hover:text-red-300 text-xs font-bold px-2">Sí</button>
                            <button onClick={() => setConfirmDeleteCv(null)} className="text-slate-400 hover:text-slate-300 text-xs px-2">No</button>
                          </div>
                        ) : (
                          <button onClick={() => setConfirmDeleteCv(cv.id)}
                            className="p-2 rounded-lg border border-red-500/30 text-red-400 hover:border-red-500/50 hover:bg-red-500/10 transition-all">
                            <Trash2 size={16} />
                          </button>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                  {curriculums.length === 0 && (
                    <tr><td colSpan={5} className="p-8 text-center text-slate-500">No hay curriculums</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
