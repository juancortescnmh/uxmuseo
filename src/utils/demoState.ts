// src/utils/demoState.ts

// Clave para almacenamiento en localStorage
const DEMO_STATE_KEY = 'lugares_memoria_demo_state';

// Duración en días antes de mostrar el demo nuevamente
const DEMO_EXPIRY_DAYS = 30;

// Tipos para el estado del demo
export interface DemoStep {
  id: string;
  title: string;
  completed: boolean;
  timestamp?: string;
}

export interface DemoState {
  hasSeenDemo: boolean;
  completedSteps: DemoStep[];
  lastVisit: string;
  currentStep: number;
  isDemoComplete: boolean;
  preferences: {
    showTips: boolean;
    skipIntro: boolean;
  };
}

// Estado inicial por defecto
const DEFAULT_STATE: DemoState = {
  hasSeenDemo: false,
  completedSteps: [],
  lastVisit: new Date().toISOString(),
  currentStep: 0,
  isDemoComplete: false,
  preferences: {
    showTips: true,
    skipIntro: false
  }
};

export const DemoStateManager = {
  /**
   * Obtiene el estado inicial del demo
   */
  getInitialState: (): DemoState => {
    try {
      const savedState = localStorage.getItem(DEMO_STATE_KEY);
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        // Verificar si el demo debe mostrarse nuevamente basado en la fecha
        const lastVisit = new Date(parsedState.lastVisit);
        const daysSinceLastVisit = (new Date().getTime() - lastVisit.getTime()) / (1000 * 3600 * 24);
        
        if (daysSinceLastVisit > DEMO_EXPIRY_DAYS) {
          return DEFAULT_STATE;
        }
        
        return parsedState;
      }
    } catch (error) {
      console.error('Error reading demo state:', error);
    }
    
    return DEFAULT_STATE;
  },

  /**
   * Guarda el estado actual del demo
   */
  saveDemoState: (state: Partial<DemoState>) => {
    try {
      const currentState = DemoStateManager.getInitialState();
      const newState = {
        ...currentState,
        ...state,
        lastVisit: new Date().toISOString()
      };
      localStorage.setItem(DEMO_STATE_KEY, JSON.stringify(newState));
    } catch (error) {
      console.error('Error saving demo state:', error);
    }
  },

  /**
   * Marca un paso específico como completado
   */
  markStepComplete: (stepId: string) => {
    try {
      const currentState = DemoStateManager.getInitialState();
      const updatedSteps = currentState.completedSteps.map(step => 
        step.id === stepId ? { ...step, completed: true, timestamp: new Date().toISOString() } : step
      );
      
      DemoStateManager.saveDemoState({
        completedSteps: updatedSteps,
        currentStep: currentState.currentStep + 1
      });
    } catch (error) {
      console.error('Error marking step complete:', error);
    }
  },

  /**
   * Marca el demo como completado
   */
  markDemoAsComplete: () => {
    try {
      const currentState = DemoStateManager.getInitialState();
      DemoStateManager.saveDemoState({
        ...currentState,
        hasSeenDemo: true,
        isDemoComplete: true,
        lastVisit: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error marking demo as complete:', error);
    }
  },

  /**
   * Reinicia el estado del demo
   */
  resetDemoState: () => {
    try {
      localStorage.setItem(DEMO_STATE_KEY, JSON.stringify(DEFAULT_STATE));
    } catch (error) {
      console.error('Error resetting demo state:', error);
    }
  },

  /**
   * Verifica si se debe mostrar el demo
   */
  shouldShowDemo: (): boolean => {
    const state = DemoStateManager.getInitialState();
    return !state.hasSeenDemo || !state.isDemoComplete;
  },
  
  /**
   * Verifica si el demo está en progreso
   */
  isDemoInProgress: (): boolean => {
    const state = DemoStateManager.getInitialState();
    return state.hasSeenDemo && !state.isDemoComplete;
  },

  /**
   * Obtiene el progreso actual del demo
   */
  getDemoProgress: (): number => {
    try {
      const state = DemoStateManager.getInitialState();
      const completedSteps = state.completedSteps.filter(step => step.completed).length;
      return (completedSteps / state.completedSteps.length) * 100;
    } catch (error) {
      console.error('Error getting demo progress:', error);
      return 0;
    }
  },

  /**
   * Actualiza las preferencias del usuario
   */
  updatePreferences: (preferences: Partial<DemoState['preferences']>) => {
    try {
      const currentState = DemoStateManager.getInitialState();
      DemoStateManager.saveDemoState({
        preferences: {
          ...currentState.preferences,
          ...preferences
        }
      });
    } catch (error) {
      console.error('Error updating preferences:', error);
    }
  },

  /**
   * Obtiene el último paso completado
   */
  getLastCompletedStep: (): DemoStep | null => {
    try {
      const state = DemoStateManager.getInitialState();
      const completedSteps = state.completedSteps.filter(step => step.completed);
      return completedSteps.length > 0 
        ? completedSteps[completedSteps.length - 1]
        : null;
    } catch (error) {
      console.error('Error getting last completed step:', error);
      return null;
    }
  }
};

// Tipos de recorridos temáticos disponibles
export type TourType = 
  | 'general'       // Recorrido general por sitios destacados
  | 'paramilitares' // Historia relacionada con paramilitarismo
  | 'guerrillas'    // Historia relacionada con guerrillas
  | 'indigenas'     // Memoria de pueblos indígenas
  | 'ambiental'     // Impacto ambiental del conflicto
  | 'mujeres'       // Memoria de las mujeres
  | 'afro'          // Comunidades afrocolombianas
  | 'urbano';       // Conflicto en zonas urbanas

// Estructura para un recorrido temático
export interface ThematicTour {
  id: TourType;
  title: string;
  description: string;
  duration: string; // Ej: "15 min"
  locations: string[]; // IDs de las ubicaciones a visitar
  color: string; // Color para identificar el recorrido
  icon: string; // Nombre de icono de Lucide
}

// Recorridos temáticos disponibles con información detallada e históricamente relevante
export const thematicTours: ThematicTour[] = [
  {
    id: 'general',
    title: 'Principales lugares de memoria',
    description: 'Recorrido panorámico por los lugares de memoria histórica más emblemáticos de Colombia',
    duration: '15 min',
    locations: [
      'monumento_victimas_bogota', 
      'casa_memoria_medellin', 
      'parque_monumento_trujillo',
      'centro_memoria_valledupar',
      'museo_conflicto_bogota'
    ],
    color: '#6366F1',
    icon: 'Map'
  },
  {
    id: 'paramilitares',
    title: 'Historia del paramilitarismo',
    description: 'Recorrido por los territorios donde actuaron grupos paramilitares y sus consecuencias',
    duration: '18 min',
    locations: [
      'el_salado_bolivar',       // Masacre de El Salado (2000)
      'montes_maria_sucre',      // Violencia paramilitar en Montes de María
      'mapiripan_meta',          // Masacre de Mapiripán (1997)
      'la_rochela_santander',    // Masacre de La Rochela (1989)
      'trujillo_valle',          // Masacres de Trujillo (1988-1994)
      'la_granja_ituango'        // Masacre de La Granja en Ituango (1996)
    ],
    color: '#F43F5E',
    icon: 'Shield'
  },
  {
    id: 'guerrillas',
    title: 'Conflicto guerrillero',
    description: 'Recorrido por zonas afectadas por la violencia de grupos guerrilleros en Colombia',
    duration: '20 min',
    locations: [
      'bojaya_choco',            // Masacre de Bojayá (2002)
      'la_chinita_apartado',     // Masacre de La Chinita (1994)
      'machuca_segovia',         // Masacre de Machuca (1998)
      'mitu_vaupes',             // Toma de Mitú (1998)
      'el_nogal_bogota',         // Atentado al Club El Nogal (2003)
      'toma_palacio_justicia'    // Toma del Palacio de Justicia (1985)
    ],
    color: '#10B981',
    icon: 'Tent'
  },
  {
    id: 'indigenas',
    title: 'Pueblos indígenas',
    description: 'La memoria y resistencia de los pueblos indígenas ante el conflicto armado',
    duration: '12 min',
    locations: [
      'nasa_cauca',              // Resistencia del pueblo Nasa
      'tikuna_amazonas',         // Comunidades Tikuna del Amazonas
      'wayuu_guajira',           // Pueblo Wayúu de La Guajira
      'embera_choco',            // Comunidades Embera del Chocó
      'kankuamo_cesar',          // Pueblo Kankuamo de la Sierra Nevada
      'awa_narino'               // Comunidad Awá de Nariño
    ],
    color: '#F59E0B',
    icon: 'Mountain'
  },
  {
    id: 'ambiental',
    title: 'Impacto ambiental',
    description: 'Lugares donde el conflicto armado ha tenido graves consecuencias ambientales',
    duration: '14 min',
    locations: [
      'serrania_macarena',       // Deforestación en La Macarena
      'sierra_nevada',           // Impacto en la Sierra Nevada de Santa Marta
      'catatumbo_parques',       // Parque Nacional Catatumbo Barí
      'amazonia_deforestacion',  // Deforestación postconflicto en Amazonía
      'mineria_cauca',           // Minería ilegal en Cauca
      'paramos_boyaca'           // Afectación a páramos en Boyacá
    ],
    color: '#34D399',
    icon: 'Leaf'
  },
  {
    id: 'mujeres',
    title: 'Memoria de las mujeres',
    description: 'Historias de resistencia y reparación desde las voces de las mujeres víctimas',
    duration: '16 min',
    locations: [
      'tejiendo_memorias_bogota',       // Colectivo "Tejiendo Memorias"
      'madres_falsos_positivos',        // Madres de Soacha (falsos positivos)
      'mujeres_bojaya',                 // Mujeres cantaoras de Bojayá
      'tejedoras_mampujan',             // Tejedoras de Mampuján
      'narino_mujeres_resistencia',     // Mujeres del Pacífico nariñense
      'meta_mujeres_constructoras'      // Mujeres constructoras de paz del Meta
    ],
    color: '#EC4899',
    icon: 'Heart'
  },
  {
    id: 'afro',
    title: 'Comunidades afrocolombianas',
    description: 'Memoria histórica desde las comunidades afrocolombianas y su resistencia',
    duration: '15 min',
    locations: [
      'palenque_bolivar',               // San Basilio de Palenque
      'buenaventura_valle',             // Puerto de Buenaventura
      'tumaco_narino',                  // Tumaco, Nariño
      'quibdo_choco',                   // Quibdó, Chocó
      'san_onofre_sucre',               // San Onofre, Sucre
      'guapi_cauca'                     // Guapi, Cauca
    ],
    color: '#8B5CF6',
    icon: 'Users'
  },
  {
    id: 'urbano',
    title: 'Conflicto urbano',
    description: 'Recorrido por zonas urbanas afectadas por el conflicto y la violencia',
    duration: '17 min',
    locations: [
      'comuna13_medellin',              // Comuna 13 de Medellín
      'ciudad_bolivar_bogota',          // Ciudad Bolívar, Bogotá
      'aguablanca_cali',                // Distrito de Aguablanca, Cali
      'barrancabermeja_centro',         // Barrancabermeja, Santander
      'altos_cazuca_soacha',            // Altos de Cazucá, Soacha
      'nelson_mandela_cartagena'        // Barrio Nelson Mandela, Cartagena
    ],
    color: '#2563EB',
    icon: 'Landmark'
  }
];

export default DemoStateManager;