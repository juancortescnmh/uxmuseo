// src/components/GuardianesMemoria.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, Bell, Clock, Eye, PlusCircle, BookOpen, HistoryIcon, UserCheck } from 'lucide-react';
import { 
  getMemoryHistory, 
  getRecentChanges, 
  MemoryVersionEntry,
  MemorySubscription,
  getUserSubscriptions,
  addSubscription
} from '../utils/memoryHistory';
import { memoryLocations } from '../utils/mapHelpers';
import { colombiaRegions, MacroRegion } from '../data/regions';

interface GuardianesMemoriaProps {
  isOpen: boolean;
  onClose: () => void;
  userId?: string; // ID de usuario simulado
}

const GuardianesMemoria: React.FC<GuardianesMemoriaProps> = ({ 
  isOpen, 
  onClose,
  userId = "user1" // Usuario de prueba por defecto
}) => {
  // Estados
  const [activeTab, setActiveTab] = useState<'cambios' | 'suscripciones' | 'historial'>('cambios');
  const [recentChanges, setRecentChanges] = useState<MemoryVersionEntry[]>([]);
  const [userSubscription, setUserSubscription] = useState<MemorySubscription | null>(null);
  const [locationHistory, setLocationHistory] = useState<MemoryVersionEntry[]>([]);
  const [selectedLocationId, setSelectedLocationId] = useState<string>("");
  
  // Estado para formulario de suscripción
  const [newSubscription, setNewSubscription] = useState({
    locations: [] as string[],
    regions: [] as string[],
    departments: [] as string[],
    notificationPreference: 'weekly' as 'immediate' | 'daily' | 'weekly'
  });
  
  // Cargar datos iniciales
  useEffect(() => {
    if (isOpen) {
      // Cargar cambios recientes
      setRecentChanges(getRecentChanges(30)); // últimos 30 días
      
      // Cargar suscripciones del usuario
      const subscription = getUserSubscriptions(userId);
      setUserSubscription(subscription);
      
      // Si hay un usuario con suscripción, pre-cargar sus preferencias
      if (subscription) {
        setNewSubscription({
          locations: subscription.locationIds,
          regions: subscription.regionIds,
          departments: subscription.departmentIds,
          notificationPreference: subscription.notificationPreference
        });
      }
    }
  }, [isOpen, userId]);
  
  // Cargar historial para una ubicación específica
  useEffect(() => {
    if (selectedLocationId) {
      setLocationHistory(getMemoryHistory(selectedLocationId));
    } else {
      setLocationHistory([]);
    }
  }, [selectedLocationId]);
  
  // Manejadores
  const handleLocationSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLocationId(event.target.value);
  };
  
  const handleAddSubscription = () => {
    if (!userSubscription) {
      // Crear nueva suscripción
      addSubscription({
        userId,
        userName: "Usuario de Prueba",
        email: "usuario@example.com",
        locationIds: newSubscription.locations,
        regionIds: newSubscription.regions,
        departmentIds: newSubscription.departments,
        notificationPreference: newSubscription.notificationPreference
      });
      
      // Actualizar estado local
      setUserSubscription(getUserSubscriptions(userId));
    } else {
      // En una implementación real, aquí actualizaríamos la suscripción existente
      alert("Funcionalidad de actualizar suscripción (simulada)");
    }
  };
  
  // Formatear fecha
  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleString('es-CO', {
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 z-50 flex items-start justify-center overflow-auto py-10 bg-black/70"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div 
            className="relative bg-gray-500/30 backdrop-blur-xl rounded-lg shadow-xl w-full max-w-4xl mx-4 my-4 border border-white/10 flex flex-col"
            initial={{ scale: 0.9, y: 10 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 10 }}
            onClick={e => e.stopPropagation()}
          >
            {/* Encabezado */}
            <div className="flex items-center justify-between p-4 border-b border-gray-700/50">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Shield className="h-6 w-6 text-amber-400" />
                  <span className="absolute -top-1 -right-1 bg-amber-500 h-2.5 w-2.5 rounded-full animate-pulse"></span>
                </div>
                <h2 className="text-xl font-medium text-white">Guardianes de la Memoria</h2>
                <span className="bg-amber-500/20 text-amber-300 text-xs px-2 py-0.5 rounded-full border border-amber-500/30 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="m12 16 4-4-4-4"/>
                    <path d="m8 12 4 4 4-4"/>
                  </svg>
                  <span className="ml-1">Versión 1.0</span>
                </span>
              </div>
              <button 
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 rounded-full p-1"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Descripción */}
            <div className="p-4 bg-gray-500/10">
              <p className="text-gray-300 text-sm">
                El programa "Guardianes de la Memoria" permite a las comunidades y organizaciones monitorear cambios en los lugares de memoria, recibir alertas sobre actualizaciones y garantizar la protección digital del patrimonio documental.
              </p>
              <div className="grid grid-cols-3 gap-2 mt-3 text-xs text-gray-300 border-t border-gray-700/30 pt-3">
                <div className="flex flex-col items-center text-center gap-1 bg-black/20 rounded-lg p-2">
                  <div className="bg-amber-500/20 p-2 rounded-full">
                    <Bell size={18} className="text-amber-400" />
                  </div>
                  <span className="font-medium">Recibe alertas</span>
                  <span className="text-gray-400 text-[10px]">Notificaciones de cambios</span>
                </div>
                <div className="flex flex-col items-center text-center gap-1 bg-black/20 rounded-lg p-2">
                  <div className="bg-amber-500/20 p-2 rounded-full">
                    <HistoryIcon size={18} className="text-amber-400" />
                  </div>
                  <span className="font-medium">Revisa cambios</span>
                  <span className="text-gray-400 text-[10px]">Ver historial completo</span>
                </div>
                <div className="flex flex-col items-center text-center gap-1 bg-black/20 rounded-lg p-2">
                  <div className="bg-amber-500/20 p-2 rounded-full">
                    <UserCheck size={18} className="text-amber-400" />
                  </div>
                  <span className="font-medium">Protege tu memoria</span>
                  <span className="text-gray-400 text-[10px]">Control comunitario</span>
                </div>
              </div>
            </div>
            
            {/* Pestañas */}
            <div className="flex border-b border-gray-700/50">
              <button 
                className={`flex items-center gap-1 px-4 py-3 text-sm font-medium transition-colors ${activeTab === 'cambios' ? 'text-white border-b-2 border-amber-400' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                onClick={() => setActiveTab('cambios')}
              >
                <Clock size={16} />
                Cambios Recientes
              </button>
              <button 
                className={`flex items-center gap-1 px-4 py-3 text-sm font-medium transition-colors ${activeTab === 'suscripciones' ? 'text-white border-b-2 border-amber-400' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                onClick={() => setActiveTab('suscripciones')}
              >
                <Bell size={16} />
                Suscripciones
              </button>
              <button 
                className={`flex items-center gap-1 px-4 py-3 text-sm font-medium transition-colors ${activeTab === 'historial' ? 'text-white border-b-2 border-amber-400' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                onClick={() => setActiveTab('historial')}
              >
                <HistoryIcon size={16} />
                Historial Completo
              </button>
            </div>
            
            {/* Contenido de las pestañas */}
            <div className="p-4 overflow-y-auto flex-grow">
              
              {/* Pestaña de Cambios Recientes */}
              {activeTab === 'cambios' && (
                <div className="space-y-4">
                  <h3 className="text-white font-medium mb-2 flex items-center gap-2">
                    <Clock size={18} className="text-amber-400" />
                    Últimas actualizaciones en lugares de memoria
                  </h3>
                  
                  {recentChanges.length === 0 ? (
                    <p className="text-gray-400 text-sm py-4">No hay cambios recientes.</p>
                  ) : (
                    <div className="space-y-3">
                      {recentChanges.map(change => (
                        <div key={change.id} className="bg-black/20 rounded-lg p-3 border border-gray-700/30">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-1.5">
                              <div className="bg-amber-500/20 p-1 rounded-full">
                                <Clock size={14} className="text-amber-400" />
                              </div>
                              <span className="text-amber-300 text-xs">{formatDate(change.timestamp)}</span>
                            </div>
                            <span className="bg-amber-500/30 text-amber-200 text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="m18 5-3-3H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2"/>
                                <path d="M8 18h1"/>
                                <path d="M18.4 9.6a2 2 0 1 1 3 3L17 17l-4 1 1-4Z"/>
                              </svg>
                              <span>{change.changes.fieldChanged}</span>
                            </span>
                          </div>
                          
                          <h4 className="text-white text-sm mt-2 flex items-center gap-1.5">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-400">
                              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                              <circle cx="12" cy="10" r="3"/>
                            </svg>
                            {memoryLocations.find(loc => loc.id === change.changes.locationId)?.title || 
                             `Lugar ID: ${change.changes.locationId}`}
                          </h4>
                          
                          <div className="mt-3 text-xs grid grid-cols-1 md:grid-cols-2 gap-2">
                            <div className="bg-red-900/10 border border-red-900/20 rounded p-2">
                              <div className="flex items-center gap-1 text-gray-300 mb-1">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-400">
                                  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                                  <polyline points="9 22 9 12 15 12 15 22"/>
                                </svg>
                                <span>Valor anterior:</span>
                              </div>
                              <div className="text-gray-300 bg-black/30 p-1.5 rounded break-words text-[11px]">
                                {change.changes.previousValue || <em className="text-gray-500">Sin valor previo</em>}
                              </div>
                            </div>
                            
                            <div className="bg-green-900/10 border border-green-900/20 rounded p-2">
                              <div className="flex items-center gap-1 text-gray-300 mb-1">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-400">
                                  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                                  <polyline points="9 22 9 12 15 12 15 22"/>
                                </svg>
                                <span>Nuevo valor:</span>
                              </div>
                              <div className="text-gray-300 bg-black/30 p-1.5 rounded break-words text-[11px]">
                                {change.changes.newValue}
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-3 pt-2 border-t border-gray-700/30 flex justify-between items-center">
                            <span className="text-gray-400 text-xs flex items-center gap-1">
                              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-400">
                                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                                <circle cx="12" cy="7" r="4"/>
                              </svg>
                              {change.author}
                            </span>
                            <span className="text-gray-300 text-xs flex items-center gap-1">
                              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-400">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                              </svg>
                              {change.comment}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              {/* Pestaña de Suscripciones */}
              {activeTab === 'suscripciones' && (
                <div className="space-y-4">
                  <h3 className="text-white font-medium mb-2 flex items-center gap-2">
                    <Bell size={18} className="text-amber-400" />
                    Gestionar suscripciones y alertas
                  </h3>
                  
                  <div className="bg-black/20 rounded-lg p-4 border border-gray-700/30 mb-4">
                    <div className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs p-1 rounded-full flex items-center justify-center shadow-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
                        <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
                      </svg>
                    </div>
                    {userSubscription ? (
                      <div>
                        <h4 className="text-white text-sm flex items-center gap-1.5">
                          <UserCheck size={16} className="text-amber-400" />
                          Suscripción actual
                        </h4>
                        
                        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h5 className="text-gray-300 text-xs font-medium mb-1.5">Lugares específicos:</h5>
                            <div className="text-gray-400 text-xs bg-black/30 p-2 rounded h-20 overflow-y-auto">
                              {userSubscription.locationIds.length > 0 ? (
                                <ul className="list-disc list-inside">
                                  {userSubscription.locationIds.map(locId => (
                                    <li key={locId}>
                                      {memoryLocations.find(l => l.id === locId)?.title || locId}
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <p className="text-gray-500 italic">Sin suscripciones a lugares específicos</p>
                              )}
                            </div>
                          </div>
                          
                          <div>
                            <h5 className="text-gray-300 text-xs font-medium mb-1.5">Regiones:</h5>
                            <div className="text-gray-400 text-xs bg-black/30 p-2 rounded h-20 overflow-y-auto">
                              {userSubscription.regionIds.length > 0 ? (
                                <ul className="list-disc list-inside">
                                  {userSubscription.regionIds.map(regionId => (
                                    <li key={regionId}>
                                      {colombiaRegions[regionId as MacroRegion]?.name || regionId}
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <p className="text-gray-500 italic">Sin suscripciones a regiones</p>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-3">
                          <h5 className="text-gray-300 text-xs font-medium mb-1.5">Preferencia de notificación:</h5>
                          <div className="text-gray-400 text-xs bg-black/30 p-2 rounded inline-block">
                            {userSubscription.notificationPreference === 'immediate' ? 'Inmediata' : 
                             userSubscription.notificationPreference === 'daily' ? 'Diaria' : 'Semanal'}
                          </div>
                        </div>
                        
                        <div className="mt-4 pt-3 border-t border-gray-700/50">
                          <button 
                            className="text-xs px-3 py-1.5 bg-amber-600/30 text-amber-200 rounded-md hover:bg-amber-600/50 transition-colors flex items-center gap-1"
                          >
                            <Eye size={14} />
                            Editar suscripción
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h4 className="text-white text-sm flex items-center gap-1.5">
                          <PlusCircle size={16} className="text-amber-400" />
                          Crear nueva suscripción
                        </h4>
                        
                        <div className="mt-3 space-y-4">
                          <div>
                            <label className="text-gray-300 text-xs font-medium mb-1.5 block">
                              Selecciona lugares específicos:
                            </label>
                            <select 
                              className="w-full bg-black/30 text-gray-300 text-xs p-2 rounded border border-gray-700/30 focus:outline-none focus:border-amber-500"
                              multiple
                              size={3}
                              onChange={(e) => {
                                const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
                                setNewSubscription({...newSubscription, locations: selectedOptions});
                              }}
                            >
                              {memoryLocations.map(location => (
                                <option key={location.id} value={location.id}>
                                  {location.title} ({location.code})
                                </option>
                              ))}
                            </select>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="text-gray-300 text-xs font-medium mb-1.5 block">
                                Selecciona regiones:
                              </label>
                              <select 
                                className="w-full bg-black/30 text-gray-300 text-xs p-2 rounded border border-gray-700/30 focus:outline-none focus:border-amber-500"
                                multiple
                                size={3}
                                onChange={(e) => {
                                  const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
                                  setNewSubscription({...newSubscription, regions: selectedOptions});
                                }}
                              >
                                {Object.entries(colombiaRegions).map(([id, region]) => (
                                  <option key={id} value={id}>
                                    {region.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                            
                            <div>
                              <label className="text-gray-300 text-xs font-medium mb-1.5 block">
                                Preferencia de notificación:
                              </label>
                              <select 
                                className="w-full bg-black/30 text-gray-300 text-xs p-2 rounded border border-gray-700/30 focus:outline-none focus:border-amber-500"
                                value={newSubscription.notificationPreference}
                                onChange={(e) => {
                                  setNewSubscription({
                                    ...newSubscription, 
                                    notificationPreference: e.target.value as 'immediate' | 'daily' | 'weekly'
                                  });
                                }}
                              >
                                <option value="immediate">Inmediata</option>
                                <option value="daily">Diaria</option>
                                <option value="weekly">Semanal</option>
                              </select>
                            </div>
                          </div>
                          
                          <div className="mt-4 pt-3 border-t border-gray-700/50">
                            <button 
                              className="text-xs px-3 py-1.5 bg-amber-600/30 text-amber-200 rounded-md hover:bg-amber-600/50 transition-colors flex items-center gap-1"
                              onClick={handleAddSubscription}
                            >
                              <Bell size={14} />
                              Crear suscripción
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="bg-black/10 rounded-lg p-3 border border-amber-800/20">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="bg-amber-500/20 p-1.5 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-400">
                          <circle cx="12" cy="12" r="10"/>
                          <path d="M12 16v-4"/>
                          <path d="M12 8h.01"/>
                        </svg>
                      </div>
                      <h4 className="text-white text-sm font-medium">¿Cómo funcionan las suscripciones?</h4>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="bg-black/20 rounded p-2 border border-amber-700/20">
                        <div className="flex flex-col items-center text-center gap-1">
                          <div className="bg-amber-500/20 p-1.5 rounded-full">
                            <Bell size={16} className="text-amber-400" />
                          </div>
                          <p className="text-amber-300 text-xs font-medium">Alertas personalizadas</p>
                          <p className="text-gray-400 text-[10px]">Recibe notificaciones sobre cambios en tus lugares</p>
                        </div>
                      </div>
                      
                      <div className="bg-black/20 rounded p-2 border border-amber-700/20">
                        <div className="flex flex-col items-center text-center gap-1">
                          <div className="bg-amber-500/20 p-1.5 rounded-full">
                            <Eye size={16} className="text-amber-400" />
                          </div>
                          <p className="text-amber-300 text-xs font-medium">Vigilancia comunitaria</p>
                          <p className="text-gray-400 text-[10px]">Verifica la precisión de la información</p>
                        </div>
                      </div>
                      
                      <div className="bg-black/20 rounded p-2 border border-amber-700/20">
                        <div className="flex flex-col items-center text-center gap-1">
                          <div className="bg-amber-500/20 p-1.5 rounded-full">
                            <Shield size={16} className="text-amber-400" />
                          </div>
                          <p className="text-amber-300 text-xs font-medium">Protección colectiva</p>
                          <p className="text-gray-400 text-[10px]">Control de versiones contra pérdida de datos</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Pestaña de Historial */}
              {activeTab === 'historial' && (
                <div className="space-y-4">
                  <h3 className="text-white font-medium mb-2 flex items-center gap-2">
                    <BookOpen size={18} className="text-amber-400" />
                    Historial de versiones por lugar
                  </h3>
                  
                  <div className="mb-4">
                    <label className="text-gray-300 text-xs font-medium mb-1.5 block">
                      Selecciona un lugar de memoria:
                    </label>
                    <select 
                      className="w-full bg-black/30 text-gray-300 text-sm p-2 rounded border border-gray-700/30 focus:outline-none focus:border-amber-500"
                      value={selectedLocationId}
                      onChange={handleLocationSelect}
                    >
                      <option value="">Seleccionar lugar...</option>
                      {memoryLocations.map(location => (
                        <option key={location.id} value={location.id}>
                          {location.title} ({location.code})
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {selectedLocationId ? (
                    locationHistory.length === 0 ? (
                      <div className="text-center py-6">
                        <p className="text-gray-400 text-sm">No hay cambios registrados para este lugar.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {locationHistory.map(entry => (
                          <div key={entry.id} className="bg-black/20 rounded-lg p-3 border border-gray-700/30">
                            <div className="flex justify-between items-start">
                              <span className="text-amber-300 text-xs">{formatDate(entry.timestamp)}</span>
                              <span className="bg-amber-500/30 text-amber-200 text-xs px-2 py-0.5 rounded-full">
                                Campo: {entry.changes.fieldChanged}
                              </span>
                            </div>
                            
                            <div className="mt-2 text-xs">
                              <div className="text-gray-400">Valor anterior:</div>
                              <div className="text-gray-300 bg-black/30 p-1.5 rounded mt-1 break-words">
                                {entry.changes.previousValue || <em className="text-gray-500">Sin valor previo</em>}
                              </div>
                              
                              <div className="text-gray-400 mt-2">Nuevo valor:</div>
                              <div className="text-gray-300 bg-black/30 p-1.5 rounded mt-1 break-words">
                                {entry.changes.newValue}
                              </div>
                            </div>
                            
                            <div className="mt-3 pt-2 border-t border-gray-700/30 flex justify-between items-center">
                              <span className="text-gray-400 text-xs">
                                Autor: {entry.author}
                              </span>
                              <span className="text-gray-300 text-xs">
                                {entry.comment}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )
                  ) : (
                    <div className="bg-black/10 p-5 rounded-lg">
                      <div className="text-center mb-4">
                        <HistoryIcon size={24} className="mx-auto text-amber-400 mb-2" />
                        <p className="text-gray-300 text-sm font-medium">
                          Selecciona un lugar para ver su historial de cambios
                        </p>
                      </div>
                      
                      <div className="flex flex-col space-y-2 mt-4 border-t border-gray-700/30 pt-3">
                        <h5 className="text-xs text-amber-300 font-medium">¿Cómo funciona el historial?</h5>
                        <div className="flex items-start gap-1.5">
                          <Clock size={12} className="text-amber-400 mt-0.5" />
                          <p className="text-gray-400 text-xs">Cada modificación queda registrada con fecha y autor</p>
                        </div>
                        <div className="flex items-start gap-1.5">
                          <BookOpen size={12} className="text-amber-400 mt-0.5" />
                          <p className="text-gray-400 text-xs">Puedes comparar versiones anteriores y actuales</p>
                        </div>
                        <div className="flex items-start gap-1.5">
                          <Shield size={12} className="text-amber-400 mt-0.5" />
                          <p className="text-gray-400 text-xs">Sistema inspirado en control de versiones Git</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Footer */}
            <div className="p-4 border-t border-gray-700/50 bg-gray-500/10">
              <div className="flex flex-col md:flex-row justify-between items-center gap-2">
                <div className="flex items-center gap-2">
                  <div className="bg-amber-500/20 p-1.5 rounded-full">
                    <Shield className="h-5 w-5 text-amber-400" />
                  </div>
                  <span className="text-gray-300 text-xs">
                    Sistema de protección de archivos digitales de memoria
                  </span>
                </div>
                
                <div className="flex gap-2">
                  <button 
                    className="text-xs px-3 py-1.5 bg-amber-600/30 text-amber-200 rounded-md hover:bg-amber-600/50 transition-colors flex items-center gap-1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M12 16v-4"/>
                      <path d="M12 8h.01"/>
                    </svg>
                    Tutorial
                  </button>
                  
                  <button 
                    className="text-xs px-3 py-1.5 bg-amber-600/30 text-amber-200 rounded-md hover:bg-amber-600/50 transition-colors flex items-center gap-1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 6H5a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h13l4-3.5L18 6Z"/>
                      <path d="M12 13v9"/>
                      <path d="M12 2v4"/>
                    </svg>
                    Reportar problema
                  </button>
                </div>
              </div>
              
              <div className="mt-3 pt-2 border-t border-gray-700/30 flex items-center justify-center">
                <div className="flex gap-4 text-[10px] text-gray-400">
                  <span className="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500">
                      <rect width="18" height="18" x="3" y="3" rx="2"/>
                      <path d="M12 8v8"/>
                      <path d="M8 12h8"/>
                    </svg>
                    Enviar comentarios
                  </span>
                  <span className="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500">
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                    Política de privacidad
                  </span>
                  <span className="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500">
                      <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                    Condiciones de uso
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GuardianesMemoria;