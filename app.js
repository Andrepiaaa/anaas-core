/**
 * app.js - Orquestador global de eventos
 */
import * as state from './state.js';
import * as storage from './storage.js';

document.addEventListener('DOMContentLoaded', () => {
    const checkGroup = document.getElementById('metodos');
    const totalFichasNode = document.getElementById('totalFichas');
    
    // Sincronizar contador inicial con la capa de persistencia
    if (totalFichasNode) {
        totalFichasNode.textContent = storage.obtenerTotalFichas();
    }
    
    // Delegación de eventos limpia para la sección de los checkboxes
    if (checkGroup) {
        checkGroup.addEventListener('click', (e) => {
            const item = e.target.closest('.check-item');
            if (item) {
                e.preventDefault(); // Detiene el doble disparo nativo del label
                state.alternarCheckboxUI(item);
            }
        });
    }
});
