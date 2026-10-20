# Matrimonio Daniel & Macarena · Sitio informativo

Página estática (HTML + CSS + JS, sin frameworks ni build) con toda la información del evento:
fecha y cuenta regresiva, lugares con mapa, itinerario, dress code, botón de regalo con datos
de transferencia (copiables) y formulario de confirmación de asistencia que guarda cada
respuesta en un Google Sheet.

## Editar los datos

Todo el contenido vive en **`js/config.js`**. No hay que tocar el HTML para cambiar:

| Qué | Dónde en `config.js` |
|---|---|
| Nombres, título y hashtag | `novios`, `titulo`, `hashtag` |
| Fecha y hora | `fechaISO` (formato `AAAA-MM-DDTHH:MM:SS-03:00`) |
| Ceremonia / celebración (hora, lugar, dirección, nota) | `ceremonia`, `celebracion` (deja `celebracion: null` si es un solo lugar) |
| Itinerario | `itinerario` (iconos: `anillos`, `copa`, `cena`, `musica`, `pin`, `reloj`) |
| Dress code y paleta sugerida | `dressCode` (`null` oculta la sección) |
| Datos de transferencia | `regalo` (`activo: false` oculta la sección) |
| Formulario de confirmación, fecha límite, opciones de restricción alimentaria y URL del receptor | `confirmacion` (`activo: false` oculta la sección) |

> El desfase horario de Chile es `-03:00` en horario de verano y `-04:00` en invierno.
> La página formatea la fecha automáticamente en español y calcula la cuenta regresiva.

## Confirmaciones en Google Sheets

El formulario envía el nombre a una pequeña aplicación web de Google Apps Script que vive
dentro de tu propia planilla. No necesita claves, servidores ni costo.

Planilla de confirmaciones:
<https://docs.google.com/spreadsheets/d/1anfGP-TPqsR7KoyffS252epXb-ps6txWp3cFjpom8t0/edit>
(su ID ya está en `ID_PLANILLA` dentro de `Codigo.gs`; si algún día usas otra planilla, cámbialo ahí).

Configuración (una sola vez, con la cuenta de Google dueña de la planilla):

1. Abre la planilla con el enlace de arriba.
2. En la planilla ve a **Extensiones → Apps Script**. Borra el contenido del editor y pega
   el código de [`google-apps-script/Codigo.gs`](google-apps-script/Codigo.gs). Guarda (icono de disquete).
   - Opcional: en la barra superior elige la función `probarEscritura` y pulsa **Ejecutar**.
     Google pedirá autorización (acepta "ir a proyecto no verificado"; es tu propio script) y
     aparecerá una fila de prueba en la pestaña **Confirmaciones**, que puedes borrar después.
3. Arriba a la derecha: **Implementar → Nueva implementación**.
   - Tipo (engranaje): **Aplicación web**.
   - Ejecutar como: **Yo**.
   - Quién tiene acceso: **Cualquier usuario**.
   - Pulsa **Implementar** y autoriza el acceso cuando Google lo pida (acepta "ir a proyecto no verificado"; es tu propio script).
4. Copia la **URL de la aplicación web** (termina en `/exec`) y pégala en `js/config.js`:

   ```js
   confirmacion: {
     endpoint: "https://script.google.com/macros/s/AKfycb.../exec",
   ```

5. Vuelve a desplegar el sitio (`vercel --prod`). Cada confirmación aparece como una fila nueva
   en la pestaña **Confirmaciones** con la fecha, el nombre y la restricción alimentaria.
   La pestaña se crea sola en el primer envío (si la "Hoja 1" está vacía, se renombra en vez de crear otra).

Para probar que el receptor está activo, abre la URL `/exec` en el navegador: debe responder
`{"ok":true,"mensaje":"Receptor de confirmaciones activo","version":"..."}`, con la misma versión
que `VERSION_RECEPTOR` en `Codigo.gs`. Si la versión no aparece o es otra, el código nuevo no está publicado.

> Si más adelante modificas `Codigo.gs`, guardar no basta: hay que publicar una **nueva versión**
> de la implementación existente: Implementar → Administrar implementaciones → lápiz → Versión: Nueva
> → Implementar. La URL no cambia. No uses "Nueva implementación": crea otra URL que el sitio no usa.

Detalles del formulario:

- Valida que el nombre tenga al menos 3 letras y muestra estados de envío, éxito y error.
- Incluye un campo trampa invisible para bots; si llega lleno, el script ignora el envío.
- Recuerda en el navegador del invitado que ya confirmó, y le ofrece "Confirmar a otra persona".
- Muestra el agradecimiento al instante y guarda en segundo plano; si el guardado falla, vuelve
  al formulario con el nombre escrito y un aviso para reintentar.
- Apps Script tarda varios segundos en responder la primera vez tras estar inactivo, así que la
  página lo "despierta" con una petición GET cuando el invitado llega a la sección de confirmación.

## Paleta y tipografías

Variables en `css/styles.css` (`:root`):

- Marfil `#F6F0E6` · Crema `#FBF8F2` · Verde bosque `#223A2F` · Salvia `#93A88A`
- Oro viejo `#B6935A` · Oro claro `#D8C39C` · Rosa empolvado `#D8B4A3`
- Display: Cormorant Garamond · Script: Pinyon Script · Texto: Jost (Google Fonts)

## Probar en local

```bash
npx serve .
```

(o simplemente abre `index.html` en el navegador).

## Dos direcciones, una sola página

- `https://matri-daniel.vercel.app/` → invitación completa, con la sección de regalo.
- `https://matri-daniel.vercel.app/invitacion` → la misma invitación **sin** la sección de regalo
  (ni su enlace en la barra), para los invitados a quienes no se les quiere pedir regalo.

Es el mismo `index.html`: `vercel.json` reescribe `/invitacion` a la raíz y `js/main.js` oculta
la sección cuando la ruta coincide con `regalo.rutaSinRegalo` de `config.js`. Las confirmaciones
de ambas direcciones llegan a la misma planilla. En local (`python -m http.server`) la ruta
`/invitacion` no existe; se prueba en Vercel.

## Desplegar en Vercel

```bash
vercel login          # solo la primera vez
vercel                # crea el proyecto y hace un deploy de prueba
vercel --prod         # deploy a producción
```

No requiere configuración de framework: Vercel sirve los archivos estáticos tal cual.

El CSS y el JavaScript se publican sin caché larga (`vercel.json`), así que cada visita recibe
la última versión. Los enlaces en `index.html` llevan `?v=...`: si cambias algo importante,
sube ese número para forzar la descarga en navegadores que tengan una copia antigua.
