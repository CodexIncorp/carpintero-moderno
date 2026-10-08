/**
 * Cada módulo se activa solo si encuentra sus elementos en la página,
 * así que el mismo archivo se carga (al final del <body>) en las 6 páginas:
 *
 *   Todas ........ menú móvil y contador del carrito en la barra
 *   Inicio ....... carrusel
 *   Registro ..... validación del formulario y botón ligado al checkbox
 *   Quiénes somos  botón «Ver más»
 *   Catálogo ..... «Agregar al carrito», contador ficticio y acordeón «MÁS»
 *   Carrito ...... cantidades solo numéricas y recálculo del total
 *   Búsqueda ..... mensaje de resultados y productos ficticios
 *
 * Los datos no se guardan de forma real: es una demostración.
 */
(function () {
    'use strict';

    const TASA_IVA = 0.16;
    const CLAVE_CONTADOR = 'contadorCarrito';

    // ------------------------------------------------------------------
    // Utilidades
    // ------------------------------------------------------------------
    function formatoDinero(valor) {
        return Number(valor).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    /** Muestra un aviso con SweetAlert2 (si está cargado) o con alert() como respaldo. */
    function notificar(opciones) {
        if (window.Swal) {
            return window.Swal.fire(opciones);
        }
        window.alert([opciones.title, opciones.text].filter(Boolean).join('\n'));
        return Promise.resolve();
    }

    // ------------------------------------------------------------------
    // Barra de navegación: botón hamburguesa (móvil)
    // ------------------------------------------------------------------
    function iniciarMenu() {
        const boton = document.querySelector('.alternar_btn');
        const lista = document.querySelector('.navbar .links');
        if (!boton || !lista) return;

        const icono = boton.querySelector('i');
        boton.addEventListener('click', function () {
            const abierto = lista.classList.toggle('open');
            boton.setAttribute('aria-expanded', String(abierto));
            icono.className = abierto ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
        });
    }

    // ------------------------------------------------------------------
    // Contador ficticio del carrito (se conserva solo durante la sesión)
    // ------------------------------------------------------------------
    function leerContador() {
        try {
            return parseInt(sessionStorage.getItem(CLAVE_CONTADOR), 10) || 0;
        } catch (error) {
            return 0;
        }
    }

    function escribirContador(valor) {
        try {
            sessionStorage.setItem(CLAVE_CONTADOR, String(valor));
        } catch (error) {
            // Sin almacenamiento disponible: el contador solo vive en esta página.
        }
    }

    function pintarContador(valor) {
        document.querySelectorAll('.contador-carrito').forEach(function (el) {
            el.textContent = valor;
        });
    }

    // ------------------------------------------------------------------
    // Inicio: carrusel
    // ------------------------------------------------------------------
    function iniciarCarrusel() {
        const slides = Array.from(document.querySelectorAll('.img-slider .slide'));
        const puntos = Array.from(document.querySelectorAll('.img-slider .navigation .btn'));
        if (slides.length === 0) return;

        let actual = 0;
        let temporizador = null;

        function mostrar(indice) {
            slides[actual].classList.remove('active');
            if (puntos[actual]) puntos[actual].classList.remove('active');
            actual = indice;
            slides[actual].classList.add('active');
            if (puntos[actual]) puntos[actual].classList.add('active');
        }

        function programar() {
            clearInterval(temporizador);
            temporizador = setInterval(function () {
                mostrar((actual + 1) % slides.length);
            }, 6000);
        }

        puntos.forEach(function (punto, i) {
            punto.addEventListener('click', function () {
                mostrar(i);
                programar();
            });
        });

        programar();
    }

    // ------------------------------------------------------------------
    // Registro
    // ------------------------------------------------------------------
    function iniciarRegistro() {
        const formulario = document.getElementById('form-registro');
        if (!formulario) return;

        const boton = document.getElementById('btn-registro');
        const terminos = document.getElementById('terminos');
        const campos = [
            { el: document.getElementById('nombre'), etiqueta: 'Nombre completo' },
            { el: document.getElementById('email'), etiqueta: 'Correo electrónico' },
            { el: document.getElementById('password'), etiqueta: 'Contraseña' },
            { el: document.getElementById('nacimiento'), etiqueta: 'Fecha de nacimiento' },
            { el: document.getElementById('telefono'), etiqueta: 'Teléfono' }
        ];

        // El botón de envío solo se habilita cuando se aceptan los términos
        function sincronizarBoton() {
            boton.disabled = !terminos.checked;
        }
        sincronizarBoton();
        terminos.addEventListener('change', sincronizarBoton);

        // El teléfono solo admite dígitos
        const telefono = document.getElementById('telefono');
        telefono.addEventListener('input', function () {
            telefono.value = telefono.value.replace(/\D/g, '').slice(0, 10);
        });

        formulario.addEventListener('submit', function (e) {
            e.preventDefault();

            if (!terminos.checked) {
                sincronizarBoton();
                return;
            }

            // 1) Todos los campos completos
            const faltantes = campos
                .filter(function (campo) { return campo.el.value.trim() === ''; })
                .map(function (campo) { return campo.etiqueta; });

            if (faltantes.length > 0) {
                notificar({
                    icon: 'warning',
                    title: 'FORMULARIO INCOMPLETO',
                    text: 'Falta completar: ' + faltantes.join(', ') + '.'
                });
                return;
            }

            // 2) Validaciones HTML5 (correo con expresión regular, teléfono, contraseña)
            if (!formulario.checkValidity()) {
                formulario.reportValidity();
                return;
            }

            // 3) La fecha de nacimiento no puede ser futura
            const nacimiento = document.getElementById('nacimiento');
            if (new Date(nacimiento.value) > new Date()) {
                notificar({
                    icon: 'warning',
                    title: 'FECHA NO VÁLIDA',
                    text: 'La fecha de nacimiento no puede ser posterior a hoy.'
                });
                return;
            }

            notificar({
                icon: 'success',
                title: 'REGISTRO EXITOSO',
                text: 'Gracias por registrarse.',
                timer: 2500
            });
            formulario.reset();
            sincronizarBoton();
        });
    }

    // ------------------------------------------------------------------
    // Quiénes somos: botón «Ver más»
    // ------------------------------------------------------------------
    function iniciarVerMas() {
        const boton = document.getElementById('btn-ver-mas');
        const panel = document.getElementById('info-adicional');
        if (!boton || !panel) return;

        boton.addEventListener('click', function () {
            const mostrar = panel.hidden; // si estaba oculto, ahora se muestra
            panel.hidden = !mostrar;
            boton.textContent = mostrar ? 'Ver menos' : 'Ver más';
            boton.setAttribute('aria-expanded', String(mostrar));
        });
    }

    // ------------------------------------------------------------------
    // Catálogo: «Agregar al carrito» (demostración) y acordeón «MÁS»
    // ------------------------------------------------------------------
    function iniciarCatalogo() {
        const botones = document.querySelectorAll('.agregar');
        const acordeones = document.querySelectorAll('.card .mas');
        if (botones.length === 0 && acordeones.length === 0) return;

        document.addEventListener('click', function (e) {
            const agregar = e.target.closest('.agregar');
            if (agregar) {
                const tarjeta = agregar.closest('.card');
                const nombre = tarjeta.querySelector('h3').textContent;
                const total = leerContador() + 1;
                escribirContador(total);
                pintarContador(total);
                notificar({
                    toast: true,
                    position: 'top-end',
                    icon: 'success',
                    title: 'Agregado al carrito',
                    text: nombre,
                    timer: 2000,
                    showConfirmButton: false
                });
                return;
            }

            const mas = e.target.closest('.card .mas');
            if (mas) {
                mas.classList.toggle('ver');
                const detalle = mas.nextElementSibling;
                if (detalle) detalle.classList.toggle('abierto');
            }
        });
    }

    // ------------------------------------------------------------------
    // Carrito: cantidades solo numéricas y recálculo de totales
    // ------------------------------------------------------------------
    function iniciarCarrito() {
        const tabla = document.getElementById('lista-compra');
        if (!tabla) return;

        const cuerpo = tabla.querySelector('tbody');
        const elSubtotal = document.getElementById('subtotal');
        const elIVA = document.getElementById('iva');
        const elTotal = document.getElementById('total');

        function cantidadDe(input) {
            return parseInt(input.value, 10) || 0;
        }

        /**
         * Los precios ya incluyen IVA: el total es la suma de (precio × cantidad)
         * y el subtotal/IVA se desglosan de él. Se calcula en centavos para
         * evitar errores de redondeo.
         */
        function recalcular() {
            let totalCentavos = 0;

            cuerpo.querySelectorAll('tr[data-precio]').forEach(function (fila) {
                const precio = Number(fila.dataset.precio);
                const cantidad = cantidadDe(fila.querySelector('.cantidad'));
                fila.querySelector('.subtotal-fila').textContent = '$ ' + formatoDinero(precio * cantidad);
                totalCentavos += Math.round(precio * cantidad * 100);
            });

            const subtotalCentavos = Math.round(totalCentavos / (1 + TASA_IVA));
            const ivaCentavos = totalCentavos - subtotalCentavos;

            elSubtotal.textContent = '$ ' + formatoDinero(subtotalCentavos / 100);
            elIVA.textContent = '$ ' + formatoDinero(ivaCentavos / 100);
            elTotal.textContent = '$ ' + formatoDinero(totalCentavos / 100);
        }

        function mostrarCarritoVacio() {
            if (cuerpo.querySelector('tr[data-precio]')) return;
            const fila = document.createElement('tr');
            fila.className = 'fila-vacia';
            const celda = document.createElement('td');
            celda.colSpan = 6;
            celda.textContent = 'Su carrito está vacío.';
            fila.appendChild(celda);
            cuerpo.appendChild(fila);
        }

        // Mientras se escribe: se descartan las letras y símbolos y se recalcula
        cuerpo.addEventListener('input', function (e) {
            if (!e.target.classList.contains('cantidad')) return;
            e.target.value = e.target.value.replace(/\D/g, '');
            recalcular();
        });

        // Al salir del cuadro: mínimo 1 (para quitar un producto use «Eliminar»)
        cuerpo.addEventListener('change', function (e) {
            if (!e.target.classList.contains('cantidad')) return;
            e.target.value = Math.max(1, cantidadDe(e.target));
            recalcular();
        });

        cuerpo.addEventListener('click', function (e) {
            const borrar = e.target.closest('.borrar-producto');
            if (!borrar) return;
            borrar.closest('tr').remove();
            mostrarCarritoVacio();
            recalcular();
        });

        const comprar = document.getElementById('btn-comprar');
        if (comprar) {
            comprar.addEventListener('click', function () {
                if (!cuerpo.querySelector('tr[data-precio]')) {
                    notificar({ icon: 'error', title: 'ERROR', text: 'Su carrito está vacío.', timer: 2000, showConfirmButton: false });
                    return;
                }
                notificar({
                    icon: 'success',
                    title: '¡LISTO!',
                    text: 'Compra realizada con éxito.',
                    timer: 2500,
                    showConfirmButton: false
                });
            });
        }

        recalcular();
    }

    // ------------------------------------------------------------------
    // Búsqueda: muestra el texto buscado y productos ficticios
    // ------------------------------------------------------------------
    const PRODUCTOS_DEMO = [
        { nombre: 'Lijadora orbital 5" (demo)', precio: 2200 },
        { nombre: 'Taladro atornillador inalámbrico 18V (demo)', precio: 3150 },
        { nombre: 'Cepillo de hierro #6 (demo)', precio: 1100 },
        { nombre: 'Flexómetro de 5 m (demo)', precio: 150 }
    ];

    function iniciarBusqueda() {
        const formulario = document.getElementById('form-busqueda');
        const resultados = document.getElementById('resultados');
        if (!formulario || !resultados) return;

        const campo = document.getElementById('termino');

        formulario.addEventListener('submit', function (e) {
            e.preventDefault();
            const texto = campo.value.trim();
            resultados.replaceChildren();

            if (texto === '') {
                const aviso = document.createElement('p');
                aviso.className = 'nota-demo';
                aviso.textContent = 'Escriba un término para buscar.';
                resultados.appendChild(aviso);
                campo.focus();
                return;
            }

            // textContent (no innerHTML): el texto del usuario nunca se interpreta como HTML
            const mensaje = document.createElement('p');
            mensaje.className = 'mensaje-resultados';
            mensaje.textContent = 'Resultados para la búsqueda de ' + texto;

            const nota = document.createElement('p');
            nota.className = 'nota-demo';
            nota.textContent = 'Productos ficticios de demostración (no dependen del texto buscado):';

            const lista = document.createElement('ul');
            lista.className = 'lista-resultados';
            PRODUCTOS_DEMO.forEach(function (producto) {
                const item = document.createElement('li');

                const nombre = document.createElement('span');
                nombre.className = 'res-nombre';
                nombre.textContent = producto.nombre;

                const precio = document.createElement('span');
                precio.className = 'res-precio';
                precio.textContent = '$ ' + formatoDinero(producto.precio);

                const enlace = document.createElement('a');
                enlace.href = 'catalogo.html';
                enlace.textContent = 'Ver en el catálogo';

                item.append(nombre, precio, enlace);
                lista.appendChild(item);
            });

            resultados.append(mensaje, nota, lista);
        });
    }

    // ------------------------------------------------------------------
    // Arranque
    // ------------------------------------------------------------------
    document.addEventListener('DOMContentLoaded', function () {
        pintarContador(leerContador());
        iniciarMenu();
        iniciarCarrusel();
        iniciarRegistro();
        iniciarVerMas();
        iniciarCatalogo();
        iniciarCarrito();
        iniciarBusqueda();
    });
})();
