import React, { useState } from 'react';
import { Play, ChevronRight } from 'lucide-react';

interface PreloaderProps {
  onStart: () => void;
}

const Preloader: React.FC<PreloaderProps> = ({ onStart }) => {
  const [videoPlayed, setVideoPlayed] = useState(false);
  
  const handleVideoEnd = () => {
    setVideoPlayed(true);
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black">
      {/* Video Container - Ocupa la mayoría del espacio disponible */}
      <div className="w-full h-screen flex flex-col items-center justify-center relative">
        {/* Overlay superior con título */}
        <div className="absolute top-0 left-0 right-0 p-8 bg-gradient-to-b from-black via-black/70 to-transparent z-10">
          <h1 className="text-4xl font-light tracking-wide text-white/90 text-center">
            Lugares de Memoria
          </h1>
          <p className="text-xl text-white/60 text-center mt-2">
            Centro Nacional de Memoria Histórica
          </p>
        </div>

        {/* Contenedor del Video Principal */}
        <div className="w-full h-full flex items-center justify-center relative">
          {/* Placeholder del video con proporción 16:9 */}
          <div className="w-full h-full relative overflow-hidden bg-black">
            <div className="absolute inset-0 flex items-center justify-center">
              <img 
                src="/api/placeholder/1920/1080"
                alt="Video Placeholder"
                className="w-full h-full object-cover opacity-50"
              />
              
              {/* Overlay con botón de play si el video no se ha reproducido */}
              {!videoPlayed && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer"
                     onClick={() => setVideoPlayed(true)}>
                  <button className="w-24 h-24 rounded-full bg-white/20 hover:bg-white/30 
                    flex items-center justify-center transition-all duration-300 
                    transform hover:scale-110">
                    <Play className="w-12 h-12 text-white" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Overlay inferior con botón de continuar */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/70 to-transparent">
          <div className="container mx-auto p-8">
            {videoPlayed ? (
              <div className="flex flex-col items-center space-y-6">
                <button
                  onClick={onStart}
                  className="group px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 
                    backdrop-blur-sm flex items-center gap-3 transform hover:scale-105 
                    transition-all duration-300"
                >
                  <span className="text-xl text-white">Comenzar Recorrido</span>
                  <ChevronRight className="w-6 h-6 text-white group-hover:translate-x-2 transition-transform" />
                </button>
              </div>
            ) : (
              <p className="text-xl text-white/60 text-center">
                Reproduce el video para continuar...
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preloader;