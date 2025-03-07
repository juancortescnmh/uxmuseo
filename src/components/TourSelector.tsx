// src/components/TourSelector.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Map, Shield, Tent, Mountain, Leaf, Heart, 
  X, ChevronRight, Info, Users, Landmark, Building,
  Clock, ArrowRight, Eye
} from 'lucide-react';
import { thematicTours, type TourType } from '../utils/demoState';

interface TourSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTour: (tourId: TourType) => void;
}

const iconMap: Record<string, React.ReactNode> = {
  'Map': <Map strokeWidth={1.5} />,
  'Shield': <Shield strokeWidth={1.5} />,
  'Tent': <Tent strokeWidth={1.5} />,
  'Mountain': <Mountain strokeWidth={1.5} />,
  'Leaf': <Leaf strokeWidth={1.5} />,
  'Heart': <Heart strokeWidth={1.5} />,
  'Users': <Users strokeWidth={1.5} />,
  'Landmark': <Landmark strokeWidth={1.5} />,
  'Building': <Building strokeWidth={1.5} />
};

const TourSelector: React.FC<TourSelectorProps> = ({ isOpen, onClose, onSelectTour }) => {
  const [selectedTourId, setSelectedTourId] = useState<TourType | null>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  
  if (!isOpen) return null;
  
  const selectedTour = selectedTourId ? thematicTours.find(tour => tour.id === selectedTourId) : null;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Fondo con blur */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      {/* Panel de selección */}
      <motion.div
        className="relative w-full max-w-4xl mx-4 h-[75vh] max-h-[700px] flex flex-col md:flex-row overflow-hidden"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      >
        {/* Panel de selección - Similar al diseño del RadialMenu */}
        <motion.div 
          className="w-full md:w-1/2 bg-gray-500/30 backdrop-filter backdrop-blur-xl rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none border-l border-t border-white/10 shadow-2xl overflow-y-auto"
          style={{ height: selectedTourId ? '100%' : 'auto' }}
        >
          {/* Título y botón de cerrar */}
          <div className="sticky top-0 z-10 bg-gray-500/20 backdrop-blur-md border-b border-white/10 px-6 py-4 flex justify-between items-center">
            <div>
              <h2 className="text-xl text-white font-light tracking-wide">Recorridos Temáticos</h2>
              <p className="text-white/50 text-xs mt-1">Explora Colombia a través de diferentes perspectivas</p>
            </div>
            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 transition-colors flex items-center justify-center"
            >
              <X size={16} className="text-white" />
            </button>
          </div>
          
          {/* Grid de recorridos */}
          <div className="p-4">
            <div className="grid grid-cols-1 gap-3">
              {thematicTours.map((tour, index) => (
                <motion.div
                  key={tour.id}
                  className={`relative overflow-hidden rounded-xl cursor-pointer group
                              ${selectedTourId === tour.id ? 'ring-2 ring-white/20' : 'hover:ring-1 hover:ring-white/10'}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0,
                    scale: selectedTourId && selectedTourId !== tour.id ? 0.97 : 1
                  }}
                  transition={{ 
                    duration: 0.4,
                    delay: index * 0.05,
                    ease: [0.16, 1, 0.3, 1]
                  }}
                  onMouseEnter={() => setHoverIndex(index)}
                  onMouseLeave={() => setHoverIndex(null)}
                  onClick={() => setSelectedTourId(tour.id)}
                >
                  {/* Fondo con gradiente y textura */}
                  <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/80 z-0" />
                  <div 
                    className="absolute inset-0 opacity-20 z-0" 
                    style={{ 
                      background: `radial-gradient(circle at 30% 50%, ${tour.color}30, transparent 70%)`,
                    }}
                  />
                  
                  {/* Contenido */}
                  <div className="relative z-10 p-5 flex flex-col md:flex-row gap-4 items-start md:items-center">
                    {/* Icono */}
                    <motion.div
                      className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center"
                      style={{ 
                        background: `linear-gradient(135deg, ${tour.color}60, ${tour.color}20)`,
                        boxShadow: `0 0 20px ${tour.color}40`
                      }}
                      animate={{ 
                        scale: hoverIndex === index ? 1.05 : 1,
                        rotate: hoverIndex === index ? 5 : 0
                      }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <div className="text-white w-6 h-6">
                        {iconMap[tour.icon]}
                      </div>
                    </motion.div>
                    
                    {/* Texto */}
                    <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between w-full">
                      <div>
                        <h3 className="text-white text-lg font-light">{tour.title}</h3>
                        <p className="text-white/60 text-xs line-clamp-1 mt-1 max-w-md">{tour.description}</p>
                      </div>
                      
                      {/* Detalles */}
                      <div className="flex items-center mt-2 md:mt-0 md:ml-4">
                        <div className="flex items-center mr-5 text-white/50 text-xs">
                          <Clock size={14} className="mr-1" />
                          {tour.duration}
                        </div>
                        
                        <motion.div 
                          className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center"
                          animate={{ 
                            x: hoverIndex === index ? 5 : 0,
                            backgroundColor: hoverIndex === index 
                              ? `rgba(255,255,255,0.2)` 
                              : `rgba(255,255,255,0.05)`
                          }}
                        >
                          <ChevronRight size={16} className="text-white" />
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Información ambiental */}
            <motion.div 
              className="mt-4 rounded-xl overflow-hidden relative"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-900/40 to-emerald-900/30 z-0" />
              
              <div className="relative z-10 p-4 flex items-start gap-3">
                <div className="p-2 rounded-full bg-green-500/20 text-green-400">
                  <Leaf size={16} strokeWidth={1.5} />
                </div>
                
                <div className="flex-1">
                  <h3 className="text-green-300 text-sm font-medium mb-1">Impacto ambiental</h3>
                  <p className="text-green-100/70 text-xs leading-relaxed">
                    Explora cómo el conflicto armado ha afectado los ecosistemas y recursos naturales de Colombia.
                    Activa las capas ambientales para visualizar áreas afectadas.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
        
        {/* Panel de detalle del recorrido seleccionado */}
        <AnimatePresence>
          {selectedTour && (
            <motion.div 
              className="w-full md:w-1/2 bg-gray-500/30 backdrop-filter backdrop-blur-xl rounded-b-2xl md:rounded-r-2xl md:rounded-bl-none border-r border-b border-t md:border-t-0 border-white/10 shadow-2xl overflow-y-auto"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <div className="p-6 bg-gray-500/20">
                <div 
                  className="w-full h-48 rounded-xl mb-5 overflow-hidden relative bg-center bg-cover"
                  style={{ 
                    backgroundImage: `url(https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?q=80&w=1000)`, // Placeholder - Reemplazar con imagen real
                    boxShadow: `inset 0 0 100px 20px rgba(0,0,0,0.8)`
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/40 to-transparent" />
                  
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <motion.div 
                      className="inline-block py-1 px-3 rounded-full text-xs"
                      style={{ 
                        backgroundColor: `${selectedTour.color}35`,
                        color: `${selectedTour.color}` 
                      }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      {selectedTour.id === 'general' ? 'Destacado' : 'Recorrido Temático'}
                    </motion.div>
                    
                    <motion.h2 
                      className="text-white text-2xl font-light mt-2"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      {selectedTour.title}
                    </motion.h2>
                  </div>
                </div>
                
                <motion.p 
                  className="text-white/80 text-sm leading-relaxed mb-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {selectedTour.description}
                </motion.p>
                
                <div className="mb-5">
                  <h3 className="text-white/90 text-sm font-medium mb-3">Detalles del recorrido</h3>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/5 rounded-lg p-3 flex items-center">
                      <Clock className="text-white/60 w-4 h-4 mr-2" />
                      <div>
                        <div className="text-white/70 text-xs">Duración</div>
                        <div className="text-white text-sm">{selectedTour.duration}</div>
                      </div>
                    </div>
                    
                    <div className="bg-white/5 rounded-lg p-3 flex items-center">
                      <Eye className="text-white/60 w-4 h-4 mr-2" />
                      <div>
                        <div className="text-white/70 text-xs">Lugares</div>
                        <div className="text-white text-sm">{selectedTour.locations.length} sitios</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-white/90 text-sm font-medium mb-3">Lugares que visitarás</h3>
                  
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                    {selectedTour.locations.map((locationId, index) => (
                      <motion.div 
                        key={locationId}
                        className="bg-white/5 hover:bg-white/10 rounded-lg p-3 flex items-center justify-between transition-colors"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                      >
                        <div className="flex items-center">
                          <div 
                            className="w-6 h-6 rounded-full flex items-center justify-center mr-3 text-xs font-medium"
                            style={{ backgroundColor: `${selectedTour.color}35`, color: selectedTour.color }}
                          >
                            {index + 1}
                          </div>
                          <span className="text-white/90 text-sm">{locationId.split('_').join(' ')}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
                
                <motion.button
                  className="w-full py-3 px-4 rounded-lg flex items-center justify-center text-white font-medium"
                  style={{ 
                    background: `linear-gradient(135deg, ${selectedTour.color}, ${selectedTour.color}90)`,
                    boxShadow: `0 4px 12px ${selectedTour.color}30`
                  }}
                  whileHover={{ scale: 1.02, boxShadow: `0 6px 20px ${selectedTour.color}50` }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onSelectTour(selectedTour.id)}
                >
                  <span>Iniciar recorrido</span>
                  <ArrowRight className="ml-2 w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default TourSelector;