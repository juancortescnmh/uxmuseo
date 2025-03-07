// src/utils/tutorialState.ts

/**
 * Gestiona el estado del tutorial interactivo para el menú radial
 */
export const TutorialStateManager = {
  /**
   * Verifica si el tutorial debe mostrarse
   */
  shouldShowTutorial(): boolean {
    // Si ya completó el tutorial, no mostrarlo de nuevo
    if (localStorage.getItem('radialMenuTutorialCompleted') === 'true') {
      return false;
    }
    
    // Si el usuario ha cerrado explícitamente el tutorial
    if (localStorage.getItem('radialMenuTutorialDismissed') === 'true') {
      // Verificar si ha pasado suficiente tiempo para volver a mostrarlo
      const dismissedTime = parseInt(localStorage.getItem('radialMenuTutorialDismissedTime') || '0', 10);
      const currentTime = Date.now();
      const oneWeekInMs = 7 * 24 * 60 * 60 * 1000;
      
      // Si ha pasado más de una semana, volver a mostrar
      if (currentTime - dismissedTime > oneWeekInMs) {
        localStorage.removeItem('radialMenuTutorialDismissed');
        localStorage.removeItem('radialMenuTutorialDismissedTime');
        return true;
      }
      
      return false;
    }
    
    // Por defecto, mostrar el tutorial
    return true;
  },
  
  /**
   * Marca el tutorial como completado
   */
  markTutorialAsCompleted(): void {
    localStorage.setItem('radialMenuTutorialCompleted', 'true');
  },
  
  /**
   * Marca el tutorial como cerrado (descartado)
   */
  dismissTutorial(): void {
    localStorage.setItem('radialMenuTutorialDismissed', 'true');
    localStorage.setItem('radialMenuTutorialDismissedTime', Date.now().toString());
  },
  
  /**
   * Reinicia el estado del tutorial
   */
  resetTutorialState(): void {
    localStorage.removeItem('radialMenuTutorialCompleted');
    localStorage.removeItem('radialMenuTutorialDismissed');
    localStorage.removeItem('radialMenuTutorialDismissedTime');
  }
};