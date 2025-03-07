/**
 * Función mejorada para crear marcadores elegantes con transparencias
 */
export function createCustomMarker(location, isCluster = false, clusterCount, isSelected = false) {
    const el = document.createElement("div");
    if (isCluster) {
        el.innerHTML = `
      <div class="cluster-marker">
        <div class="cluster-base">
          <span class="cluster-value">${clusterCount ?? 0}</span>
        </div>
      </div>
    `;
    }
    else if (location) {
        // Determinamos el color y el símbolo del icono basado en el tipo
        const iconColor = getIconColorByType(location.type);
        const iconSymbol = getIconSymbolByType(location.type);
        // Estructura más elegante con transparencias y sin emoticonos
        el.innerHTML = `
      <div class="memory-location-marker ${isSelected ? "selected" : ""}">
        <div class="memory-marker-outer-ring"></div>
        <div class="memory-marker-circle" style="background-color: ${iconColor}40; border-color: ${iconColor}80;">
          <div class="memory-marker-inner-circle" style="background-color: ${iconColor};">
            <div class="memory-marker-icon" style="color: white;">${iconSymbol}</div>
          </div>
        </div>
        ${location.code ? `<div class="memory-marker-label">${location.code}</div>` : ''}
      </div>
    `;
    }
    return el;
}
/**
 * Devuelve un color de icono basado en el tipo.
 */
function getIconColorByType(type) {
    const colors = {
        identificados: "#FF9D4D", // Naranja
        caracterizados: "#4CAF50", // Verde
        solicitud: "#2196F3", // Azul
        horror: "#F44336", // Rojo
        sanaciones: "#9C27B0", // Morado
        exilio: "#EC4899", // Rosa fuerte para exilio
    };
    return colors[type] || "#FFFFFF";
}
/**
 * Devuelve un símbolo (icono SVG) basado en el tipo.
 */
function getIconSymbolByType(type) {
    const symbols = {
        identificados: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 2L20 7L12 12L4 7L12 2Z"/>
      <path d="M20 14l-8 5l-8-5"/>
    </svg>`, // Marcador de lugar identificado - forma de diamante
        caracterizados: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2"/>
      <path d="M9 3v18"/>
      <path d="M15 3v18"/>
    </svg>`, // Libro/documento - caracterización
        solicitud: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <path d="M14 2v6h6"/>
      <path d="M16 13H8"/>
      <path d="M16 17H8"/>
      <path d="M10 9H8"/>
    </svg>`, // Documento con líneas - solicitud
        horror: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
      <path d="M12 9v4"/>
      <path d="M12 17h.01"/>
    </svg>`, // Triángulo de advertencia - lugares del horror
        sanaciones: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M7 11v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-8a4 4 0 1 0-10 0Z"/>
      <path d="M12 3v4"/>
      <path d="M10 7h4"/>
    </svg>`, // Lámpara/esperanza - sanaciones
        exilio: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M10 3.2A9 9 0 1 0 20.8 14a1 1 0 0 0-1-1H13a1 1 0 0 1-1-1V4.5a1 1 0 0 0-.5-.9 1 1 0 0 0-1.2.1L10 3.2Z"/>
      <path d="M3 9h2"/>
      <path d="M8 3.2V5"/>
      <path d="M11 3h2"/>
    </svg>`, // Icono de mundo/globo - exilio
    };
    return symbols[type] || `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>`; // Icono de ubicación predeterminado
}
/**
 * Devuelve una descripción según el tipo de lugar de memoria
 */
function getDescriptionByType(type) {
    const descriptions = {
        identificados: "Este lugar ha sido identificado como un espacio significativo para la memoria colectiva, que preserva testimonios y recuerdos de hechos históricos relevantes.",
        caracterizados: "Este espacio ha sido caracterizado en detalle, documentando su historia, impacto y significado dentro del contexto de la memoria histórica del país.",
        solicitud: "Este sitio se encuentra en proceso de solicitud para ser reconocido oficialmente como lugar de memoria, con la documentación en curso.",
        horror: "Este lugar conmemora eventos traumáticos y dolorosos, buscando preservar la memoria para garantizar la no repetición de estos hechos.",
        sanaciones: "Este espacio está dedicado a procesos de sanación colectiva, reconciliación y construcción de memoria desde perspectivas restaurativas.",
        exilio: "Este lugar representa un espacio de memoria colombiana en el exterior, documentando experiencias de exilio y manteniendo viva la conexión con el país."
    };
    return descriptions[type] || "Este lugar forma parte de la red de sitios documentados por el Centro Nacional de Memoria Histórica.";
}
/**
 * Genera 140 lugares de memoria con distribución por regiones
 */
