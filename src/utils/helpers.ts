// src/utils/helpers.ts

/**
 * Crea puntos aleatorios dentro de un área definida
 * para visualizaciones como heatmaps
 */
export function createRandomPoints(
  west: number,
  south: number,
  east: number,
  north: number,
  count: number,
  minI = 0.3,
  maxI = 1.0
): { coordinates: [number, number]; intensity: number }[] {
  const points: { coordinates: [number, number]; intensity: number }[] = [];
  
  for (let i = 0; i < count; i++) {
    const lng = west + Math.random() * (east - west);
    const lat = south + Math.random() * (north - south);
    const intensity = minI + Math.random() * (maxI - minI);
    points.push({ coordinates: [lng, lat], intensity });
  }
  
  return points;
}

/**
 * Crea un retraso (sleep) usando Promises
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Formatea coordenadas para mostrarlas al usuario
 */
export function formatCoordinates(lng: number, lat: number): string {
  return `${lng.toFixed(2)}°, ${lat.toFixed(2)}°`;
}

/**
 * Comprueba si un punto está dentro de un polígono
 * Útil para comprobar si un marcador está dentro de un área
 */
export function isPointInPolygon(
  point: [number, number], 
  polygon: [number, number][]
): boolean {
  // Algoritmo "ray casting"
  const x = point[0], y = point[1];
  
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0], yi = polygon[i][1];
    const xj = polygon[j][0], yj = polygon[j][1];
    
    const intersect = ((yi > y) !== (yj > y))
        && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  
  return inside;
}

/**
 * Crea una URL de compartir para un punto en el mapa
 */
export function createShareableUrl(
  location: { longitude: number; latitude: number; title?: string }
): string {
  const baseUrl = window.location.origin + window.location.pathname;
  return `${baseUrl}?lng=${location.longitude}&lat=${location.latitude}${location.title ? `&title=${encodeURIComponent(location.title)}` : ''}`;
}

/**
 * Comprueba si el dispositivo es móvil
 */
export function isMobileDevice(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * Obtiene los parámetros de la URL
 */
export function getUrlParams(): Record<string, string> {
  const params = new URLSearchParams(window.location.search);
  const result: Record<string, string> = {};
  
  for (const [key, value] of params.entries()) {
    result[key] = value;
  }
  
  return result;
}

/**
 * Obtiene la dirección del centro a los bordes
 */
export function getDirectionFromCenter(
  centerLng: number, 
  centerLat: number, 
  lng: number, 
  lat: number
): string {
  let direction = '';
  
  if (lat > centerLat) {
    direction += 'Norte';
  } else if (lat < centerLat) {
    direction += 'Sur';
  }
  
  if (lng > centerLng) {
    direction += direction ? '-Este' : 'Este';
  } else if (lng < centerLng) {
    direction += direction ? '-Oeste' : 'Oeste';
  }
  
  return direction || 'Centro';
}

/**
 * Calcula la distancia entre dos puntos (en kilómetros)
 * usando la fórmula de Haversine
 */
export function calculateDistance(
  lat1: number, 
  lng1: number, 
  lat2: number, 
  lng2: number
): number {
  const R = 6371; // Radio de la Tierra en km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
          Math.sin(dLng/2) * Math.sin(dLng/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  
  return distance;
}

/**
 * Agrupa puntos cercanos (para clustering manual)
 */
export function groupNearbyPoints<T extends { latitude: number; longitude: number }>(
  points: T[],
  maxDistanceKm: number
): T[][] {
  const groups: T[][] = [];
  const visited = new Set<number>();
  
  for (let i = 0; i < points.length; i++) {
    if (visited.has(i)) continue;
    
    const group: T[] = [points[i]];
    visited.add(i);
    
    for (let j = 0; j < points.length; j++) {
      if (visited.has(j)) continue;
      
      const distance = calculateDistance(
        points[i].latitude, points[i].longitude,
        points[j].latitude, points[j].longitude
      );
      
      if (distance <= maxDistanceKm) {
        group.push(points[j]);
        visited.add(j);
      }
    }
    
    groups.push(group);
  }
  
  return groups;
}

/**
 * Encuentra el punto central de un conjunto de puntos
 */
export function findCentralPoint(
  points: Array<{ latitude: number; longitude: number }>
): { latitude: number; longitude: number } {
  if (points.length === 0) {
    throw new Error('No se pueden encontrar el punto central de un conjunto vacío');
  }
  
  let sumLat = 0;
  let sumLng = 0;
  
  for (const point of points) {
    sumLat += point.latitude;
    sumLng += point.longitude;
  }
  
  return {
    latitude: sumLat / points.length,
    longitude: sumLng / points.length
  };
}

/**
 * Genera un color basado en un texto (para colorear regiones/tipos)
 */
export function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xFF;
    color += ('00' + value.toString(16)).substr(-2);
  }
  
  return color;
}

/**
 * Genera un número de versión para cache-busting
 */
export function generateVersionNumber(): string {
  return new Date().getTime().toString(36);
}

/**
 * Comprueba si un tipo de archivo es imagen
 */
export function isImageFile(filename: string): boolean {
  const extensions = ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp'];
  const lowerFilename = filename.toLowerCase();
  return extensions.some(ext => lowerFilename.endsWith(ext));
}

/**
 * Trunca texto con elipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}