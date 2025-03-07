// src/components/NavComponents.tsx - Corrección para el panel de capas

// Reemplaza el componente SideButtons con esta versión actualizada

export const SideButtons: React.FC<{
  activeLayers: string[];
  onToggleLayer: (layerId: string) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetRotation: () => void;
}> = ({
  activeLayers,
  onToggleLayer,
  onZoomIn,
  onZoomOut,
  onResetRotation
}) => {
  const [showLayersPanel, setShowLayersPanel] = useState(false);
  
  return (
    <div className="fixed bottom-8 left-8 z-40 flex flex-col items-start gap-4">
      {/* Panel de capas - ahora se posiciona correctamente y no se sobrepone */}
      <AnimatePresence>
        {showLayersPanel && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-16 left-full ml-4 bg-black/80 backdrop-blur-md rounded-lg p-4 
                      border border-white/10 w-64 shadow-lg"
            style={{ zIndex: 45 }}
          >
            <h3 className="text-white font-medium text-sm mb-3">Capas Ambientales</h3>
            
            <div className="space-y-2">
              {[
                { id: 'deforestation', name: 'Deforestación', color: '#FF4444' },
                { id: 'mining', name: 'Minería Ilegal', color: '#FF8C00' },
                { id: 'erosion', name: 'Erosión del Suelo', color: '#2196F3' }
              ].map(layer => {
                const isActive = activeLayers.includes(layer.id);
                return (
                  <div key={layer.id} className="flex items-center gap-3">
                    <div 
                      className={`w-14 h-6 relative rounded-full transition-colors ${isActive ? 'bg-white/20' : 'bg-black/40'}`}
                      onClick={() => onToggleLayer(layer.id)}
                      role="checkbox"
                      aria-checked={isActive}
                      tabIndex={0}
                    >
                      <div 
                        className={`absolute top-1 w-4 h-4 rounded-full transition-all ${
                          isActive 
                            ? 'right-1' 
                            : 'left-1 bg-white/40'
                        }`}
                        style={{ backgroundColor: isActive ? layer.color : 'rgba(255,255,255,0.4)' }}
                      ></div>
                    </div>
                    <span className="text-white text-sm">{layer.name}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Botón principal de capas */}
      <button 
        onClick={() => setShowLayersPanel(!showLayersPanel)}
        className="bg-black/70 backdrop-blur-md rounded-full px-4 py-2.5 
                  flex items-center gap-2 shadow-lg text-white
                  border border-white/10 transition-all hover:bg-black/80"
      >
        <Layers size={18} />
        <span>Capas</span>
      </button>
      
      {/* Controles de zoom */}
      <div className="flex flex-col gap-3">
        <button 
          onClick={onZoomIn}
          className="bg-black/70 backdrop-blur-md rounded-full p-2.5 
                    shadow-lg text-white border border-white/10 
                    hover:bg-black/80 transition-all"
          title="Acercar"
        >
          <ZoomIn size={18} />
        </button>
        
        <button 
          onClick={onZoomOut}
          className="bg-black/70 backdrop-blur-md rounded-full p-2.5 
                    shadow-lg text-white border border-white/10 
                    hover:bg-black/80 transition-all"
          title="Alejar"
        >
          <ZoomOut size={18} />
        </button>
        
        <button 
          onClick={onResetRotation}
          className="bg-black/70 backdrop-blur-md rounded-full p-2.5 
                    shadow-lg text-white border border-white/10 
                    hover:bg-black/80 transition-all"
          title="Restablecer rotación"
        >
          <Compass size={18} />
        </button>
      </div>
    </div>
  );
};