// src/services/MapService.ts

import mapboxgl from "mapbox-gl";
import { colombiaRegions, memoryTypes, type MacroRegion } from "../data/regions";
import { memoryLocations, createCustomMarker } from "../utils/mapHelpers";
import { createRandomPoints } from "../utils/helpers";
import { AppState, MemoryLocation } from "../types";

// Constantes de estilo para el mapa
export const SATELLITE_STYLE = "mapbox://styles/mapbox/satellite-v9";
export const DARK_STYLE = "mapbox://styles/mapbox/dark-v10";

// Configuración inicial del mapa
export const mapConfig = {
  center: [-74.3, 4.3],
  zoom: 10,
  pitch: 0,
  bearing: 0,
  style: SATELLITE_STYLE, // estilo inicial
};

// Variable para almacenar el estilo actual del mapa y evitar cambios repetidos
let currentMapStyle = mapConfig.style;
// Bandera para indicar que se está cambiando el estilo
let styleChanging = false;

/**
 * Agrega efectos ambientales avanzados al mapa para mayor impacto visual
 */
export function addEnvironmentEffects(
  mapRef: React.MutableRefObject<mapboxgl.Map | null>,
  mapLoadedRef: React.MutableRefObject<boolean>
) {
  if (!mapRef.current || !mapLoadedRef.current) return;
  const map = mapRef.current;
  
  // 1. Añadir terreno 3D
  if (!map.getSource("mapbox-dem")) {
    map.addSource("mapbox-dem", {
      type: "raster-dem",
      url: "mapbox://mapbox.mapbox-terrain-dem-v1",
      tileSize: 512,
      maxzoom: 14,
    });
    
    map.setTerrain({ 
      source: "mapbox-dem", 
      exaggeration: 1.2  // Valor más alto para terreno más dramático
    });
    
    // 2. Añadir efecto de niebla avanzado
    map.setFog({
      'color': 'rgba(255, 255, 255, 0.8)',
      'high-color': 'rgba(200, 210, 255, 0.8)',
      'horizon-blend': 0.1,
      'space-color': 'rgba(175, 175, 200, 1)',
      'star-intensity': 0.15,
      'range': [0.5, 10]
    });
    
    // 3. Ajustar la luz para efecto dramático
    // Usar setLight ya que setLights necesita una estructura diferente
    map.setLight({
      anchor: 'viewport',
      color: 'rgb(250, 250, 230)',
      intensity: 0.55,
      position: [1.3, 2, 1.5]
    });
  }
  
  // 4. Añadir capa atmosférica si no existe
  if (!map.getLayer('atmosphere')) {
    map.addLayer({
      id: 'atmosphere',
      type: 'sky',
      paint: {
        'sky-type': 'atmosphere',
        'sky-atmosphere-sun': [0.0, 90.0],
        'sky-atmosphere-sun-intensity': 15,
        'sky-atmosphere-halo-color': 'rgba(255, 255, 240, 1)',
        'sky-atmosphere-color': 'rgba(180, 200, 255, 1)',
        'sky-opacity': [
          'interpolate',
          ['linear'],
          ['zoom'],
          5, 0.5,
          10, 0.8
        ]
      }
    });
  }
  
  // 5. Añadir efecto de brillo/resplandor a ciertas alturas (capa ilustrativa)
  if (!map.getLayer('elevation-glow')) {
    if (!map.getSource('elevation-data')) {
      map.addSource('elevation-data', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: []
        }
      });
      updateElevationGlowLayer(map);
    }
  }
}

/**
 * Actualiza la capa de brillo en elevaciones altas (ejemplo)
 */
function updateElevationGlowLayer(map: mapboxgl.Map) {
  if (!map.getLayer('elevation-glow')) {
    map.addLayer({
      id: 'elevation-glow',
      type: 'heatmap',
      source: 'elevation-data',
      paint: {
        'heatmap-weight': [
          'interpolate',
          ['linear'],
          ['get', 'elevation'],
          500, 0,
          1000, 0.2,
          2000, 0.6,
          3000, 1
        ],
        'heatmap-intensity': 1.5,
        'heatmap-color': [
          'interpolate',
          ['linear'],
          ['heatmap-density'],
          0, 'rgba(255,255,255,0)',
          0.2, 'rgba(255,255,235,0.2)',
          0.4, 'rgba(255,255,240,0.4)',
          0.6, 'rgba(255,250,230,0.6)',
          0.8, 'rgba(255,245,225,0.8)',
          1, 'rgba(255,240,220,1)'
        ],
        'heatmap-radius': 15,
        'heatmap-opacity': 0.7
      }
    });
  }
}

/**
 * Realiza una transición cinematográfica entre ubicaciones
 */
export function cinematicFlyTo(
  map: mapboxgl.Map,
  options: {
    center: [number, number],
    zoom: number,
    pitch?: number,
    bearing?: number,
    duration?: number,
    easing?: "linear" | "cubic" | "exponential" | "cinematic",
    startSpeed?: number,
    endSpeed?: number
  }
) {
  const easingFunctions = {
    linear: (t: number) => t,
    cubic: (t: number) => {
      return t < 0.5 
        ? 4 * t * t * t 
        : 1 - Math.pow(-2 * t + 2, 3) / 2;
    },
    exponential: (t: number) => {
      return t === 0 
        ? 0 
        : t === 1 
          ? 1 
          : t < 0.5 
            ? Math.pow(2, 20 * t - 10) / 2
            : (2 - Math.pow(2, -20 * t + 10)) / 2;
    },
    cinematic: (t: number) => {
      const p1 = 0.075;
      const p2 = 0.5;
      const p3 = 0.9;
      if (t < p1) {
        return (t / p1) * (t / p1) * 0.1;
      } else if (t < p2) {
        return 0.1 + (t - p1) * (0.9 / (p2 - p1));
      } else if (t < p3) {
        return 1.0;
      } else {
        const tNorm = (t - p3) / (1 - p3);
        return 1.0 - tNorm * tNorm * 0.5;
      }
    }
  };
  
  const easingType = options.easing || "cubic";
  const easingFn = easingFunctions[easingType];
  const startSpeed = options.startSpeed || 0.15;
  const endSpeed = options.endSpeed || 0.2;

  const flyOptions = {
    center: options.center,
    zoom: options.zoom,
    pitch: options.pitch || 60,
    bearing: options.bearing || 0,
    duration: options.duration || 6000,
    essential: true,
    easing: (t: number) => {
      const adjustedT = t < startSpeed 
        ? (t / startSpeed) * startSpeed 
        : t > (1 - endSpeed) 
          ? 1 - ((1 - t) / endSpeed) * endSpeed 
          : t;
      return easingFn(adjustedT);
    }
  };

  map.flyTo(flyOptions);
  
  let lastTime = Date.now();
  const oscillate = () => {
    const now = Date.now();
    if (map.isMoving()) {
      const currentPitch = map.getPitch();
      const oscillation = Math.sin(now / 3000) * 0.8;
      if (currentPitch + oscillation <= 80 && currentPitch + oscillation >= 0) {
        map.setPitch(currentPitch + oscillation);
      }
      requestAnimationFrame(oscillate);
    }
    lastTime = now;
  };
  requestAnimationFrame(oscillate);
}


/**
 * Actualiza la visibilidad de las capas y cambia el estilo del mapa
 */
