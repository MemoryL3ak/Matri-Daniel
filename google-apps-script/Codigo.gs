/**
 * Receptor de confirmaciones · Matrimonio Daniel & Macarena
 * ----------------------------------------------------------------------
 * Este script va DENTRO de tu Google Sheet (Extensiones → Apps Script).
 * Recibe el formulario del sitio y agrega una fila por confirmación.
 * Planilla: https://docs.google.com/spreadsheets/d/1anfGP-TPqsR7KoyffS252epXb-ps6txWp3cFjpom8t0/edit
 *
 * Pasos completos en README.md del proyecto ("Confirmaciones en Google Sheets").
 * Resumen:
 *   1. Pega este código en el editor de Apps Script del Sheet y guarda.
 *      (Opcional) Ejecuta probarEscritura() para autorizar y ver una fila de prueba.
 *   2. Implementar → Nueva implementación → Aplicación web.
 *      Ejecutar como: Yo · Quién tiene acceso: Cualquier usuario.
 *   3. Copia la URL (termina en /exec) y pégala en js/config.js → confirmacion.endpoint.
 */

// ID de la planilla destino (sacado de su URL: /spreadsheets/d/<ID>/edit).
// Si pegas este código dentro del Sheet (Extensiones → Apps Script) no hace falta,
// pero permite que también funcione como proyecto independiente en script.google.com.
var ID_PLANILLA = '1anfGP-TPqsR7KoyffS252epXb-ps6txWp3cFjpom8t0';
var NOMBRE_HOJA = 'Confirmaciones';
var ENCABEZADOS = ['Fecha', 'Nombre', 'Restricción alimentaria'];
// Abre la URL /exec en el navegador: si muestra esta versión, la implementación está al día.
var VERSION_RECEPTOR = '2026-10-18';

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

    var restriccion = String(datos.restriccion || '').trim().replace(/\s+/g, ' ').slice(0, 200) || 'Ninguna';

    var hoja = obtenerHoja();
    hoja.appendRow([new Date(), nombre, restriccion]);
    return responder({ ok: true });
  } catch (err) {
    return responder({ ok: false, error: String(err) });
  } finally {
    try { lock.releaseLock(); } catch (_) {}
  }
}

// Abrir la URL en el navegador sirve para comprobar que la implementación está activa
// y qué versión del código está publicada.
function doGet() {
  return responder({ ok: true, mensaje: 'Receptor de confirmaciones activo', version: VERSION_RECEPTOR });
}

function obtenerHoja() {
  var libro = SpreadsheetApp.getActiveSpreadsheet() || SpreadsheetApp.openById(ID_PLANILLA);
  var hoja = libro.getSheetByName(NOMBRE_HOJA);
  if (!hoja) {
    // Si la primera pestaña está vacía (la "Hoja 1" de una planilla nueva) la
    // reutilizamos con el nombre correcto; si no, creamos una pestaña aparte.
    var primera = libro.getSheets()[0];
    var vacia = primera && primera.getLastRow() === 0 && primera.getLastColumn() === 0;
    hoja = vacia ? primera.setName(NOMBRE_HOJA) : libro.insertSheet(NOMBRE_HOJA);
  }
  if (hoja.getLastRow() === 0) {
    hoja.appendRow(ENCABEZADOS);
    hoja.setFrozenRows(1);
    hoja.getRange('A:A').setNumberFormat('dd/MM/yyyy HH:mm');
    hoja.setColumnWidth(1, 150);
    hoja.setColumnWidth(2, 260);
    hoja.setColumnWidth(3, 240);
  } else if (hoja.getRange(1, 3).getValue() !== ENCABEZADOS[2]) {
    // Planilla creada antes de sumar la restricción alimentaria: completa el encabezado
    // y limpia el antiguo "Navegador" si todavía quedaba.
    hoja.getRange(1, 1, 1, ENCABEZADOS.length).setValues([ENCABEZADOS]);
    if (hoja.getRange(1, 4).getValue() === 'Navegador') hoja.getRange(1, 4).clearContent();
    hoja.setColumnWidth(3, 240);
  }
  return hoja;
}

// Ejecútala desde el editor (selecciónala arriba y pulsa ▶ Ejecutar) para autorizar
// el script y comprobar que escribe en la planilla. Agrega una fila de prueba que
// luego puedes borrar.
function probarEscritura() {
  var hoja = obtenerHoja();
  hoja.appendRow([new Date(), 'Prueba desde el editor', 'Ninguna']);
  Logger.log('Fila de prueba agregada en "%s" (ahora tiene %s filas)', hoja.getName(), hoja.getLastRow());
}

function responder(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
