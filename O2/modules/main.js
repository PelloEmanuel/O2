
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
 * @type {boolean}
 */
let modoOscuroActivo = false;





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


/* MODO CLARO / OSCURO */

if (btnModo) {
    btnModo.addEventListener('click', () => {
        modoOscuroActivo = !modoOscuroActivo;
        aplicarModo(modoOscuroActivo, btnModo);
    });
}


/* VALIDACIÓN EN TIEMPO REAL */


if (inputNombre)   inputNombre.addEventListener('input',   () => validarNombre(inputNombre));
if (inputApellido) inputApellido.addEventListener('input', () => validarNombreApellido(inputApellido));
if (inputEmail)    inputEmail.addEventListener('input',    () => validarEmail(inputEmail));
if (inputTelefono) inputTelefono.addEventListener('input', () => validarTelefono(inputTelefono));
if (inputDni)      inputDni.addEventListener('input',      () => validarDni(inputDni));


/* ENVÍO DEL FORMULARIO */


if (formContacto) {
    formContacto.addEventListener('submit', (event) => {

        // Paso 1: Prevenir envío nativo
        event.preventDefault();

        // Paso 2: Ejecutar todas las validaciones
        const nombreOk   = validarNombre(inputNombre);
        const apellidoOk = validarNombreApellido(inputApellido);
        const emailOk    = validarEmail(inputEmail);
        const telefonoOk = validarTelefono(inputTelefono);
        const dniOk      = validarDni(inputDni);

        // Paso 3: Si algún campo es inválido, mostrar mensaje general
        if (!nombreOk || !apellidoOk || !emailOk || !telefonoOk || !dniOk) {
            mostrarMensaje(
                '⚠️ Por favor corregí los campos marcados en rojo antes de continuar.',
                'danger'
            );
            return;
        }

        // Paso 4: Todos los campos válidos → recopilar datos y generar el .txt
        const datosFormulario = {
            nombre:    inputNombre.value.trim(),
            apellido:  inputApellido.value.trim(),
            email:     inputEmail.value.trim(),
            telefono:  inputTelefono.value.trim(),
            dni:       inputDni.value.trim().replace(/\./g, '')
        };

        generarYDescargarTxt(datosFormulario);

        // Mostrar mensaje de éxito
        ocultarMensaje();
        mostrarMensaje(
            '✅ ¡Tu formulario fue recibido correctamente! Nos comunicaremos a la brevedad.',
            'success'
        );

        // Limpiar campos y clases de validación
        limpiarValidaciones([inputNombre, inputApellido, inputEmail, inputTelefono, inputDni]);
    });
}


/* ===== GENERACIÓN Y DESCARGA DEL ARCHIVO TXT ===== */


/**
 * Genera el contenido del archivo .txt con los datos del formulario
 * y lo descarga automáticamente en el equipo del usuario.
 *
 * El archivo se nombra con el número de DNI ingresado.
 * Se simula la carpeta "data/" incluyéndola en el nombre del archivo
 * (los navegadores no permiten crear carpetas reales en el sistema de archivos).
 *
 * Utiliza exclusivamente:
 *   - Blob con tipo text/plain y codificación UTF-8
 *   - URL.createObjectURL() para generar una URL temporal
 *   - <a> dinámico con atributo download para disparar la descarga
 *
 * @param {Object} datos - Objeto con los campos del formulario
 * @param {string} datos.nombre
 * @param {string} datos.apellido
 * @param {string} datos.email
 * @param {string} datos.telefono
 * @param {string} datos.dni
 */
function generarYDescargarTxt(datos) {

    // Fecha y hora actuales para registrar el momento del envío
    const ahora       = new Date();
    const fechaHora   = ahora.toLocaleString('es-AR', {
        day:    '2-digit',
        month:  '2-digit',
        year:   'numeric',
        hour:   '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });

    // Construcción del contenido del archivo en texto plano
    const contenidoTxt =
`========================================
     EL DIARIO DIGITAL - CONTACTO
========================================
Fecha y hora de envío: ${fechaHora}
----------------------------------------
Nombre:    ${datos.nombre}
Apellido:  ${datos.apellido}
Email:     ${datos.email}
Teléfono:  ${datos.telefono}
DNI:       ${datos.dni}
----------------------------------------
Formulario generado automáticamente.
========================================`;

    // Crear el Blob con codificación UTF-8
    const blob = new Blob([contenidoTxt], { type: 'text/plain;charset=utf-8' });

    // Generar URL temporal para el Blob
    const urlTemporal = URL.createObjectURL(blob);

    // Crear elemento <a> dinámico para disparar la descarga
    const enlaceDescarga = document.createElement('a');
    enlaceDescarga.href     = urlTemporal;
    enlaceDescarga.download = `data/${datos.dni}.txt`;

    // Agregar al DOM, simular click y limpiar
    document.body.appendChild(enlaceDescarga);
    enlaceDescarga.click();
    document.body.removeChild(enlaceDescarga);

    // Liberar la URL temporal de memoria
    URL.revokeObjectURL(urlTemporal);
}


/* ===== FUNCIONES DE VALIDACIÓN ===== */


/**
 * Valida el campo Nombre.
 * Reglas: no vacío, solo letras y espacios, mínimo 2 caracteres.
 *
 * @param {HTMLInputElement} input
 * @returns {boolean}
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
 * Regla: debe contener @ y un dominio válido.
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
 * Regla: entre 7 y 15 dígitos numéricos.
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
 * Regla: entre 7 y 8 dígitos numéricos.
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