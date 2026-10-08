# Carpintero Moderno

Sitio web (ficticio) de una distribuidora de máquinas y herramientas para carpintería, con sede en Tuxtla Gutiérrez, Chiapas. Proyecto académico con **6 secciones**: Inicio, Registro, Quiénes somos, Catálogo, Carrito de compra y Búsqueda de productos.

> Proyecto web **estático** (HTML + CSS + JavaScript vanilla). No requiere compilación, servidor ni dependencias para desarrollarlo: basta abrir `index.html`.

---

## Tabla de contenido

1. [Páginas y requisitos](#páginas-y-requisitos)
2. [Tecnologías](#tecnologías)
3. [Estructura del proyecto](#estructura-del-proyecto)
4. [Reglas de desarrollo](#reglas-de-desarrollo)
5. [Flujo de trabajo con Git (rama `main`)](#flujo-de-trabajo-con-git-rama-main)
6. [Guías rápidas](#guías-rápidas)
7. [Publicación en GitHub Pages](#publicación-en-github-pages)

---

## Páginas y requisitos

Todas las páginas llevan el mismo `<nav>` con una lista `<ul><li>` (Inicio, Registro, Quiénes somos, Catálogo, Carrito, Búsqueda), cargan **solo** `assets/css/styles.css` y `assets/js/script.js`, y no contienen CSS ni JavaScript en línea.

| Página | Archivo | Contenido y JavaScript |
|---|---|---|
| **Inicio** | `index.html` | Carrusel/banner, bienvenida con `<h1>` y `<ul>` de categorías destacadas. |
| **Registro** | `pages/registro.html` | Nombre, correo, contraseña, fecha de nacimiento, teléfono, checkbox de términos y envío. El correo se valida con `pattern` (expresión regular); **no se usa `required`**. JS: verifica que todo esté completo y mantiene el botón deshabilitado hasta marcar los términos. |
| **Quiénes somos** | `pages/nosotros.html` | Giro, misión, visión y valores, más una tabla del equipo (nombre, rol, correo). JS: botón «Ver más» que muestra/oculta información adicional. |
| **Catálogo** | `pages/catalogo.html` | 20 productos (imagen, nombre, precio y «Agregar al carrito») agrupados en Máquinas, Inalámbricos, Manuales y Ofertas. JS: cada clic muestra un aviso e incrementa un contador ficticio en el menú. |
| **Carrito** | `pages/carrito.html` | Productos de demostración con cantidades editables (solo aceptan dígitos). JS: recalcula subtotal, IVA y total al instante. |
| **Búsqueda** | `pages/busqueda.html` | Formulario y área de resultados. JS: muestra «Resultados para la búsqueda de *texto*» y productos ficticios. |

> Los productos del catálogo y del carrito **no se guardan de manera real**: es una demostración.

## Tecnologías

- **HTML5** y **CSS3** (sin preprocesadores).
- **JavaScript ES6+** vanilla.
- [Font Awesome 6.3](https://fontawesome.com/) — iconos (CDN con SRI).
- [SweetAlert2 11.7.3](https://sweetalert2.github.io/) — avisos (incluido en `assets/vendor/`, licencia MIT). Solo se carga en Registro, Catálogo y Carrito.
- [Google Fonts · Poppins](https://fonts.google.com/specimen/Poppins) — tipografía del carrusel de Inicio.

## Estructura del proyecto

```text
.
├── index.html                  # Inicio (debe permanecer en la raíz)
├── pages/
│   ├── registro.html
│   ├── nosotros.html           # Quiénes somos
│   ├── catalogo.html
│   ├── carrito.html
│   └── busqueda.html
├── assets/
│   ├── css/styles.css          # ÚNICA hoja de estilos
│   ├── js/script.js            # ÚNICO script
│   ├── vendor/sweetalert2/     # Librería de terceros servida localmente (+ su LICENSE)
│   └── img/                    # branding, carrusel, categorias, secciones, icons, productos
├── .github/pull_request_template.md
├── .editorconfig
├── .gitattributes
├── .gitignore
└── README.md
```

**Menú y pie.** El `<nav>` y el `<footer>` están escritos directamente en cada HTML (sin JavaScript). Si cambias un enlace, **edítalo en las 6 páginas**. La página activa se marca con `aria-current="page"`.

**URLs relativas y absolutas.**
- *Relativas* para todo lo interno, calculadas según la carpeta de la página: desde `index.html` (`pages/catalogo.html`, `assets/css/styles.css`) y desde `pages/` (`../index.html`, `catalogo.html`, `../assets/css/styles.css`). Así el sitio funciona igual en local y publicado.
- *Absolutas* (`https://…`) solo para recursos externos: Google Maps y el sitio publicado en el pie de página, además de los CDN de Font Awesome y Google Fonts. Los enlaces que abren otra pestaña llevan `target="_blank" rel="noopener noreferrer"`.

## Reglas de desarrollo

### Nombres de archivos y carpetas
- `kebab-case`, **minúsculas**, **sin acentos, `ñ`, espacios ni caracteres como `#`** (ej.: `taladro-bosch-gsr-180.jpg`).
- Rutas siempre con `/`, **nunca `\`**. GitHub Pages distingue mayúsculas de minúsculas: respeta exactamente el nombre del archivo.
- Nada de rutas que empiecen con `/` (`/assets/...`): rompen en GitHub Pages cuando el sitio vive en un subdirectorio.
- Una imagen por producto, en `assets/img/productos/<categoría>/`. No subas duplicados.

### HTML
- HTML5 semántico (`header`, `nav`, `main`, `section`, `footer`), un solo `<h1>` por página, `lang="es"`.
- Toda `<img>` lleva `alt` descriptivo; todo `<input>` lleva `<label>` o `aria-label`.
- **Prohibido** el CSS en línea (`style="..."`, `<style>`) y el JavaScript en línea (`<script>` con código, `onclick`, `onload`…). Todo va en `styles.css` y `script.js`.
- IDs únicos por página.
- En el formulario de registro **no** se usa el atributo `required`: la comprobación de campos completos la hace `script.js`.

### CSS
- Todos los estilos viven en `assets/css/styles.css`, organizado por secciones (comentarios numerados).
- Clases nuevas en `kebab-case` (`.tarjeta-producto`). El código heredado mezcla estilos (`pie_pagina`, `alternar_btn`); **no lo renombres de golpe**: hazlo en un PR dedicado.
- Los estilos de una página se escriben con clases propias para no afectar a las demás (hay una sola hoja compartida).
- Diseña *mobile-first* y prueba en ≤ 390 px y ≥ 1280 px.

### JavaScript
- ES6+: `const`/`let` (no `var`), `===`, funciones flecha, plantillas de texto.
- `camelCase` para variables y funciones, `PascalCase` para clases.
- Todo el código está en `assets/js/script.js`, dividido en funciones `iniciarXxx()` que solo actúan si la página contiene sus elementos.
- Las librerías de terceros van en `assets/vendor/<nombre>/` con su licencia, fijadas a una versión concreta (no enlaces a CDN sin `integrity`).
- Nunca insertes texto del usuario con `innerHTML`: usa `textContent` (riesgo XSS).
- Sin `console.log` olvidados ni código comentado: para eso está Git.

### Imágenes y rendimiento
- Peso objetivo: **< 200 KB** por imagen de producto y **< 400 KB** por imagen de carrusel. Preferible WebP/AVIF con fallback.
- `loading="lazy"` en imágenes fuera del primer pantallazo (ya aplicado a las tarjetas de producto).
- `alt` descriptivo y **correcto** (que corresponda al producto mostrado).

### Seguridad y datos
- **Nunca** subas credenciales, claves o datos personales reales.
- El registro y la compra son **simulados**: no se guarda ningún dato.

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

## Guías rápidas

### Agregar o editar un producto
1. Guarda la imagen en `assets/img/productos/<categoría>/` con nombre `kebab-case`.
2. Copia una tarjeta `<div class="product">…</div>` de `pages/catalogo.html` dentro de la sección de su categoría (`#maquinas`, `#inalambricos`, `#manuales` u `#ofertas`) y cambia imagen, `alt`, nombre, precio y descripción (la que aparece en «MÁS»). En las ofertas añade `<p class="precio_ant"><s>$ …</s></p>` con el precio anterior.
3. Verifica la página en el navegador.

### Cambiar los integrantes del equipo
Edita la tabla de `pages/nosotros.html` (sección `#equipo`): nombre, rol y correo de cada integrante.

### Crear una página nueva
1. Colócala en `pages/` y copia el `<head>`, el `<nav>` y el `<footer>` de una página existente (los enlaces ya usan las rutas correctas desde `pages/`).
2. Enlaza **solo** `assets/css/styles.css` y `assets/js/script.js` (y SweetAlert2 si usas avisos).
3. Añade el enlace en el `<nav>` de **todas** las páginas.
4. Agrega a `script.js` una función `iniciarXxx()` y llámala en el arranque.

## Publicación en GitHub Pages

1. Crea un repositorio en GitHub y sube **todo** el proyecto (con `index.html` en la raíz).
   ```bash
   git init
   git add .
   git commit -m "feat: sitio con las 6 secciones requeridas"
   git branch -M main
   git remote add origin https://github.com/<usuario>/<repositorio>.git
   git push -u origin main
   ```
2. En GitHub: **Settings → Pages → Build and deployment → Source: *Deploy from a branch***, rama **`main`**, carpeta **`/ (root)`** y *Save*.
3. Espera un par de minutos: el sitio queda en `https://<usuario>.github.io/<repositorio>/`.
4. Actualiza el enlace «Sitio en GitHub Pages» del pie de página (en las 6 páginas) y la URL `og:image` con la dirección real.

Cualquier *push* a `main` se publica automáticamente: **prueba antes de subir**.

---

© 2023 **Carpintero Moderno** — Todos los Derechos Reservados.