export function updateLayersVisibility(
  mapRef: React.MutableRefObject<mapboxgl.Map | null>,
  mapLoadedRef: React.MutableRefObject<boolean>,
  activeLayers: string[],
  onMarkerClick?: (location: MemoryLocation) => void
) {
  if (!mapRef.current || !mapLoadedRef.current) return activeLayers;
  const map = mapRef.current;

  if (!Array.isArray(activeLayers)) {
    console.error("updateLayersVisibility: activeLayers is not an array", activeLayers);
    return activeLayers;
  }

  if (styleChanging) {
    console.warn("updateLayersVisibility: Style change in progress; skipping update");
    return activeLayers;
  }

  if (!map.isStyleLoaded()) {
    console.warn("updateLayersVisibility: Style not fully loaded, skipping update");
    return activeLayers;
  }

  const dataLayerIds = ["deforestation", "mining", "erosion"];
  const hasDataLayer = activeLayers.some((layer) => dataLayerIds.includes(layer));
  const desiredStyle = hasDataLayer ? DARK_STYLE : SATELLITE_STYLE;
  const needsStyleChange = currentMapStyle !== desiredStyle;

  if (!needsStyleChange) {
    map.setPaintProperty(
      "deforestation-heat", 
      "heatmap-opacity", 
      activeLayers.includes("deforestation") ? 0.8 : 0
    );
    map.setLayoutProperty(
      "deforestation-points", 
      "visibility", 
      activeLayers.includes("deforestation") ? "visible" : "none"
    );
    
    map.setPaintProperty(
      "mining-heat", 
      "heatmap-opacity", 
      activeLayers.includes("mining") ? 0.8 : 0
    );
    map.setLayoutProperty(
      "mining-points", 
      "visibility", 
      activeLayers.includes("mining") ? "visible" : "none"
    );
    
    map.setPaintProperty(
      "erosion-heat", 
      "heatmap-opacity", 
      activeLayers.includes("erosion") ? 0.8 : 0
    );
    map.setLayoutProperty(
      "erosion-points", 
      "visibility", 
      activeLayers.includes("erosion") ? "visible" : "none"
    );
    
    return activeLayers;
  }

  currentMapStyle = desiredStyle;
  styleChanging = true;
  
  const center = map.getCenter();
  const zoom = map.getZoom();
  const pitch = map.getPitch();
  const bearing = map.getBearing();
  
  // Guardar las ubicaciones de memoria actuales para restaurarlas después
  const locationsToRestore = memoryLocations;
  
  map.setStyle(desiredStyle);
  mapLoadedRef.current = false;

  map.once("style.load", () => {
    mapLoadedRef.current = true;
    map.setCenter(center);
    map.setZoom(zoom);
    map.setPitch(pitch);
    map.setBearing(bearing);
    
    addEnvironmentEffects(mapRef, mapLoadedRef);
    setupMapLayers(mapRef, mapLoadedRef);
    
    // IMPORTANTE: Restaurar los marcadores de memoria
    if (onMarkerClick) {
      setupClusteredMarkers(mapRef, mapLoadedRef, locationsToRestore, onMarkerClick);
    }
    
    if (map.getLayer("deforestation-heat")) {
      map.setPaintProperty(
        "deforestation-heat", 
        "heatmap-opacity", 
        activeLayers.includes("deforestation") ? 0.8 : 0
      );
      map.setLayoutProperty(
        "deforestation-points", 
        "visibility", 
        activeLayers.includes("deforestation") ? "visible" : "none"
      );
    }
    
    if (map.getLayer("mining-heat")) {
      map.setPaintProperty(
        "mining-heat", 
        "heatmap-opacity", 
        activeLayers.includes("mining") ? 0.8 : 0
      );
      map.setLayoutProperty(
        "mining-points", 
        "visibility", 
        activeLayers.includes("mining") ? "visible" : "none"
      );
    }
    
    if (map.getLayer("erosion-heat")) {
      map.setPaintProperty(
        "erosion-heat", 
        "heatmap-opacity", 
        activeLayers.includes("erosion") ? 0.8 : 0
      );
      map.setLayoutProperty(
        "erosion-points", 
        "visibility", 
        activeLayers.includes("erosion") ? "visible" : "none"
      );
    }
    
    styleChanging = false;
  });

  return activeLayers;
}



/**
 * Actualiza los marcadores (versión sin clustering)
 */
export function updateVisibleMarkers(
  mapRef: React.MutableRefObject<mapboxgl.Map | null>,
  mapLoadedRef: React.MutableRefObject<boolean>,
  markersRef: React.MutableRefObject<{ [key: string]: mapboxgl.Marker }>,
  appState: AppState,
  onMarkerClick: (location: MemoryLocation) => void,
  selectedMarkerRef: React.MutableRefObject<string | null>
) {
  if (!mapRef.current || !mapLoadedRef.current) return;
  const map = mapRef.current;

  // Elimina todos
  Object.values(markersRef.current).forEach((marker) => marker.remove());
  markersRef.current = {};

  // Filtrar
  const filteredLocations = memoryLocations.filter(location => {
    if (appState.selectedMacroRegion && location.region && 
        location.region !== appState.selectedMacroRegion) {
      return false;
    }
    if (appState.selectedDepartment && location.department && 
        location.department !== appState.selectedDepartment) {
      return false;
    }
    if (appState.selectedMemoryType && location.type && 
        location.type !== appState.selectedMemoryType) {
      return false;
    }
    return true;
  });

  filteredLocations.forEach((location) => {
    const isSelected = selectedMarkerRef.current === location.id;
    const markerEl = createCustomMarker(location, false, undefined, isSelected);
    const marker = new mapboxgl.Marker({ 
      element: markerEl,
      anchor: 'bottom'
    })
      .setLngLat([location.longitude, location.latitude])
      .addTo(map);

    marker.getElement().addEventListener("click", () => {
      onMarkerClick(location);
    });

    // Crear contenido detallado para el popup
    const popupContent = document.createElement('div');
    popupContent.className = 'popup-content';
    popupContent.innerHTML = `
      <h3>${location.title || `Lugar de Memoria ${location.code || ''}`}</h3>
      <p>${location.type ? memoryTypes[location.type as keyof typeof memoryTypes]?.name || location.type : 'Lugar de Memoria'}</p>
      ${location.region ? `<p class="location-region">Región ${location.region}</p>` : ''}
      ${location.department ? `<p class="location-department">Departamento ${location.department}</p>` : ''}
    `;

    const popup = new mapboxgl.Popup({
      closeButton: true,
      closeOnClick: false,
      offset: 25,
      className: 'memory-location-popup',
      maxWidth: '300px'
    }).setDOMContent(popupContent);

    // Mostrar popup al hacer hover sobre el marcador
    marker.getElement().addEventListener('mouseenter', () => {
      marker.setPopup(popup);
      popup.addTo(map);
    });
    
    // Mantener el popup visible cuando se hace clic en el marcador
    marker.getElement().addEventListener('click', () => {
      marker.setPopup(popup);
      popup.addTo(map);
    });
    
    // Ocultar popup solo al salir del marcador si no se ha hecho clic
    marker.getElement().addEventListener('mouseleave', () => {
      // Solo eliminar el popup si no se ha hecho clic en el marcador
      if (selectedMarkerRef.current !== location.id) {
        popup.remove();
      }
    });

    markersRef.current[location.id] = marker;
  });
}

/**
 * animateCamera: Animaciones de la cámara sin modificar el bearing.
 */
export function animateCamera(
  timestamp: number,
  mapRef: React.MutableRefObject<mapboxgl.Map | null>,
  mapLoadedRef: React.MutableRefObject<boolean>,
  droneActive: boolean,
  lastFrameTime: React.MutableRefObject<number>,
  animationFrameRef: React.MutableRefObject<number | undefined>,
  setDroneActive: (active: boolean) => void
) {
  if (!mapRef.current || !mapLoadedRef.current) return;
  const map = mapRef.current;
  
  // Verificar si hay una animación o movimiento en curso
  if (map.isMoving()) {
    // Si hay animación en curso, solo programar el siguiente frame
    animationFrameRef.current = requestAnimationFrame((ts) =>
      animateCamera(ts, mapRef, mapLoadedRef, droneActive, lastFrameTime, animationFrameRef, setDroneActive)
    );
    return;
  }
  
  // Actualizar el tiempo
  lastFrameTime.current = timestamp;

  // Solo aplicar efectos cuando el drone está activo
  if (droneActive) {
    // Rotación suave del bearing
    const currentBearing = map.getBearing();
    map.setBearing((currentBearing + 0.05) % 360);
  }

  // Programar el próximo frame de animación
  animationFrameRef.current = requestAnimationFrame((ts) =>
    animateCamera(ts, mapRef, mapLoadedRef, droneActive, lastFrameTime, animationFrameRef, setDroneActive)
  );
}

/**
 * navigateToRegion: Centra la cámara en una macro región
 */
