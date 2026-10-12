# Dalbit · 달빛

**Abrí `index.html` con doble clic y conservá la carpeta completa.** No requiere instalación, framework, build ni servidor. También funciona por HTTP; subí toda la carpeta si lo publicás.

## Aprender y practicar

- **Aprender:** cinco tarjetas abren introducciones legibles ES/EN, con explicaciones cortas, ejemplos y audio opcional. Podés volver o elegir **Practicar este nivel**. El historial del navegador permite volver atrás.
- **Practicar:** conserva los 30 ejercicios, cinco niveles, caminante, teclado guiado y animaciones. El desglose muestra los jamo de cada bloque. Incluye el resumen diario **Tu práctica**, no Aprender.
- La primera entrada a cada nivel sin práctica registrada muestra su introducción, incluso desde pestañas, Practicar, enlaces directos o historial. **Practicar este nivel** habilita ese nivel; no hay cuenta regresiva ni bloqueos secuenciales. No se exige repetir la introducción si ese nivel ya tiene un ejercicio completado o un intento evaluado registrado.
- Idioma, tema, teclado y romanización conservan sus preferencias. Los ejercicios únicos completados se guardan por ID; errores/aciertos de la sesión no.
- El progreso anterior (`prog`) se migra mediante un mapa explícito sin modificar esa clave. El nuevo formato usa `hangul-progress-v1`. Si el navegador bloquea almacenamiento, podés jugar, pero el progreso puede no persistir.
- `hangul-unit-access-v1` guarda por nivel la aceptación del botón y los nuevos intentos evaluados, separados de ejercicios completados. Visitar, escuchar o usar controles no registra práctica. No demuestra lectura ni comprensión; los intentos incompletos anteriores sin nivel registrado no se pueden reconstruir. Sin almacenamiento, esta habilitación dura solo la visita.

## Tu práctica

Cada tecla evaluada en el juego suma un acierto o fallo, una sola vez. Shift, navegación y lecciones no cuentan. Precisión = aciertos / (aciertos + fallos); sin intentos muestra «— / Sin datos», con solo fallos muestra 0%. Hoy y ayer usan el calendario local del dispositivo, no intervalos de 24 horas. La diferencia se expresa en puntos porcentuales y muestra el volumen de ambos días, solo si ambos tienen intentos.

Se conservan **90 días calendario**, incluido hoy, en `hangul-metrics-v1`, separado de progreso/preferencias. No se inventan métricas de prácticas anteriores a esta función. Sin almacenamiento, se acumulan en memoria durante la visita; al recargar se pueden perder. Cambiar dispositivo, zona horaria u origen del sitio puede cambiar los datos/fechas disponibles. Son métricas de escritura guiada, no de dominio lingüístico.

Al volver a la ventana/pestaña se actualizan las fechas y datos. Las pestañas alternadas consultan los últimos datos antes de sumar; los intentos pendientes por fallos de guardado se conservan en memoria. No hay bloqueo entre pestañas: escrituras exactamente simultáneas pueden competir; no se promete sincronización atómica.

## Cómo escribir

Usá el teclado físico desde el área del ejercicio o tocá los botones en pantalla. Si el foco está en otro control, tocá el texto del ejercicio para volver a escribir. No necesitás instalar un teclado coreano: se verifican posiciones QWERTY (두벌식). Shift permite las letras dobles existentes; las vocales compuestas se dividen en pasos.

Es **escritura guiada**, no editor/IME de texto libre. Espacios y puntuación se saltan. Siguiente permite omitir; al completar avanza tras 1,5 segundos, salvo que salgas de Practicar. Sin intentos, precisión muestra «—».

## Alcance

Son introducciones, **no un curso completo ni evaluación de dominio**. Completar teclas no demuestra comprensión o pronunciación. El alfabeto inicial es una selección; romanización orientativa. El audio depende de una voz coreana del navegador/sistema y puede no estar disponible, incluso sin conexión. El almacenamiento de archivos locales depende del navegador y no necesariamente se comparte con la versión HTTP.

## Organización y pruebas

- `index.html` / `styles.css`: estructura y estética.
- `js/data.js`: ejercicios con IDs estables, textos bilingües y lecciones.
- `js/engine.js`: descomposición y mapa de teclas.
- `js/progress.js`: validación, migración y almacenamiento tolerante a fallos.
- `js/navigation.js`: rutas y reglas de captura del teclado.
- `js/metrics.js`: intentos diarios y comparación local.
- `js/app.js`: controlador de interfaz.

Scripts clásicos `defer`, sin `fetch` obligatorio ni módulos ES, para preservar `file://`. Pruebas de módulos puros con Node, sin dependencias:

```sh
node --test tests/*.test.cjs
```

Para agregar ejercicios, editá `js/data.js` y asigná un **ID nuevo y único**. Conservá el ID al reordenar. No cambies `ORIGINAL_IDS`: describe la versión histórica para migrar índices. Actualizá pruebas si ampliás contenido; el fixture conserva los 30 ejercicios originales.

## Fuentes

Explicaciones propias; estructura inicial/medial/final contrastada con [National Institute of Korean Language](https://www.korean.go.kr/eng_hangeul/principle/001.html). El [curso introductorio de King Sejong Institute](https://www.iksi.or.kr/lms/crse/crseApply.do?crseNo=119352) distingue consonantes, vocales y batchim, aprendizaje y ejercicios. Ejemplos y traducciones del prototipo se conservaron; no constituyen una revisión lingüística completa.
