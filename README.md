# 🎮 GameVault

Biblioteca personal de videojuegos para **agregar juegos, puntuarlos del 1 al 10 y escribir reseñas**. Hecha con Next.js, TypeScript y Tailwind CSS, lista para desplegar en Vercel.

![stack](https://img.shields.io/badge/Next.js-16-black) ![stack](https://img.shields.io/badge/React-19-blue) ![stack](https://img.shields.io/badge/Tailwind-4-38bdf8)

## ✨ Qué incluye

- Agregar juegos uno por uno con título, plataforma, género, año, portada y estado (terminado / jugando / pendiente).
- Cargar la **primera reseña con puntuación** en el mismo formulario de alta.
- Ficha de cada juego con promedio, datos y todas sus reseñas.
- Agregar y eliminar reseñas (con autor, nota del 1 al 10 y texto).
- Editar y eliminar juegos.
- Buscador por título/género, filtros por estado y plataforma, y orden por fecha, puntuación o título.
- Estadísticas generales: juegos, reseñas, promedio y juegos en curso.
- **Exportar / importar** toda la biblioteca en JSON (respaldo).
- Diseño responsive, modo oscuro y datos de ejemplo en la primera visita.

## 🚀 Ejecutar en local

Requiere Node.js 20.9 o superior.

```bash
npm install
npm run dev
```

Abrí http://localhost:3000

Para probar la versión de producción:

```bash
npm run build
npm start
```

## ☁️ Desplegar en Vercel

### Opción A: desde GitHub (recomendado)

1. Creá un repositorio en GitHub y subí este proyecto:

   ```bash
   git add .
   git commit -m "GameVault"
   git branch -M main
   git remote add origin https://github.com/TU-USUARIO/TU-REPO.git
   git push -u origin main
   ```

2. Entrá a [vercel.com/new](https://vercel.com/new) e importá el repositorio.
3. Vercel detecta **Next.js** automáticamente. No hace falta configurar nada más.
4. Presioná **Deploy**. Listo. 🎉

### Opción B: desde la terminal

```bash
npm i -g vercel
vercel
```

Seguí las instrucciones (el framework se detecta solo). Para producción:

```bash
vercel --prod
```

## 💾 Dónde se guardan los datos

La app guarda todo en el **`localStorage` del navegador**, así que:

- Funciona en Vercel sin base de datos, variables de entorno ni configuración.
- Cada navegador/dispositivo tiene su propia biblioteca (no se sincroniza entre dispositivos).
- Si borrás los datos del navegador, se pierde la biblioteca: usá **Exportar** para bajar un respaldo JSON y **Importar** para restaurarlo.
- En la primera visita se cargan 5 juegos de ejemplo; podés eliminarlos y agregar los tuyos.

### ¿Querés que los datos se compartan entre dispositivos?

El proyecto está separado en capas para que sea fácil: toda la persistencia está en `lib/storage.ts`. Podés reemplazar esas funciones por llamadas a una base de datos (por ejemplo **Neon Postgres**, **Supabase** o **Vercel Postgres**) y crear rutas de API en `app/api/`. La UI no necesita cambios.

## 🗂️ Estructura

```
app/
  layout.tsx          Fuentes, metadata y estilos globales
  page.tsx            Página principal
  globals.css         Tailwind, fondo y animaciones
components/
  game-vault.tsx      Estado principal, filtros, stats y acciones
  game-card.tsx       Tarjeta del juego en la grilla
  game-form-modal.tsx Formulario para agregar / editar juegos
  game-detail-modal.tsx Ficha con reseñas
  review-form.tsx     Formulario de reseña
  score-picker.tsx    Selector de nota 1-10
  score-badge.tsx     Badge de puntuación
  cover.tsx           Portada con imagen o fallback generado
  modal.tsx           Modal accesible reutilizable
lib/
  types.ts            Tipos, plataformas, géneros y estados
  storage.ts          Lectura/escritura y validación de datos
  seed.ts             Datos de ejemplo
  utils.ts            Helpers (promedios, colores, fechas...)
```

## 🎨 Personalizar

- **Colores/estilo**: clases de Tailwind en los componentes y variables en `app/globals.css`.
- **Plataformas, géneros y estados**: `lib/types.ts`.
- **Datos de ejemplo**: `lib/seed.ts`.
- **Nombre de la app**: `app/layout.tsx` y la cabecera en `components/game-vault.tsx`.

---

Hecho para calificar juegos sin complicaciones. 🕹️
