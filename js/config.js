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
  fechaISO: "2027-03-20T17:00:00-03:00",
  zonaHoraria: "America/Santiago",
  duracionHoras: 8,               // para el evento de calendario (.ics / Google)

  /* ------------------------------------------------------ Texto de hero */
  preTitulo: "¡Nos casamos!",
  frase: "Con la bendición de Dios y de nuestras familias, queremos compartir contigo el día más importante de nuestras vidas. Será un honor contar con tu presencia.",

  /* ------------------------------------------------------------ Lugares */
  // Si la ceremonia y la celebración son en el mismo lugar, deja
  // `celebracion: null` y se mostrará una sola tarjeta.
  ceremonia: {
    titulo: "Ceremonia",
    hora: "17:00",
    lugar: "Parroquia San Francisco de Asís",
    direccion: "Av. Libertador Bernardo O'Higgins 834, Santiago",
    nota: "Te pedimos llegar 15 minutos antes para comenzar puntualmente.",
    // Opcional: pega aquí el enlace "Compartir" de Google Maps si quieres
    // apuntar a un punto exacto. Si lo dejas vacío se usa la dirección.
    mapsUrl: "",
  },
  celebracion: {
    titulo: "Celebración",
    hora: "19:30",
    lugar: "Centro de Eventos Los Nogales",
    direccion: "Camino Los Nogales 1250, Pirque",
    nota: "Estacionamiento disponible dentro del recinto.",
    mapsUrl: "",
  },

  /* --------------------------------------------------------- Itinerario */
  // Iconos disponibles: anillos · copa · cena · musica · pin · reloj
  itinerario: [
    { hora: "17:00", titulo: "Ceremonia",          desc: "Nos damos el sí frente a quienes más queremos.", icono: "anillos" },
    { hora: "19:30", titulo: "Recepción y cóctel", desc: "Brindis de bienvenida en los jardines.",          icono: "copa" },
    { hora: "21:00", titulo: "Cena",               desc: "Compartimos la mesa y los discursos.",            icono: "cena" },
    { hora: "23:00", titulo: "Fiesta",             desc: "¡A bailar hasta que el cuerpo aguante!",         icono: "musica" },
  ],

  /* --------------------------------------------------------- Dress code */
  dressCode: {
    titulo: "Formal · Elegante",
    detalle: "Queremos que te sientas cómodo y espléndido. La celebración será al aire libre, así que recomendamos tacos gruesos y un abrigo para la noche.",
    coloresSugeridos: ["#223A2F", "#5B6E5A", "#8E7040", "#A86B5C", "#4A4F6B", "#2B2B2B"],
    evitar: "Por favor evita el blanco, marfil y crema: están reservados para la novia.",
  },

  /* ------------------------------------------------------------- Regalo */
  regalo: {
    activo: true,
    mensaje: "Tu presencia es nuestro mejor regalo. Pero si además deseas hacernos un presente, puedes hacerlo mediante una transferencia a la siguiente cuenta:",
    titular: "Daniel Pérez González",
    rut: "12.345.678-9",
    banco: "Banco de Chile",
    tipoCuenta: "Cuenta Corriente",
    numeroCuenta: "00-123-45678-90",
    email: "daniel.macarena@correo.cl",
    gracias: "¡Gracias de corazón por acompañarnos!",
  },

  /* ------------------------------------------------- Confirmación (RSVP) */
  confirmacion: {
    activo: true,
    fechaLimite: "2027-02-20",             // AAAA-MM-DD
    whatsapp: "56912345678",               // código país + número, sin + ni espacios
    mensaje: "¡Hola! Confirmo mi asistencia al matrimonio de Daniel y Macarena. Mi nombre es: ",
    texto: "Nos ayudaría mucho saber si puedes acompañarnos. Confirma tu asistencia por WhatsApp antes de la fecha límite.",
  },

  /* ---------------------------------------------------------------- Pie */
  despedida: "Con amor, Daniel & Macarena",
};
