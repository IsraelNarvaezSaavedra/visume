const raw = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim()
  || 'http://localhost:8080';

export const API_BASE_URL = raw.replace(/\/$/, '');

export function apiUrl(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  if (API_BASE_URL === '/api') {
    return normalized.startsWith('/api/') || normalized === '/api'
      ? normalized
      : `/api${normalized}`;
  }
  if (API_BASE_URL === '' || API_BASE_URL === '/') {
    return normalized;
  }
  return `${API_BASE_URL}${normalized}`;
}

// Función para obtener las fotos de un currículum
export async function getFotosCurriculum(idCurriculum: string | number) {
  const res = await fetch(apiUrl(`/api/files/curriculum/${idCurriculum}/fotos`));
  if (!res.ok) throw new Error('Error al obtener las fotos');
  return res.json();
}

// Función para obtener la foto principal de un currículum
export async function getFotoCurriculum(idCurriculum: string | number) {
  const res = await fetch(apiUrl(`/api/files/curriculum/${idCurriculum}/foto`));
  if (!res.ok) throw new Error('Error al obtener la foto');
  return res.json();
}

// Función para obtener una foto específica por su ID de foto
export async function getFotoPorId(idFoto: string | number) {
  const res = await fetch(apiUrl(`/api/files/curriculum/foto/${idFoto}`));
  if (!res.ok) throw new Error('Error al obtener la foto por ID');
  return res.json();
}