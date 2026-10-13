/**
 * Receptor de confirmaciones · Matrimonio Daniel & Macarena
 * ----------------------------------------------------------------------
 * Este script va DENTRO de tu Google Sheet (Extensiones → Apps Script).
 * Recibe el formulario del sitio y agrega una fila por confirmación.
 *
 * Pasos completos en README.md del proyecto ("Confirmaciones en Google Sheets").
 * Resumen:
 *   1. Pega este código en el editor de Apps Script del Sheet y guarda.
 *   2. Implementar → Nueva implementación → Aplicación web.
 *      Ejecutar como: Yo · Quién tiene acceso: Cualquier usuario.
 *   3. Copia la URL (termina en /exec) y pégala en js/config.js → confirmacion.endpoint.
 */

var NOMBRE_HOJA = 'Confirmaciones';

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000); // evita que dos envíos simultáneos pisen la misma fila

    var datos = {};
    try { datos = JSON.parse((e && e.postData && e.postData.contents) || '{}'); } catch (_) {}

    var nombre = String(datos.nombre || '').trim().replace(/\s+/g, ' ').slice(0, 120);
    if (!nombre) return responder({ ok: false, error: 'Falta el nombre' });

    // Campo trampa: si viene lleno es un bot. Respondemos ok para no darle pistas.
    if (datos.empresa) return responder({ ok: true });

    var hoja = obtenerHoja();
    hoja.appendRow([
      new Date(),
      nombre,
      String(datos.origen || ''),
      String(datos.agente || ''),
    ]);
    return responder({ ok: true });
  } catch (err) {
    return responder({ ok: false, error: String(err) });
  } finally {
    try { lock.releaseLock(); } catch (_) {}
  }
}

// Abrir la URL en el navegador sirve para comprobar que la implementación está activa.
function doGet() {
  return responder({ ok: true, mensaje: 'Receptor de confirmaciones activo' });
}

function obtenerHoja() {
  var libro = SpreadsheetApp.getActiveSpreadsheet();
  var hoja = libro.getSheetByName(NOMBRE_HOJA);
  if (!hoja) hoja = libro.insertSheet(NOMBRE_HOJA);
  if (hoja.getLastRow() === 0) {
    hoja.appendRow(['Fecha', 'Nombre', 'Origen', 'Navegador']);
    hoja.setFrozenRows(1);
    hoja.getRange('A:A').setNumberFormat('dd/MM/yyyy HH:mm');
    hoja.setColumnWidth(1, 150);
    hoja.setColumnWidth(2, 260);
  }
  return hoja;
}

function responder(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