export function navigateToRegion(
  macro: MacroRegion | string,
  mapRef: React.MutableRefObject<mapboxgl.Map | null>,
  mapLoadedRef: React.MutableRefObject<boolean>,
  setAppState: (state: any) => void
) {
  if (!mapRef.current || !mapLoadedRef.current) return;
  const map = mapRef.current;
  const region = colombiaRegions[macro as MacroRegion];
  if (region && region.bounds) {
    // Calcular el centro de la región
    const centerLng = (region.bounds.lng[0] + region.bounds.lng[1]) / 2;
    const centerLat = (region.bounds.lat[0] + region.bounds.lat[1]) / 2;
    
    // Zoom inicial para la región - este nivel de zoom mostrará el resaltado
    const initialZoom = 7.5;
    
    // Animar la cámara hacia la región
    cinematicFlyTo(map, {
      center: [centerLng, centerLat],
      zoom: initialZoom,
      pitch: 60,
      bearing: Math.random() * 60 - 30,
      duration: 2500
    });
    
    // Actualizar el estado
    setAppState((prev: any) => ({ 
      ...prev, 
      selectedMacroRegion: macro,
      selectedDepartment: null
    }));
  }
}

/**
 * navigateToDepartment: Centra la cámara en el centro de un departamento.
 */
export function navigateToDepartment(
  departmentId: string,
  appState: AppState,
  mapRef: React.MutableRefObject<mapboxgl.Map | null>,
  mapLoadedRef: React.MutableRefObject<boolean>,
  setAppState: (state: any) => void
) {
  if (!mapRef.current || !mapLoadedRef.current) return;
  const map = mapRef.current;
  const macro = appState.selectedMacroRegion;
  if (macro) {
    const region = colombiaRegions[macro as MacroRegion];
    const department = region.departments.find((d) => d.id === departmentId);
    
    let centerCoords: [number, number] = [
      (region.bounds.lng[0] + region.bounds.lng[1]) / 2,
      (region.bounds.lat[0] + region.bounds.lat[1]) / 2
    ];
    
    if (department && department.center) {
      centerCoords = department.center;
    }
    
    // Utilizar un zoom más alto para departamentos (por encima del umbral donde 
    // el resaltado de región se desvanece, que es 11 según nuestro setupZoomBasedHighlighting)
    cinematicFlyTo(map, {
      center: centerCoords,
      zoom: 11.5,
      pitch: 60,
      bearing: 30,
      duration: 2500
    });
    
    setAppState((prev: any) => ({ ...prev, selectedDepartment: departmentId }));
    
    // No es necesario ajustar el resaltado explícitamente después de la animación
    // ya que el comportamiento está incorporado en las expresiones de opacidad
  }
}

/**
 * Vista aérea de un lugar de memoria específico
 */
export function showLocationAerialView(
  mapRef: React.MutableRefObject<mapboxgl.Map | null>,
  mapLoadedRef: React.MutableRefObject<boolean>,
  location: MemoryLocation
) {
  if (!mapRef.current || !mapLoadedRef.current) return;
  const map = mapRef.current;
  
  cinematicFlyTo(map, {
    center: [location.longitude, location.latitude],
    zoom: 15,
    pitch: 65,
    bearing: Math.random() * 360,
    duration: 3000
  });
}

/**
 * Finaliza el tour guiado con transición cinematográfica
 */
export function finishGuidedTour(
  mapRef: React.MutableRefObject<mapboxgl.Map | null>, 
  setAppState: (state: any) => void,
  lastLocation?: [number, number]
) {
  if (!mapRef.current) return;
  
  hideAreaOfInterest(mapRef, { current: true });
  const finalLocation = lastLocation || [-74.3, 4.3];
  
  const map = mapRef.current;
  cinematicFlyTo(map, {
    center: finalLocation,
    zoom: 9,
    pitch: 60,
    bearing: Math.random() * 60 - 30,
    duration: 4000,
    easing: "cinematic",
    startSpeed: 0.2,
    endSpeed: 0.3
  });
  
  setTimeout(() => {
    map.once('moveend', () => {
      setAppState((prev: any) => ({ ...prev, stage: 'app' }));
    });
    cinematicFlyTo(map, {
      center: finalLocation,
      zoom: 11,
      pitch: 45,
      bearing: 0,
      duration: 3000,
      easing: "cubic"
    });
  }, 4500);
  
  applyTourEndingEffect(map);
}

/**
 * Aplica efecto visual de cierre de tour
 */
function applyTourEndingEffect(map: mapboxgl.Map) {
  const overlay = document.createElement('div');
  overlay.className = 'tour-ending-overlay';
  overlay.style.cssText = `
    position: absolute; top: 0; left: 0; right: 0; bottom: 0;
    background-color: rgba(0, 0, 0, 0);
    pointer-events: none;
    transition: background-color 3s ease;
    z-index: 1000;
  `;
  
  document.body.appendChild(overlay);
  
  setTimeout(() => {
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    setTimeout(() => {
      overlay.style.transition = 'background-color 2s ease';
      overlay.style.backgroundColor = 'rgba(0, 0, 0, 0)';
      setTimeout(() => {
        overlay.remove();
      }, 2500);
    }, 1000);
  }, 200);
  
  if (map.getLight) {
    const originalLight = map.getLight();
    map.setLight({
      color: 'rgb(180, 180, 180)',
      intensity: 0.2
    });
    setTimeout(() => {
      map.setLight(originalLight);
    }, 3000);
  }
}

/**
 * Vuela cinematográficamente a un lugar de memoria
 */
export function cinematicLocationFocus(
  mapRef: React.MutableRefObject<mapboxgl.Map | null>,
  location: MemoryLocation
) {
  if (!mapRef.current) return;
  
  const map = mapRef.current;
  const randomAngle = Math.random() * 360;
  const highPitch = 55 + Math.random() * 15;
  
  // No es necesario atenuar el resaltado explícitamente
  // La atenuación está incorporada en las expresiones de opacidad
  // en la función highlightRegion
  
  if (map.getZoom() > 14) {
    map.flyTo({
      center: [location.longitude, location.latitude],
      zoom: 13,
      pitch: 30,
      bearing: randomAngle,
      duration: 1500,
      essential: true
    });
    
    setTimeout(() => {
      map.flyTo({
        center: [location.longitude, location.latitude],
        zoom: 15.5,
        pitch: highPitch,
        bearing: (randomAngle + 120) % 360,
        duration: 3500,
        essential: true
      });
    }, 1600);
  } else {
    map.flyTo({
      center: [location.longitude, location.latitude],
      zoom: 15,
      pitch: highPitch,
      bearing: randomAngle,
      duration: 4000,
      essential: true,
      curve: 1.5
    });
  }
}

/**
 * Dibuja un área de interés circular
 */
export function drawAreaOfInterest(
  mapRef: React.MutableRefObject<mapboxgl.Map | null>,
  mapLoadedRef: React.MutableRefObject<boolean>,
  center: [number, number],
  radius: number = 0.1
) {
  if (!mapRef.current || !mapLoadedRef.current) return;
  const map = mapRef.current;
  
  // Asegurar que el área de interés sea visible
  if (map.getLayer('area-fill')) {
    map.setLayoutProperty('area-fill', 'visibility', 'visible');
  }
  if (map.getLayer('area-line')) {
    map.setLayoutProperty('area-line', 'visibility', 'visible');
  }
  
  // Usar un radio fijo muy pequeño en coordenadas de pantalla para mantenerlo cerca del punto
  // en lugar de usar coordenadas geográficas que pueden distorsionarse
  
  // Calcular el radio basado en el zoom actual - más pequeño a mayor zoom para mantenerlo preciso
  const currentZoom = map.getZoom();
  // Fórmula ajustada para que el radio sea mucho más pequeño
  const scaledRadius = 0.015 / Math.pow(1.2, Math.min(currentZoom - 10, 8));
  
  const points = 64;
  const coords = [];
  for (let i = 0; i < points; i++) {
    const angle = (i / points) * 2 * Math.PI;
    // Fórmulas simplificadas para evitar distorsiones geográficas
    const latOffset = scaledRadius * Math.sin(angle);
    const lngOffset = scaledRadius * Math.cos(angle);
    coords.push([center[0] + lngOffset, center[1] + latOffset]);
  }
  coords.push(coords[0]);
  
  if (!map.getSource('area-of-interest')) {
    map.addSource('area-of-interest', {
      type: 'geojson',
      data: {
        type: 'Feature',
        geometry: { type: 'Polygon', coordinates: [coords] },
        properties: {}
      }
    });
    
    map.addLayer({
      id: 'area-fill',
      type: 'fill',
      source: 'area-of-interest',
      paint: {
        'fill-color': 'white',
        'fill-opacity': 0.1
      }
    });
    map.addLayer({
      id: 'area-line',
      type: 'line',
      source: 'area-of-interest',
      paint: {
        'line-color': 'white',
        'line-width': 2,
        'line-opacity': 0.8,
        'line-dasharray': [2, 1]
      }
    });
  } else {
    const source = map.getSource('area-of-interest') as mapboxgl.GeoJSONSource;
    source.setData({
      type: 'Feature',
      geometry: { type: 'Polygon', coordinates: [coords] },
      properties: {}
    });
  }
}

