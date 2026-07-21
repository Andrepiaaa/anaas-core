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
    if (event) event.preventDefault();

    const nombre = document.getElementById('nombre_negocio')?.value.trim();
    if (!nombre) {
        alert('Ponele al menos el nombre del negocio 😊');
        return;
    }

    const metodos = Array.from(document.querySelectorAll('#metodos input[type="checkbox"]:checked')).map((input) => input.value);
    const fichasExistentes = storage.obtenerFichas();
    const ficha = {
        id:             fichasExistentes.length + 1,
        fecha:          new Date().toLocaleDateString('es-CO'),
        hora:           new Date().toLocaleTimeString('es-CO', {hour:'2-digit',minute:'2-digit'}),
        nombre_negocio: nombre,
        tipo_negocio:   document.getElementById('tipo_negocio')?.value || '',
        ciudad:         document.getElementById('ciudad')?.value.trim() || '',
        nombre_dueno:   document.getElementById('nombre_dueno')?.value.trim() || '',
        metodos_cuentas:metodos,
        dolores:        document.getElementById('dolores')?.value.trim() || '',
        sabe_producto:  document.getElementById('sabe_producto')?.value || '',
        olvido_deuda:   document.getElementById('olvido_deuda')?.value || '',
        primer_vistazo: document.getElementById('primer_vistazo')?.value.trim() || '',
        reaccion:       document.getElementById('reaccion')?.value || '',
        no_entendio:    document.getElementById('no_entendio')?.value.trim() || '',
        frase_exacta:   document.getElementById('frase_exacta')?.value.trim() || '',
        whatsapp:       document.getElementById('whatsapp')?.value.trim() || ''
    };

    const total = storage.guardarFicha(ficha);

    const totalFichasNode = document.getElementById('totalFichas');
    if (totalFichasNode) {
        totalFichasNode.textContent = total;
    }

    const fichaNumVal = document.getElementById('fichaNumVal');
    if (fichaNumVal) {
        fichaNumVal.textContent = total + 1;
    }

    const modalOverlay = document.getElementById('modalOverlay');
    if (modalOverlay) {
        modalOverlay.style.display = 'flex';
    }
}

function verFichas() {
    const fichas = storage.obtenerFichas();
    const fichasPanel = document.getElementById('fichasPanel');
    const fichasLista = document.getElementById('fichasLista');
    if (!fichasPanel || !fichasLista) return;

    if (fichas.length === 0) {
        fichasLista.innerHTML = '<div class="sin-fichas">Todavia no hay fichas guardadas.<br>Entrevista tu primer tendero.</div>';
    } else {
        fichasLista.innerHTML = fichas.map(f => `
            <div class="ficha-card">
                <div class="ficha-card-header">
                    <span class="ficha-card-num">Ficha #${f.id}</span>
                    <span class="ficha-card-fecha">${f.fecha || ''} ${f.hora || ''}</span>
                </div>
                <div class="ficha-card-body">
                    <div class="ficha-row">
                        <span class="ficha-key">Negocio</span>
                        <span class="ficha-val">${f.nombre_negocio || '—'}</span>
                    </div>
                    <div class="ficha-row">
                        <span class="ficha-key">Tipo</span>
                        <span class="ficha-val">${f.tipo_negocio || '—'}</span>
                    </div>
                    <div class="ficha-row">
                        <span class="ficha-key">Ciudad</span>
                        <span class="ficha-val">${f.ciudad || '—'}</span>
                    </div>
                    <div class="ficha-row">
                        <span class="ficha-key">Dueño</span>
                        <span class="ficha-val">${f.nombre_dueno || '—'}</span>
                    </div>
                    <div class="ficha-row">
                        <span class="ficha-key">Cuentas hoy</span>
                        <span class="ficha-val">${f.metodos_cuentas?.length ? f.metodos_cuentas.join(', ') : '—'}</span>
                    </div>
                    <div class="ficha-row">
                        <span class="ficha-key">Reacción</span>
                        <span class="ficha-val">${f.reaccion === 'positiva' ? 'Le gustó' : f.reaccion === 'neutral' ? 'Indiferente' : f.reaccion === 'negativa' ? 'Con dudas' : '—'}</span>
                    </div>
                    <div class="ficha-row">
                        <span class="ficha-key">WhatsApp</span>
                        <span class="ficha-val">${f.whatsapp || 'No dio número'}</span>
                    </div>
                    ${f.dolores ? `<div class="ficha-row"><span class="ficha-key">Dolores</span><span class="ficha-val">${f.dolores}</span></div>` : ''}
                    ${f.frase_exacta ? `<div class="frase-destacada">"${f.frase_exacta}"</div>` : ''}
                </div>
            </div>
        `).join('');
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

function nuevaFicha() {
    document.getElementById('modalOverlay').style.display = 'none';

    // Actualizar número de ficha
    const fichaNumVal = document.getElementById('fichaNumVal');
    if (fichaNumVal) {
        fichaNumVal.textContent = storage.obtenerTotalFichas() + 1;
    }

    // Reset campos de texto
    ['nombre_negocio','ciudad','nombre_dueno','dolores',
     'primer_vistazo','no_entendio','frase_exacta','whatsapp'].forEach(id => {
        document.getElementById(id).value = '';
    });
    // Reset selects
    ['tipo_negocio','sabe_producto','olvido_deuda'].forEach(id => {
        document.getElementById(id).value = '';
    });
    // Reset reacción
    document.querySelectorAll('.reaction-btn').forEach(el => el.classList.remove('selected'));
    document.getElementById('reaccion').value = '';
    // Reset checkboxes
    document.querySelectorAll('.check-item').forEach(el => el.classList.remove('checked'));
    // Reset WhatsApp toggle
    const waToggle = document.getElementById('waToggle');
    if (waToggle && waToggle.classList.contains('on')) {
        waToggle.classList.remove('on');
        document.getElementById('waField').style.display = 'none';
    }

    updateProgress();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function initEvents() {
    const checkGroup = document.getElementById('metodos');
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

    if (btnNuevaFicha) {
        btnNuevaFicha.addEventListener('click', nuevaFicha);
    }
}

window.updateProgress = updateProgress;
window.guardarFicha = guardarFicha;
window.verFichas = verFichas;
window.exportarDatos = exportarDatos;
window.cerrarPanel = cerrarPanel;
window.nuevaFicha = nuevaFicha;

document.addEventListener('DOMContentLoaded', () => {
    const total = storage.obtenerTotalFichas();

    const totalFichasNode = document.getElementById('totalFichas');
    if (totalFichasNode) {
        totalFichasNode.textContent = total;
    }

    const fichaNumVal = document.getElementById('fichaNumVal');
    if (fichaNumVal) {
        fichaNumVal.textContent = total + 1;
    }

    initEvents();
    updateProgress();
});
