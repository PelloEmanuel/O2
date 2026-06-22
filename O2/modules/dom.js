/* MODO CLARO / OSCURO */

/**
 * Aplica o quita la clase "modo-oscuro" del <body>.
 *
 * @param {boolean} activar - true para modo oscuro, false para modo claro
 * @param {HTMLButtonElement} boton - botón cuyo texto se actualiza
 */
export function aplicarModo(activar, boton) {
    if (activar) {
        document.body.classList.add('modo-oscuro');
        boton.textContent = '☀️ Modo claro';
    } else {
        document.body.classList.remove('modo-oscuro');
        boton.textContent = '🌙 Modo oscuro';
    }
}

/* VALIDACIONES DEL FORMULARIO */

/**
 *
 * @param {HTMLInputElement} input - El campo que falló la validación
 */
export function marcarInvalido(input) {
    input.classList.remove('is-valid');
    input.classList.add('is-invalid');
}

/**
 * Marca un campo como válido agregando la clase Bootstrap "is-valid".
 *
 * @param {HTMLInputElement} input - El campo que pasó la validación
 */
export function marcarValido(input) {
    input.classList.remove('is-invalid');
    input.classList.add('is-valid');
}

/**
 * Limpia las clases de validación y el valor de todos los campos recibidos.
 * Se usa al resetear el formulario tras un envío exitoso.
 *
 * @param {HTMLInputElement[]} campos - Array de inputs a limpiar
 */
export function limpiarValidaciones(campos) {
    campos.forEach(c => {
        c.classList.remove('is-valid', 'is-invalid');
        c.value = '';
    });
}

/* MENSAJES DINÁMICOS */

/**
 *
 * @param {string} texto - Texto del mensaje a mostrar
 * @param {string} tipo  - Tipo Bootstrap: "success" | "danger" | "warning"
 */
export function mostrarMensaje(texto, tipo) {
    const contenedor = document.getElementById('mensajeFormulario');
    if (!contenedor) return;

    contenedor.innerHTML = `
        <div class="alert alert-${tipo} fw-semibold mb-0" role="alert">
            ${texto}
        </div>
    `;
    contenedor.style.display = 'block';
}

/**
 * Oculta el contenedor del mensaje dinámico del formulario.
 */
export function ocultarMensaje() {
    const contenedor = document.getElementById('mensajeFormulario');
    if (contenedor) {
        contenedor.style.display = 'none';
        contenedor.innerHTML = '';
    }
}