/**
 * Ocultar el área de interés
 */
export function hideAreaOfInterest(
  mapRef: React.MutableRefObject<mapboxgl.Map | null>,
  mapLoadedRef: React.MutableRefObject<boolean>
) {
  if (!mapRef.current || !mapLoadedRef.current) return;
  const map = mapRef.current;
  
  if (map.getLayer('area-fill')) {
    map.setLayoutProperty('area-fill', 'visibility', 'none');
  }
  if (map.getLayer('area-line')) {
    map.setLayoutProperty('area-line', 'visibility', 'none');
  }
}

/**
 * initializeMap: Crea y configura la instancia del mapa
 */
export function initializeMap(
  mapContainerRef: React.RefObject<HTMLDivElement>,
  mapRef: React.MutableRefObject<mapboxgl.Map | null>,
  mapLoadedRef: React.MutableRefObject<boolean>,
  setIsMapLoaded: (loaded: boolean) => void,
  setMapError: (error: string | null) => void,
  droneActive: boolean,
  setDroneActive: (active: boolean) => void,
  onMapReady: () => void
) {
  try {
    if (!mapContainerRef.current) {
      throw new Error("El contenedor del mapa no está disponible");
    }
    
    const preloadImages = [
      "mapbox://styles/mapbox/satellite-streets-v12",
      "mapbox://styles/mapbox/dark-v10"
    ];
    
    Promise.all(preloadImages.map(url => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(url);
        img.onerror = () => resolve(url);
        img.src = url.replace("mapbox://", "https://api.mapbox.com/");
      });
    })).then(() => {
      const map = new mapboxgl.Map({
        container: mapContainerRef.current as HTMLElement,
        style: mapConfig.style,
        center: mapConfig.center,
        zoom: mapConfig.zoom,
        pitch: mapConfig.pitch,
        bearing: mapConfig.bearing,
        antialias: true,
        attributionControl: false,
        preserveDrawingBuffer: true,
        fadeDuration: 0,
        crossSourceCollisions: false,
        logoPosition: 'bottom-left',
        interactive: true,
        boxZoom: false,
        dragRotate: true,
        dragPan: true,
        keyboard: true,
        doubleClickZoom: true,
        touchZoomRotate: true,
        scrollZoom: true
      });

      map.on("load", () => {
        // Asegurarse de que no hay controles de navegación o información
        const existingControls = map._controls || [];
        existingControls.forEach((control: any) => {
          if (control instanceof mapboxgl.NavigationControl || 
              control instanceof mapboxgl.AttributionControl || 
              control instanceof mapboxgl.GeolocateControl) {
            map.removeControl(control);
          }
        });
        
        mapLoadedRef.current = true;
        setIsMapLoaded(true);
        onMapReady();
      });

      map.on("error", (e) => {
        console.error("Error en el mapa:", e);
        setMapError(e.error?.message || "Error desconocido en el mapa");
      });

      mapRef.current = map;
    });
  } catch (error: any) {
    console.error("Error al inicializar el mapa:", error);
    setMapError(error.message || "Error al inicializar el mapa");
  }
}

/**
 * resetMap: Elimina el mapa actual y lo reinicializa
 */
export function resetMap(
  mapRef: React.MutableRefObject<mapboxgl.Map | null>,
  mapContainerRef: React.RefObject<HTMLDivElement>,
  markersRef: React.MutableRefObject<{ [key: string]: mapboxgl.Marker }>,
  mapLoadedRef: React.MutableRefObject<boolean>,
  setIsMapLoaded: (loaded: boolean) => void,
  setMapError: (error: string | null) => void,
  droneActive: boolean,
  setDroneActive: (active: boolean) => void,
  onMapReady: () => void
) {
  if (mapRef.current) {
    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};
    mapRef.current.remove();
    mapRef.current = null;
    mapLoadedRef.current = false;
  }
  
  currentMapStyle = mapConfig.style;
  styleChanging = false;
  
  initializeMap(
    mapContainerRef,
    mapRef,
    mapLoadedRef,
    setIsMapLoaded,
    setMapError,
    droneActive,
    setDroneActive,
    onMapReady
  );
}


//
// Continúa el archivo "MapService.ts"
//

/**
 * Tour guiado con marcadores visibles en cada ubicación importante
 */
