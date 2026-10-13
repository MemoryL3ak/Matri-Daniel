# Matrimonio Daniel & Macarena · Sitio informativo

Página estática (HTML + CSS + JS, sin frameworks ni build) con toda la información del evento:
fecha y cuenta regresiva, lugares con mapa, itinerario, dress code, botón de regalo con datos
de transferencia (copiables) y confirmación de asistencia por WhatsApp.

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
| WhatsApp de confirmación y fecha límite | `confirmacion` (`activo: false` oculta la sección) |

> El desfase horario de Chile es `-03:00` en horario de verano y `-04:00` en invierno.
> La página formatea la fecha automáticamente en español y calcula la cuenta regresiva.

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
