/**
 * Componentes compartidos del sitio (Web Components sin dependencias):
 *
 *   <cm-header carrito="..."></cm-header>   barra de navegación
 *   <cm-footer></cm-footer>                 pie de página
 *
 * El menú y el pie existen una sola vez aquí, en lugar de copiarse en cada HTML.
 * Los enlaces se calculan con rutaDesdeRaiz(), así que funcionan desde cualquier carpeta.
 *
 * Atributo `carrito` de <cm-header>:
 *   "desplegable"  Enlace "Carrito" que abre el desplegable (páginas de catálogo)
 *   "oculto"       Enlace a la compra + desplegable oculto por CSS (inicio)
 *   "enlace"       Solo enlace a la página de compra (Nosotros, Historia, Contacto)
 *   "ninguno"      Sin carrito en la barra (la propia página de compra)
 *
 * Requiere utils.js cargado antes.
 */
const _r = rutaDesdeRaiz;

class CmHeader extends HTMLElement {
    connectedCallback() {
        const variante = this.getAttribute('carrito') || 'ninguno';
        const hayDesplegable = variante === 'desplegable' || variante === 'oculto';

        let botonCarrito = '';
        if (variante === 'desplegable') {
            botonCarrito = `<a href="#" class="accion_btn carrito mas"><i class="fa-solid fa-shopping-cart"></i>Carrito<i
                    class="icono fa fa-chevron-down" aria-hidden="true"></i></a>`;
        } else if (variante !== 'ninguno') {
            botonCarrito = `<a href="${_r('pages/compra.html')}" class="accion_btn carrito mas"><i class="fa-solid fa-shopping-cart"></i>Carrito</a>`;
        }

        const desplegable = !hayDesplegable ? '' : `
            <div class="submenu-carrito" id="carrito">
                <table id="lista-carrito" class="table">
                    <div class="header_carrito">
                        <h3>PRODUCTOS</h3>
                    </div>
                    <thead>
                        <tr>
                            <th>Imagen</th>
                            <th>Nombre</th>
                            <th>Precio</th>
                            <th>Borrar</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
                <div class="opciones">
                    <a href="#" id="vaciar-carrito" class="vaciar">Vaciar carrito</a>
                    <a href="#" id="procesar-pedido" class="pagar">Procesar pedido</a>
                </div>
            </div>`;

        const carritoMovil = variante === 'ninguno' ? '' : `
                <li><a href="${_r('pages/compra.html')}" class="accion_btn carrito mas"><i class="fa-solid fa-shopping-cart"></i>Carrito</a></li>`;

        this.innerHTML = `
        <header>
            <div class="navbar">
                <div class="logo"><a href="${_r('index.html')}"><img src="${_r('assets/img/branding/logo-letras.png')}"
                            alt="Logo de la empresa" width="144.75px" height="56.5px"></a></div>
                <ul class="links">
                    <li>
                        <a href="#" id="enlace-productos">Productos</a>
                        <ul class="submenu">
                            <li><a href="${_r('pages/catalogo/maquinas.html')}">Máquinas</a></li>
                            <li><a href="${_r('pages/catalogo/inalambricos.html')}">Inalámbricos</a></li>
                            <li><a href="${_r('pages/catalogo/manuales.html')}">Herramientas Manuales</a></li>
                        </ul>
                    </li>
                    <li><a href="${_r('pages/catalogo/ofertas.html')}">Ofertas</a></li>
                    <li>
                        <a href="#">Nosotros</a>
                        <ul class="submenu">
                            <li><a href="${_r('pages/nosotros.html')}">¿Quiénes somos?</a></li>
                            <li><a href="${_r('pages/historia.html')}">Historia</a></li>
                        </ul>
                    </li>
                    <li><a href="${_r('pages/contacto.html')}">Contacto</a></li>
                </ul>
                <a href="${_r('pages/registro.html')}" class="registro-btn" id="registro">Registrarse</a>
                <a href="${_r('index.html')}" class="cerrar-sesion" id="cerrar"><i
                        class="fa-solid fa-door-open"></i>Salir</a>
                ${botonCarrito}${desplegable}
                <div class="alternar_btn">
                    <i class="fa-solid fa-bars"></i>
                </div>
            </div>

            <div class="mostrar_menu">
                <ul class="menu">
                    <li>
                        <a class="m_links mas" href="#">Productos<span><i class="icono fa fa-chevron-down"
                                    aria-hidden="true"></i></span></a>
                        <ul class="submenu_2">
                            <li><a href="${_r('pages/catalogo/maquinas.html')}">Máquinas</a></li>
                            <li><a href="${_r('pages/catalogo/inalambricos.html')}">Inalámbricos</a></li>
                            <li><a href="${_r('pages/catalogo/manuales.html')}">Manuales</a></li>
                        </ul>
                    </li>
                    <li><a class="m_links" href="${_r('pages/catalogo/ofertas.html')}">Ofertas</a></li>
                    <li>
                        <a class="m_links mas" href="#">Nosotros<span><i class="icono fa fa-chevron-down"
                                    aria-hidden="true"></i></span></a>
                        <ul class="submenu_2">
                            <li><a href="${_r('pages/nosotros.html')}">¿Quiénes somos?</a></li>
                            <li><a href="${_r('pages/historia.html')}">Historia</a></li>
                        </ul>
                    </li>
                    <li><a href="${_r('pages/contacto.html')}" class="m_links">Contacto</a></li>${carritoMovil}
                </ul>
            </div>
        </header>`;
    }
}

class CmFooter extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <footer class="pie_pagina">
            <div class="grupo1">
                <div class="box">
                    <figure><a href="${_r('index.html')}"><img src="${_r('assets/img/branding/logo-letras.png')}" alt="Logo de Carpintero Moderno"></a></figure>
                </div>
                <div class="box b_posicion">
                    <h2>SUCURSALES</h2>
                    <p>Central Norte No. 1845 Esq. Libramiento Norte, La Llave, 29037 Tuxtla Gutiérrez, Chiapas</p><br>
                    <p>Avenida Quinta Norte Poniente 1615, 29000 Tuxtla Gutiérrez, Chiapas</p>
                </div>
                <div class="box b_posicion">
                    <h2>PRODUCTOS</h2>
                    <ul>
                        <li><a href="${_r('pages/catalogo/maquinas.html')}">Máquinas</a></li>
                        <li><a href="${_r('pages/catalogo/inalambricos.html')}">Inalámbricos</a></li>
                        <li><a href="${_r('pages/catalogo/manuales.html')}">Manuales</a></li>
                        <li><a href="${_r('pages/catalogo/ofertas.html')}">Ofertas</a></li>
                    </ul>
                </div>
                <div class="box">
                    <h2>ACERCA DE</h2>
                    <ul>
                        <li><a href="${_r('pages/nosotros.html')}">Nosotros</a></li>
                        <li><a href="${_r('pages/historia.html')}">Historia</a></li>
                        <li><a href="${_r('pages/contacto.html')}">Contacto</a></li>
                    </ul>
                </div>
            </div>
            <div class="grupo2">
                <small>&copy; 2023 <b>Carpintero Moderno</b> - Todos los Derechos Reservados.</small>
            </div>
        </footer>`;
    }
}

customElements.define('cm-header', CmHeader);
customElements.define('cm-footer', CmFooter);