export function startGuidedTour(
  mapRef: React.MutableRefObject<mapboxgl.Map | null>,
  mapLoadedRef: React.MutableRefObject<boolean>,
  setDroneActive: (active: boolean) => void,
  setAppState: (state: any) => void,
  renderTourMessage: (props: any, container: HTMLElement, onClose: () => void) => void,
  specificLocations: string[] = [], // Nuevo parámetro para recorridos temáticos
  onDemoComplete?: () => void // Función para saltar el demo
) {
  if (!mapRef.current || !mapLoadedRef.current) return;
  
  const map = mapRef.current;
  setDroneActive(false);
  setAppState((prev: any) => ({ ...prev, stage: 'tour' }));
  
  // Crear marcadores temporales para el tour
  const tourMarkers: mapboxgl.Marker[] = [];
  
  // Coordenadas y detalles de lugares de memoria para mostrar durante el tour
  const defaultTourLocations = [
    {
      id: "bogota_cnmh",
      longitude: -74.071,
      latitude: 4.624,
      title: "Centro de Memoria, Paz y Reconciliación",
      description: "Este centro en el corazón de Colombia simboliza la resistencia y la memoria colectiva de las víctimas del conflicto.",
      type: "caracterizados",
      code: "LM001"
    },
    {
      id: "medellin_casa",
      longitude: -75.571,
      latitude: 6.249,
      title: "Museo Casa de la Memoria",
      description: "Este espacio dedicado a la memoria de las víctimas permite que las voces silenciadas por la violencia sean escuchadas.",
      type: "identificados",
      code: "LM002"
    },
    {
      id: "cali_monumento",
      longitude: -76.533,
      latitude: 3.435,
      title: "Monumento a las Víctimas del Conflicto",
      description: "Este lugar simboliza la resistencia de las comunidades afectadas por la violencia en el suroccidente del país.",
      type: "solicitud",
      code: "LM003"
    },
    {
      id: "cartagena_memorial",
      longitude: -75.50,
      latitude: 10.39,
      title: "Memorial por la Verdad",
      description: "Un espacio de reflexión y conmemoración dedicado a honrar la memoria de las víctimas del conflicto en la región Caribe.",
      type: "sanaciones",
      code: "LM004"
    }
  ];
  
  // Si hay ubicaciones específicas para un recorrido temático, usarlas en lugar de la ruta predeterminada
  const tourLocations = specificLocations.length > 0
    ? memoryLocations.filter(loc => specificLocations.includes(loc.id))
    : defaultTourLocations;
  
  // Función para crear y mostrar marcadores en lugares específicos
  const showMemoryMarkers = (index: number) => {
    // Limpiar marcadores anteriores
    tourMarkers.forEach(marker => marker.remove());
    tourMarkers.length = 0;
    
    // Determinar qué marcadores mostrar según la etapa del tour
    let markersToShow: any[] = [];
    
    if (specificLocations.length > 0) {
      // En tours temáticos, mostrar marcadores progresivamente según el avance
      const currentStep = Math.floor((index / tourSequence.length) * tourLocations.length);
      markersToShow = tourLocations.slice(0, Math.max(1, currentStep));
    } else {
      // En el tour estándar, seguir la secuencia original
      if (index <= 3) {
        // En la intro y primer lugar, mostrar solo el primero
        markersToShow = [tourLocations[0]];
      } else if (index <= 6) {
        // En la segunda ubicación, mostrar las dos primeras
        markersToShow = [tourLocations[0], tourLocations[1]];
      } else if (index <= 9) {
        // En la tercera ubicación, mostrar las tres primeras
        markersToShow = [tourLocations[0], tourLocations[1], tourLocations[2]];
      } else {
        // Al final, mostrar todos
        markersToShow = tourLocations;
      }
    }
    
    markersToShow.forEach(location => {
      const el = document.createElement("div");
      el.className = "memory-location-marker";
      
      const markerColor = getMarkerColor(location.type);
      el.innerHTML = `
        <div class="memory-marker-outer-ring"></div>
        <div class="memory-marker-circle" style="background-color: ${markerColor}40; border-color: ${markerColor}80;">
          <div class="memory-marker-inner-circle" style="background-color: ${markerColor};">
            <div class="memory-marker-icon" style="color: white;">
              ${getMarkerIcon(location.type)}
            </div>
          </div>
        </div>
        ${location.code ? `<div class="memory-marker-label">${location.code}</div>` : ''}
      `;
      
      const marker = new mapboxgl.Marker({
        element: el,
        anchor: 'bottom'
      })
        .setLngLat([location.longitude, location.latitude])
        .addTo(map);
      
      // Popup
      const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
        offset: 25,
        className: 'memory-location-popup'
      });
      const popupContent = document.createElement('div');
      popupContent.className = 'popup-content';
      popupContent.innerHTML = `
        <h3>${location.title}</h3>
        <p>${getTypeName(location.type)}</p>
      `;
      popup.setDOMContent(popupContent);
      
      el.addEventListener('mouseenter', () => {
        // Verificar que el mapa sigue siendo válido antes de añadir el popup
        if (map && !map._removed) {
          marker.setPopup(popup);
          popup.addTo(map);
        }
      });
      el.addEventListener('mouseleave', () => {
        popup.remove();
      });
      
      tourMarkers.push(marker);
    });
    
    if (markersToShow.length > 0) {
      console.log(`Mostrando ${markersToShow.length} marcadores de memoria en esta etapa`);
    }
  };
  
  function getMarkerColor(type: string): string {
    const colors: Record<string, string> = {
      identificados: "#FF9D4D",
      caracterizados: "#4CAF50",
      solicitud: "#2196F3",
      horror: "#F44336",
      sanaciones: "#9C27B0"
    };
    return colors[type] || "#FFFFFF";
  }
  
  function getMarkerIcon(type: string): string {
    const icons: Record<string, string> = {
      identificados: `<svg width="12" height="12" ...>...</svg>`,
      caracterizados: `<svg width="12" height="12" ...>...</svg>`,
      solicitud: `<svg width="12" height="12" ...>...</svg>`,
      horror: `<svg width="12" height="12" ...>...</svg>`,
      sanaciones: `<svg width="12" height="12" ...>...</svg>`
    };
    return icons[type] || `<svg width="12" height="12" ...>...</svg>`;
  }
  
  function getTypeName(type: string): string {
    const names: Record<string, string> = {
      identificados: "Lugar Identificado",
      caracterizados: "Lugar Caracterizado",
      solicitud: "En Solicitud",
      horror: "Lugar del Horror",
      sanaciones: "Espacio de Sanación"
    };
    return names[type] || "Lugar de Memoria";
  }
  
  // Secuencia de pasos del tour
  let tourSequence: Array<{
    title: string;
    message: string;
    center: [number, number];
    zoom: number;
    pitch: number;
    bearing: number;
    duration: number;
    location?: string;
    isLastStep?: boolean;
  }> = [];
  
  // Si estamos en un tour temático (con ubicaciones específicas), creamos una secuencia más directa
  if (specificLocations.length > 0) {
    // Paso inicial introductorio
    tourSequence.push({
      title: "Recorrido Temático",
      message: "Bienvenido a este recorrido temático por los Lugares de Memoria de Colombia...",
      center: [-73.5, 4.8],
      zoom: 6.2,
      pitch: 45,
      bearing: 0,
      duration: 5000
    });
    
    // Añadir cada ubicación como un paso en el tour
    tourLocations.forEach((location, index) => {
      const isLast = index === tourLocations.length - 1;
      const regionName = location.region ? getRegionName(location.region as MacroRegion) : "Colombia";
      const typeName = location.type ? getTypeName(location.type) : "Lugar de Memoria";
      
      tourSequence.push({
        title: location.title,
        message: location.description + (isLast ? 
          " Este es el último sitio de nuestro recorrido temático." : 
          " Continúa explorando estos importantes espacios de memoria."),
        center: [location.longitude, location.latitude],
        zoom: 16.2,
        pitch: 65 + (Math.random() * 10),
        bearing: Math.random() * 360,
        duration: 7000,
        location: `${location.code || ''} • ${regionName} • ${typeName}`,
        isLastStep: isLast
      });
    });
    
    // Paso final de cierre
    tourSequence.push({
      title: "Fin del Recorrido Temático",
      message: "Has completado este recorrido temático. Te invitamos a explorar los más de 140 lugares de memoria documentados...",
      center: [-74.5, 5.5],
      zoom: 6.8,
      pitch: 45,
      bearing: 15,
      duration: 5000,
      isLastStep: true
    });
  } else {
    // Tour estándar con introducción y contenido educativo
    tourSequence = [
      {
        title: "Mapa de la Memoria Histórica",
        message: "Bienvenido al recorrido por los Lugares de Memoria de Colombia...",
        center: [-73.5, 4.8],
        zoom: 6.2,
        pitch: 45,
        bearing: 0,
        duration: 7000,
        skipFunction: () => {
          // Limpiar todos los elementos del tour y salir del modo demo
          hideAreaOfInterest(mapRef, mapLoadedRef);
          
          // Limpiar todos los marcadores del tour
          tourMarkers.forEach(marker => marker.remove());
          
          // Eliminar cualquier popup o mensaje que esté visible
          const tourMessages = document.querySelectorAll('.tour-message-wrapper');
          tourMessages.forEach(el => el.remove());
          
          // Cambiar el estado para volver al modo principal de la aplicación
          setAppState((prev: any) => ({ ...prev, stage: 'app' }));
          
          // Volver a una vista general del mapa
          map.flyTo({
            center: [-73.5, 4.8],
            zoom: 6,
            pitch: 30,
            bearing: 0,
            duration: 2000
          });
          
          // Llamar a la función que completa el demo
          if (onDemoComplete) onDemoComplete();
        }
      },
      {
        title: "Navegación por Regiones",
        message: "El mapa te permite explorar las cinco macroregiones de Colombia...",
        center: [-74.2, 4.55],
        zoom: 10,
        pitch: 50,
        bearing: 30,
        duration: 7000
      },
      {
        title: tourLocations[0].title,
        message: tourLocations[0].description + " Su arquitectura y espacios invitan...",
        center: [tourLocations[0].longitude, tourLocations[0].latitude],
        zoom: 16.2,
        pitch: 67,
        bearing: 210,
        duration: 7000,
        location: `${tourLocations[0].code} • Región Andina • ${getTypeName(tourLocations[0].type)}`
      },
      {
        title: "Información Contextual",
        message: "Este mapa integra capas de información ambiental...",
        center: [tourLocations[0].longitude - 0.002, tourLocations[0].latitude - 0.001],
        zoom: 15.5,
        pitch: 70,
        bearing: 150,
        duration: 7000
      },
      {
        title: "Lugares que Conectan Territorios",
        message: "Los lugares de memoria están dispersos...",
        center: [-75.0, 5.6],
        zoom: 9,
        pitch: 60,
        bearing: 30,
        duration: 8000
      },
      {
        title: tourLocations[1].title,
        message: tourLocations[1].description + " A través de exposiciones y actividades...",
        center: [tourLocations[1].longitude, tourLocations[1].latitude],
        zoom: 16.2,
        pitch: 72,
        bearing: 45,
        duration: 7000,
        location: `${tourLocations[1].code} • Región Andina • ${getTypeName(tourLocations[1].type)}`
      },
      {
        title: "Tipologías de Lugares",
        message: "El mapa clasifica los lugares en cinco categorías...",
        center: [tourLocations[1].longitude - 0.002, tourLocations[1].latitude + 0.002],
        zoom: 15.5,
        pitch: 65,
        bearing: 310,
        duration: 7000
      },
      {
        title: "Diversidad de Narrativas",
        message: "Desde el Caribe hasta el Pacífico...",
        center: [-76.0, 4.0],
        zoom: 9,
        pitch: 70,
        bearing: 120,
        duration: 8000
      },
      {
        title: tourLocations[2].title,
        message: tourLocations[2].description + " Aquí se realizan ceremonias de conmemoración...",
        center: [tourLocations[2].longitude, tourLocations[2].latitude],
        zoom: 16.2,
        pitch: 65,
        bearing: 155,
        duration: 7000,
        location: `${tourLocations[2].code} • Región Pacífico • ${getTypeName(tourLocations[2].type)}`
      },
      {
        title: "Tu Recorrido por la Memoria",
        message: "Has completado un viaje por algunos de los más de 140 lugares de memoria...",
        center: [-74.5, 5.5],
        zoom: 6.8,
        pitch: 45,
        bearing: 15,
        duration: 7000,
        isLastStep: true
      }
    ];
  }

  try {
    (async () => {
      // Pequeño retardo inicial
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      for (let i = 0; i < tourSequence.length; i++) {
        const step = tourSequence[i];
        
        // Verificar que el mapa todavía existe antes de continuar
        if (!mapRef.current || mapRef.current._removed) {
          console.log("Tour interrumpido: el mapa ya no existe");
          break;
        }
        
        try {
          showMemoryMarkers(i);
          console.log("Volando a:", step.center, "zoom:", step.zoom);
        } catch (err) {
          console.error("Error al mostrar marcadores:", err);
        }
        
        await new Promise<void>(resolve => {
          map.flyTo({
            center: step.center,
            zoom: step.zoom,
            pitch: step.pitch || 60,
            bearing: step.bearing || 0,
            duration: step.duration || 7000,
            essential: true
          });
          
          map.once('moveend', () => {
            console.log("Vuelo completado a", step.center);
            setTimeout(resolve, 800);
          });
        });
        
        if (i === 2 || i === 5 || i === 8) {
          drawAreaOfInterest(mapRef, mapLoadedRef, step.center as [number, number], 0.15);
        } else if (i !== 0 && i !== tourSequence.length - 1) {
          // Mantener área para otros pasos
        } else {
          hideAreaOfInterest(mapRef, mapLoadedRef);
        }
        
        // Mostrar mensaje educativo
        await new Promise<void>(resolve => {
          // Verificar que el documento todavía existe y está disponible
          if (!document.body) {
            console.error("Error: document.body no está disponible");
            resolve();
            return;
          }
          
          const tourMessageElement = document.createElement('div');
          tourMessageElement.className = 'tour-message-wrapper';
          document.body.appendChild(tourMessageElement);

          renderTourMessage({
            title: step.title,
            message: step.message,
            location: step.location,
            isLastStep: step.isLastStep || i === tourSequence.length - 1,
            skipFunction: step.skipFunction,
            onNext: () => {
              tourMessageElement.remove();
              resolve();
            }
          }, tourMessageElement, () => {
            hideAreaOfInterest(mapRef, mapLoadedRef);
            tourMessageElement.remove();
            
            // Limpiar marcadores del tour al salir
            tourMarkers.forEach(marker => marker.remove());
            setAppState((prev: any) => ({ ...prev, stage: 'app' }));
            resolve();
          });
        });
      }
      
      // Tour finalizado
      hideAreaOfInterest(mapRef, mapLoadedRef);
      tourMarkers.forEach(marker => marker.remove());
      
      map.flyTo({
        center: [-73.5, 4.8],
        zoom: 6,
        pitch: 0,
        bearing: 0,
        duration: 3000
      });
      
      setTimeout(() => {
        setAppState((prev: any) => ({ ...prev, stage: 'app' }));
      }, 3000);
      
    })().catch(error => {
      console.error("Error en tour guiado:", error);
      tourMarkers.forEach(marker => marker.remove());
      setAppState((prev: any) => ({ ...prev, stage: 'app' }));
    });
  } catch (error) {
    console.error("Error en tour guiado:", error);
    setAppState((prev: any) => ({ ...prev, stage: 'app' }));
  }
}


