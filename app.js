/**
 * app.js - Orquestador global de eventos
 */
import * as state from './state.js';
import * as storage from './storage.js';

function updateProgress() {
    const fields = [
        'nombre_negocio',
        'tipo_negocio',
        'ciudad',
        'nombre_dueno',
        'dolores',
        'sabe_producto',
        'olvido_deuda',
        'primer_vistazo',
        'no_entendio',
        'frase_exacta',
        'whatsapp'
    ];

    let completed = 0;
    fields.forEach((id) => {
        const node = document.getElementById(id);
        if (!node) return;
        if ((node.value || '').trim() !== '') completed += 1;
    });

    const metodos = document.querySelectorAll('#metodos input[type="checkbox"]:checked').length;
    if (metodos > 0) completed += 1;

    const reactionSelected = document.querySelector('#reaccionGroup .selected');
    if (reactionSelected) completed += 1;

    const total = fields.length + 2;
    const percent = Math.round((completed / total) * 100);

    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    if (progressFill) progressFill.style.width = `${percent}%`;
    if (progressText) progressText.textContent = `${percent}% completado`;
}

function guardarFicha(event) {
    event.preventDefault();

    const metodos = Array.from(document.querySelectorAll('#metodos input[type="checkbox"]:checked')).map((input) => input.value);
    const ficha = {
        id:             storage.obtenerTotalFichas() + 1,
        fecha:          new Date().toLocaleDateString('es-CO'),
        hora:           new Date().toLocaleTimeString('es-CO', {hour:'2-digit',minute:'2-digit'}),
        nombre_negocio: document.getElementById('nombre_negocio')?.value.trim() || '',
        tipo_negocio: document.getElementById('tipo_negocio')?.value || '',
        ciudad: document.getElementById('ciudad')?.value.trim() || '',
        nombre_dueno: document.getElementById('nombre_dueno')?.value.trim() || '',
        metodos,
        dolores: document.getElementById('dolores')?.value.trim() || '',
        sabe_producto: document.getElementById('sabe_producto')?.value || '',
        olvido_deuda: document.getElementById('olvido_deuda')?.value || '',
        primer_vistazo: document.getElementById('primer_vistazo')?.value.trim() || '',
        reaccion: document.getElementById('reaccion')?.value || '',
        no_entendio: document.getElementById('no_entendio')?.value.trim() || '',
        frase_exacta: document.getElementById('frase_exacta')?.value.trim() || '',
        whatsapp: document.getElementById('whatsapp')?.value.trim() || ''
    };

    storage.guardarFicha(ficha);

    const totalFichasNode = document.getElementById('totalFichas');
    if (totalFichasNode) {
        totalFichasNode.textContent = storage.obtenerTotalFichas();
    }

    const modalOverlay = document.getElementById('modalOverlay');
    if (modalOverlay) {
        modalOverlay.classList.add('active');
    }
}

function verFichas() {
    const fichas = storage.obtenerFichas();
    const fichasPanel = document.getElementById('fichasPanel');
    const fichasLista = document.getElementById('fichasLista');
    if (!fichasPanel || !fichasLista) return;

    fichasLista.innerHTML = '';
    if (fichas.length === 0) {
        fichasLista.innerHTML = '<div class="sin-fichas">Todavia no hay fichas guardadas.<br>Entrevista tu primer tendero.</div>';
    } else {
        fichas.forEach((ficha) => {
            const item = document.createElement('div');
            item.className = 'ficha-item';
            const reaccionTxt = ficha.reaccion === 'positiva' ? '😃 Le gusto'
                : ficha.reaccion === 'neutral' ? '😐 Indiferente'
                : ficha.reaccion === 'negativa' ? '😕 Con dudas' : '—';
            item.innerHTML = `
                <strong data-fecha="${ficha.fecha || ''} ${ficha.hora || ''}">Ficha #${ficha.id || '?'}</strong>
                <div class="ficha-line"><span class="ficha-label">Negocio</span><span class="ficha-value">${ficha.nombre_negocio || '—'}</span></div>
                <div class="ficha-line"><span class="ficha-label">Tipo</span><span class="ficha-value">${ficha.tipo_negocio || '—'}</span></div>
                <div class="ficha-line"><span class="ficha-label">Ciudad</span><span class="ficha-value">${ficha.ciudad || '—'}</span></div>
                <div class="ficha-line"><span class="ficha-label">Duenno</span><span class="ficha-value">${ficha.nombre_dueno || '—'}</span></div>
                <div class="ficha-line"><span class="ficha-label">Cuentas</span><span class="ficha-value">${ficha.metodos?.length ? ficha.metodos.join(', ') : '—'}</span></div>
                <div class="ficha-line"><span class="ficha-label">Reaccion</span><span class="ficha-value">${reaccionTxt}</span></div>
                <div class="ficha-line"><span class="ficha-label">WhatsApp</span><span class="ficha-value">${ficha.whatsapp || 'No dio numero'}</span></div>
                ${ficha.dolores ? `<div class="ficha-line"><span class="ficha-label">Dolores</span><span class="ficha-value">${ficha.dolores}</span></div>` : ''}
                ${ficha.frase_exacta ? `<div class="frase-destacada">"${ficha.frase_exacta}"</div>` : ''}
            `;
            fichasLista.appendChild(item);
        });
    }

    fichasPanel.style.display = 'block';
}

function cerrarPanel() {
    const fichasPanel = document.getElementById('fichasPanel');
    if (fichasPanel) {
        fichasPanel.style.display = 'none';
    }
}

function exportarDatos() {
    const fichas = storage.obtenerFichas();
    const blob = new Blob([JSON.stringify(fichas, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'fichas-anaas.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

function initEvents() {
    const checkGroup = document.getElementById('metodos');
    const btnGuardarFicha = document.getElementById('btnGuardarFicha');
    const reactionGroup = document.getElementById('reaccionGroup');
    const waToggle = document.getElementById('waToggle');
    const btnNuevaFicha = document.getElementById('btnNuevaFicha');

    if (checkGroup) {
        checkGroup.addEventListener('click', (e) => {
            const item = e.target.closest('.check-item');
            if (item) {
                e.preventDefault();
                state.alternarCheckboxUI(item);
                updateProgress();
            }
        });
    }

    if (reactionGroup) {
        reactionGroup.addEventListener('click', (e) => {
            const button = e.target.closest('.reaction-btn');
            if (button) {
                state.seleccionarReaccionUI(reactionGroup, button);
                updateProgress();
            }
        });
    }

    if (waToggle) {
        waToggle.addEventListener('click', () => {
            waToggle.classList.toggle('on');
            const waField = document.getElementById('waField');
            if (waField) {
                waField.style.display = waToggle.classList.contains('on') ? 'block' : 'none';
            }
            updateProgress();
        });
    }

    if (btnGuardarFicha) {
        btnGuardarFicha.addEventListener('click', guardarFicha);
    }

    if (btnNuevaFicha) {
        btnNuevaFicha.addEventListener('click', () => window.location.reload());
    }
}

window.updateProgress = updateProgress;
window.verFichas = verFichas;
window.exportarDatos = exportarDatos;
window.cerrarPanel = cerrarPanel;

document.addEventListener('DOMContentLoaded', () => {
    const totalFichasNode = document.getElementById('totalFichas');
    if (totalFichasNode) {
        totalFichasNode.textContent = storage.obtenerTotalFichas();
    }

    initEvents();
    updateProgress();
});
