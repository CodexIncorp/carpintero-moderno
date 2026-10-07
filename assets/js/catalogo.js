/**
 * Renderiza las tarjetas de producto a partir de data/productos.json.
 *
 * El contenedor #lista-productos indica qué mostrar con `data-catalogo`:
 *   "inicio"                                     productos con campo `inicio`, en ese orden
 *   "maquinas" | "inalambricos" | "manuales" | "ofertas"   productos de esa categoría
 *
 * Al terminar dispara el evento `catalogo:listo` en `document`.
 * Para agregar o editar productos basta con modificar el JSON.
 */
const TIPO_FILTRO_INICIO = { maquinas: 'maquina', inalambricos: 'inalambrico', manuales: 'manual' };

function formatoDinero(valor) {
    return Number(valor).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function tarjetaProducto(p, esInicio) {
    const claseImg = p.claseImagen ? ` class="${escaparHTML(p.claseImagen)}"` : '';
    const tipo = TIPO_FILTRO_INICIO[p.categoria]; // las ofertas no tienen botón de filtro propio
    const dataTipo = esInicio && tipo ? ` data-producto="${tipo}"` : '';
    const anterior = p.precioAnterior
        ? `\n                    <p class="precio_ant"><s>$ ${formatoDinero(p.precioAnterior)}</s></p>`
        : '';
    const descripcion = escaparHTML(p.descripcion).replace(/\n/g, '<br>');

    return `
            <div class="row center-xs"${dataTipo}>
                <div class="col-xs-10 col-sm-6 col-md-4 product">
                    <div class="card">
                        <img loading="lazy"${claseImg} src="${escaparHTML(rutaDesdeRaiz('assets/img/' + p.imagen))}" alt="${escaparHTML(p.alt)}">
                        <h3>${escaparHTML(p.nombre)}</h3>
                        <p class="precio">$ <span>${Number(p.precio).toFixed(2)}</span></p>${anterior}
                        <a href="#" class="accion_btn agregar" data-id="${escaparHTML(p.id)}">Agregar al carrito</a>
                        <h4 class="mas">MÁS<span><i class="icono fa fa-chevron-down" aria-hidden="true"></i></span></h4>
                        <ul class="submenu_2">
                            <li><p>${descripcion}</p></li>
                        </ul>
                    </div>
                </div>
            </div>`;
}

async function cargarCatalogo() {
    const contenedor = document.getElementById('lista-productos');
    if (!contenedor) return;

    const seccion = contenedor.dataset.catalogo;
    const esInicio = seccion === 'inicio';

    try {
        const respuesta = await fetch(rutaDesdeRaiz('data/productos.json'));
        if (!respuesta.ok) throw new Error('HTTP ' + respuesta.status);
        const productos = await respuesta.json();

        const lista = esInicio
            ? productos.filter(p => p.inicio).sort((a, b) => a.inicio - b.inicio)
            : productos.filter(p => p.categoria === seccion);

        contenedor.innerHTML = lista.map(p => tarjetaProducto(p, esInicio)).join('');

        // Con sesión iniciada los precios se muestran con descuento (auth.js)
        if (haySesion()) aplicarDescuentoSesion();
    } catch (error) {
        console.error('No se pudo cargar el catálogo:', error);
        contenedor.innerHTML = '<p class="error-catalogo">No pudimos cargar los productos. Intenta recargar la página.</p>';
    }

    document.dispatchEvent(new CustomEvent('catalogo:listo'));
}

cargarCatalogo();