/**
 * Configuración del clustering para marcadores en el mapa
 */
export function setupClusteredMarkers(
  mapRef: React.MutableRefObject<mapboxgl.Map | null>,
  mapLoadedRef: React.MutableRefObject<boolean>,
  memoryLocations: MemoryLocation[],
  onMarkerClick: (location: MemoryLocation) => void
) {
  if (!mapRef.current || !mapLoadedRef.current) return;
  const map = mapRef.current;
  
  // Comprobar si la fuente ya existe para evitar duplicados
  if (map.getSource('memory-locations')) {
    updateClusterSource(mapRef, memoryLocations);
    return;
  }

  // Creamos un GeoJSON con todos los lugares de memoria
  const memoryPoints = {
    type: 'FeatureCollection',
    features: memoryLocations.map(location => ({
      type: 'Feature',
      properties: {
        id: location.id,
        title: location.title,
        type: location.type,
        code: location.code || '',
        description: location.description || '',
        region: location.region,
        department: location.department
      },
      geometry: {
        type: 'Point',
        coordinates: [location.longitude, location.latitude]
      }
    }))
  };

  // Añadir la fuente con clusterización activada
  map.addSource('memory-locations', {
    type: 'geojson',
    data: memoryPoints as any,
    cluster: true,
    clusterMaxZoom: 14, // Máximo zoom al que se muestran clusters
    clusterRadius: 50 // Radio de agrupación en píxeles
  });

  // Añadir capa de círculos para los clusters
  map.addLayer({
    id: 'clusters',
    type: 'circle',
    source: 'memory-locations',
    filter: ['has', 'point_count'],
    paint: {
      'circle-color': [
        'step',
        ['get', 'point_count'],
        '#51bbd6', // Color para clusters pequeños
        10, '#f1f075', // Color para clusters medianos
        50, '#f28cb1' // Color para clusters grandes
      ],
      'circle-radius': [
        'step',
        ['get', 'point_count'],
        20, // Radio para clusters pequeños
        10, 25, // Radio para clusters medianos
        50, 30 // Radio para clusters grandes
      ],
      'circle-opacity': 0.85,
      'circle-stroke-width': 2,
      'circle-stroke-color': 'rgba(255,255,255,0.5)',
      'circle-stroke-opacity': 0.5
    }
  });

  // Añadir capa para la cuenta de puntos en cada cluster
  map.addLayer({
    id: 'cluster-count',
    type: 'symbol',
    source: 'memory-locations',
    filter: ['has', 'point_count'],
    layout: {
      'text-field': '{point_count_abbreviated}',
      'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
      'text-size': 12
    },
    paint: {
      'text-color': 'white'
    }
  });

  // Añadir capa para puntos individuales
  map.addLayer({
    id: 'unclustered-point',
    type: 'circle',
    source: 'memory-locations',
    filter: ['!', ['has', 'point_count']],
    paint: {
      'circle-color': [
        'match',
        ['get', 'type'],
        'identificados', '#FF9D4D',
        'caracterizados', '#4CAF50',
        'solicitud', '#2196F3',
        'horror', '#F44336',
        'sanaciones', '#9C27B0',
        '#AAAAAA' // color por defecto
      ],
      'circle-radius': 8,
      'circle-stroke-width': 2,
      'circle-stroke-color': 'white',
      'circle-opacity': 0.85
    }
  });

  // Añadir etiquetas para los códigos de los lugares
  map.addLayer({
    id: 'unclustered-label',
    type: 'symbol',
    source: 'memory-locations',
    filter: ['!', ['has', 'point_count']],
    layout: {
      'text-field': ['get', 'code'],
      'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
      'text-size': 9,
      'text-offset': [0, 1.5],
      'text-anchor': 'top',
      'text-optional': true
    },
    paint: {
      'text-color': 'white',
      'text-halo-color': 'rgba(0,0,0,0.7)',
      'text-halo-width': 1.5
    }
  });

  // Evento click para expandir un cluster
  map.on('click', 'clusters', (e) => {
    const features = map.queryRenderedFeatures(e.point, { layers: ['clusters'] });
    const clusterId = features[0].properties.cluster_id;
    
    (map.getSource('memory-locations') as mapboxgl.GeoJSONSource).getClusterExpansionZoom(
      clusterId,
      (err, zoom) => {
        if (err) return;
        map.easeTo({
          center: (features[0].geometry as any).coordinates,
          zoom: zoom
        });
      }
    );
  });

  // Cambiar el cursor al pasar sobre elementos interactivos
  map.on('mouseenter', 'clusters', () => {
    map.getCanvas().style.cursor = 'pointer';
  });
  
  map.on('mouseleave', 'clusters', () => {
    map.getCanvas().style.cursor = '';
  });

  map.on('mouseenter', 'unclustered-point', () => {
    map.getCanvas().style.cursor = 'pointer';
  });
  
  map.on('mouseleave', 'unclustered-point', () => {
    map.getCanvas().style.cursor = '';
  });

  // Evento click para puntos individuales
  map.on('click', 'unclustered-point', (e) => {
    const properties = e.features?.[0]?.properties;
    if (!properties) return;
    
    // Crear objeto de tipo MemoryLocation con los datos del punto
    const location: MemoryLocation = {
      id: properties.id,
      longitude: e.lngLat.lng,
      latitude: e.lngLat.lat,
      title: properties.title,
      type: properties.type,
      region: properties.region,
      department: properties.department,
      description: properties.description,
      code: properties.code || undefined
    };
    
    // Llamar a la función de manejo de clics en marcadores
    onMarkerClick(location);
  });
}
/**
 * Carga las imágenes personalizadas para los marcadores si no existen ya
 */
