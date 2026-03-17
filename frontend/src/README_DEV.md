# Visume - Guía Rápida para Desarrolladores

## 🚀 Nueva Estructura de Proyecto

El proyecto ha sido reorganizado para mejorar la legibilidad y facilitar el mantenimiento. Aquí está todo lo que necesitas saber:

## 📂 Estructura Simplificada

### Páginas (`/pages`)
```
HomePage.tsx       → Landing page principal
GeneratorPage.tsx  → Generador de currículum con IA
EditorPage.tsx     → Editor de diseño y personalización
GalleryPage.tsx    → Galería de ejemplos
AuthPage.tsx       → Sistema de login y registro
```

### Componentes por Categoría

#### Layout (`/components/layout`)
```
Navbar.tsx  → Navegación principal
Footer.tsx  → Pie de página
```

#### Homepage (`/components/homepage`)
```
Hero.tsx        → Banner principal
HowItWorks.tsx  → Sección "Cómo funciona"
```

#### Autenticación (`/components/auth`)
```
LoginForm.tsx     → Formulario de login
RegisterForm.tsx  → Formulario de registro
SocialAuth.tsx    → Botones de Google/GitHub
```

#### Compartidos (`/components/shared`)
```
ParticlesBackground.tsx  → Fondo animado de partículas
```

#### Componentes Base
```
/components/Generator.tsx  → Lógica del generador
/components/Editor.tsx     → Lógica del editor
/components/Gallery.tsx    → Lógica de la galería
```

## 🔧 Cómo Trabajar

### Editar una Página
```typescript
// Ir a /pages/HomePage.tsx
import Hero from '../components/homepage/Hero';
import HowItWorks from '../components/homepage/HowItWorks';

export default function HomePage({ onGetStarted }) {
  return (
    <>
      <Hero onGetStarted={onGetStarted} />
      <HowItWorks />
    </>
  );
}
```

### Crear un Nuevo Componente

**Ejemplo: Agregar un componente de Testimonios**

1. Crear archivo en la carpeta apropiada:
```bash
/components/homepage/Testimonials.tsx
```

2. Escribir el componente:
```typescript
export default function Testimonials() {
  return <section>...</section>;
}
```

3. Importar en la página:
```typescript
import Testimonials from '../components/homepage/Testimonials';
```

### Modificar el Sistema de Navegación

**Archivo:** `/App.tsx`

```typescript
// Agregar nueva sección
const [currentSection, setCurrentSection] = useState("home");

// En el render:
{currentSection === "nueva-seccion" && <NuevaSeccionPage />}
```

**Archivo:** `/components/layout/Navbar.tsx`

```typescript
// Agregar nuevo enlace en el menú
{ id: "nueva-seccion", label: "Nueva Sección" }
```

## 🎨 Estándares de Código

### Nombres de Archivos
- Componentes: `PascalCase.tsx` → `LoginForm.tsx`
- Carpetas: `lowercase` → `homepage/`, `auth/`

### Estructura de Componente
```typescript
import { useState } from 'react';
import { motion } from 'motion/react';

interface ComponentProps {
  onAction: () => void;
}

export default function Component({ onAction }: ComponentProps) {
  const [state, setState] = useState('');

  return (
    <section className="relative">
      {/* Contenido */}
    </section>
  );
}
```

## 📦 Importaciones

### Rutas Relativas
```typescript
// Desde /pages/HomePage.tsx
import Hero from '../components/homepage/Hero';

// Desde /components/auth/LoginForm.tsx
import { Mail } from 'lucide-react';
```

### Assets e Imágenes
```typescript
// Imagen Figma
import logo from 'figma:asset/1d2887d0560c03701e2c49da822f19698caa5d77.png';

// SVG importado
import svgPaths from './imports/svg-wg56ef214f';
```

## 🎯 Componentes Clave

### App.tsx
- **Función**: Punto de entrada principal
- **Responsabilidad**: Gestión de navegación y estado global
- **Renderiza**: Navbar, ParticlesBackground, páginas actuales, Footer

### Navbar
- **Ubicación**: `/components/layout/Navbar.tsx`
- **Función**: Navegación entre secciones
- **Props**: `currentSection`, `scrollToSection`, etc.

### AuthPage
- **Ubicación**: `/pages/AuthPage.tsx`
- **Función**: Login/Registro
- **Componentes**: LoginForm, RegisterForm, SocialAuth

## 🔄 Flujo de Datos

```
App.tsx (Estado global)
    ↓
Navbar (Navegación)
    ↓
Páginas (Estado de sección activa)
    ↓
Componentes (Props específicos)
```

## 💡 Tips Rápidos

### Añadir una nueva página:
1. Crear archivo en `/pages/NombrePage.tsx`
2. Importar en `/App.tsx`
3. Añadir caso en el switch de renderizado
4. Actualizar Navbar si es necesario

### Añadir animaciones:
```typescript
import { motion } from 'motion/react';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  Contenido
</motion.div>
```

### Estilos Tailwind consistentes:
- Background: `bg-slate-950`, `bg-slate-900/70`
- Borders: `border-cyan-500/30`
- Gradientes: `from-cyan-400 to-violet-400`
- Efectos: `backdrop-blur-md`, `shadow-lg shadow-cyan-500/30`

## 🐛 Debugging

### Problema: Componente no se renderiza
- ✅ Verificar importación correcta
- ✅ Revisar export default
- ✅ Comprobar props requeridas

### Problema: Estilos no se aplican
- ✅ Verificar clases Tailwind
- ✅ Revisar `/styles/globals.css`
- ✅ Comprobar conflictos de z-index

## 📚 Recursos

- **Tailwind CSS**: https://tailwindcss.com/docs
- **Motion (Framer Motion)**: https://motion.dev
- **Lucide Icons**: https://lucide.dev
- **TypeScript**: https://www.typescriptlang.org/docs

---

¿Preguntas? Revisa el archivo `/ESTRUCTURA.md` para más detalles.
