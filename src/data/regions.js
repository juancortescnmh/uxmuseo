// src/data/regions.ts
export const colombiaRegions = {
    pacifico: {
        name: 'Pacífico',
        departments: [
            { id: 'cauca', name: 'Cauca' },
            { id: 'choco', name: 'Chocó' },
            { id: 'narino', name: 'Nariño' },
            { id: 'valle_del_cauca', name: 'Valle del Cauca' }
        ],
        bounds: { lat: [2.5, 5.5], lng: [-77.3, -76.5] }
    },
    amazonia: {
        name: 'Amazonía',
        departments: [
            { id: 'amazonas', name: 'Amazonas' },
            { id: 'caqueta', name: 'Caquetá' },
            { id: 'guainia', name: 'Guainía' },
            { id: 'guaviare', name: 'Guaviare' },
            { id: 'putumayo', name: 'Putumayo' },
            { id: 'vaupes', name: 'Vaupés' }
        ],
        bounds: { lat: [0.5, 2.0], lng: [-73.0, -71.5] }
    },
    andina: {
        name: 'Andina',
        departments: [
            { id: 'antioquia', name: 'Antioquia' },
            { id: 'boyaca', name: 'Boyacá' },
            { id: 'caldas', name: 'Caldas' },
            { id: 'cundinamarca', name: 'Cundinamarca' },
            { id: 'huila', name: 'Huila' },
            { id: 'norte_de_santander', name: 'Norte de Santander' },
            { id: 'quindio', name: 'Quindío' },
            { id: 'risaralda', name: 'Risaralda' },
            { id: 'santander', name: 'Santander' },
            { id: 'tolima', name: 'Tolima' }
        ],
        bounds: { lat: [2.5, 6.5], lng: [-75.8, -73.5] }
    },
    caribe: {
        name: 'Caribe',
        departments: [
            { id: 'atlantico', name: 'Atlántico' },
            { id: 'bolivar', name: 'Bolívar' },
            { id: 'cesar', name: 'César' },
            { id: 'cordoba', name: 'Córdoba' },
            { id: 'guajira', name: 'La Guajira' },
            { id: 'magdalena', name: 'Magdalena' },
            { id: 'sai', name: 'San Andrés y Providencia' },
            { id: 'sucre', name: 'Sucre' }
        ],
        bounds: { lat: [8.0, 11.0], lng: [-75.5, -73.5] }
    },
    orinoquia: {
        name: 'Orinoquía',
        departments: [
            { id: 'arauca', name: 'Arauca' },
            { id: 'casanare', name: 'Casanare' },
            { id: 'meta', name: 'Meta' },
            { id: 'vichada', name: 'Vichada' }
        ],
        bounds: { lat: [3.5, 5.5], lng: [-72.5, -70.0] }
    }
};
// Tipos de memoria, manteniendo las claves en snake_case y un color particular
export const memoryTypes = {
    identificados: { name: 'Identificados', color: '#818CF8' },
    caracterizados: { name: 'Caracterizados', color: '#34D399' },
    solicitud: { name: 'En Solicitud', color: '#FBBF24' },
    horror: { name: 'Del Horror', color: '#F87171' },
    sanaciones: { name: 'Sanaciones', color: '#A78BFA' },
    exilio: { name: 'Exilio', color: '#EC4899' } // Nuevo tipo para lugares en el exilio
};
