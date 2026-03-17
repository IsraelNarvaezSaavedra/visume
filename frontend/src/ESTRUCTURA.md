# Estructura del Proyecto Visume

## 📁 Organización de Archivos

```
/
├── App.tsx                          # Componente principal de la aplicación
├── pages/                           # Páginas principales de la aplicación
│   ├── HomePage.tsx                 # Página de inicio (Hero + HowItWorks)
│   ├── GeneratorPage.tsx            # Página del generador de currículum
│   ├── EditorPage.tsx              # Página del editor de diseño
│   ├── GalleryPage.tsx             # Página de galería de ejemplos
│   └── AuthPage.tsx                # Página de autenticación (login/registro)
├── components/
│   ├── layout/                     # Componentes de layout
│   │   ├── Navbar.tsx              # Barra de navegación principal
│   │   └── Footer.tsx              # Pie de página
│   ├── homepage/                   # Componentes específicos de la homepage
│   │   ├── Hero.tsx                # Sección hero de la landing page
│   │   └── HowItWorks.tsx         # Sección "Cómo funciona"
│   ├── auth/                       # Componentes de autenticación
│   │   ├── LoginForm.tsx           # Formulario de inicio de sesión
│   │   ├── RegisterForm.tsx        # Formulario de registro
│   │   └── SocialAuth.tsx          # Botones de autenticación social
│   ├── shared/                     # Componentes compartidos
│   │   └── ParticlesBackground.tsx # Fondo animado de partículas
│   ├── Generator.tsx               # Componente del generador
│   ├── Editor.tsx                  # Componente del editor
│   ├── Gallery.tsx                 # Componente de galería
│   └── ui/                         # Componentes UI reutilizables
│       └── ...                     # (múltiples componentes UI)
└── styles/
    └── globals.css                 # Estilos globales de la aplicación
```

## 🎯 Descripción de Carpetas

### `/pages`
Contiene las páginas principales de la aplicación. Cada página representa una vista completa y puede componerse de múltiples componentes.

- **HomePage.tsx**: Landing page con Hero y sección "Cómo funciona"
- **GeneratorPage.tsx**: Interfaz para generar currículums con IA
- **EditorPage.tsx**: Editor visual para personalizar el diseño
- **GalleryPage.tsx**: Galería de ejemplos de currículums
- **AuthPage.tsx**: Sistema de autenticación (login/registro)

### `/components/layout`
Componentes de estructura que se mantienen consistentes en toda la aplicación.

- **Navbar.tsx**: Navegación principal con enlaces y menú móvil
- **Footer.tsx**: Pie de página con enlaces, newsletter y redes sociales

### `/components/homepage`
Componentes específicos usados en la página de inicio.

- **Hero.tsx**: Sección principal con título, descripción y CTA
- **HowItWorks.tsx**: Explicación del proceso en 3 pasos

### `/components/auth`
Componentes relacionados con la autenticación de usuarios.

- **LoginForm.tsx**: Formulario de inicio de sesión
- **RegisterForm.tsx**: Formulario de registro de nuevos usuarios
- **SocialAuth.tsx**: Opciones de autenticación con GitHub y Google

### `/components/shared`
Componentes reutilizables en toda la aplicación.

- **ParticlesBackground.tsx**: Animación de fondo con efecto de partículas

### `/components/ui`
Componentes de interfaz de usuario reutilizables (botones, inputs, cards, etc.)

## 🔧 Cómo Trabajar con esta Estructura

### Añadir un nuevo componente de página:
1. Crea el archivo en `/pages/NombrePage.tsx`
2. Importa los componentes necesarios
3. Exporta el componente con `export default`
4. Añade la ruta en `App.tsx`

### Añadir un componente compartido:
1. Identifica la categoría correcta (layout, homepage, auth, shared)
2. Crea el archivo en la carpeta correspondiente
3. Usa nombres descriptivos en PascalCase
4. Exporta con `export default`

### Modificar un componente existente:
1. Navega a la carpeta correspondiente
2. Edita el archivo `.tsx`
3. Los cambios se reflejarán automáticamente

## 📝 Convenciones de Nomenclatura

- **Archivos**: PascalCase para componentes (`LoginForm.tsx`)
- **Carpetas**: lowercase para categorías (`homepage/`, `auth/`)
- **Componentes**: PascalCase (`function LoginForm()`)
- **Props**: camelCase (`onSubmit`, `userName`)

## 🚀 Beneficios de esta Estructura

1. **Modularidad**: Cada componente tiene una responsabilidad clara
2. **Escalabilidad**: Fácil añadir nuevas funcionalidades
3. **Mantenibilidad**: Rápido encontrar y modificar código
4. **Legibilidad**: Estructura intuitiva y organizada
5. **Reutilización**: Componentes compartidos evitan duplicación

## 🔄 Flujo de Navegación

```
App.tsx (Main)
    ├─> Navbar (siempre visible)
    ├─> ParticlesBackground (siempre visible)
    ├─> Páginas (según sección activa)
    │   ├─> HomePage
    │   ├─> GeneratorPage
    │   ├─> EditorPage
    │   ├─> GalleryPage
    │   └─> AuthPage
    └─> Footer (siempre visible)
```

## 💡 Tips de Desarrollo

- Mantén los componentes pequeños y enfocados
- Usa TypeScript para props bien definidas
- Documenta funciones complejas
- Sigue el patrón de composición de componentes
- Utiliza Motion (Framer Motion) para animaciones consistentes
