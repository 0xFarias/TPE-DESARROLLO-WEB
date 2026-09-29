/* ==========================================================
   Sesión 3 – JavaScript y validaciones
   Registro del Club de Código
   ----------------------------------------------------------
   1. Elementos del DOM
   2. Reglas de validación de cada campo
   3. Mostrar errores y mensajes en la página
   4. Eventos de los campos: input y blur
   5. Evento submit: validar todo antes de enviar
   ========================================================== */

'use strict';


/* ---------- 1. Elementos del DOM ---------- */
const formulario = document.querySelector('#formulario-registro');
const mensaje = document.querySelector('#mensaje');

// Los 5 campos del formulario, en el mismo orden en que aparecen
const campos = {
  nombre: document.querySelector('#nombre'),
  correo: document.querySelector('#correo'),
  password: document.querySelector('#password'),
  edad: document.querySelector('#edad'),
  telefono: document.querySelector('#telefono'),
};

// Desactivamos los globos de validación del navegador: ahora valida JavaScript.
// Si JavaScript no carga, el formulario sigue validando con los atributos HTML.
formulario.noValidate = true;

// Guardamos el texto de ayuda original de cada campo para poder restaurarlo
document.querySelectorAll('.ayuda').forEach((ayuda) => {
  ayuda.dataset.original = ayuda.textContent;
});


/* ---------- 2. Reglas de validación ----------
   Cada regla recibe el campo y devuelve:
   - ''                → el dato es válido
   - 'mensaje de error' → el dato es inválido                      */
const SOLO_LETRAS = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü ]+$/;
const FORMATO_CORREO = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;
const SOLO_NUMEROS = /^[0-9]+$/;

const reglas = {
  nombre(campo) {
    const valor = campo.value.trim();
    if (valor === '') return 'Escribe tu nombre completo.';
    if (!SOLO_LETRAS.test(valor)) return 'Usa solo letras y espacios, sin números ni símbolos.';
    if (valor.split(/\s+/).length < 2) return 'Escribe al menos un nombre y un apellido.';
    if (valor.length > 60) return 'El nombre puede tener como máximo 60 caracteres.';
    return '';
  },

  correo(campo) {
    const valor = campo.value.trim();
    if (valor === '') return 'Escribe tu correo electrónico.';
    if (!FORMATO_CORREO.test(valor)) return 'El correo debe tener el formato nombre@correo.com.';
    return '';
  },

  password(campo) {
    const valor = campo.value;
    if (valor === '') return 'Crea una contraseña.';
    if (valor.length < 8) {
      const faltan = 8 - valor.length;
      return `Te ${faltan === 1 ? 'falta 1 carácter' : `faltan ${faltan} caracteres`} (mínimo 8).`;
    }
    if (valor.length > 30) return 'La contraseña puede tener como máximo 30 caracteres.';
    if (!/[A-Za-z]/.test(valor) || !/[0-9]/.test(valor)) return 'Combina letras y números.';
    return '';
  },

  edad(campo) {
    // badInput: el usuario escribió algo que no es un número
    if (campo.validity.badInput) return 'La edad debe ser un número.';
    if (campo.value.trim() === '') return 'Escribe tu edad.';
    const edad = Number(campo.value);
    if (!Number.isInteger(edad)) return 'La edad debe ser un número entero, sin decimales.';
    if (edad < 16 || edad > 99) return 'La edad debe estar entre 16 y 99 años.';
    return '';
  },

  telefono(campo) {
    const valor = campo.value.trim();
    if (valor === '') return 'Escribe tu número de teléfono.';
    if (!SOLO_NUMEROS.test(valor)) return 'Usa solo números, sin espacios ni guiones.';
    if (valor.length < 7 || valor.length > 10) return 'El número debe tener de 7 a 10 dígitos.';
    return '';
  },
};


/* ---------- 3. Mostrar errores y mensajes en la página ---------- */

// Pinta el campo en rojo (error) o verde (correcto) y cambia su texto de ayuda
function mostrarEstadoCampo(nombre, error) {
  const campo = campos[nombre];
  const contenedor = campo.closest('.campo');
  const ayuda = contenedor.querySelector('.ayuda');
  const hayError = error !== '';

  contenedor.classList.toggle('campo--error', hayError);
  contenedor.classList.toggle('campo--ok', !hayError);
  campo.setAttribute('aria-invalid', hayError ? 'true' : 'false');
  ayuda.textContent = hayError ? error : ayuda.dataset.original;
}

// Valida un campo, muestra el resultado y devuelve true si es válido
function validarCampo(nombre) {
  const error = reglas[nombre](campos[nombre]);
  mostrarEstadoCampo(nombre, error);
  return error === '';
}

// Deja un campo como al inicio (sin rojo ni verde)
function limpiarCampo(nombre) {
  const campo = campos[nombre];
  const contenedor = campo.closest('.campo');
  const ayuda = contenedor.querySelector('.ayuda');

  contenedor.classList.remove('campo--error', 'campo--ok');
  campo.removeAttribute('aria-invalid');
  delete campo.dataset.tocado;
  ayuda.textContent = ayuda.dataset.original;
}

// Muestra el mensaje general del formulario: tipo 'error' o 'exito'
function mostrarMensaje(tipo, texto) {
  mensaje.className = `mensaje mensaje--${tipo}`;
  mensaje.textContent = texto;
  mensaje.hidden = false;
}

function ocultarMensaje() {
  mensaje.hidden = true;
  mensaje.textContent = '';
}


/* ---------- 4. Eventos de los campos: input y blur ---------- */

// En el teléfono se borran al instante los caracteres que no son números.
// Va primero para que la validación de abajo reciba el número ya limpio.
campos.telefono.addEventListener('input', () => {
  campos.telefono.value = campos.telefono.value.replace(/[^0-9]/g, '');
});

for (const nombre of Object.keys(campos)) {
  const campo = campos[nombre];

  // blur: el usuario sale del campo → se marca como "tocado" y se valida
  campo.addEventListener('blur', () => {
    campo.dataset.tocado = 'si';
    validarCampo(nombre);
  });

  // input: mientras escribe, se valida solo si ya había salido del campo antes
  // (así no aparecen errores desde la primera letra)
  campo.addEventListener('input', () => {
    ocultarMensaje();
    if (campo.dataset.tocado) {
      validarCampo(nombre);
    }
  });
}


/* ---------- 5. Evento submit: validar todo antes de enviar ---------- */
formulario.addEventListener('submit', (evento) => {
  evento.preventDefault(); // evita que el formulario se envíe y recargue la página

  // Se validan los 5 campos y se guardan los que tienen error
  const invalidos = Object.keys(campos).filter((nombre) => {
    campos[nombre].dataset.tocado = 'si';
    return !validarCampo(nombre);
  });

  // Si hay datos inválidos, NO se envía: se avisa y se lleva al primer error
  if (invalidos.length > 0) {
    const cuantos = invalidos.length === 1 ? 'el campo marcado' : `los ${invalidos.length} campos marcados`;
    mostrarMensaje('error', `No se pudo crear la cuenta. Revisa ${cuantos} en rojo.`);
    campos[invalidos[0]].focus();
    return;
  }

  // Todo es válido: se muestra el mensaje de éxito y se limpia el formulario
  const primerNombre = campos.nombre.value.trim().split(/\s+/)[0];
  formulario.reset();
  Object.keys(campos).forEach(limpiarCampo);
  mostrarMensaje('exito', `Cuenta creada. Te damos la bienvenida al club, ${primerNombre}.`);
});
