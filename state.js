/**
 * state.js - Gestión del estado reactivo en memoria
 */
const _state = {
    metodosSeleccionados: new Set(),
    reaccionSeleccionada: '',
    waActivo: false
};

export function alternarCheckboxUI(wrapper) {
    const checkbox = wrapper.querySelector('input[type="checkbox"]');
    if (!checkbox) return;
    checkbox.checked = !checkbox.checked;

    if (checkbox.checked) {
        wrapper.classList.add('checked');
        _state.metodosSeleccionados.add(checkbox.value);
    } else {
        wrapper.classList.remove('checked');
        _state.metodosSeleccionados.delete(checkbox.value);
    }
}

export function seleccionarReaccionUI(contenedor, boton) {
    constenedor.querySelectorAll('.reaction-btn').forEach(b => b.classList.remove('selected'));
    boton.classList.add('selected');
    
    const valor = boton.getAttribute('data-value');
    _state.reaccionSeleccionada = valor;
    
    const inputOculto = document.getElementById('reaccion');
    if (inputOculto) inputOculto.value = valor;
}