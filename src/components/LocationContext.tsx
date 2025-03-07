// src/components/LocationContext.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, ChevronRight } from 'lucide-react';

interface LocationContextProps {
  currentLocation: {
    region?: string;
    department?: string;
    coordinates?: [number, number];
    name?: string;
  };
  isActive: boolean;
}

const LocationContext: React.FC<LocationContextProps> = ({ currentLocation, isActive }) => {
  if (!isActive || !currentLocation) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="bg-black/60 backdrop-blur-md rounded-full px-4 py-2
                 border border-white/15 shadow-lg mt-4
                 max-w-md w-full md:w-auto"
    >
      <div className="flex items-center justify-center gap-2 text-white">
        <MapPin size={16} className="text-amber-400" />
        <span className="text-sm text-white/90">
          {currentLocation.name || 'Ubicación actual'}:
        </span>
        
        <div className="flex items-center gap-1 text-sm">
          {currentLocation.region && (
            <span className="text-amber-200">
              {currentLocation.region}
            </span>
          )}
          
          {currentLocation.department && (
            <>
              <ChevronRight size={12} className="text-white/50" />
              <span className="text-white">
                {currentLocation.department}
              </span>
            </>
          )}
          
          {currentLocation.coordinates && (
            <span className="ml-2 text-white/60 hidden md:inline-block">
              ({currentLocation.coordinates[0].toFixed(2)}, {currentLocation.coordinates[1].toFixed(2)})
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default LocationContext;