/**
 * Utilidades compartidas. Se carga primero en todas las páginas.
 *
 * Cada <html> declara `data-raiz` con la ruta relativa hacia la raíz del
 * sitio ("./", "../" o "../../"), de modo que el JS pueda navegar sin
 * depender de en qué carpeta esté la página actual.
 */
function rutaDesdeRaiz(ruta) {
    const raiz = document.documentElement.dataset.raiz || './';
    return raiz + ruta;
}

/**
 * Escapa texto para insertarlo de forma segura dentro de HTML construido con
 * plantillas (previene XSS). Úsalo siempre que mezcles datos con innerHTML.
 */
function escaparHTML(texto) {
    return String(texto)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}