function loadCustomMarkerIcons(map: mapboxgl.Map) {
  const markerColors = {
    identificados: '#FF9D4D',
    caracterizados: '#4CAF50',
    solicitud: '#2196F3',
    horror: '#F44336',
    sanaciones: '#9C27B0',
    default: '#AAAAAA'
  };
  
  const iconTypes = [
    'identificados',
    'caracterizados',
    'solicitud',
    'horror',
    'sanaciones',
    'default'
  ];
  
  iconTypes.forEach(type => {
    const color = markerColors[type as keyof typeof markerColors];
    const iconId = `memory-marker-${type}`;
    if (map.hasImage(iconId)) return;
    
    const canvas = document.createElement('canvas');
    canvas.width = 40;
    canvas.height = 40;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Círculo exterior (halo)
    ctx.beginPath();
    ctx.arc(20, 20, 18, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.fill();
    
    // Círculo principal
    ctx.beginPath();
    ctx.arc(20, 20, 16, 0, Math.PI * 2);
    ctx.fillStyle = color + '33';
    ctx.strokeStyle = color + '80';
    ctx.lineWidth = 2;
    ctx.fill();
    ctx.stroke();
    
    // Círculo interior
    ctx.beginPath();
    ctx.arc(20, 20, 8, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    
    // Icono interno (simplificado a un círculo blanco)
    ctx.beginPath();
    ctx.arc(20, 20, 4, 0, Math.PI * 2);
    ctx.fillStyle = 'white';
    ctx.fill();
    
    map.addImage(iconId, canvas);
  });
}

/**
 * Actualiza los datos de la fuente de clusters
 */
export function updateClusterSource(
  mapRef: React.MutableRefObject<mapboxgl.Map | null>,
  memoryLocations: MemoryLocation[]
) {
  if (!mapRef.current) return;
  const map = mapRef.current;
  
  const source = map.getSource('memory-locations') as mapboxgl.GeoJSONSource;
  if (!source) return;
  
  // Convertir ubicaciones a GeoJSON
  const memoryPoints = {
    type: 'FeatureCollection',
    features: memoryLocations.map(location => ({
      type: 'Feature',
      properties: {
        id: location.id,
        title: location.title,
        type: location.type,
        code: location.code || '',
        description: location.description || '',
        region: location.region,
        department: location.department
      },
      geometry: {
        type: 'Point',
        coordinates: [location.longitude, location.latitude]
      }
    }))
  };
  
  source.setData(memoryPoints as any);
}

/**
 * Genera datos aleatorios más orgánicos y con mayor impacto visual para los heatmaps
 */
function generateImprovedHeatmapData() {
  // Límites aproximados de Colombia
  const bounds = {
    west: -79.0,
    south: -4.3,
    east: -66.9,
    north: 12.5
  };
  
  // Función interna para crear puntos con concentración
  function createConcentratedPoints(
    centerX: number, 
    centerY: number, 
    count: number, 
    radius: number,
    minIntensity: number = 0.6, 
    maxIntensity: number = 1.0
  ) {
    const points = [];
    for (let i = 0; i < count; i++) {
      const r = radius * Math.sqrt(-2 * Math.log(Math.random()));
      const theta = 2 * Math.PI * Math.random();
      const offsetX = r * Math.cos(theta);
      const offsetY = r * Math.sin(theta);
      
      const longitude = centerX + offsetX;
      const latitude = centerY + offsetY;
      
      const distanceFromCenter = Math.sqrt(offsetX * offsetX + offsetY * offsetY);
      const normalizedDistance = Math.min(1, distanceFromCenter / radius);
      const intensity = maxIntensity - normalizedDistance * (maxIntensity - minIntensity);
      
      points.push({
        coordinates: [longitude, latitude] as [number, number],
        intensity
      });
    }
    return points;
  }
  
  // Deforestación
  const deforestationClusters = [
    createConcentratedPoints(-72.0, 0.0, 100, 2.0, 0.7, 1.0),
    createConcentratedPoints(-77.0, 6.0, 70, 1.5, 0.7, 1.0),
    createConcentratedPoints(-74.0, 7.5, 50, 1.2, 0.6, 0.9),
    createConcentratedPoints(-76.0, 1.5, 60, 1.3, 0.6, 0.9)
  ];
  
  // Minería
  const miningClusters = [
    createConcentratedPoints(-74.5, 7.0, 80, 1.0, 0.7, 1.0),
    createConcentratedPoints(-76.8, 5.0, 70, 1.2, 0.7, 1.0),
    createConcentratedPoints(-74.0, 8.5, 40, 1.0, 0.7, 0.9),
    createConcentratedPoints(-76.5, 2.5, 50, 1.0, 0.6, 0.9)
  ];
  
  // Erosión
  const erosionClusters = [
    createConcentratedPoints(-75.0, 10.5, 70, 1.5, 0.7, 1.0),
    createConcentratedPoints(-74.5, 5.0, 100, 2.0, 0.7, 1.0),
    createConcentratedPoints(-75.5, 4.5, 60, 1.0, 0.6, 0.9),
    createConcentratedPoints(-76.3, 3.5, 50, 1.0, 0.6, 0.9)
  ];
  
  const deforestationData = deforestationClusters.flat();
  const miningData = miningClusters.flat();
  const erosionData = erosionClusters.flat();
  
  return {
    deforestation: {
      type: "FeatureCollection",
      features: deforestationData.map(point => ({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: point.coordinates
        },
        properties: { intensity: point.intensity }
      }))
    },
    mining: {
      type: "FeatureCollection",
      features: miningData.map(point => ({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: point.coordinates
        },
        properties: { intensity: point.intensity }
      }))
    },
    erosion: {
      type: "FeatureCollection",
      features: erosionData.map(point => ({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: point.coordinates
        },
        properties: { intensity: point.intensity }
      }))
    }
  };
}

/**
 * Configura capas de heatmap mejoradas para visualización ambiental
 */
