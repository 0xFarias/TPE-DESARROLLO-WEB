# Club de Código — Formulario de registro

Proyecto de la materia Desarrollo Web.
Autor: Jose Luis Farias Valdez

Página de registro para un club de programación (ficticio): a la izquierda la presentación del club y a la derecha el formulario. La página solo valida los datos del formulario; no guarda usuarios ni tiene inicio de sesión.

## Estructura

```
proyecto-formulario/
├── index.html      → página principal con el formulario (Sesión 1)
├── css/
│   └── style.css   → estilos (Sesión 2 + estados de la Sesión 3)
├── js/
│   └── script.js   → validaciones (Sesión 3)
└── img/            → imágenes del proyecto
```

Recurso externo: fuente **Bricolage Grotesque** (Google Fonts).

## Sesión 1 – HTML5

El formulario tiene los 5 campos solicitados:

| Campo | Elemento / tipo | Atributos |
|---|---|---|
| Nombre completo | `input type="text"` | `required`, `minlength`, `maxlength`, `pattern`, `placeholder` |
| Correo electrónico | `input type="email"` | `required`, `maxlength`, `placeholder` |
| Contraseña | `input type="password"` | `required`, `minlength="8"`, `maxlength`, `pattern`, `placeholder` |
| Edad | `input type="number"` | `required`, `min="16"`, `max="99"`, `step`, `placeholder` |
| Teléfono | `select` (código de país) + `input type="tel"` | `required`, `pattern="[0-9]{7,10}"`, `maxlength`, `placeholder` |

- Cada campo tiene su `label` enlazado con `for` / `id`.
- Cada campo tiene un texto de ayuda (`small`) enlazado con `aria-describedby`.
- Botón final: `button type="submit"` (Crear mi cuenta).

## Sesión 2 – CSS

Estilo: fondo amarillo plano, tarjeta blanca con borde negro grueso y sombras sólidas (sin difuminar).

| Parte | Qué hace | Técnica |
|---|---|---|
| Variables (`:root`) | Colores, fuente, bordes y sombras en un solo lugar | Variables CSS |
| Página (`body`) | Encabezado, contenido y pie en tres filas | **Grid** (`grid-template-rows`) |
| Encabezado | Barra superior con el logo | **Flexbox** |
| Contenido | Presentación y formulario en dos columnas | **Grid** (`grid-template-columns`) |
| Temas del club | Etiquetas en fila que bajan de línea si no caben | **Flexbox** (`flex-wrap`) |
| Formulario | Ubicación de cada campo por nombre de área; edad y teléfono comparten fila | **Grid** (`grid-template-areas`) |
| Campos | Label, campo y ayuda apilados; al escribir el campo se levanta con sombra azul | **Flexbox** + `:focus` |
| Teléfono | Código de país y número en la misma fila | **Flexbox** |
| Botón | Sombra sólida; al pasar el mouse sube y al hacer clic se "hunde" | `transform`, `box-shadow`, `transition` |

### Diseño adaptable

| Ancho de pantalla | Cambio |
|---|---|
| Más de 960 px | Presentación y formulario lado a lado |
| 960 px o menos | Presentación arriba y formulario abajo |
| 560 px o menos | El formulario pasa a una sola columna y se reducen los márgenes |

Si el usuario tiene activada la opción de reducir movimiento en su sistema, se quitan las animaciones (`prefers-reduced-motion`).

## Sesión 3 – JavaScript y validaciones

`js/script.js` está vinculado al final del `<body>` con `defer`.

### Manipulación del DOM

| Qué se hace | Cómo |
|---|---|
| Seleccionar el formulario, los campos y el mensaje | `document.querySelector()` |
| Leer lo que escribió el usuario | `.value`, `.validity.badInput` |
| Pintar el campo en rojo o verde | `classList.toggle('campo--error' / 'campo--ok')` |
| Cambiar el texto de ayuda por el error | `textContent` |
| Marcar el campo como inválido para lectores de pantalla | `setAttribute('aria-invalid', …)` |
| Mostrar u ocultar el mensaje general | `hidden` |
| Borrar lo que no sea número en el teléfono | modificar `.value` |
| Llevar el cursor al primer error | `focus()` |
| Limpiar el formulario después del éxito | `reset()` |

### Eventos

| Evento | Dónde | Qué hace |
|---|---|---|
| `blur` | Cada campo | Al salir del campo lo valida y muestra el error si hay |
| `input` | Cada campo | Mientras escribe, vuelve a validar (solo si ya salió del campo antes, para no mostrar errores desde la primera letra). En el teléfono borra lo que no sea número |
| `submit` | Formulario | `preventDefault()`, valida los 5 campos; si hay errores no envía, muestra un mensaje y pone el foco en el primer error; si todo está bien muestra el mensaje de éxito y limpia el formulario |

### Validaciones

| Campo | Reglas |
|---|---|
| Nombre | Obligatorio; solo letras y espacios; al menos nombre y apellido; máximo 60 caracteres |
| Correo | Obligatorio; formato `nombre@correo.com` |
| Contraseña | Obligatoria; mínimo 8 caracteres (dice cuántos faltan); máximo 30; letras y números |
| Edad | Obligatoria; debe ser número; entero; entre 16 y 99 |
| Teléfono | Obligatorio; solo números; de 7 a 10 dígitos |

El formulario usa `noValidate` desde JavaScript para que los mensajes sean los propios. Si JavaScript no carga, los atributos HTML de la Sesión 1 siguen validando.

## Cómo probarlo

1. Abrir `index.html` en el navegador (con internet, para que cargue la fuente).
2. Pulsar **Crear mi cuenta** con los campos vacíos: aparecen los 5 errores y no se envía nada.
3. Llenar los campos con datos incorrectos (por ejemplo, edad 15 o contraseña de 3 letras) y ver el mensaje de cada error.
4. Corregirlos: cada campo se pone verde.
5. Pulsar **Crear mi cuenta** con todo correcto: aparece el mensaje de éxito y el formulario queda limpio.
