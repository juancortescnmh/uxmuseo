// src/components/ExilioGlobeView.tsx
import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import mapboxgl from 'mapbox-gl';

// Tipo para los lugares de exilio
interface ExilioLocation {
  id: string;
  longitude: number;
  latitude: number;
  title: string;
  country: string;
  description?: string;
}

// Datos de ejemplo de lugares de exilio
const exilioLocations: ExilioLocation[] = [
  {
    id: 'ex01',
    longitude: -77.04,
    latitude: 38.91,
    title: 'Memoria Colombiana en DC',
    country: 'Estados Unidos',
    description: 'Espacio de memoria para la comunidad colombiana en Washington DC'
  },
  {
    id: 'ex02',
    longitude: 2.35,
    latitude: 48.85,
    title: 'Memorial del Exilio',
    country: 'Francia',
    description: 'Dedicado a los colombianos exiliados en Europa durante el conflicto'
  },
  {
    id: 'ex03',
    longitude: -58.38,
    latitude: -34.60,
    title: 'Casa de la Memoria Colombiana',
    country: 'Argentina',
    description: 'Centro cultural y memorial para refugiados y exiliados colombianos'
  },
  {
    id: 'ex04',
    longitude: -3.70,
    latitude: 40.42,
    title: 'Centro de Documentación del Exilio',
    country: 'España',
    description: 'Archivo y espacio de memoria para víctimas del conflicto en España'
  },
  {
    id: 'ex05',
    longitude: -79.38,
    latitude: 43.65,
    title: 'Comunidad de Memoria',
    country: 'Canadá',
    description: 'Iniciativa comunitaria de colombianos exiliados en Toronto'
  },
];

interface ExilioGlobeViewProps {
  isOpen: boolean;
  onClose: () => void;
}