function generateMemoryLocations() {
    const locations = [];
    const memoryTypes = ['identificados', 'caracterizados', 'solicitud', 'horror', 'sanaciones'];
    // Coordenadas específicas para cada región (ajustadas para evitar el mar)
    const regionCoordinates = {
        pacifico: [
            // Departamentos del Pacífico - coordenadas ajustadas tierra adentro
            { lat: 3.5, lng: -76.5, dept: 'cauca' },
            { lat: 5.2, lng: -76.6, dept: 'choco' },
            { lat: 1.8, lng: -77.3, dept: 'narino' },
            { lat: 3.4, lng: -76.4, dept: 'valle_del_cauca' }
        ],
        amazonia: [
            // Departamentos de la Amazonía - ajustados a zonas terrestres
            { lat: -1.0, lng: -71.5, dept: 'amazonas' },
            { lat: 0.5, lng: -72.5, dept: 'caqueta' },
            { lat: 2.5, lng: -69.8, dept: 'guainia' },
            { lat: 2.0, lng: -72.7, dept: 'guaviare' },
            { lat: 0.8, lng: -76.5, dept: 'putumayo' },
            { lat: 0.1, lng: -70.8, dept: 'vaupes' }
        ],
        andina: [
            // Departamentos de la región Andina
            { lat: 6.2, lng: -75.5, dept: 'antioquia' },
            { lat: 5.5, lng: -73.2, dept: 'boyaca' },
            { lat: 5.1, lng: -75.5, dept: 'caldas' },
            { lat: 4.7, lng: -74.1, dept: 'cundinamarca' },
            { lat: 2.9, lng: -75.2, dept: 'huila' },
            { lat: 7.9, lng: -72.5, dept: 'norte_de_santander' },
            { lat: 4.5, lng: -75.7, dept: 'quindio' },
            { lat: 5.0, lng: -75.8, dept: 'risaralda' },
            { lat: 7.1, lng: -73.1, dept: 'santander' },
            { lat: 4.4, lng: -75.2, dept: 'tolima' }
        ],
        caribe: [
            // Departamentos de la región Caribe - ajustados a zonas terrestres
            { lat: 10.9, lng: -74.8, dept: 'atlantico' },
            { lat: 9.2, lng: -74.9, dept: 'bolivar' },
            { lat: 9.3, lng: -73.5, dept: 'cesar' },
            { lat: 8.4, lng: -75.8, dept: 'cordoba' },
            { lat: 11.5, lng: -72.9, dept: 'guajira' },
            { lat: 10.4, lng: -74.4, dept: 'magdalena' },
            { lat: 12.5, lng: -81.7, dept: 'sai' }, // San Andrés
            { lat: 9.3, lng: -75.4, dept: 'sucre' }
        ],
        orinoquia: [
            // Departamentos de la Orinoquía
            { lat: 7.1, lng: -70.7, dept: 'arauca' },
            { lat: 5.3, lng: -72.4, dept: 'casanare' },
            { lat: 3.9, lng: -73.8, dept: 'meta' },
            { lat: 4.4, lng: -69.8, dept: 'vichada' }
        ]
    };
    // Cantidad de lugares por región
    const regionCounts = {
        andina: 40,
        caribe: 30,
        pacifico: 25,
        amazonia: 25,
        orinoquia: 20
    };
    // Función para generar puntos aleatorios alrededor de un centro
    function generatePointsAroundCenter(center, count, maxDistanceKm) {
        const points = [];
        for (let i = 0; i < count; i++) {
            // Convertir distancia km a grados (aproximación)
            const distanceKm = Math.random() * maxDistanceKm;
            const distanceDegrees = distanceKm / 111; // 1 grado ≈ 111 km
            // Ángulo aleatorio
            const angle = Math.random() * 2 * Math.PI;
            // Calcular desplazamiento
            const latOffset = distanceDegrees * Math.sin(angle);
            const lngOffset = distanceDegrees * Math.cos(angle) / Math.cos((center.lat + latOffset) * Math.PI / 180);
            // Crear nuevo punto
            points.push({
                lat: center.lat + latOffset,
                lng: center.lng + lngOffset,
                dept: center.dept
            });
        }
        return points;
    }
    // Generar lugares para cada región
    let counter = 0;
    Object.entries(regionCoordinates).forEach(([region, centers]) => {
        const regionTotal = regionCounts[region];
        // Distribuir equitativamente entre los centros
        const centersCount = centers.length;
        const placesPerCenter = Math.ceil(regionTotal / centersCount);
        centers.forEach(center => {
            // Generar puntos alrededor del centro (máximo 15km para mantenerlos en tierra)
            const points = generatePointsAroundCenter(center, Math.min(placesPerCenter, regionTotal), 15);
            points.forEach(point => {
                if (counter >= 140)
                    return; // Limitar a 140 lugares
                // Asignar un tipo de memoria aleatorio
                const type = memoryTypes[Math.floor(Math.random() * memoryTypes.length)];
                // Crear el objeto de ubicación
                locations.push({
                    id: `loc${counter + 1}`,
                    latitude: point.lat,
                    longitude: point.lng,
                    title: `Lugar de Memoria ${counter + 1}`,
                    type: type,
                    region: region,
                    department: point.dept,
                    description: `Este es un lugar de memoria ubicado en la región ${region}, departamento de ${point.dept}. ${getDescriptionByType(type)}`,
                    code: `LM${String(counter + 1).padStart(3, '0')}`
                });
                counter++;
            });
        });
    });
    return locations;
}
// Lugares de memoria del exilio - fuera de Colombia
const exileLocations = [
    {
        id: "madrid_casa_memoria",
        longitude: -3.703,
        latitude: 40.416,
        title: "Casa de la Memoria Colombiana en Madrid",
        description: "Espacio en Madrid dedicado a preservar las memorias de los colombianos exiliados en España, con testimonios, exposiciones y actividades culturales.",
        type: "exilio",
        code: "EX001",
        region: "Europa",
        department: "España",
        country: "España"
    },
    {
        id: "buenos_aires_memoria",
        longitude: -58.381,
        latitude: -34.603,
        title: "Centro Cultural de la Memoria en Buenos Aires",
        description: "Centro cultural que mantiene viva la memoria de los refugiados colombianos en Argentina y promueve el intercambio cultural y de experiencias.",
        type: "exilio",
        code: "EX002",
        region: "Sudamérica",
        department: "Buenos Aires",
        country: "Argentina"
    },
    {
        id: "new_york_colombian_diaspora",
        longitude: -73.985,
        latitude: 40.748,
        title: "Colombian Diaspora Archives",
        description: "Archivo documental en Nueva York que recopila historias, documentos y testimonios de colombianos exiliados en Estados Unidos desde los años 80.",
        type: "exilio",
        code: "EX003",
        region: "Norteamérica",
        department: "Nueva York",
        country: "Estados Unidos"
    },
    {
        id: "paris_memoria_colectiva",
        longitude: 2.349,
        latitude: 48.864,
        title: "Mémoire Collective Colombienne",
        description: "Asociación en París que documenta las experiencias de exiliados colombianos en Francia y promueve la construcción de memoria desde la diáspora.",
        type: "exilio",
        code: "EX004",
        region: "Europa",
        department: "París",
        country: "Francia"
    },
    {
        id: "toronto_casa_refugio",
        longitude: -79.383,
        latitude: 43.653,
        title: "Casa Refugio Toronto",
        description: "Espacio comunitario en Toronto dedicado a la memoria y acogida de refugiados colombianos en Canadá, con programas de apoyo y documentación.",
        type: "exilio",
        code: "EX005",
        region: "Norteamérica",
        department: "Ontario",
        country: "Canadá"
    }
];
// Generar y exportar los 140 lugares de memoria junto con los lugares del exilio
export const memoryLocations = [...generateMemoryLocations(), ...exileLocations];
