// src/components/NotificacionesGuardianes.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Shield, X, ExternalLink } from 'lucide-react';
import { getPendingNotificationsCount } from '../utils/memoryHistory';

interface NotificacionesGuardianesProps {
  onClick: () => void;
}

const NotificacionesGuardianes: React.FC<NotificacionesGuardianesProps> = ({ onClick }) => {
  const [notificationCount, setNotificationCount] = useState(0);
  const [showTooltip, setShowTooltip] = useState(false);
  
  // Simular carga de notificaciones
  useEffect(() => {
    // Carga inicial
    setNotificationCount(getPendingNotificationsCount());
    
    // Simulación de notificaciones periódicas
    const interval = setInterval(() => {
      // Simular una notificación aleatoria cada 30-60 segundos
      if (Math.random() > 0.7) {
        setNotificationCount(prev => prev + 1);
      }
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="relative">
      <button
        onClick={onClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="p-2 text-white rounded-full hover:bg-white/10 transition-all relative flex items-center gap-1"
      >
        <Shield size={20} className="text-amber-400" />
        <span className="text-sm font-medium hidden md:inline">Guardianes</span>
        
        {/* Insignia de notificaciones */}
        {notificationCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center border border-black/10">
            {notificationCount > 9 ? '9+' : notificationCount}
          </span>
        )}
      </button>
      
      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute top-full right-0 mt-2 w-64 bg-gray-800/90 backdrop-blur-md text-white rounded-md shadow-lg border border-amber-500/20 z-50"
          >
            <div className="p-3">
              <h3 className="text-sm font-medium flex items-center gap-1.5">
                <Shield size={14} className="text-amber-400" />
                Guardianes de la Memoria
              </h3>
              <p className="text-xs text-gray-300 mt-1">
                Sistema de monitoreo y protección para lugares y archivos de memoria histórica.
              </p>
              
              {notificationCount > 0 && (
                <div className="mt-2 pt-2 border-t border-gray-700/50">
                  <div className="flex items-center gap-1.5 text-xs text-amber-300">
                    <Bell size={12} />
                    {notificationCount} {notificationCount === 1 ? 'cambio' : 'cambios'} pendiente{notificationCount === 1 ? '' : 's'} de revisión
                  </div>
                </div>
              )}
              
              <div className="mt-2 pt-2 text-right">
                <button 
                  onClick={onClick}
                  className="text-xs text-amber-300 hover:text-amber-200 flex items-center gap-1 ml-auto"
                >
                  Ver panel <ExternalLink size={10} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificacionesGuardianes;