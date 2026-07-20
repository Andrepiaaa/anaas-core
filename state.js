/**
 * state.js - Gestión del estado reactivo en memoria
 */
const _state = {
    metodosSeleccionados: new Set()
};

/**
 * Alterna el estado del checkbox real y aplica las clases visuales de CSS
 * @param {HTMLElement} wrapper - El contenedor padre (.check-item) clickeado
 */
export function alternarCheckboxUI(wrapper) {
    const checkbox = wrapper.querySelector('input[type="checkbox"]');
    checkbox.checked = !checkbox.checked;
    
    if (checkbox.checked) {
        wrapper.classList.add('checked');
        _state.metodosSeleccionados.add(checkbox.value);
    } else {
        wrapper.classList.remove('checked');
        _state.metodosSeleccionados.delete(checkbox.value);
    }
}
