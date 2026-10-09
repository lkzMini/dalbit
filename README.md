# 한글 0→Hero — Aprende coreano desde cero

Web estática de **un solo archivo** (`index.html`): sin dependencias, sin build, sin servidor, sin frameworks. Pesa ~20 KB y funciona offline.

## Qué incluye
- **Aprender**: ruta 0→Hero, cómo se arma una sílaba, tablas de vocales/consonantes (con la tecla a presionar) y consejos.
- **Practicar** (minijuego): aparece texto en Hangul + romanización + traducción. Mientras escribes, el 🚶 camina hacia la 🏁. Teclado en pantalla que resalta la próxima tecla (con Shift cuando hace falta).
- **5 niveles**: Letras → Palabras → Frases → Oraciones → Textos largos.
- **Modo Claro/Oscuro** (respeta tu sistema por defecto) e **idioma ES/EN** (se guardan en tu navegador).
- Botón 🔊 para escuchar la pronunciación (voz coreana del navegador/sistema, si está disponible).

## Cómo funciona escribir (importante)
No necesitas teclado coreano instalado. La web usa la distribución estándar coreana (두벌식): tú presionas la tecla física de cada letra (jamo) **en orden** y la web arma las sílabas. Vocales compuestas = 2 pasos (ㅘ = ㅗ + ㅏ). Shift para ㄲ ㄸ ㅃ ㅆ ㅉ ㅒ ㅖ. En móvil puedes tocar el teclado en pantalla.

## Paso a paso
1. Descarga la carpeta `hangul-hero`.
2. Abre `index.html` con doble clic. ¡Listo!
3. (Opcional) Servidor local: `python -m http.server 8000` dentro de la carpeta y abre `http://localhost:8000`.

## Publicarla gratis
- **GitHub Pages**: sube `index.html` a un repo → Settings → Pages → rama `main`.
- **Netlify / Cloudflare Pages**: arrastra la carpeta al panel. Sin configuración.

## Agregar contenido (¡para practicar horas!)
En `index.html`, busca `const DATA=[` y añade líneas a cualquier nivel con el formato:

```js
["한국어", "hangugeo", "idioma coreano", "Korean language"]
// [texto Hangul, romanización, español, inglés]
```
Puedes pegar textos tan largos como quieras; el motor descompone cualquier sílaba Hangul automáticamente. Para un nivel nuevo, agrega `{es:"Nombre",en:"Name",items:[...]}`.

## Ideas para la v2
Progreso guardado por nivel y rachas diarias, modo cronómetro (PPM), repaso espaciado, reconocimiento de gramática (partículas, conjugaciones), ejercicios de lectura con audio, PWA instalable y archivos de contenido JSON separados.
