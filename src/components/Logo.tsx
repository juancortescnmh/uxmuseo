// src/components/Logo.tsx
import React from 'react';

export const Logo: React.FC = () => {
  return (
    <div className="flex items-center text-white">
      <div className="mr-2">
        <svg width="48" height="48" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="58" stroke="white" strokeWidth="2" />
          <path d="M34 60C34 46.1929 45.1929 35 59 35C72.8071 35 84 46.1929 84 60C84 73.8071 72.8071 85 59 85" 
                stroke="white" strokeWidth="2" strokeLinecap="round" />
          <path d="M59 85C52.3726 85 47 79.6274 47 73C47 66.3726 52.3726 61 59 61C65.6274 61 71 66.3726 71 73" 
                stroke="white" strokeWidth="2" strokeLinecap="round" />
          <path d="M59 47C53.4772 47 49 51.4772 49 57C49 62.5228 53.4772 67 59 67C64.5228 67 69 62.5228 69 57" 
                stroke="white" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      <div className="leading-tight">
        <div className="text-sm font-semibold">Centro Nacional</div>
        <div className="text-xs">de Memoria Histórica</div>
      </div>
    </div>
  );
};