const ExilioGlobeView: React.FC<ExilioGlobeViewProps> = ({ isOpen, onClose }) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const popupRef = useRef<mapboxgl.Popup | null>(null);
  
  // Inicializar y configurar el mapa
  useEffect(() => {
    if (!isOpen || !mapContainerRef.current || mapRef.current) return;
    
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/satellite-v9',
      center: [0, 20],
      zoom: 1.5,
      projection: 'globe', // Usar proyección de globo 3D
      attributionControl: false,
      logoPosition: 'bottom-left',
      scrollZoom: true,
      dragRotate: true,
      pitchWithRotate: true,
      dragPan: true
    });
    
    // Configuración inicial al cargar
    map.on('load', () => {
      // Configurar la atmósfera para vista satelital
      map.setFog({
        'color': 'rgba(220, 235, 255, 0.8)',
        'high-color': 'rgba(170, 190, 240, 0.8)',
        'horizon-blend': 0.2,
        'space-color': 'rgba(10, 20, 40, 1)',
        'star-intensity': 0.25
      });
      
      // Agregar efecto de brillo nocturno
      if (!map.getLayer('night-glow')) {
        map.addLayer({
          id: 'night-glow',
          type: 'sky',
          paint: {
            'sky-type': 'atmosphere',
            'sky-atmosphere-sun': [0.0, 0.0],
            'sky-atmosphere-sun-intensity': 5.0,
            'sky-atmosphere-color': 'rgba(20, 30, 60, 1)'
          }
        });
      }
      
      // Agregar marcadores de exilio
      exilioLocations.forEach(location => {
        const markerEl = document.createElement('div');
        markerEl.className = 'exilio-marker';
        markerEl.style.width = '12px';
        markerEl.style.height = '12px';
        markerEl.style.borderRadius = '50%';
        markerEl.style.backgroundColor = '#EC4899';
        markerEl.style.border = '2px solid rgba(255, 255, 255, 0.7)';
        markerEl.style.boxShadow = '0 0 8px rgba(236, 72, 153, 0.8)';
        
        // Crear popup para mostrar información
        const popup = new mapboxgl.Popup({
          closeButton: false,
          closeOnClick: false,
          offset: 10,
          maxWidth: '300px',
          className: 'exilio-popup'
        });
        
        const marker = new mapboxgl.Marker(markerEl)
          .setLngLat([location.longitude, location.latitude])
          .addTo(map);
          
        // Mostrar popup al hacer hover
        markerEl.addEventListener('mouseenter', () => {
          popup.setHTML(`
            <div class="flex flex-col gap-1 p-1">
              <h3 class="font-bold text-base">${location.title}</h3>
              <p class="text-sm text-gray-200">${location.country}</p>
              ${location.description ? `<p class="text-xs mt-1">${location.description}</p>` : ''}
            </div>
          `);
          popup.setLngLat([location.longitude, location.latitude]);
          popup.addTo(map);
          popupRef.current = popup;
        });
        
        markerEl.addEventListener('mouseleave', () => {
          popup.remove();
        });
      });
      
      // Línea de conexión con Colombia
      const colombiaCoords = [-74.3, 4.3]; // Centro aproximado de Colombia
      
      // Crear GeoJSON para líneas de conexión
      const connectionLines = {
        type: 'FeatureCollection',
        features: exilioLocations.map(location => ({
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: [
              colombiaCoords,
              [location.longitude, location.latitude]
            ]
          },
          properties: {
            title: location.title
          }
        }))
      };
      
      // Añadir fuente y capa para las líneas de conexión
      map.addSource('connection-lines', {
        type: 'geojson',
        data: connectionLines
      });
      
      map.addLayer({
        id: 'connections',
        type: 'line',
        source: 'connection-lines',
        paint: {
          'line-color': '#EC4899',
          'line-width': 1,
          'line-opacity': 0.6,
          'line-dasharray': [2, 2]
        }
      });
      
      // Añadir punto para Colombia
      const colombiaMarkerEl = document.createElement('div');
      colombiaMarkerEl.className = 'colombia-marker';
      colombiaMarkerEl.style.width = '15px';
      colombiaMarkerEl.style.height = '15px';
      colombiaMarkerEl.style.borderRadius = '50%';
      colombiaMarkerEl.style.backgroundColor = '#FBB6CE';
      colombiaMarkerEl.style.border = '2px solid rgba(255, 255, 255, 0.8)';
      colombiaMarkerEl.style.boxShadow = '0 0 8px rgba(255, 182, 206, 0.9)';
      
      new mapboxgl.Marker(colombiaMarkerEl)
        .setLngLat(colombiaCoords)
        .addTo(map);
      
      // Eliminamos la rotación automática para permitir navegación manual con el mouse
    });
    
    mapRef.current = map;
    
    // Limpieza al desmontar
    return () => {
      if (popupRef.current) {
        popupRef.current.remove();
      }
      
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [isOpen]);
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div 
            className="relative bg-gray-500/30 backdrop-blur-xl rounded-lg shadow-xl overflow-hidden max-w-3xl w-full mx-4 max-h-[90vh] border border-white/10"
            initial={{ scale: 0.9, y: 10 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 10 }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-700/50">
              <h2 className="text-xl font-medium text-white">Lugares de Memoria en el Exilio</h2>
              <button 
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 rounded-full p-1"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-4 bg-gray-500/20">
              <p className="text-gray-300 mb-4 text-sm">
                La memoria del conflicto colombiano también se construye desde lugares fuera del territorio nacional. 
                Estos espacios creados por comunidades en el exilio contribuyen a la preservación de la memoria histórica y la búsqueda de verdad y reconciliación.
              </p>
            </div>
            
            <div 
              ref={mapContainerRef}
              className="w-full h-[400px]"
            />
            
            <div className="p-4 border-t border-gray-700/50 bg-gray-500/20">
              <p className="text-xs text-gray-300">
                Este mapa muestra ubicaciones representativas donde comunidades colombianas en el exilio han creado espacios de memoria.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ExilioGlobeView;