// src/components/TourMessage.tsx
import React, { useState, useEffect } from 'react';
import { X, ChevronRight, MapPin, ArrowRight, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TourMessageProps {
  title?: string;
  message: string;
  location?: string;
  icon?: React.ReactNode;
  onClose?: () => void;
  onNext?: () => void;
  isLastStep?: boolean;
  skipFunction?: () => void;
}

export const TourMessage: React.FC<TourMessageProps> = ({ 
  title, 
  message, 
  location,
  icon = <MapPin className="w-6 h-6 text-white" />,
  onClose,
  onNext,
  isLastStep = false,
  skipFunction
}) => {
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div 
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
          className="tour-message-container"
        >
          <div className="tour-message-box">
            {/* Decoración lateral */}
            <div className="tour-message-sidebar">
              <div className="tour-message-icon-container">
                {icon}
              </div>
              <div className="tour-message-vertical-line"></div>
            </div>
            
            <div className="tour-message-content">
              {/* Contenido principal */}
              <div className="tour-message-header">
                {location && (
                  <div className="tour-message-location">{location}</div>
                )}
                {title && (
                  <h3 className="tour-message-title">{title}</h3>
                )}
              </div>
              
              <div className="tour-message-body">
                <p>{message}</p>
              </div>
              
              {/* Footer con botón de siguiente */}
              <div className="tour-message-footer">
                {skipFunction && (
                  <button 
                    className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 
                      backdrop-blur-sm flex items-center gap-3 group transition-all duration-300 mr-3
                      cursor-pointer"
                    onClick={() => {
                      console.log("Botón 'Ir al mapa' presionado desde TourMessage");
                      skipFunction();
                    }}
                  >
                    <span className="text-white">Ir al mapa</span>
                    <ChevronRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
                  </button>
                )}
                {onNext && (
                  <button 
                    className="tour-message-next-btn"
                    onClick={onNext}
                  >
                    <span>{isLastStep ? 'Finalizar recorrido' : 'Continuar'}</span>
                    <ArrowRight className="tour-message-next-icon" />
                  </button>
                )}
              </div>
            </div>
            
            {onClose && (
              <button className="tour-message-close" onClick={onClose}>
                <X size={18} />
              </button>
            )}
          </div>
          
          {/* Decoración flotante - forma abstracta */}
          <div className="tour-message-floating-shape"></div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};