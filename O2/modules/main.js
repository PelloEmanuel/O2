/**
 * main.js — Módulo principal de eventos y conexión DOM
 *
 * Responsabilidad:
 *   - Registrar todos los event listeners
 *   - Orquestar la validación del formulario
 *   - Llamar a dom.js para actualizaciones visuales
 *   - Mostrar mensaje de éxito en el DOM al enviar correctamente
 *
 * NO genera ni descarga archivos .txt porque el enunciado
 * prohíbe server.js y el navegador no puede escribir en
 * carpetas del servidor sin un backend.
 */

import {
    aplicarModo,
    marcarInvalido,
    marcarValido,
    limpiarValidaciones,
    mostrarMensaje,
    ocultarMensaje
} from './dom.js';

/* ===== ESTADO DEL TEMA ===== */

/**
 * Rastrea si el modo oscuro está activo durante la sesión.
 * No usa localStorage — vive en memoria mientras la pestaña esté abierta.
 * @type {boolean}
 */
let modoOscuroActivo = false;

/* ===== REFERENCIAS AL DOM ===== */

/** @type {HTMLButtonElement} Botón de alternancia del tema */
const btnModo = document.getElementById('btnModo');

/** @type {HTMLFormElement} Formulario de contacto */
const formContacto = document.getElementById('formContacto');

/** @type {HTMLInputElement} Campos del formulario */
const inputNombre   = document.getElementById('nombre');
const inputApellido = document.getElementById('apellido');
const inputEmail    = document.getElementById('email');
const inputTelefono = document.getElementById('telefono');
const inputDni      = document.getElementById('dni');

/* ===== EVENTO 1: MODO CLARO / OSCURO (click) ===== */

/**
 * Evento: click sobre el botón de modo oscuro/claro.
 * Alterna modoOscuroActivo y llama a aplicarModo() para
 * actualizar la clase del body y el texto del botón.
 *
 * Por qué click: es la acción directa del usuario sobre un control de UI.
 */
if (btnModo) {
    btnModo.addEventListener('click', () => {
        modoOscuroActivo = !modoOscuroActivo;
        aplicarModo(modoOscuroActivo, btnModo);
    });
}

/* ===== EVENTO 2: VALIDACIÓN EN TIEMPO REAL (input) ===== */

/**
 * Evento: input en cada campo del formulario.
 * Valida el campo mientras el usuario escribe,
 * dando feedback visual inmediato sin esperar al envío.
 *
 * Por qué input: responde a cada tecla, no solo al perder el foco.
 */
if (inputNombre)   inputNombre.addEventListener('input',   () => validarNombre(inputNombre));
if (inputApellido) inputApellido.addEventListener('input', () => validarNombreApellido(inputApellido));
if (inputEmail)    inputEmail.addEventListener('input',    () => validarEmail(inputEmail));
if (inputTelefono) inputTelefono.addEventListener('input', () => validarTelefono(inputTelefono));
if (inputDni)      inputDni.addEventListener('input',      () => validarDni(inputDni));

/* ===== EVENTO 3: ENVÍO DEL FORMULARIO (submit) ===== */

/**
 * Evento: submit del formulario de contacto.
 *
 * Flujo:
 *   1. Previene el envío nativo del navegador (event.preventDefault)
 *   2. Valida todos los campos
 *   3. Si hay errores → muestra mensaje de error en el DOM
 *   4. Si todo es válido → muestra mensaje de éxito y limpia el formulario
 *
 * Por qué submit: es el evento correcto para interceptar el envío del form.
 * No se genera ni descarga ningún archivo .txt porque el enunciado
 * prohíbe server.js y el navegador no puede guardar en /data sin backend.
 */
if (formContacto) {
    formContacto.addEventListener('submit', (event) => {

        // Paso 1: Prevenir envío nativo — OBLIGATORIO según enunciado
        event.preventDefault();

        // Paso 2: Ejecutar todas las validaciones
        const nombreOk   = validarNombre(inputNombre);
        const apellidoOk = validarNombreApellido(inputApellido);
        const emailOk    = validarEmail(inputEmail);
        const telefonoOk = validarTelefono(inputTelefono);
        const dniOk      = validarDni(inputDni);

        // Paso 3: Si algún campo es inválido, mostrar mensaje general en el DOM
        if (!nombreOk || !apellidoOk || !emailOk || !telefonoOk || !dniOk) {
            mostrarMensaje(
                '⚠️ Por favor corregí los campos marcados en rojo antes de continuar.',
                'danger'
            );
            return;
        }

        // Paso 4: Todos los campos válidos → mostrar mensaje de éxito en el DOM
        ocultarMensaje();

        mostrarMensaje(
            '✅ ¡Tu formulario fue recibido correctamente! Nos comunicaremos a la brevedad.',
            'success'
        );

        // Limpiar campos y clases de validación tras el envío exitoso
        limpiarValidaciones([inputNombre, inputApellido, inputEmail, inputTelefono, inputDni]);
    });
}

/* ===== FUNCIONES DE VALIDACIÓN ===== */

/**
 * Valida el campo Nombre.
 * Reglas: no vacío, solo letras y espacios, mínimo 2 caracteres.
 *
 * @param {HTMLInputElement} input
 * @returns {boolean} true si válido, false si inválido
 */
function validarNombre(input) {
    const valor = input.value.trim();
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,}$/;
    if (!valor || !regex.test(valor)) {
        marcarInvalido(input);
        return false;
    }
    marcarValido(input);
    return true;
}

/**
 * Valida el campo Apellido.
 * Reglas: no vacío, solo letras y espacios, mínimo 2 caracteres.
 *
 * @param {HTMLInputElement} input
 * @returns {boolean}
 */
function validarNombreApellido(input) {
    const valor = input.value.trim();
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,}$/;
    if (!valor || !regex.test(valor)) {
        marcarInvalido(input);
        return false;
    }
    marcarValido(input);
    return true;
}

/**
 * Valida el campo Email.
 * Regla: debe contener @ y un dominio válido (usuario@dominio.ext).
 *
 * @param {HTMLInputElement} input
 * @returns {boolean}
 */
function validarEmail(input) {
    const valor = input.value.trim();
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!valor || !regex.test(valor)) {
        marcarInvalido(input);
        return false;
    }
    marcarValido(input);
    return true;
}

/**
 * Valida el campo Teléfono.
 * Regla: entre 7 y 15 dígitos numéricos (admite espacios y guiones).
 *
 * @param {HTMLInputElement} input
 * @returns {boolean}
 */
function validarTelefono(input) {
    const valor = input.value.trim().replace(/[\s\-]/g, '');
    const regex = /^\d{7,15}$/;
    if (!valor || !regex.test(valor)) {
        marcarInvalido(input);
        return false;
    }
    marcarValido(input);
    return true;
}

/**
 * Valida el campo DNI.
 * Regla: entre 7 y 8 dígitos numéricos (sin puntos ni espacios).
 *
 * @param {HTMLInputElement} input
 * @returns {boolean}
 */
function validarDni(input) {
    const valor = input.value.trim().replace(/\./g, '');
    const regex = /^\d{7,8}$/;
    if (!valor || !regex.test(valor)) {
        marcarInvalido(input);
        return false;
    }
    marcarValido(input);
    return true;
}