export function setupMapLayers(
  mapRef: React.MutableRefObject<mapboxgl.Map | null>,
  mapLoadedRef: React.MutableRefObject<boolean>
) {
  if (!mapRef.current || !mapLoadedRef.current) return;
  const map = mapRef.current;

  // Evita agregar duplicados
  if (map.getLayer("deforestation-heat")) return;

  const heatmapData = generateImprovedHeatmapData();

  // Fuentes de datos
  if (!map.getSource("deforestation-data")) {
    map.addSource("deforestation-data", {
      type: "geojson",
      data: heatmapData.deforestation,
    });
  }
  if (!map.getSource("mining-data")) {
    map.addSource("mining-data", {
      type: "geojson",
      data: heatmapData.mining,
    });
  }
  if (!map.getSource("erosion-data")) {
    map.addSource("erosion-data", {
      type: "geojson",
      data: heatmapData.erosion,
    });
  }

  // Deforestación
  map.addLayer({
    id: "deforestation-heat",
    type: "heatmap",
    source: "deforestation-data",
    maxzoom: 15,
    paint: {
      "heatmap-weight": [
        "interpolate",
        ["linear"],
        ["get", "intensity"],
        0, 0,
        0.5, 1,
        1, 3
      ],
      "heatmap-intensity": [
        "interpolate",
        ["linear"],
        ["zoom"],
        0, 1,
        8, 3,
        15, 5
      ],
      "heatmap-color": [
        "interpolate",
        ["linear"],
        ["heatmap-density"],
        0, "rgba(255,255,255,0)",
        0.1, "rgba(255,235,230,0.5)",
        0.3, "rgba(255,190,170,0.6)",
        0.5, "rgba(255,140,120,0.7)",
        0.7, "rgba(255,90,70,0.8)",
        1, "rgba(255,40,30,0.9)",
      ],
      "heatmap-radius": [
        "interpolate",
        ["linear"],
        ["zoom"],
        0, 8,
        8, 25,
        15, 50
      ],
      "heatmap-opacity": 0,
    },
  });
  map.addLayer({
    id: "deforestation-points",
    type: "circle",
    source: "deforestation-data",
    minzoom: 13,
    paint: {
      "circle-radius": [
        "interpolate",
        ["linear"],
        ["zoom"],
        13, 5,
        18, 15
      ],
      "circle-color": "rgb(255, 40, 30)",
      "circle-opacity": 0.7,
      "circle-stroke-width": 1.5,
      "circle-stroke-color": "white",
      "circle-stroke-opacity": 0.5
    },
    layout: {
      "visibility": "none"
    }
  });

  // Minería
  map.addLayer({
    id: "mining-heat",
    type: "heatmap",
    source: "mining-data",
    maxzoom: 15,
    paint: {
      "heatmap-weight": [
        "interpolate",
        ["linear"],
        ["get", "intensity"],
        0, 0,
        0.5, 1,
        1, 3
      ],
      "heatmap-intensity": [
        "interpolate",
        ["linear"],
        ["zoom"],
        0, 1,
        8, 3,
        15, 5
      ],
      "heatmap-color": [
        "interpolate",
        ["linear"],
        ["heatmap-density"],
        0, "rgba(255,255,255,0)",
        0.1, "rgba(255,240,210,0.5)",
        0.3, "rgba(255,210,150,0.6)",
        0.5, "rgba(255,180,90,0.7)",
        0.7, "rgba(255,150,30,0.8)",
        1, "rgba(255,120,0,0.9)",
      ],
      "heatmap-radius": [
        "interpolate",
        ["linear"],
        ["zoom"],
        0, 8,
        8, 25,
        15, 50
      ],
      "heatmap-opacity": 0,
    },
  });
  map.addLayer({
    id: "mining-points",
    type: "circle",
    source: "mining-data",
    minzoom: 13,
    paint: {
      "circle-radius": [
        "interpolate",
        ["linear"],
        ["zoom"],
        13, 5,
        18, 15
      ],
      "circle-color": "rgb(255, 120, 0)",
      "circle-opacity": 0.7,
      "circle-stroke-width": 1.5,
      "circle-stroke-color": "white",
      "circle-stroke-opacity": 0.5
    },
    layout: {
      "visibility": "none"
    }
  });

  // Erosión
  map.addLayer({
    id: "erosion-heat",
    type: "heatmap",
    source: "erosion-data",
    maxzoom: 15,
    paint: {
      "heatmap-weight": [
        "interpolate",
        ["linear"],
        ["get", "intensity"],
        0, 0,
        0.5, 1,
        1, 3
      ],
      "heatmap-intensity": [
        "interpolate",
        ["linear"],
        ["zoom"],
        0, 1,
        8, 3,
        15, 5
      ],
      "heatmap-color": [
        "interpolate",
        ["linear"],
        ["heatmap-density"],
        0, "rgba(255,255,255,0)",
        0.1, "rgba(210,230,255,0.5)",
        0.3, "rgba(160,200,255,0.6)",
        0.5, "rgba(100,170,255,0.7)",
        0.7, "rgba(50,140,255,0.8)",
        1, "rgba(0,110,255,0.9)",
      ],
      "heatmap-radius": [
        "interpolate",
        ["linear"],
        ["zoom"],
        0, 8,
        8, 25,
        15, 50
      ],
      "heatmap-opacity": 0,
    },
  });
  map.addLayer({
    id: "erosion-points",
    type: "circle",
    source: "erosion-data",
    minzoom: 13,
    paint: {
      "circle-radius": [
        "interpolate",
        ["linear"],
        ["zoom"],
        13, 5,
        18, 15
      ],
      "circle-color": "rgb(0, 110, 255)",
      "circle-opacity": 0.7,
      "circle-stroke-width": 1.5,
      "circle-stroke-color": "white",
      "circle-stroke-opacity": 0.5
    },
    layout: {
      "visibility": "none"
    }
  });
}

/**
 * Filtra los marcadores clusterizados según los criterios especificados
 */
export function filterClusteredMarkers(
  mapRef: React.MutableRefObject<mapboxgl.Map | null>,
  mapLoadedRef: React.MutableRefObject<boolean>,
  filters: {
    region?: MacroRegion | null,
    department?: string | null,
    memoryType?: keyof typeof memoryTypes | null
  }
) {
  if (!mapRef.current || !mapLoadedRef.current) return;
  const map = mapRef.current;
  
  let filterExpression: any[] = ['all'];
  
  if (filters.region) {
    filterExpression.push(['==', ['get', 'region'], filters.region]);
  }
  if (filters.department) {
    filterExpression.push(['==', ['get', 'department'], filters.department]);
  }
  if (filters.memoryType) {
    filterExpression.push(['==', ['get', 'type'], filters.memoryType]);
  }
  
  if (filterExpression.length === 1) {
    filterExpression = ['!', ['has', 'point_count']];
  } else {
    filterExpression.push(['!', ['has', 'point_count']]);
  }
  
  if (map.getLayer('unclustered-memory')) {
    map.setFilter('unclustered-memory', filterExpression);
  }
}

/**
 * Actualiza los marcadores visibles según el estado de la aplicación
 * (versión con clustering)
 */
export function updateVisibleMarkersWithClustering(
  mapRef: React.MutableRefObject<mapboxgl.Map | null>,
  mapLoadedRef: React.MutableRefObject<boolean>,
  appState: AppState,
  onMarkerClick: (location: MemoryLocation) => void
) {
  if (!mapRef.current || !mapLoadedRef.current) return;
  
  const filteredLocations = memoryLocations.filter(location => {
    if (appState.selectedMacroRegion && location.region && 
        location.region !== appState.selectedMacroRegion) {
      return false;
    }
    if (appState.selectedDepartment && location.department && 
        location.department !== appState.selectedDepartment) {
      return false;
    }
    if (appState.selectedMemoryType && location.type && 
        location.type !== appState.selectedMemoryType) {
      return false;
    }
    return true;
  });
  
  if (!mapRef.current.getSource('memory-locations')) {
    setupClusteredMarkers(mapRef, mapLoadedRef, filteredLocations, onMarkerClick);
  } else {
    updateClusterSource(mapRef, filteredLocations);
  }
  
  filterClusteredMarkers(mapRef, mapLoadedRef, {
    region: appState.selectedMacroRegion,
    department: appState.selectedDepartment,
    memoryType: appState.selectedMemoryType
  });
}

/**
 * Genera mensajes descriptivos para cada lugar en el tour
 */
function getTourMessageForLocation(
  location: MemoryLocation, 
  index: number, 
  totalLocations: number
): string {
  switch (index) {
    case 0:
      return `Te damos la bienvenida al recorrido por los Lugares de Memoria de Colombia. Comenzamos en ${location.title}, un ${memoryTypes[location.type].name.toLowerCase()} en ${getDepartmentName(location.region, location.department)}. Estos lugares son fundamentales para preservar la memoria histórica del país.`;
    
    case totalLocations - 1:
      return `Finalizamos nuestro recorrido en ${location.title}. Los lugares de memoria como este cumplen un papel fundamental en la construcción de paz y reconciliación. Te invitamos a explorar los más de 140 sitios documentados por el Centro Nacional de Memoria Histórica.`;
      
    default:
      return `${location.description} Este lugar es parte de una red de espacios que contribuyen a la construcción de la memoria colectiva de Colombia.`;
  }
}

/**
 * Obtiene el nombre de una región
 */
function getRegionName(regionId: MacroRegion): string {
  return colombiaRegions[regionId].name;
}

/**
 * Obtiene el nombre de un departamento
 */
function getDepartmentName(regionId: MacroRegion, departmentId: string): string {
  const department = colombiaRegions[regionId].departments.find(d => d.id === departmentId);
  return department ? department.name : departmentId;
}