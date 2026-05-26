import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { apiUrl } from "../config/api";

interface Foto {
  id: number;
  url: string;
  esPrincipal: boolean;
  orden: number;
}

interface Props {
  idCurriculum: number;
  esPremium: boolean;
  maxFotos: number;
  onUpgrade: () => void;
  onFotoPrincipalChange?: (url: string) => void;
  onFotosChange?: (fotos: Foto[]) => void;
}

export default function CurriculumFotos({ idCurriculum, esPremium, maxFotos, onUpgrade, onFotoPrincipalChange, onFotosChange }: Props) {
  const [fotos, setFotos] = useState<Foto[]>([]);
  const [subiendo, setSubiendo] = useState(false);
  const [subiendoPrincipal, setSubiendoPrincipal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputGaleriaRef = useRef<HTMLInputElement>(null);
  const inputPrincipalRef = useRef<HTMLInputElement>(null);
  const { token } = useAuth();

  useEffect(() => { cargarFotos(); }, [idCurriculum]);

  const cargarFotos = async () => {
    try {
      const res = await fetch(apiUrl(`/api/files/curriculum/${idCurriculum}/fotos`), {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const fotosData = await res.json();
        setFotos(fotosData);
        // Emitir callback con fotos de galería (no principales)
        if (onFotosChange) {
          const fotosGaleria = fotosData.filter((f: Foto) => !f.esPrincipal);
          onFotosChange(fotosGaleria);
        }
      }
    } catch (err) { console.error(err); }
  };

  const subirFoto = async (file: File, esPrincipal: boolean) => {
    esPrincipal ? setSubiendoPrincipal(true) : setSubiendo(true);
    setError(null);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("esPrincipal", String(esPrincipal));
      const res = await fetch(apiUrl(`/api/files/curriculum/${idCurriculum}/foto`), {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });
      if (res.ok) {
        const nueva = await res.json();
        if (esPrincipal && onFotoPrincipalChange) onFotoPrincipalChange(nueva.url);
        await cargarFotos();
      } else {
        const data = await res.json();
        setError(data.error || "Error al subir la foto");
      }
    } catch { setError("Error de red"); }
    finally { esPrincipal ? setSubiendoPrincipal(false) : setSubiendo(false); }
  };

  const eliminarFoto = async (idFoto: number) => {
    if (!confirm("¿Eliminar esta foto?")) return;
    try {
      const fotoEliminada = fotos.find(f => f.id === idFoto);
      const res = await fetch(apiUrl(`/api/files/curriculum/foto/${idFoto}`), {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        if (fotoEliminada?.esPrincipal && onFotoPrincipalChange) onFotoPrincipalChange('');
        await cargarFotos();
      } else setError("No se pudo eliminar");
    } catch { setError("Error de red"); }
  };

  const fotoPrincipal = fotos.find(f => f.esPrincipal);
  const fotosGaleria = fotos.filter(f => !f.esPrincipal);
  const limitGaleriaAlcanzado = fotosGaleria.length >= maxFotos;

  return (
    <div className="space-y-6">

      {/* — Foto de perfil — */}
      <div>
        <p className="text-sm text-slate-400 mb-3">Foto de perfil</p>
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-slate-700 flex-shrink-0">
            {fotoPrincipal ? (
              <img src={apiUrl(fotoPrincipal.url)} alt="perfil" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-500 text-2xl">?</div>
            )}
          </div>
          <div className="space-y-2">
            <button
              onClick={() => inputPrincipalRef.current?.click()}
              disabled={subiendoPrincipal}
              className="block px-4 py-2 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 text-sm hover:bg-cyan-500/30 transition-all disabled:opacity-50">
              {subiendoPrincipal ? 'Subiendo...' : fotoPrincipal ? 'Cambiar foto' : 'Subir foto'}
            </button>
            {fotoPrincipal && (
              <button onClick={() => eliminarFoto(fotoPrincipal.id)}
                className="block px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm hover:bg-red-500/20 transition-all">
                Eliminar
              </button>
            )}
          </div>
        </div>
        <input ref={inputPrincipalRef} type="file" accept="image/*" className="hidden"
          onChange={e => { if (e.target.files?.[0]) subirFoto(e.target.files[0], true); e.target.value = ''; }} />
      </div>

      {/* — Fotos de galería — solo premium — */}
      {esPremium && (
        <div>
          <p className="text-sm text-slate-400 mb-1">Fotos de galería</p>
          <p className="text-xs text-slate-600 mb-3">Proyectos, obras, trabajos... se muestran en tu portfolio</p>
          <div className="grid grid-cols-3 gap-3">
            {fotosGaleria.map(foto => (
              <div key={foto.id} className="relative group aspect-square rounded-xl overflow-hidden border border-slate-700">
                <img src={apiUrl(foto.url)} alt="galería" className="w-full h-full object-cover" />
                <button onClick={() => eliminarFoto(foto.id)}
                  className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs">
                  ✕
                </button>
              </div>
            ))}
            {!limitGaleriaAlcanzado && (
              <button
                onClick={() => inputGaleriaRef.current?.click()}
                disabled={subiendo}
                className="aspect-square rounded-xl border-2 border-dashed border-slate-700 hover:border-cyan-500/50 flex flex-col items-center justify-center gap-2 text-slate-400 hover:text-cyan-400 transition-all disabled:opacity-50">
                {subiendo ? <span className="text-xs text-cyan-400">Subiendo...</span> : <><span className="text-2xl">+</span><span className="text-xs">Añadir</span></>}
              </button>
            )}
          </div>
          <input ref={inputGaleriaRef} type="file" accept="image/*" className="hidden"
            onChange={e => { if (e.target.files?.[0]) subirFoto(e.target.files[0], false); e.target.value = ''; }} />
          <p className="text-xs text-slate-500 mt-2">{fotosGaleria.length}/{maxFotos} fotos de galería</p>
        </div>
      )}

      {!esPremium && (
        <p className="text-xs text-slate-500">
          <button onClick={onUpgrade}
            className="text-violet-400 hover:text-violet-300 underline">
            Hazte Premium
          </button>{' '}
          para añadir fotos de galería y hacer tu CV un portfolio
        </p>
      )}

      {error && <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">{error}</p>}
    </div>
  );
}