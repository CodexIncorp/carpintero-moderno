/**
 * Comportamiento de la barra de navegación (idéntico en todas las páginas):
 *  - botón hamburguesa del menú móvil
 *  - submenús desplegables (acordeón)
 *  - doble clic en "Productos" -> inicio
 */
function irAInicio() {
    window.location.href = rutaDesdeRaiz('index.html');
}

(function () {
    const alternarBtn = document.querySelector('.alternar_btn');
    const alternarBtnIcon = document.querySelector('.alternar_btn i');
    const mostrarMenu = document.querySelector('.mostrar_menu');

    alternarBtn.onclick = function () {
        mostrarMenu.classList.toggle('open');
        const isOpen = mostrarMenu.classList.contains('open');

        alternarBtnIcon.classList = isOpen
            ? 'fa-solid fa-xmark'
            : 'fa-solid fa-bars';
    };

    // Acordeones (.mas): delegación de eventos, porque las tarjetas de producto
    // se crean después de cargar la página.
    document.addEventListener('click', (e) => {
        const listElement = e.target.closest('.mas');
        if (!listElement) return;

        listElement.classList.toggle('ver');

        let height = 0;
        const menu = listElement.nextElementSibling;
        if (!menu) return; // enlaces sin submenú (p. ej. "Carrito" en el menú móvil)
        if (menu.clientHeight == '0') {
            height = menu.scrollHeight;
        }
        menu.style.height = height + 'px';
    });

    // Doble clic en "Productos" -> inicio
    document.getElementById('enlace-productos').addEventListener('dblclick', irAInicio);
})();
