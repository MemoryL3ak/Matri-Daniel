/* =====================================================================
   DATOS DEL EVENTO · Daniel & Macarena
   ---------------------------------------------------------------------
   Este es el ÚNICO archivo que necesitas editar para cambiar textos,
   fecha, lugares, itinerario y datos de transferencia.
   Guarda y vuelve a desplegar (vercel --prod) y listo.
   ===================================================================== */
window.BODA = {

  /* ------------------------------------------------------------ Novios */
  novios: {
    novio: "Daniel",
    novia: "Macarena",
  },
  // Cómo aparece el título en la página, pestaña del navegador y redes
  titulo: "Daniel & Macarena",
  hashtag: "#DanielYMacarena",

  /* ------------------------------------------------------- Fecha y hora */
  // Formato: AAAA-MM-DDTHH:MM:SS seguido del desfase horario de Chile:
  //   -03:00  → horario de verano (septiembre a abril aprox.)
  //   -04:00  → horario de invierno (abril a septiembre aprox.)
  fechaISO: "2026-12-26T12:30:00-03:00",
  zonaHoraria: "America/Santiago",
  duracionHoras: 7.5,             // 12:30 a 20:00, para el evento de calendario (.ics / Google)

  /* ------------------------------------------------------ Texto de hero */
  preTitulo: "¡Nos casamos!",

  /* ------------------------------------------------------------ Lugares */
  // Si la ceremonia y la celebración son en el mismo lugar, deja
  // `celebracion: null` y se mostrará una sola tarjeta.
  ceremonia: {
    titulo: "Ceremonia y celebración",
    hora: "12:30",
    horaFin: "20:00",                       // opcional: la tarjeta muestra "12:30 – 20:00 hrs"
    lugar: "Centro de Eventos La Casita de Cuentos",
    direccion: "Los Guindos 1575, Parcela 25, Buin",
    nota: "Como nuestra ceremonia es civil, comenzará exactamente a la hora y no podremos esperar. ¡Te pedimos puntualidad para que no te la pierdas! Hay estacionamiento dentro del recinto.",
    // Opcional: pega aquí el enlace "Compartir" de Google Maps si quieres
    // apuntar a un punto exacto. Si lo dejas vacío se usa la dirección.
    mapsUrl: "",
  },
  // Ceremonia y celebración son en el mismo lugar: se muestra una sola tarjeta.
  celebracion: null,

  /* --------------------------------------------------------- Itinerario */
  // Vacío = la sección y su enlace en la barra no se muestran.
  // Formato: { hora: "12:30", titulo: "Ceremonia", desc: "...", icono: "anillos" }
  // Iconos disponibles: anillos · copa · cena · musica · pin · reloj
  itinerario: [],

  /* --------------------------------------------------------- Dress code */
  // null = la sección y su enlace en la barra no se muestran.
  // Para mostrarla: { titulo: "...", detalle: "...", coloresSugeridos: ["#223A2F", ...], evitar: "..." }
  dressCode: null,

  /* ------------------------------------------------------------- Regalo */
  regalo: {
    activo: true,
    mensaje: "Tu presencia es nuestro mejor regalo. Si quieres sumar un detalle, te dejamos cómo hacerlo:",
    titular: "Pamela Campos Contreras",
    rut: "10.692.323-K",
    banco: "Banco Santander",
    tipoCuenta: "Cuenta Corriente",
    numeroCuenta: "62387890",
    email: "pame.campos1971@gmail.com",
    gracias: "¡Gracias de corazón por acompañarnos!",
  },

  /* ------------------------------------------------- Confirmación (RSVP) */
  confirmacion: {
    activo: true,
    fechaLimite: "2026-12-05",             // AAAA-MM-DD · ⚠ por confirmar
    // URL de la aplicación web de Google Apps Script que escribe en tu Google Sheet.
    // Sigue los pasos de README.md ("Confirmaciones en Google Sheets"). Termina en /exec.
    // Mientras esté vacía, el formulario avisará que aún no está conectado.
    endpoint: "https://script.google.com/macros/s/AKfycbw7N__mpSEBhohdsdlf8ZUFyaBo5I4pFUOqSUNHhFxVzIqB7Xg3byh2rhd9TfB9N7ge/exec",
    // Solo como referencia: planilla donde quedan las confirmaciones (no la usa el sitio).
    sheetUrl: "https://docs.google.com/spreadsheets/d/1anfGP-TPqsR7KoyffS252epXb-ps6txWp3cFjpom8t0/edit",
    texto: "Nos ayudaría mucho saber si puedes acompañarnos. Escribe tu nombre y envía tu confirmación antes de la fecha límite.",
    etiquetaNombre: "Tu nombre y apellido",
    placeholder: "Ej: María José Soto",
    exito: "¡Gracias, {nombre}! Nos hace muy felices contar contigo. Nos vemos en el gran día.",
    // Restricción alimentaria: el invitado puede marcar varias o ninguna.
    // En la planilla quedan separadas por coma; si no marca nada queda "Ninguna".
    etiquetaRestriccion: "Restricción alimentaria",
    ayudaRestriccion: "¿Tienes alguna? Marca las que correspondan. Si comes pescado pero no carne, elige Vegetariana. Si no tienes ninguna, déjalo en blanco.",
    restricciones: ["Vegana", "Vegetariana", "Celíaca (sin gluten)"],
    // Casilla "Otra" con un campo para escribir cuál. false = no se muestra.
    otraRestriccion: true,
    placeholderOtra: "¿Cuál? Ej: alergia a los frutos secos",
  },

  /* ---------------------------------------------------------------- Pie */
  // Frase final del pie de página. Vacía = no se muestra.
  despedida: "",
};
