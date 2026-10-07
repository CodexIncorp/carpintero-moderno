/**
 * Registro, inicio de sesión (simulados con sessionStorage) y estado de sesión.
 * Los usuarios con sesión iniciada obtienen DESCUENTO_SESION en los precios del catálogo.
 */
const DESCUENTO_SESION = 0.05;

function emailFormulario() {
    return document.querySelector('#e-mail').value.trim().toLowerCase();
}

function emailValido() {
    return document.querySelector('#e-mail').checkValidity();
}

function login() {
    const nombre = document.querySelector('#nombre').value.trim();
    const apellidos = document.querySelector('#apellidos').value.trim();
    const password = document.querySelector('#contraseña').value;
    const email = emailFormulario();

    if (nombre === '' || apellidos === '' || password === '' || email === '') {
        Swal.fire({
            icon: 'warning',
            title: 'ACCESO DENEGADO',
            text: 'Debe rellenar todos los campos solicitados',
            timer: 3000
        });
    } else if (!emailValido()) {
        Swal.fire({
            icon: 'warning',
            title: 'CORREO NO VÁLIDO',
            text: 'Ingrese un correo electrónico válido',
            timer: 3000
        });
    } else {
        const Users = JSON.parse(sessionStorage.getItem('users')) || [];
        const registrado = Users.find(user => user.email === email);
        if (registrado) {
            Swal.fire({
                icon: 'error',
                title: 'ACCESO DENEGADO',
                text: 'Usuario ya registrado',
                timer: 3000
            });
        } else {
            Users.push({ nombre: nombre, apellidos: apellidos, email: email, password: password });
            sessionStorage.setItem('users', JSON.stringify(Users));
            Swal.fire({
                icon: 'success',
                title: 'REGISTRO EXITOSO',
                timer: 1500
            }).then(function () {
                sessionStorage.setItem('contador', 1);
                window.location.href = rutaDesdeRaiz('index.html');
            });
        }
    }
}

function loginInicio() {
    const password = document.querySelector('#contraseña').value;
    const email = emailFormulario();
    const Users = JSON.parse(sessionStorage.getItem('users')) || [];

    if (password === '' || email === '') {
        Swal.fire({
            icon: 'warning',
            title: 'ACCESO DENEGADO',
            text: 'Debe rellenar todos los campos solicitados',
            timer: 3000
        });
    } else {
        const validacion = Users.find(user => user.email === email && user.password === password);
        if (!validacion) {
            Swal.fire({
                icon: 'error',
                title: 'USUARIO NO ENCONTRADO',
                text: 'Correo y/o contraseña incorrectos',
                timer: 3000
            });
        } else {
            Swal.fire({
                icon: 'success',
                title: 'BIENVENIDO',
                timer: 1500
            }).then(function () {
                sessionStorage.setItem('contador', 1);
                window.location.href = rutaDesdeRaiz('index.html');
            });
        }
    }
}

/** Cierra la sesión. La navegación la realiza el propio enlace "Salir". */
function salir() {
    sessionStorage.removeItem('contador');
}

function haySesion() {
    return sessionStorage.getItem('contador') !== null;
}

/** Muestra "Salir" o "Registrarse" en la barra según haya sesión. */
function actualizarSesion() {
    const sesion = haySesion();
    document.getElementById('cerrar').style.display = sesion ? 'flex' : 'none';
    document.getElementById('registro').style.display = sesion ? 'none' : 'flex';
}

/** Aplica el descuento de sesión a todos los precios del catálogo mostrados. */
function aplicarDescuentoSesion() {
    document.querySelectorAll('.precio span').forEach(function (elemento) {
        const precio = Number(elemento.textContent);
        const descuento = Number((precio * DESCUENTO_SESION).toFixed(2));
        elemento.textContent = (precio - descuento).toFixed(2);
    });
}

document.addEventListener('DOMContentLoaded', function () {
    // Barra de navegación: estado de sesión y botón "Salir"
    const cerrar = document.getElementById('cerrar');
    if (cerrar) {
        actualizarSesion();
        cerrar.addEventListener('click', salir);
    }

    // Enter dentro de los formularios de registro / inicio de sesión
    const formulario = document.querySelector('form.form');
    if (formulario && document.querySelector('#contraseña')) {
        formulario.addEventListener('submit', function (e) {
            e.preventDefault();
            if (document.querySelector('#nombre')) login();
            else loginInicio();
        });
    }
});
