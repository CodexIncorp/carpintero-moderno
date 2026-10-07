const compra = new Carrito();
const listaCompra = document.querySelector('#lista-compra tbody');
const carrito = document.getElementById('carrito');
const procesarCompraBtn = document.getElementById('procesar-compra');
const nombre = document.getElementById('nombre');
const correo = document.getElementById('email');
const address = document.getElementById('adress');

cargarEventos();

function cargarEventos() {
    compra.leerLSCompra();
    compra.calcularTotal();
    carrito.addEventListener('click', (e) => { compra.eliminarProducto(e); });
    carrito.addEventListener('change', (e) => { compra.obtenerEvento(e); });
    carrito.addEventListener('keyup', (e) => { compra.obtenerEvento(e); });
    procesarCompraBtn.addEventListener('click', procesarCompra);
}

function procesarCompra(e) {
    e.preventDefault();

    if (compra.obtenerProductosLS().length === 0) {
        Swal.fire({
            icon: 'error',
            title: 'ERROR',
            text: 'El carrito está vacío',
            timer: 2000,
            showConfirmButton: false
        }).then(function () {
            window.location = rutaDesdeRaiz('index.html');
        });
    } else if (nombre.value.trim() === '' || correo.value.trim() === '' || address.value.trim() === '') {
        Swal.fire({
            icon: 'error',
            title: 'ERROR',
            text: 'Rellene todos los campos solicitados',
            timer: 2000,
            showConfirmButton: false
        });
    } else if (!correo.checkValidity()) {
        Swal.fire({
            icon: 'error',
            title: 'ERROR',
            text: 'Ingrese un correo electrónico válido',
            timer: 2000,
            showConfirmButton: false
        });
    } else {
        Swal.fire({
            icon: 'success',
            title: '¡LISTO!',
            text: 'Compra efectuada correctamente',
            timer: 2000,
            showConfirmButton: false
        });

        setTimeout(() => {
            compra.vaciarLS();
            window.location = rutaDesdeRaiz('index.html');
        }, 3000);
    }
}
