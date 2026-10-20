/* =====================================================================
   Daniel & Macarena · Lógica de la página
   Lee window.BODA (js/config.js) y rellena toda la página.
   ===================================================================== */
(() => {
  'use strict';

  const B = window.BODA || {};
  const $  = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const esc = (s) => String(s ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

  const setTxt = (id, txt) => { const el = document.getElementById(id); if (el && txt != null) el.textContent = txt; };
  const cap = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : s;

  /* ------------------------------------------------------------ Fecha */
  const tz = B.zonaHoraria || 'America/Santiago';
  const fecha = new Date(B.fechaISO);
  const fechaValida = !Number.isNaN(fecha.getTime());

  const fmt = (opts) => fechaValida
    ? new Intl.DateTimeFormat('es-CL', { timeZone: tz, ...opts }).format(fecha)
    : '';

  const diaSemana  = cap(fmt({ weekday: 'long' }));
  const diaNum     = fmt({ day: 'numeric' });
  const mes        = fmt({ month: 'long' });
  const anio       = fmt({ year: 'numeric' });
  const horaTxt    = fmt({ hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
  const fechaLarga = fechaValida ? `${diaSemana} ${diaNum} de ${mes} de ${anio}` : '';
  const fechaCorta = fechaValida ? `${diaNum} · ${mes} · ${anio}` : '';

  const iniciales = `${(B.novios?.novio || 'D').charAt(0)}&${(B.novios?.novia || 'M').charAt(0)}`.toUpperCase();

  /* --------------------------------------------------------- Cabecera */
  const tituloPagina = `${B.titulo || 'Nuestra boda'} · ¡Nos casamos!`;
  document.title = tituloPagina;
  $('meta[property="og:title"]')?.setAttribute('content', tituloPagina);

  setTxt('navMarca', iniciales);
  setTxt('heroMono', iniciales);
  setTxt('heroPre', B.preTitulo);
  setTxt('nombreNovio', B.novios?.novio);
  setTxt('nombreNovia', B.novios?.novia);
  setTxt('heroFecha', fechaLarga);
  setTxt('heroHora', B.ceremonia?.hora || B.celebracion?.hora || horaTxt);
  setTxt('heroLugar', B.ceremonia?.lugar || B.celebracion?.lugar || '');

  /* ------------------------------------------------- Cuenta regresiva */
  const cd = {
    dias: $('#cdDias'), horas: $('#cdHoras'), min: $('#cdMin'), seg: $('#cdSeg'),
    grid: $('#cuentaGrid'), hoy: $('#cuentaHoy'), pre: $('.cuenta__pre'),
  };
  const dos = (n) => String(n).padStart(2, '0');
  // Solo escribe si el número cambió: en Safari cada cambio de texto obliga a
  // recalcular la página completa, así que no reescribimos días/horas cada segundo.
  const poner = (el, v) => { if (el.textContent !== v) el.textContent = v; };

  let timer = null;
  let terminado = false;
  function tick() {
    if (!fechaValida || terminado) return;
    const diff = fecha.getTime() - Date.now();
    if (diff <= 0) {
      terminado = true;
      cd.grid.hidden = true;
      cd.pre.hidden = true;
      cd.hoy.hidden = false;
      const pasado = Date.now() - fecha.getTime() > 36 * 3600 * 1000;
      cd.hoy.textContent = pasado ? '¡Ya nos casamos! Gracias por acompañarnos.' : '¡Hoy es el gran día!';
      detenerReloj();
      return;
    }
    const s = Math.floor(diff / 1000);
    poner(cd.dias,  dos(Math.floor(s / 86400)));
    poner(cd.horas, dos(Math.floor((s % 86400) / 3600)));
    poner(cd.min,   dos(Math.floor((s % 3600) / 60)));
    poner(cd.seg,   dos(s % 60));
  }
  function iniciarReloj() { if (timer === null && fechaValida && !terminado) { tick(); timer = setInterval(tick, 1000); } }
  function detenerReloj() { if (timer !== null) { clearInterval(timer); timer = null; } }

  // El reloj corre solo mientras está en pantalla y la pestaña está abierta.
  let relojVisible = true;
  const ajustarReloj = () => (relojVisible && !document.hidden) ? iniciarReloj() : detenerReloj();
  if ('IntersectionObserver' in window) {
    relojVisible = false;
    new IntersectionObserver((entradas) => {
      // Cuenta como visible solo si de verdad asoma en pantalla (no basta con tocar el borde)
      relojVisible = entradas.some(en => en.isIntersecting && en.intersectionRatio > 0);
      ajustarReloj();
    }, { threshold: [0, 0.01, 0.1] }).observe($('#cuenta'));
  }
  document.addEventListener('visibilitychange', ajustarReloj);
  tick();           // deja los números correctos desde el inicio
  ajustarReloj();

  /* --------------------------------------------------- Calendarios */
  const utcCompacto = (d) => d.toISOString().replace(/[-:]|\.\d{3}/g, '');
  const lugarCal = [B.ceremonia || B.celebracion].filter(Boolean)
    .map(l => `${l.lugar}, ${l.direccion}`).join(' · ');
  const descCal = `Matrimonio de ${B.titulo}. ${B.celebracion ? `Celebración: ${B.celebracion.lugar}, ${B.celebracion.direccion}.` : ''} ${location.origin}`.trim();

  if (fechaValida) {
    const fin = new Date(fecha.getTime() + (B.duracionHoras || 6) * 3600 * 1000);
    const g = new URL('https://calendar.google.com/calendar/render');
    g.searchParams.set('action', 'TEMPLATE');
    g.searchParams.set('text', `Matrimonio ${B.titulo}`);
    g.searchParams.set('dates', `${utcCompacto(fecha)}/${utcCompacto(fin)}`);
    g.searchParams.set('details', descCal);
    g.searchParams.set('location', lugarCal);
    g.searchParams.set('ctz', tz);
    $('#btnGoogleCal').href = g.toString();

    $('#btnIcs').addEventListener('click', () => {
      const escIcs = (s) => String(s).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
      const ics = [
        'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Boda//ES', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
        'BEGIN:VEVENT',
        `UID:${utcCompacto(fecha)}-boda@${location.hostname || 'boda.local'}`,
        `DTSTAMP:${utcCompacto(new Date())}`,
        `DTSTART:${utcCompacto(fecha)}`,
        `DTEND:${utcCompacto(fin)}`,
        `SUMMARY:${escIcs(`Matrimonio ${B.titulo}`)}`,
        `LOCATION:${escIcs(lugarCal)}`,
        `DESCRIPTION:${escIcs(descCal)}`,
        'BEGIN:VALARM', 'TRIGGER:-P1D', 'ACTION:DISPLAY', `DESCRIPTION:${escIcs(`Mañana: matrimonio ${B.titulo}`)}`, 'END:VALARM',
        'END:VEVENT', 'END:VCALENDAR',
      ].join('\r\n');
      const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `matrimonio-${(B.titulo || 'boda').toLowerCase().replace(/[^a-z0-9]+/gi, '-')}.ics`;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    });
  }

  /* ---------------------------------------------------------- Lugares */
  const lugares = [
    B.ceremonia ? { ...B.ceremonia, icono: 'anillos' } : null,
    B.celebracion ? { ...B.celebracion, icono: 'copa' } : null,
  ].filter(Boolean);

  const consulta = (l) => `${l.lugar}, ${l.direccion}`;
  const urlMaps  = (l) => l.mapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(consulta(l))}`;
  const urlWaze  = (l) => `https://waze.com/ul?q=${encodeURIComponent(consulta(l))}&navigate=yes`;
  const urlEmbed = (l) => `https://www.google.com/maps?q=${encodeURIComponent(consulta(l))}&output=embed&hl=es&z=15`;

  const grid = $('#detallesGrid');
  grid.innerHTML = lugares.map(l => `
    <article class="tarjeta">
      <div class="tarjeta__ico"><svg><use href="#ico-${esc(l.icono)}"/></svg></div>
      <h3 class="tarjeta__h">${esc(l.titulo)}</h3>
      <span class="tarjeta__hora"><svg><use href="#ico-reloj"/></svg>${esc(l.horaFin ? `${l.hora} – ${l.horaFin}` : l.hora)} hrs</span>
      <div class="tarjeta__sep" aria-hidden="true"></div>
      <p class="tarjeta__lugar">${esc(l.lugar)}</p>
      <p class="tarjeta__dir">${esc(l.direccion)}</p>
      ${l.nota ? `<p class="tarjeta__nota">${esc(l.nota)}</p>` : ''}
      <div class="tarjeta__acciones">
        <a class="btn btn--mini" href="${esc(urlMaps(l))}" target="_blank" rel="noopener"><svg class="btn__ico"><use href="#ico-pin"/></svg> Google Maps</a>
        <a class="btn btn--mini" href="${esc(urlWaze(l))}" target="_blank" rel="noopener"><svg class="btn__ico"><use href="#ico-externo"/></svg> Waze</a>
      </div>
    </article>`).join('');

  const tabs = $('#mapaTabs');
  const frame = $('#mapaFrame');
  let mapaCargado = false;
  if (lugares.length === 0) {
    $('#mapaWrap').hidden = true;
  } else {
    if (lugares.length > 1) {
      tabs.innerHTML = lugares.map((l, i) =>
        `<button class="mapa__tab" role="tab" type="button" aria-selected="${i === 0}" data-i="${i}">${esc(l.titulo)}</button>`
      ).join('');
      tabs.addEventListener('click', (e) => {
        const b = e.target.closest('.mapa__tab'); if (!b) return;
        $$('.mapa__tab', tabs).forEach(t => t.setAttribute('aria-selected', String(t === b)));
        mapaCargado = true;
        frame.src = urlEmbed(lugares[+b.dataset.i]);
        frame.title = `Mapa · ${lugares[+b.dataset.i].lugar}`;
      });
    } else {
      tabs.hidden = true;
    }
    frame.title = `Mapa · ${lugares[0].lugar}`;
    // El mapa de Google pesa ~0,5 MB y decenas de peticiones: lo cargamos recién
    // cuando el invitado se acerca a él, para no frenar la apertura de la página.
    const cargarMapa = () => {
      if (mapaCargado) return;
      mapaCargado = true;
      frame.src = urlEmbed(lugares[0]);
    };
    if ('IntersectionObserver' in window) {
      const ioMapa = new IntersectionObserver((entradas) => {
        if (entradas.some(en => en.isIntersecting)) { cargarMapa(); ioMapa.disconnect(); }
      }, { rootMargin: '400px 0px' });
      ioMapa.observe($('#mapaWrap'));
    } else {
      cargarMapa();
    }
  }

  /* ------------------------------------------------------- Itinerario */
  const iconosValidos = new Set(['anillos', 'copa', 'cena', 'musica', 'pin', 'reloj', 'regalo', 'vestido']);
  const linea = $('#lineaTiempo');
  const hitos = Array.isArray(B.itinerario) ? B.itinerario : [];
  if (hitos.length === 0) {
    $('#itinerario').hidden = true;
    $$('.nav__links a[href="#itinerario"]').forEach(a => a.closest('li').hidden = true);
  } else {
    linea.innerHTML = hitos.map(h => `
      <li class="hito">
        <span class="hito__hora">${esc(h.hora)}</span>
        <span class="hito__ico"><svg><use href="#ico-${iconosValidos.has(h.icono) ? h.icono : 'reloj'}"/></svg></span>
        <div class="hito__txt"><h3>${esc(h.titulo)}</h3>${h.desc ? `<p>${esc(h.desc)}</p>` : ''}</div>
      </li>`).join('');
  }

  /* ------------------------------------------------------- Dress code */
  const dc = B.dressCode;
  if (!dc) {
    $('#dresscode').hidden = true;
    $$('.nav__links a[href="#dresscode"]').forEach(a => a.closest('li').hidden = true);
  } else {
    setTxt('dressTitulo', dc.titulo);
    setTxt('dressDetalle', dc.detalle);
    setTxt('dressEvitar', dc.evitar);
    const colores = Array.isArray(dc.coloresSugeridos) ? dc.coloresSugeridos : [];
    $('#paleta').innerHTML = colores.map(c =>
      `<span class="paleta__color" style="background:${esc(c)}" title="${esc(c)}" aria-label="Color ${esc(c)}"></span>`
    ).join('');
    if (colores.length === 0) { $('.dress__sub').hidden = true; }
  }

  /* ----------------------------------------------------------- Regalo */
  const toast = $('#toast');
  let toastTimer;
  function avisar(msg) {
    toast.textContent = msg;
    toast.classList.add('ver');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('ver'), 2200);
  }

  async function copiar(texto) {
    try {
      if (navigator.clipboard?.writeText) { await navigator.clipboard.writeText(texto); return true; }
    } catch (_) { /* cae al respaldo */ }
    try {
      const ta = document.createElement('textarea');
      ta.value = texto; ta.setAttribute('readonly', '');
      ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      const ok = document.execCommand('copy');
      ta.remove();
      return ok;
    } catch (_) { return false; }
  }

  const rg = B.regalo;
  const modal = $('#modalRegalo');
  // En la ruta alternativa (p. ej. /invitacion) la página es idéntica pero sin la sección de regalo
  const limpiarRuta = (r) => String(r || '').replace(/\/+$/, '').toLowerCase();
  const sinRegalo = !!(rg && rg.rutaSinRegalo) && limpiarRuta(location.pathname) === limpiarRuta(rg.rutaSinRegalo);
  if (!rg || rg.activo === false || sinRegalo) {
    $$('[data-seccion="regalo"]').forEach(el => el.hidden = true);
  } else {
    setTxt('regaloMensaje', rg.mensaje);
    setTxt('modalGracias', rg.gracias);

    const campos = [
      ['Titular',        rg.titular],
      ['RUT',            rg.rut],
      ['Banco',          rg.banco],
      ['Tipo de cuenta', rg.tipoCuenta],
      ['N° de cuenta',   rg.numeroCuenta],
      ['Correo',         rg.email],
    ].filter(([, v]) => v);

    $('#datosTransferencia').innerHTML = campos.map(([k, v]) => `
      <li class="dato">
        <span class="dato__k">${esc(k)}</span>
        <span class="dato__v">${esc(v)}</span>
        <button class="copiar" type="button" data-valor="${esc(v)}" aria-label="Copiar ${esc(k)}">
          <svg><use href="#ico-copiar"/></svg>
        </button>
      </li>`).join('');

    $('#datosTransferencia').addEventListener('click', async (e) => {
      const b = e.target.closest('.copiar'); if (!b) return;
      const ok = await copiar(b.dataset.valor);
      if (ok) {
        b.classList.add('ok');
        b.innerHTML = '<svg><use href="#ico-check"/></svg>';
        avisar('Copiado ✓');
        setTimeout(() => { b.classList.remove('ok'); b.innerHTML = '<svg><use href="#ico-copiar"/></svg>'; }, 1600);
      } else {
        avisar('No se pudo copiar, selecciona el texto manualmente');
      }
    });

    $('#btnCopiarTodo').addEventListener('click', async () => {
      const texto = campos.map(([k, v]) => `${k}: ${v}`).join('\n');
      const ok = await copiar(texto);
      avisar(ok ? 'Todos los datos copiados ✓' : 'No se pudo copiar');
    });

    const abrir = () => {
      if (typeof modal.showModal === 'function') modal.showModal();
      else modal.setAttribute('open', '');
      document.body.style.overflow = 'hidden';
    };
    const cerrar = () => {
      if (typeof modal.close === 'function' && modal.open) modal.close();
      else modal.removeAttribute('open');
      document.body.style.overflow = '';
    };
    $('#btnRegalo').addEventListener('click', abrir);
    $('#modalCerrar').addEventListener('click', cerrar);
    modal.addEventListener('close', () => { document.body.style.overflow = ''; });
    // Cerrar al tocar fuera de la caja
    modal.addEventListener('click', (e) => { if (e.target === modal) cerrar(); });
  }

  /* ------------------------------------------------------ Confirmación */
  const rs = B.confirmacion;
  if (!rs || rs.activo === false) {
    $$('[data-seccion="confirmacion"]').forEach(el => el.hidden = true);
  } else {
    setTxt('rsvpTexto', rs.texto);
    setTxt('rsvpLabel', rs.etiquetaNombre || 'Tu nombre');

    const form        = $('#rsvpForm');
    const input       = $('#rsvpNombre');
    const estado      = $('#rsvpEstado');
    const exito       = $('#rsvpExito');
    const exitoEstado = $('#rsvpExitoEstado');
    const btnOtra     = $('#btnOtra');
    const CLAVE       = 'boda-confirmacion';
    if (rs.placeholder) input.placeholder = rs.placeholder;

    // Restricción alimentaria: casillas generadas desde config.js
    const restricciones = Array.isArray(rs.restricciones) ? rs.restricciones.filter(Boolean) : [];
    const conOtra = rs.otraRestriccion !== false;
    const otraTxt = $('#rsvpOtraTxt');
    if (restricciones.length === 0 && !conOtra) {
      $('#rsvpRestriccion').hidden = true;
    } else {
      setTxt('rsvpRestriccionLbl', rs.etiquetaRestriccion);
      setTxt('rsvpRestriccionAyuda', rs.ayudaRestriccion);
      if (rs.placeholderOtra) otraTxt.placeholder = rs.placeholderOtra;
      $('#rsvpRestricciones').innerHTML = restricciones.map(r =>
        `<label class="chip"><input type="checkbox" name="restriccion" value="${esc(r)}"><span>${esc(r)}</span></label>`
      ).join('') + (conOtra
        ? '<label class="chip"><input type="checkbox" name="restriccion" value="Otra" id="rsvpOtraChk" aria-controls="rsvpOtraTxt"><span>Otra</span></label>'
        : '');
    }
    const casillasRestriccion = () => $$('input[name="restriccion"]', form);
    const otraChk = $('#rsvpOtraChk');
    const mostrarOtra = (enfocar) => {
      if (!otraChk) return;
      otraTxt.hidden = !otraChk.checked;
      if (!otraChk.checked) { otraTxt.value = ''; otraTxt.removeAttribute('aria-invalid'); }
      else if (enfocar) otraTxt.focus();
    };
    otraChk?.addEventListener('change', () => { mostrarOtra(true); mostrarEstado(''); });
    otraTxt.addEventListener('input', () => { otraTxt.removeAttribute('aria-invalid'); mostrarEstado(''); });
    // Texto que se guarda en la planilla: "Vegana, Otra: alergia al maní" o "Ninguna"
    const textoRestriccion = () => casillasRestriccion().filter(c => c.checked).map(c =>
      c.value === 'Otra' ? `Otra: ${otraTxt.value.trim().replace(/\s+/g, ' ')}` : c.value
    ).join(', ') || 'Ninguna';

    const mostrarEstado = (msg, esError = false) => {
      estado.textContent = msg;
      estado.classList.toggle('error', esError);
    };
    const mostrarExito = (nombre, guardando = false) => {
      form.hidden = true;
      exito.hidden = false;
      $('#rsvpExitoTxt').textContent = (rs.exito || '¡Gracias, {nombre}!').replace('{nombre}', nombre);
      exitoEstado.textContent = guardando ? 'Guardando tu confirmación…' : '';
      exitoEstado.hidden = !guardando;
      btnOtra.disabled = guardando;
    };

    // Apps Script "duerme" cuando nadie lo usa y su primera respuesta tarda varios
    // segundos. Lo despertamos con un GET en cuanto el invitado llega al formulario,
    // así cuando pulse enviar el receptor ya está listo.
    let despierto = false;
    const despertar = () => {
      if (despierto || !rs.endpoint) return;
      despierto = true;
      fetch(rs.endpoint, { cache: 'no-store', keepalive: true }).catch(() => {});
    };
    input.addEventListener('focus', despertar, { once: true });
    if ('IntersectionObserver' in window) {
      const ioRsvp = new IntersectionObserver((entradas) => {
        if (entradas.some(en => en.isIntersecting)) { despertar(); ioRsvp.disconnect(); }
      }, { rootMargin: '300px' });
      ioRsvp.observe($('#confirmar'));
    }

    // Si ya confirmó desde este dispositivo, mostramos el estado confirmado
    try {
      const previo = JSON.parse(localStorage.getItem(CLAVE) || 'null');
      if (previo && previo.nombre) mostrarExito(previo.nombre);
    } catch (_) { /* sin almacenamiento: no pasa nada */ }

    btnOtra.addEventListener('click', () => {
      exito.hidden = true;
      form.hidden = false;
      input.value = '';
      casillasRestriccion().forEach(c => { c.checked = false; });
      mostrarOtra(false);
      mostrarEstado('');
      input.focus();
    });

    input.addEventListener('input', () => { input.removeAttribute('aria-invalid'); mostrarEstado(''); });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const nombre = input.value.trim().replace(/\s+/g, ' ');
      if (nombre.length < 3) {
        input.setAttribute('aria-invalid', 'true');
        input.focus();
        mostrarEstado('Escribe tu nombre completo, por favor.', true);
        return;
      }
      if (otraChk?.checked && !otraTxt.value.trim()) {
        otraTxt.setAttribute('aria-invalid', 'true');
        otraTxt.focus();
        mostrarEstado('Cuéntanos cuál es tu otra restricción alimentaria.', true);
        return;
      }
      if (!rs.endpoint) {
        mostrarEstado('El formulario aún no está conectado. Avísanos por otro medio, por favor.', true);
        return;
      }

      // Mostramos el agradecimiento de inmediato y guardamos en segundo plano:
      // el invitado no espera a Google. Si falla, volvemos al formulario con aviso.
      mostrarEstado('');
      mostrarExito(nombre, true);
      const ctrl = new AbortController();
      const limite = setTimeout(() => ctrl.abort(), 20000);
      try {
        // Cuerpo como texto plano: evita el preflight CORS y Apps Script lo lee en e.postData.contents
        const r = await fetch(rs.endpoint, {
          method: 'POST',
          body: JSON.stringify({
            nombre,
            restriccion: textoRestriccion(),
            empresa: $('#rsvpHp').value,          // campo trampa; debe llegar vacío
          }),
          keepalive: true,                        // termina aunque el invitado cierre la pestaña
          signal: ctrl.signal,
        });
        const data = await r.json().catch(() => ({ ok: r.ok }));
        if (!r.ok || data.ok === false) throw new Error(data.error || `HTTP ${r.status}`);
        try { localStorage.setItem(CLAVE, JSON.stringify({ nombre, fecha: new Date().toISOString() })); } catch (_) {}
        exitoEstado.textContent = 'Confirmación guardada ✓';
        btnOtra.disabled = false;
      } catch (err) {
        console.error('Confirmación fallida:', err);
        exito.hidden = true;
        form.hidden = false;
        input.value = nombre;
        btnOtra.disabled = false;
        mostrarEstado('No pudimos registrar tu confirmación. Revisa tu conexión e inténtalo de nuevo.', true);
      } finally {
        clearTimeout(limite);
      }
    });

    if (rs.fechaLimite) {
      const lim = new Date(`${rs.fechaLimite}T12:00:00`);
      const limTxt = Number.isNaN(lim.getTime()) ? rs.fechaLimite
        : new Intl.DateTimeFormat('es-CL', { day: 'numeric', month: 'long', year: 'numeric' }).format(lim);
      setTxt('rsvpLimite', `Confirmar antes del ${limTxt}`);
    } else {
      $('#rsvpLimite').hidden = true;
    }
  }

  /* --------------------------------------------------------------- Pie */
  $('#pieMono').innerHTML = `${esc(iniciales.charAt(0))}<span>&amp;</span>${esc(iniciales.charAt(2))}`;
  setTxt('pieFecha', fechaCorta);
  setTxt('pieHash', B.hashtag);
  const pieDesp = $('#pieDespedida');
  if (B.despedida) pieDesp.textContent = B.despedida; else pieDesp.hidden = true;

  /* ------------------------------------------------- Aparición al scroll */
  const reveals = $$('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('visto'); io.unobserve(en.target); } });
    }, { threshold: .01, rootMargin: '0px 0px 8% 0px' });
    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('visto'));
  }

  /* ---------------------------------------------------------------- Nav */
  const nav = $('#nav');
  const hero = $('#inicio');
  let limiteNav = 0;
  const actualizarNav = () => nav.classList.toggle('ver', window.scrollY > limiteNav);
  const medirNav = () => { limiteNav = hero.offsetHeight - 120; actualizarNav(); };
  window.addEventListener('scroll', actualizarNav, { passive: true });
  window.addEventListener('resize', medirNav, { passive: true });
  medirNav();
})();
