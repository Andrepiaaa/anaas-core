/**
 * storage.js - Capa de persistencia en localStorage
 */
const STORAGE_KEY = 'anaas_fichas_core';

export function obtenerFichas() {
    const datos = localStorage.getItem(STORAGE_KEY);
    return datos ? JSON.parse(datos) : [];
}

export function obtenerTotalFichas() {
    return obtenerFichas().length;
}
