// src/components/NavComponents.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Search, Map, Info, HelpCircle, MapPin, User, ChevronRight, Menu, X, Compass, Layers, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { colombiaRegions, memoryTypes } from '../data/regions';
import { Logo } from './Logo';
import { MemoryLocation } from '../types';
import NotificacionesGuardianes from './NotificacionesGuardianes';

// Componente de navegación superior mejorado
export const NavBar: React.FC<{
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSearch: (e: React.FormEvent) => void;
  onRouteClick: () => void;
  onInfoClick: () => void;
  onHelpClick: () => void;
  onLocationClick: () => void;
  onUserProfileClick: () => void;
  onExilioClick: () => void;
  onGuardianesClick: () => void;
  appState: any;
  memoryLocations?: MemoryLocation[];
  suggestions?: MemoryLocation[];
  showSuggestions?: boolean;
  setShowSuggestions?: (show: boolean) => void;
  onSuggestionSelect?: (location: MemoryLocation) => void;
}> = ({
  searchQuery,
  setSearchQuery,
  onSearch,
  onRouteClick,
  onInfoClick,
  onHelpClick,
  onLocationClick,
  onUserProfileClick,
  onExilioClick,
  onGuardianesClick,
  appState,
  memoryLocations = [],
  suggestions = [],
  showSuggestions = false,
  setShowSuggestions = () => {},
  onSuggestionSelect = () => {}
}) => {
  const [scrolled, setScrolled] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  
  // Detectar scroll para cambiar estilos
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cerrar sugerencias al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setShowSuggestions]);

  // Obtener color según tipo de memoria
  const getColorForType = (type: string): string => {
    const colors: Record<string, string> = {
      identificados: "#FF9D4D",
      caracterizados: "#4CAF50",
      solicitud: "#2196F3",
      horror: "#F44336",
      sanaciones: "#9C27B0"
    };
    return colors[type] || "#FFFFFF";
  };

  return (
    <div className={`fixed top-0 left-0 z-50 transition-all duration-300 
      ${scrolled ? 'py-3 bg-black/70' : 'py-5 bg-gradient-to-b from-black/60 to-transparent'}`}>
      <div className="px-6 flex items-center" style={{ maxWidth: "fit-content" }}>
        {/* Logo */}
        <div className="flex items-center">
          <div className="mr-8">
            <Logo />
          </div>
        </div>
        
        {/* Buscador mejorado con sugerencias */}
        <div className="hidden md:block w-72 mx-6">
          <div className="relative">
            <form onSubmit={onSearch} className="relative">
              <input
                ref={inputRef}
                type="text"
                placeholder="Buscar territorio de memoria"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                className="w-full py-2.5 pl-4 pr-10 bg-white/10 backdrop-blur-md 
                         border border-white/20 rounded-full text-white placeholder-white/60
                         focus:outline-none focus:border-white/30 transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setShowSuggestions(false);
                  }}
                  className="absolute right-12 top-1/2 transform -translate-y-1/2 text-white/60
                            hover:text-white/90 p-1 rounded-full transition-colors"
                >
                  <X size={16} />
                </button>
              )}
              <button 
                type="submit" 
                className="absolute right-1 top-1/2 -translate-y-1/2 p-2 bg-amber-500
                          hover:bg-amber-600 rounded-full transition-colors"
              >
                <Search size={18} className="text-white" />
              </button>
            </form>
            
            {/* Lista de sugerencias */}
            <AnimatePresence>
              {showSuggestions && suggestions.length > 0 && (
                <motion.div
                  ref={suggestionsRef}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-black/70 backdrop-blur-lg
                           rounded-lg overflow-hidden border border-white/10 shadow-xl z-50"
                >
                  <div className="py-1 max-h-60 overflow-y-auto">
                    {suggestions.map((location) => (
                      <button
                        key={location.id}
                        onClick={() => onSuggestionSelect(location)}
                        className="w-full px-4 py-3 text-left flex items-start hover:bg-white/10 transition-colors"
                      >
                        <div className="flex-shrink-0 mr-3 mt-0.5">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{
                              backgroundColor: getColorForType(location.type)
                            }}
                          />
                        </div>
                        <div className="flex-grow">
                          <div className="text-white font-medium">{location.title}</div>
                          <div className="text-white/60 text-sm flex flex-wrap gap-1 items-center">
                            {location.code && (
                              <span className="bg-white/10 px-1.5 py-0.5 rounded text-xs">{location.code}</span>
                            )}
                            <span>{location.region} · {location.department}</span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        
        {/* Breadcrumb integrado en la barra */}
        <Breadcrumb 
          items={getBreadcrumbItems(appState)}
          className={`hidden md:flex transition-opacity duration-300 ml-6 ${scrolled ? 'opacity-100' : 'opacity-80'}`}
        />
        
        {/* Botones de navegación */}
        <div className="hidden md:flex items-center gap-3 ml-6">
          <NavButton icon={<Map size={18} />} label="Recorrido" onClick={onRouteClick} />
          <NavButton icon={<Info size={18} />} label="Información" onClick={onInfoClick} />
          <NavButton icon={<HelpCircle size={18} />} label="Ayuda" onClick={onHelpClick} />
          <NavButton icon={<MapPin size={18} />} label="Ubicación" onClick={onLocationClick} />
          <NavButton 
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EC4899" strokeWidth="2" 
                   strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 3.2A9 9 0 1 0 20.8 14a1 1 0 0 0-1-1H13a1 1 0 0 1-1-1V4.5a1 1 0 0 0-.5-.9 1 1 0 0 0-1.2.1L10 3.2Z"/>
                <path d="M3 9h2"/>
                <path d="M8 3.2V5"/>
                <path d="M11 3h2"/>
              </svg>
            } 
            label="Exilio" 
            onClick={onExilioClick} 
          />
          
          {/* Botón de Guardianes de la Memoria */}
          <div className="mx-2">
            <NotificacionesGuardianes onClick={onGuardianesClick} />
          </div>
          
          <button 
            onClick={onUserProfileClick}
            className="ml-2 p-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full 
                     border border-white/10 transition-all"
          >
            <User size={20} className="text-white" />
          </button>
        </div>
        
        {/* Versión móvil: botón de menú */}
        <div className="md:hidden flex items-center ml-2">
          <MobileMenuButton 
            onUserProfileClick={onUserProfileClick}
            onRouteClick={onRouteClick}
            onInfoClick={onInfoClick}
            onHelpClick={onHelpClick}
            onLocationClick={onLocationClick}
            onExilioClick={onExilioClick}
            onGuardianesClick={onGuardianesClick}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onSearch={onSearch}
            suggestions={suggestions}
            showSuggestions={showSuggestions}
            setShowSuggestions={setShowSuggestions}
            onSuggestionSelect={onSuggestionSelect}
          />
        </div>
      </div>
    </div>
  );
};

// Botón de navegación con ícono y etiqueta
const NavButton: React.FC<{
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}> = ({ icon, label, onClick }) => {
  return (
    <button 
      onClick={onClick}
      className="flex flex-col items-center justify-center py-1.5 px-3 rounded-lg
                 hover:bg-white/10 transition-colors"
    >
      <div className="text-white/90">{icon}</div>
      <span className="text-white/80 text-xs mt-1.5">{label}</span>
    </button>
  );
};

// Menú móvil mejorado
const MobileMenuButton: React.FC<{
  onUserProfileClick: () => void;
  onRouteClick: () => void;
  onInfoClick: () => void;
  onHelpClick: () => void;
  onLocationClick: () => void;
  onExilioClick: () => void;
  onGuardianesClick: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSearch: (e: React.FormEvent) => void;
  suggestions?: MemoryLocation[];
  showSuggestions?: boolean;
  setShowSuggestions?: (show: boolean) => void;
  onSuggestionSelect?: (location: MemoryLocation) => void;
}> = ({ 
  onUserProfileClick,
  onRouteClick,
  onInfoClick,
  onHelpClick,
  onLocationClick,
  onExilioClick,
  onGuardianesClick,
  searchQuery,
  setSearchQuery,
  onSearch,
  suggestions = [],
  showSuggestions = false,
  setShowSuggestions = () => {},
  onSuggestionSelect = () => {}
}) => {
  const [open, setOpen] = useState(false);
  const [showSearchForm, setShowSearchForm] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Cerrar menú cuando se hace clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Obtener color según tipo de memoria (para las sugerencias)
  const getColorForType = (type: string): string => {
    const colors: Record<string, string> = {
      identificados: "#FF9D4D",
      caracterizados: "#4CAF50",
      solicitud: "#2196F3",
      horror: "#F44336",
      sanaciones: "#9C27B0",
      exilio: "#EC4899"
    };
    return colors[type] || "#FFFFFF";
  };
  
  const handleMenuItemClick = (callback: () => void) => {
    setOpen(false);
    callback();
  };
  
  return (
    <div ref={menuRef}>
      <button 
        onClick={() => setOpen(!open)}
        className="p-2 bg-white/10 backdrop-blur-md rounded-full transition-all hover:bg-white/20"
        aria-label="Menú"
      >
        {open ? <X size={22} className="text-white" /> : <Menu size={22} className="text-white" />}
      </button>
      
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-[70px] mx-4 bg-black/90 backdrop-blur-md
                      border border-white/10 rounded-xl overflow-hidden shadow-xl z-50"
          >
            {showSearchForm ? (
              <div className="p-4">
                <div className="flex items-center mb-2">
                  <button 
                    onClick={() => setShowSearchForm(false)}
                    className="text-white/80 hover:text-white mr-3"
                  >
                    <ChevronRight className="rotate-180" size={20} />
                  </button>
                  <h3 className="text-white font-medium">Buscar</h3>
                </div>
                
                <form onSubmit={(e) => {
                  e.preventDefault();
                  onSearch(e);
                  setShowSearchForm(false);
                  setOpen(false);
                }} className="relative">
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Buscar territorio de memoria"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setShowSuggestions(true)}
                    className="w-full py-2.5 pl-4 pr-10 bg-white/10 backdrop-blur-md 
                             border border-white/20 rounded-full text-white placeholder-white/60
                             focus:outline-none focus:border-white/30 transition-all"
                    autoFocus
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setShowSuggestions(false);
                      }}
                      className="absolute right-12 top-1/2 transform -translate-y-1/2 text-white/60
                                hover:text-white/90 p-1 rounded-full transition-colors"
                    >
                      <X size={16} />
                    </button>
                  )}
                  <button 
                    type="submit" 
                    className="absolute right-1 top-1/2 -translate-y-1/2 p-2 bg-amber-500
                              hover:bg-amber-600 rounded-full transition-colors"
                  >
                    <Search size={18} className="text-white" />
                  </button>
                </form>
                
                {/* Lista de sugerencias */}
                <AnimatePresence>
                  {showSuggestions && suggestions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="mt-2 bg-black/60 backdrop-blur-lg rounded-lg overflow-hidden border border-white/10 shadow-lg"
                    >
                      <div className="py-1 max-h-60 overflow-y-auto">
                        {suggestions.map((location) => (
                          <button
                            key={location.id}
                            onClick={() => {
                              onSuggestionSelect(location);
                              setShowSearchForm(false);
                              setOpen(false);
                            }}
                            className="w-full px-4 py-3 text-left flex items-start hover:bg-white/10 transition-colors"
                          >
                            <div className="flex-shrink-0 mr-3 mt-0.5">
                              <div 
                                className="w-3 h-3 rounded-full" 
                                style={{
                                  backgroundColor: getColorForType(location.type)
                                }}
                              />
                            </div>
                            <div className="flex-grow">
                              <div className="text-white font-medium">{location.title}</div>
                              <div className="text-white/60 text-sm flex flex-wrap gap-1 items-center">
                                {location.code && (
                                  <span className="bg-white/10 px-1.5 py-0.5 rounded text-xs">{location.code}</span>
                                )}
                                <span>{location.region} · {location.department}</span>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="py-2 max-h-[80vh] overflow-y-auto">
                <MobileMenuItem 
                  icon={<Search size={18} />} 
                  label="Buscar" 
                  onClick={() => setShowSearchForm(true)}
                />
                <MobileMenuItem 
                  icon={<Map size={18} />} 
                  label="Recorrido" 
                  onClick={() => handleMenuItemClick(onRouteClick)}
                />
                <MobileMenuItem 
                  icon={<Info size={18} />} 
                  label="Información" 
                  onClick={() => handleMenuItemClick(onInfoClick)}
                />
                <MobileMenuItem 
                  icon={<HelpCircle size={18} />} 
                  label="Ayuda" 
                  onClick={() => handleMenuItemClick(onHelpClick)}
                />
                <MobileMenuItem 
                  icon={<MapPin size={18} />} 
                  label="Ubicación" 
                  onClick={() => handleMenuItemClick(onLocationClick)}
                />
                <MobileMenuItem 
                  icon={
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EC4899" strokeWidth="2" 
                         strokeLinecap="round" strokeLinejoin="round">
                      <path d="M10 3.2A9 9 0 1 0 20.8 14a1 1 0 0 0-1-1H13a1 1 0 0 1-1-1V4.5a1 1 0 0 0-.5-.9 1 1 0 0 0-1.2.1L10 3.2Z"/>
                      <path d="M3 9h2"/>
                      <path d="M8 3.2V5"/>
                      <path d="M11 3h2"/>
                    </svg>
                  } 
                  label="Exilio" 
                  onClick={() => handleMenuItemClick(onExilioClick)}
                />
                <MobileMenuItem 
                  icon={<Globe size={18} />} 
                  label="Guardianes de Memoria" 
                  onClick={() => handleMenuItemClick(onGuardianesClick)} 
                />
                
                <div className="border-t border-white/10 my-1"></div>
                
                <MobileMenuItem 
                  icon={<User size={18} />} 
                  label="Perfil" 
                  onClick={() => handleMenuItemClick(onUserProfileClick)}
                />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Elemento del menú móvil
const MobileMenuItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}> = ({ icon, label, onClick }) => {
  return (
    <button 
      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/10 transition-colors"
      onClick={onClick}
    >
      <div className="text-white/90">{icon}</div>
      <span className="text-white text-sm">{label}</span>
    </button>
  );
};

// Breadcrumb mejorado con estilo elegante
export const Breadcrumb: React.FC<{
  items: {
    label: string;
    href?: string;
  }[];
  className?: string;
}> = ({ items, className = '' }) => {
  if (items.length <= 1) return null;
  
  return (
    <nav className={`flex items-center ${className}`} aria-label="Breadcrumb">
      <ol className="flex items-center gap-2">
        {items.map((item, index) => (
          <React.Fragment key={index}>
            {index > 0 && (
              <li className="flex items-center">
                <ChevronRight size={14} className="text-white/50" />
              </li>
            )}
            <li>
              {item.href ? (
                <a 
                  href={item.href} 
                  className={`text-sm hover:underline ${
                    index === items.length - 1 
                      ? 'text-amber-300 font-medium' 
                      : 'text-white/80'
                  }`}
                >
                  {item.label}
                </a>
              ) : (
                <span 
                  className={`text-sm ${
                    index === items.length - 1 
                      ? 'text-amber-300 font-medium' 
                      : 'text-white/80'
                  }`}
                >
                  {item.label}
                </span>
              )}
            </li>
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
};

// Componente para los botones laterales mejorados
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
    <div className="fixed bottom-4 left-4 md:bottom-8 md:left-8 z-40 flex flex-col items-start gap-3 md:gap-4">
      {/* Panel de capas */}
      <AnimatePresence>
        {showLayersPanel && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-16 left-0 md:left-full md:ml-4 bg-black/80 backdrop-blur-md rounded-lg p-3 md:p-4
                      border border-white/10 w-64 shadow-lg"
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
                            ? `right-1 bg-${layer.color.substring(1)}` 
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
        className="bg-black/50 backdrop-blur-md rounded-full 
                  flex items-center gap-2 shadow-lg text-white
                  border border-white/10 transition-all hover:bg-black/60
                  px-3 py-2 md:px-4 md:py-2.5"
      >
        <Layers size={16} className="md:w-[18px] md:h-[18px]" />
        <span className="text-sm md:text-base">Capas</span>
      </button>
      
      {/* Controles de zoom */}
      <div className="flex flex-col gap-2 md:gap-3">
        <button 
          onClick={onZoomIn}
          className="bg-black/50 backdrop-blur-md rounded-full
                    shadow-lg text-white border border-white/10 
                    hover:bg-black/60 transition-all
                    p-2 md:p-2.5"
          title="Acercar"
        >
          <ZoomIn size={16} className="md:w-[18px] md:h-[18px]" />
        </button>
        
        <button 
          onClick={onZoomOut}
          className="bg-black/50 backdrop-blur-md rounded-full
                    shadow-lg text-white border border-white/10 
                    hover:bg-black/60 transition-all
                    p-2 md:p-2.5"
          title="Alejar"
        >
          <ZoomOut size={16} className="md:w-[18px] md:h-[18px]" />
        </button>
        
        <button 
          onClick={onResetRotation}
          className="bg-black/50 backdrop-blur-md rounded-full
                    shadow-lg text-white border border-white/10 
                    hover:bg-black/60 transition-all
                    p-2 md:p-2.5"
          title="Restablecer rotación"
        >
          <Compass size={16} className="md:w-[18px] md:h-[18px]" />
        </button>
      </div>
    </div>
  );
};

// Función para construir los elementos del breadcrumb
function getBreadcrumbItems(appState: any) {
  const items = [{ label: 'Colombia', href: '#' }];
  
  if (appState.selectedMacroRegion) {
    const regionName = colombiaRegions[appState.selectedMacroRegion].name;
    items.push({ label: regionName, href: '#' });
    
    if (appState.selectedDepartment) {
      const region = colombiaRegions[appState.selectedMacroRegion];
      const department = region.departments.find(d => d.id === appState.selectedDepartment);
      if (department) {
        items.push({ label: department.name, href: '#' });
      }
    }
    
    if (appState.selectedMemoryType) {
      const typeName = memoryTypes[appState.selectedMemoryType]?.name;
      if (typeName) {
        items.push({ label: typeName, href: '#' });
      }
    }
  }
  
  if (appState.selectedLocation) {
    const locationName = appState.selectedLocation.title || 'Lugar de memoria';
    items.push({ label: locationName });
  }
  
  return items;
}

// Componente para los controles de zoom
const ZoomIn: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="16" />
    <line x1="8" y1="12" x2="16" y2="12" />
  </svg>
);

const ZoomOut: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="8" y1="12" x2="16" y2="12" />
  </svg>
);