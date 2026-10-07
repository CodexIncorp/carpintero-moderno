# Carpintero Moderno

Sitio web de una distribuidora (ficticia) de máquinas y herramientas para carpintería, con sede en Tuxtla Gutiérrez, Chiapas. Incluye catálogo por categorías, ofertas, carrito de compras, registro/inicio de sesión simulados y formulario de contacto.

> Proyecto web **estático** (HTML + CSS + JavaScript vanilla). No requiere compilación ni dependencias para desarrollarlo.

---

## Tabla de contenido

1. [Características](#características)
2. [Tecnologías](#tecnologías)
3. [Estructura del proyecto](#estructura-del-proyecto)
4. [Cómo ejecutarlo en local](#cómo-ejecutarlo-en-local)
5. [Reglas de desarrollo](#reglas-de-desarrollo)
6. [Flujo de trabajo con Git (rama `main`)](#flujo-de-trabajo-con-git-rama-main)
7. [Guías rápidas](#guías-rápidas)
8. [Deuda técnica y problemas conocidos](#deuda-técnica-y-problemas-conocidos)
9. [Despliegue](#despliegue)

---

## Características

| Área | Descripción |
|---|---|
| **Inicio** | Carrusel automático/manual con promociones, beneficios, productos destacados y accesos a las categorías. Filtro por categoría (Todos / Máquinas / Inalámbricos / Manuales). |
| **Catálogo** | Páginas por categoría: *Máquinas*, *Inalámbricos*, *Herramientas manuales* y *Ofertas*. Las tarjetas se generan a partir de [`data/productos.json`](data/productos.json) (imagen, precio, precio anterior en ofertas, botón "Agregar al carrito" y descripción desplegable). |
| **Carrito** | Desplegable en la barra superior. Evita duplicados, permite eliminar/vaciar y persiste en `localStorage` (solo la clave `productos`). |
| **Compra** | Resumen con cantidades editables y totales que se recalculan al instante. Los precios **ya incluyen IVA (16 %)**: el total es la suma de los precios y el subtotal/IVA se desglosan de él. Valida datos de envío (campos y formato de correo) y simula la confirmación del pedido. |
| **Cuenta (simulada)** | Registro e inicio de sesión guardados en `sessionStorage` (el correo no distingue mayúsculas; Enter envía el formulario). Con sesión iniciada, **todos los precios del catálogo** (`.precio span`) reciben **5 % de descuento**. |
| **Nosotros** | Giro, misión, visión y valores de la empresa. |
| **Historia** | Relato de cómo comenzó el negocio. |
| **Contacto** | Formulario enviado por correo mediante [FormSubmit](https://formsubmit.co), teléfono y correo de la empresa. |
| **Diseño responsivo** | Menú hamburguesa en móvil, submenús desplegables y rejilla adaptable. |

## Tecnologías

- **HTML5** y **CSS3** (sin preprocesadores).
- **JavaScript ES6+** vanilla (clases, Web Components, `fetch`, `localStorage` / `sessionStorage`).
- [Font Awesome 6.3](https://fontawesome.com/) — iconos (CDN con SRI).
- [SweetAlert2 11.7.3](https://sweetalert2.github.io/) — alertas y confirmaciones (incluido en `assets/vendor/`, licencia MIT).
- [Google Fonts · Poppins](https://fonts.google.com/specimen/Poppins) — tipografía de la página de inicio.
- [FormSubmit](https://formsubmit.co) — envío del formulario de contacto sin backend.

## Estructura del proyecto

```text
.
├── index.html                  # Página de inicio (debe permanecer en la raíz)
├── data/
│   └── productos.json          # Catálogo completo (única fuente de verdad de los productos)
├── pages/
│   ├── catalogo/
│   │   ├── maquinas.html
│   │   ├── inalambricos.html
│   │   ├── manuales.html
│   │   └── ofertas.html
│   ├── nosotros.html           # ¿Quiénes somos?
│   ├── historia.html
│   ├── contacto.html
│   ├── compra.html             # Carrito / checkout
│   ├── registro.html
│   └── iniciar-sesion.html
├── assets/
│   ├── css/
│   │   ├── base.css            # Estilos globales: navbar, footer, tipografía
│   │   ├── productos.css       # Solo la página de inicio (tarjetas, carrusel, filtro)
│   │   ├── carrito.css         # Páginas de catálogo (rejilla de productos y carrito)
│   │   ├── compra.css
│   │   ├── contacto.css
│   │   ├── historia.css
│   │   └── auth.css            # Registro e inicio de sesión
│   ├── js/
│   │   ├── utils.js            # rutaDesdeRaiz() y escaparHTML()
│   │   ├── componentes.js      # <cm-header> y <cm-footer> (menú y pie únicos)
│   │   ├── menu.js             # Navbar: hamburguesa, acordeones, doble clic
│   │   ├── catalogo.js         # Pinta las tarjetas desde data/productos.json
│   │   ├── productos.js        # Filtro por categoría del inicio
│   │   ├── carrusel.js         # Carrusel del inicio
│   │   ├── carrito.js          # Clase Carrito (lógica, totales, localStorage)
│   │   ├── pedido.js           # Eventos del carrito en el catálogo
│   │   ├── compra.js           # Checkout
│   │   └── auth.js             # Registro, login, sesión y descuento
│   ├── vendor/
│   │   └── sweetalert2/        # Librería de terceros servida localmente (+ su LICENSE)
│   └── img/
│       ├── branding/           # Logos
│       ├── carrusel/           # slide-1.jpg … slide-5.jpg
│       ├── categorias/         # Portadas de categoría
│       ├── secciones/          # Imágenes de Nosotros, Historia, Registro
│       ├── icons/              # SVG
│       └── productos/
│           ├── maquinas/
│           ├── inalambricos/
│           ├── manuales/
│           └── ofertas/
├── .github/pull_request_template.md
├── .editorconfig
├── .gitattributes
├── .gitignore
└── README.md
```

**Menú y pie únicos.** Todas las páginas usan `<cm-header carrito="…">` y `<cm-footer>` (definidos en `componentes.js`). Para cambiar un enlace del menú o el pie, edita **solo ese archivo**. El atributo `carrito` elige la variante del carrito en la barra (`desplegable`, `oculto`, `enlace` o `ninguno`; ver el comentario al inicio del archivo).

**Rutas entre páginas.** Cada `<html>` declara `data-raiz` con la ruta relativa a la raíz (`"./"`, `"../"` o `"../../"`). El JavaScript usa `rutaDesdeRaiz('pages/compra.html')` para redirigir, de modo que funciona igual desde cualquier carpeta. **Si creas una página nueva, añade `data-raiz` correctamente.**

## Cómo ejecutarlo en local

Necesitas un servidor estático: el catálogo se carga con `fetch()` y los navegadores lo bloquean si abres el HTML con `file://`.

```bash
git clone <url-del-repositorio>
cd <carpeta-del-repositorio>

# Opción 1: Python (preinstalado en la mayoría de sistemas)
python3 -m http.server 8000

# Opción 2: Node
npx serve .
```

Abre <http://localhost:8000>. También sirve la extensión **Live Server** de VS Code.

> Font Awesome y Google Fonts se cargan por CDN y requieren conexión a internet.

## Reglas de desarrollo

### Nombres de archivos y carpetas
- `kebab-case`, **minúsculas**, **sin acentos, `ñ`, espacios ni caracteres como `#`** (ej.: `taladro-bosch-gsr-180.jpg`).
- Rutas siempre con `/`, **nunca `\`**. GitHub Pages distingue mayúsculas de minúsculas: respeta exactamente el nombre del archivo.
- Rutas **relativas** (no `/assets/...` ni URLs absolutas) para que el sitio funcione en local y desplegado.
- Una imagen por producto, en `assets/img/productos/<categoría>/`. No subas duplicados.

### HTML
- HTML5 semántico (`header`, `nav`, `main`, `section`, `footer`), un solo `<h1>` por página, `lang="es"`.
- Toda `<img>` lleva `alt` descriptivo; todo `<input>` lleva `<label>` o `aria-label`.
- **No pongas lógica en el HTML**: sin `<script>` inline ni manejadores `onclick`/`onload`/`ondblclick`. Usa `addEventListener` desde `assets/js/`.
- **No copies el menú ni el pie**: usa `<cm-header>` / `<cm-footer>`.
- **No escribas tarjetas de producto a mano**: se generan desde `data/productos.json`.
- IDs únicos por página.

### CSS
- Estilos en `assets/css/`; nada de `style="..."` en línea.
- `base.css` es solo para lo compartido; los estilos de una página van en su propio archivo.
- Clases nuevas en `kebab-case` (`.tarjeta-producto`). El código heredado mezcla estilos (`pie_pagina`, `alternar_btn`); **no lo renombres de golpe**: hazlo en un PR dedicado.
- Diseña *mobile-first* y prueba en ≤ 390 px y ≥ 1280 px.

### JavaScript
- ES6+: `const`/`let` (no `var`), `===`, funciones flecha, plantillas de texto.
- `camelCase` para variables y funciones, `PascalCase` para clases.
- Un archivo = una responsabilidad. No declares globales nuevas; si necesitas compartir algo, que sea explícito (ver `utils.js`).
- Las librerías de terceros van en `assets/vendor/<nombre>/` con su licencia, fijadas a una versión concreta (no enlaces a CDN sin `integrity`).
- Nunca construyas HTML con datos variables vía `innerHTML` sin escaparlos con `escaparHTML()` (`utils.js`) — riesgo XSS. Prefiere `textContent`.
- Sin `console.log` olvidados ni código comentado: para eso está Git.

### Imágenes y rendimiento
- Peso objetivo: **< 200 KB** por imagen de producto y **< 400 KB** por imagen de carrusel. Preferible WebP/AVIF con fallback.
- Tamaños `width`/`height` declarados para evitar saltos de diseño; `loading="lazy"` en imágenes fuera del primer pantallazo (ya aplicado a las tarjetas de producto y categorías).
- `alt` descriptivo y **correcto** (que corresponda al producto mostrado).

### Seguridad y datos
- **Nunca** subas credenciales, claves o datos personales reales.
- La autenticación actual es **simulada** y guarda contraseñas en texto plano en `sessionStorage`: es solo una demostración. No la uses con datos reales.

### Idioma
- Interfaz, comentarios y mensajes de commit en **español**. Identificadores de código en español, coherentes con lo ya existente.

## Flujo de trabajo con Git (rama `main`)

El equipo trabaja sobre **`main`** (*trunk-based development*): `main` **siempre debe estar en un estado funcional y desplegable**.

1. **Sincroniza antes de empezar y antes de subir**
   ```bash
   git pull --rebase origin main
   ```
2. **Cambios pequeños y frecuentes.** Un commit = una idea. Evita acumular días de trabajo sin integrar.
3. **Cambios grandes o riesgosos → rama corta + Pull Request.** Crea `feat/…`, `fix/…`, `docs/…` o `refactor/…`, intégrala a `main` en pocos días y bórrala. Se usa la [plantilla de PR](.github/pull_request_template.md).
4. **Nunca `git push --force` sobre `main`.** Si usas rebase en tu rama local, fuerza solo en *tu* rama con `--force-with-lease`.
5. **Prueba antes de subir**: recorre las páginas afectadas y revisa que la consola del navegador esté sin errores.
6. **Resuelve conflictos localmente** (`git pull --rebase`) y vuelve a probar antes de hacer `push`.
7. **No hagas commit de archivos generados o personales** (ver `.gitignore`).

> Recomendación para el administrador del repositorio: en *Settings → Branches* protege `main` (requerir PR con al menos 1 aprobación y bloquear *force push*).

### Mensajes de commit — [Conventional Commits](https://www.conventionalcommits.org/es/v1.0.0/)

```text
<tipo>(<ámbito opcional>): <descripción en imperativo, minúsculas, sin punto final>
```

| Tipo | Uso |
|---|---|
| `feat` | Nueva funcionalidad |
| `fix` | Corrección de un error |
| `refactor` | Reorganización sin cambiar comportamiento |
| `style` | Formato o CSS sin cambio funcional |
| `docs` | Documentación |
| `perf` | Mejora de rendimiento (p. ej. optimizar imágenes) |
| `chore` | Mantenimiento, configuración |

Ejemplos:

```text
feat(carrito): permitir modificar la cantidad desde el desplegable
fix(compra): validar el formato del correo electrónico
perf(img): convertir imágenes del carrusel a webp
docs: documentar cómo agregar un producto
```

## Guías rápidas

### Agregar o editar un producto
1. Guarda la imagen en `assets/img/productos/<categoría>/` con nombre `kebab-case`.
2. Agrega un objeto a [`data/productos.json`](data/productos.json). **No toques el HTML**: las páginas lo renderizan solas.

   ```json
   {
     "id": 21,
     "nombre": "TALADRO DE BANCO 13MM TRUPER",
     "categoria": "maquinas",
     "precio": 2500.00,
     "imagen": "productos/maquinas/taladro-banco-truper.jpg",
     "alt": "Taladro de banco Truper",
     "descripcion": "Texto que aparece en el desplegable «MÁS». Usa \n para un salto de línea.",
     "inicio": 10
   }
   ```

   | Campo | Notas |
   |---|---|
   | `id` | **Único** y numérico. El carrito lo usa para evitar duplicados. |
   | `categoria` | `maquinas`, `inalambricos`, `manuales` u `ofertas`. Define en qué página aparece. |
   | `precio` | Número, **IVA incluido**, sin separador de miles. |
   | `precioAnterior` | Opcional. Solo para ofertas: se muestra tachado. |
   | `imagen` | Ruta relativa a `assets/img/`. |
   | `alt` | Texto alternativo **correcto** (que describa ese producto). |
   | `claseImagen` | Opcional. Ajuste de altura de imagen (`inal_2`, `inal_3`). |
   | `inicio` | Opcional. Si existe, el producto aparece en la portada en esa posición. Los de `ofertas` solo se ven con el botón «Todos». |

3. Los textos se escapan automáticamente: no pongas HTML en `nombre`, `alt` ni `descripcion`.
4. Verifica en local la página de su categoría (y el inicio, si usaste `inicio`).

### Crear una página nueva
1. Colócala en `pages/` y copia el `<head>` de una página existente (el `<head>` de `pages/contacto.html` sirve de modelo).
2. Declara `data-raiz` según la profundidad (`"../"` en `pages/`, `"../../"` en `pages/catalogo/`).
3. Carga `utils.js` y `componentes.js` en el `<head>`, usa `<cm-header carrito="…">` y `<cm-footer>` en el `<body>`, y carga `menu.js` al final del `<body>`.
4. Para añadirla al menú, edita `assets/js/componentes.js` (una sola vez).
5. Si lista productos, agrega `<div id="lista-productos" data-catalogo="…">` y carga `carrito.js`, `pedido.js` y `catalogo.js` al final del `<body>`.

## Deuda técnica y problemas conocidos

- **Autenticación simulada** (contraseñas en texto plano en `sessionStorage`): es solo una demostración y no debe usarse con datos reales.
- **El menú y el catálogo dependen de JavaScript.** Sin JS las páginas muestran el contenido principal pero no la navegación ni los productos (hay un aviso `<noscript>` en el catálogo). Si algún día importa el SEO o la carga inicial, la opción natural es generar el HTML en build (Eleventy/Astro) usando los mismos `componentes` y `productos.json`.

## Despliegue

Según las URLs del proyecto, el sitio se publica con **GitHub Pages** desde la rama `main` (carpeta raíz) en `https://carpinteromoderno.github.io/`. Por eso `index.html` está en la raíz y todas las rutas son relativas. Cualquier *push* a `main` se publica automáticamente: **prueba antes de subir**.

Dos URLs absolutas dependen del dominio y deben actualizarse si este cambia: la imagen `og:image` de cada página y el campo `_next` del formulario de contacto (`pages/contacto.html`).

---

© 2023 **Carpintero Moderno** — Todos los derechos reservados.
