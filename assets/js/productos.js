/** Filtro por categoría de la página de inicio. Se activa cuando el catálogo ya está pintado. */
document.addEventListener('catalogo:listo', () => {
    const contenedor = document.getElementById('lista-productos');
    const filas = [...contenedor.querySelectorAll(':scope > .row')];

    const mostrar = (tipo) => {
        contenedor.replaceChildren(...filas.filter(f => !tipo || f.dataset.producto === tipo));
    };

    document.querySelector('.todos').addEventListener('click', () => mostrar());
    document.querySelector('.maquinas').addEventListener('click', () => mostrar('maquina'));
    document.querySelector('.inalambricos').addEventListener('click', () => mostrar('inalambrico'));
    document.querySelector('.manuales').addEventListener('click', () => mostrar('manual'));
});
