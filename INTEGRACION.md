# Implementación e Integración 

## Cambios implementados

Se han realizado las siguientes mejoras en el menú radial y en la experiencia de usuario:

1. **Menú radial tipo cebolla**
   - Se modificó el componente RadialMenu para que las secciones se revelen desde el centro hacia afuera
   - Se aumentaron los tiempos de transición entre cada capa para mayor claridad

2. **Eliminación del título duplicado**
   - Se eliminó el título "Lugares de memoria, Centro de memoria histórica" que se repetía con el centro de la rueda

3. **Animación mejorada de botones**
   - Los botones ahora tienen un movimiento más pronunciado hacia afuera
   - Utilizan animaciones tipo "spring" para un efecto más orgánico y natural

4. **Atenuación de macroregiones no seleccionadas**
   - Cuando se selecciona una macroregión, las demás se atenúan visualmente para guiar al usuario
   - Se modificó el filtro para reducir el brillo de las regiones no seleccionadas

5. **Reposicionamiento de indicadores de progreso**
   - Los indicadores de carga ahora están más cerca del centro de la rueda en lugar de en la parte inferior

6. **Implementación de recorridos alternativos**
   - Se creó un componente TourSelector para mostrar opciones de recorridos temáticos
   - Se implementaron 6 tipos de recorridos (paramilitares, guerrillas, pueblos indígenas, etc.)
   - Cada recorrido tiene su propio color, icono y duración estimada

7. **Navegación al hacer clic en el centro**
   - Al hacer clic en el centro, se regresa a ver el mapa completo de Colombia

8. **Inclusión de información ambiental**
   - Se agregó un panel en el selector de recorridos con información ambiental

## Prueba del componente TourSelector

Para probar el nuevo componente TourSelector, añade el siguiente código a App.tsx:

```tsx
import TourSelector from './components/TourSelector';
import { thematicTours, type TourType } from './utils/demoState';

// Añadir este estado en el componente App
const [isTourSelectorOpen, setIsTourSelectorOpen] = useState(false);

// Añadir esta función para manejar la selección de recorrido
const handleTourSelect = (tourId: TourType) => {
  // Obtener el recorrido seleccionado
  const selectedTour = thematicTours.find(tour => tour.id === tourId);
  
  // Cerrar el selector
  setIsTourSelectorOpen(false);
  
  // Iniciar el recorrido con los lugares especificados
  if (selectedTour && mapRef.current && mapLoadedRef.current) {
    console.log(`Iniciando recorrido: ${selectedTour.title}`);
    // Aquí puedes agregar la lógica para iniciar el recorrido
    // utilizando las ubicaciones en selectedTour.locations
  }
};

// Modificar handleRouteClick para mostrar el selector
const handleRouteClick = () => {
  setIsTourSelectorOpen(true);
};

// Añadir el componente al final del JSX, justo antes del cierre del div principal
<AnimatePresence>
  {isTourSelectorOpen && (
    <TourSelector 
      isOpen={isTourSelectorOpen}
      onClose={() => setIsTourSelectorOpen(false)}
      onSelectTour={handleTourSelect}
    />
  )}
</AnimatePresence>
```

## Integración con MapService

Para que los recorridos temáticos funcionen correctamente, modifica MapService.ts:

1. Busca la función `startGuidedTour` y añade un parámetro opcional para especificar ubicaciones:

```tsx
export function startGuidedTour(
  mapRef,
  mapLoadedRef,
  setDroneActive,
  setAppState,
  renderTourMessage,
  specificLocations = [] // Nuevo parámetro
) {
  // ... código existente
  
  // Si hay ubicaciones específicas, usarlas en lugar de la ruta predeterminada
  const tourLocations = specificLocations.length > 0 
    ? memoryLocations.filter(loc => specificLocations.includes(loc.id))
    : defaultTourLocations;
    
  // ... resto del código
}
```

2. Adapta la lógica para manejar tours específicos según el tema seleccionado.

## Validación

Una vez implementados estos cambios, valida lo siguiente:

1. El menú radial se despliega correctamente, con las secciones revelándose desde el centro hacia afuera
2. Los botones tienen el efecto de elevación al pasar el cursor
3. Las macroregiones no seleccionadas se atenúan correctamente
4. El selector de recorridos temáticos se muestra y funciona adecuadamente
5. La información ambiental está visible en el selector de recorridos
6. Al hacer clic en el centro, se regresa a la vista completa del mapa