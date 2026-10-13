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
| Frase de invitación | `frase` |
| Ceremonia / celebración (hora, lugar, dirección, nota) | `ceremonia`, `celebracion` (deja `celebracion: null` si es un solo lugar) |
| Itinerario | `itinerario` (iconos: `anillos`, `copa`, `cena`, `musica`, `pin`, `reloj`) |
| Dress code y paleta sugerida | `dressCode` |
| Datos de transferencia | `regalo` (`activo: false` oculta la sección) |
| Formulario de confirmación, fecha límite y URL del receptor | `confirmacion` (`activo: false` oculta la sección) |

> El desfase horario de Chile es `-03:00` en horario de verano y `-04:00` en invierno.
> La página formatea la fecha automáticamente en español y calcula la cuenta regresiva.

## Confirmaciones en Google Sheets

El formulario envía el nombre a una pequeña aplicación web de Google Apps Script que vive
dentro de tu propia planilla. No necesita claves, servidores ni costo. Configuración (una sola vez):

1. Crea un Google Sheet nuevo, por ejemplo **"Confirmaciones matrimonio"**.
2. En la planilla ve a **Extensiones → Apps Script**. Borra el contenido del editor y pega
   el código de [`google-apps-script/Codigo.gs`](google-apps-script/Codigo.gs). Guarda (icono de disquete).
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
   en la hoja **Confirmaciones** con fecha, nombre, dominio de origen y navegador.

Para probar que el receptor está activo, abre la URL `/exec` en el navegador: debe responder
`{"ok":true,"mensaje":"Receptor de confirmaciones activo"}`.

> Si más adelante modificas `Codigo.gs`, hay que publicar una **nueva versión**:
> Implementar → Administrar implementaciones → lápiz → Versión: Nueva → Implementar. La URL no cambia.

Detalles del formulario:

- Valida que el nombre tenga al menos 3 letras y muestra estados de envío, éxito y error.
- Incluye un campo trampa invisible para bots; si llega lleno, el script ignora el envío.
- Recuerda en el navegador del invitado que ya confirmó, y le ofrece "Confirmar a otra persona".

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

## Desplegar en Vercel

```bash
vercel login          # solo la primera vez
vercel                # crea el proyecto y hace un deploy de prueba
vercel --prod         # deploy a producción
```

No requiere configuración de framework: Vercel sirve los archivos estáticos tal cual.
