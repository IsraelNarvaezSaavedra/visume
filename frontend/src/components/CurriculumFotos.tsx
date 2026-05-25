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
}

export default function CurriculumFotos({
  idCurriculum,
  esPremium,
  maxFotos,
}: Props) {
  const [fotos, setFotos] = useState<Foto[]>([]);
  const [subiendo, setSubiendo] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { token } = useAuth();

  useEffect(() => {
    cargarFotos();
  }, [idCurriculum]);

  // 1. Cargar fotos
  const cargarFotos = async () => {
    try {
      const res = await fetch(
        apiUrl(`/api/files/curriculum/${idCurriculum}/fotos`),
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (res.ok) {
        setFotos(await res.json());
      }
    } catch (err) {
      console.error("Error al cargar fotos:", err);
    }
  };

  // 2. Subir foto
  const subirFoto = async (file: File) => {
    setSubiendo(true);
    setError(null);

    try {
      const form = new FormData();
      form.append("file", file);
      form.append("esPrincipal", String(fotos.length === 0));

      const res = await fetch(
        apiUrl(`/api/files/curriculum/${idCurriculum}/foto`),
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: form,
        },
      );

      if (res.ok) {
        await cargarFotos();
      } else {
        const data = await res.json();
        setError(data.error || "Error al subir la foto");
      }
    } catch (err) {
      setError("Error de red al intentar subir la foto");
    } finally {
      setSubiendo(false);
    }
  };

  // 3. Eliminar foto
  const eliminarFoto = async (idFoto: number) => {
    if (!confirm("¿Seguro que quieres eliminar esta foto?")) return;

    try {
      const res = await fetch(apiUrl(`/api/files/curriculum/foto/${idFoto}`), {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        await cargarFotos();
      } else {
        setError("No se pudo eliminar la foto");
      }
    } catch (err) {
      setError("Error de red al intentar eliminar la foto");
    }
  };

  const limitAlcanzado = fotos.length >= maxFotos;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        {fotos.map((foto) => (
          <div
            key={foto.id}
            className="relative group aspect-square rounded-xl overflow-hidden border border-slate-700"
          >
            <img
              src={apiUrl(foto.url)}
              alt="Foto CV"
              className="w-full h-full object-cover"
            />
            {foto.esPrincipal && (
              <span className="absolute top-1 left-1 bg-cyan-500 text-white text-xs px-2 py-0.5 rounded-full">
                Principal
              </span>
            )}
            <button
              onClick={() => eliminarFoto(foto.id)}
              className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs"
            >
              ✕
            </button>
          </div>
        ))}

        {!limitAlcanzado && (
          <button
            className="aspect-square rounded-xl border-2 border-dashed border-slate-700 hover:border-cyan-500/50 flex flex-col items-center justify-center gap-2 text-slate-400 hover:text-cyan-400 transition-all disabled:opacity-50"
            onClick={() => inputRef.current?.click()}
            disabled={subiendo}
          >
            {subiendo ? (
              <span className="text-xs text-cyan-400">Subiendo...</span>
            ) : (
              <>
                <span className="text-2xl">+</span>
                <span className="text-xs">Añadir foto</span>
              </>
            )}
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.[0]) subirFoto(e.target.files[0]);
          e.target.value = "";
        }}
      />

      <p className="text-xs text-slate-500">
        {fotos.length}/{maxFotos} foto{maxFotos > 1 ? "s" : ""}
        {!esPremium && (
          <span>
            {" · "}
            <button
              onClick={() => alert("Portal de pago próximamente 🚀")}
              className="text-violet-400 hover:text-violet-300 underline"
            >
              Hazte Premium
            </button>{" "}
            para añadir hasta 6 fotos y hacer tu CV un portfolio
          </span>
        )}
      </p>

      {error && (
        <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
          {error}
        </p>
      )}
    </div>
  );
}
