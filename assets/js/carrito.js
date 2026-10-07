/**
 * Carrito de compras. Persiste en localStorage bajo la clave CLAVE_CARRITO.
 *
 * Cada producto se guarda como:
 *   { imagen, titulo, precio, id, cantidad }
 *
 * Los precios mostrados en la tienda ya incluyen IVA (16 %).
 */
const CLAVE_CARRITO = 'productos';
const TASA_IVA = 0.16;

class Carrito {
    // ---------- Eventos del catálogo ----------
    comprarProducto(e) {
        e.preventDefault();
        if (e.target.classList.contains('agregar')) {
            const producto = e.target.parentElement.parentElement;
            this.leerDatosProducto(producto);
        }
    }

    leerDatosProducto(producto) {
        const infoProducto = {
            imagen: producto.querySelector('img').src,
            titulo: producto.querySelector('h3').textContent,
            precio: producto.querySelector('.precio span').textContent,
            id: producto.querySelector('a').getAttribute('data-id'),
            cantidad: 1
        };

        const yaAgregado = this.obtenerProductosLS().some(p => p.id === infoProducto.id);
        if (yaAgregado) {
            Swal.fire({
                icon: 'info',
                title: 'SOBRE EL CARRITO',
                text: 'El producto ya está agregado',
                timer: 2000,
                showConfirmButton: false
            });
        } else {
            this.insertarCarrito(infoProducto);
        }
    }

    insertarCarrito(producto) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <img src="${escaparHTML(producto.imagen)}" width=100>
            </td>
            <td>${escaparHTML(producto.titulo)}</td>
            <td>$ ${Number(producto.precio).toFixed(2)}</td>
            <td><a href="#" class="borrar-producto fas fa-times-circle" data-id="${escaparHTML(producto.id)}"></a></td>
        `;
        listaProductos.appendChild(row);
        this.guardarProductosLS(producto);
    }

    eliminarProducto(e) {
        e.preventDefault();
        if (!e.target.classList.contains('borrar-producto')) return;

        const fila = e.target.closest('tr');
        const productoID = fila.querySelector('a').getAttribute('data-id');
        fila.remove();
        this.eliminarProductoLS(productoID);
        this.calcularTotal();
    }

    vaciarCarrito(e) {
        e.preventDefault();
        while (listaProductos.firstChild) {
            listaProductos.removeChild(listaProductos.firstChild);
        }
        this.vaciarLS();
        return false;
    }

    // ---------- Persistencia ----------
    obtenerProductosLS() {
        try {
            const guardado = JSON.parse(localStorage.getItem(CLAVE_CARRITO));
            return Array.isArray(guardado) ? guardado : [];
        } catch (error) {
            return []; // contenido corrupto: se parte de un carrito vacío
        }
    }

    guardarProductosLS(producto) {
        const productos = this.obtenerProductosLS();
        productos.push(producto);
        this.escribirLS(productos);
    }

    eliminarProductoLS(productoID) {
        this.escribirLS(this.obtenerProductosLS().filter(p => p.id !== productoID));
    }

    escribirLS(productos) {
        localStorage.setItem(CLAVE_CARRITO, JSON.stringify(productos));
    }

    /** Vacía solo el carrito (no el resto del almacenamiento del sitio). */
    vaciarLS() {
        localStorage.removeItem(CLAVE_CARRITO);
    }

    // ---------- Render ----------
    leerLS() {
        this.obtenerProductosLS().forEach(function (producto) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <img src="${escaparHTML(producto.imagen)}" width=100>
                </td>
                <td>${escaparHTML(producto.titulo)}</td>
                <td>$ ${Number(producto.precio).toFixed(2)}</td>
                <td>
                    <a href="#" class="borrar-producto fas fa-times-circle" data-id="${escaparHTML(producto.id)}"></a>
                </td>
            `;
            listaProductos.appendChild(row);
        });
    }

    leerLSCompra() {
        this.obtenerProductosLS().forEach(function (producto) {
            const cantidad = Math.max(1, parseInt(producto.cantidad, 10) || 1);
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <img src="${escaparHTML(producto.imagen)}" width=100>
                </td>
                <td>${escaparHTML(producto.titulo)}</td>
                <td>$ ${Number(producto.precio).toFixed(2)}</td>
                <td class="td-cantidad">
                    <input type="number" class="form-control cantidad" min="1" value="${cantidad}" aria-label="Cantidad">
                </td>
                <td class="subtotal-fila">$ ${Number(producto.precio * cantidad).toFixed(2)}</td>
                <td>
                    <a href="#" class="borrar-producto fas fa-times-circle" data-id="${escaparHTML(producto.id)}"></a>
                </td>
            `;
            listaCompra.appendChild(row);
        });
    }

    // ---------- Pedido y totales ----------
    procesarPedido(e) {
        e.preventDefault();
        if (this.obtenerProductosLS().length === 0) {
            Swal.fire({
                icon: 'error',
                title: 'ACCESO DENEGADO',
                text: 'El carrito está vacío',
                timer: 2000,
                showConfirmButton: false
            });
        } else {
            location.href = rutaDesdeRaiz('pages/compra.html');
        }
    }

    /**
     * Calcula subtotal, IVA y total. Los precios ya incluyen IVA, por lo que
     * el total es la suma de los precios y el IVA se desglosa de él.
     * Solo actúa en páginas que muestran el desglose (compra.html).
     */
    calcularTotal() {
        const elSubtotal = document.getElementById('subtotal');
        const elIVA = document.getElementById('IVA');
        const elTotal = document.getElementById('total');
        if (!elSubtotal || !elIVA || !elTotal) return;

        const totalCentavos = Math.round(
            this.obtenerProductosLS().reduce(
                (suma, p) => suma + Number(p.precio) * Math.max(1, parseInt(p.cantidad, 10) || 1), 0
            ) * 100
        );
        const subtotalCentavos = Math.round(totalCentavos / (1 + TASA_IVA));
        const ivaCentavos = totalCentavos - subtotalCentavos;

        elSubtotal.textContent = '$ ' + (subtotalCentavos / 100).toFixed(2);
        elIVA.textContent = '$ ' + (ivaCentavos / 100).toFixed(2);
        elTotal.textContent = '$ ' + (totalCentavos / 100).toFixed(2);
    }

    /** Se dispara al cambiar la cantidad de un producto en compra.html. */
    obtenerEvento(e) {
        if (!e.target.classList.contains('cantidad')) return;

        const fila = e.target.closest('tr');
        const id = fila.querySelector('a').getAttribute('data-id');
        const cantidad = Math.max(1, parseInt(e.target.value, 10) || 1);
        if (e.type === 'change') e.target.value = cantidad; // normaliza vacío/0/negativos

        const productos = this.obtenerProductosLS();
        const producto = productos.find(p => p.id === id);
        if (!producto) return;

        producto.cantidad = cantidad;
        fila.querySelector('.subtotal-fila').textContent =
            '$ ' + Number(cantidad * producto.precio).toFixed(2);
        this.escribirLS(productos);
        this.calcularTotal();
    }
}
