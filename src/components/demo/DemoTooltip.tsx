// src/components/demo/DemoTooltip.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { DemoStep } from './types';

interface DemoTooltipProps {
  step: DemoStep;
}

export const DemoTooltip: React.FC<DemoTooltipProps> = ({ step }) => {
  const Icon = step.icon;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="absolute top-full mt-8 left-1/2 transform -translate-x-1/2"
    >
      <div className="relative bg-black/70 backdrop-blur-md rounded-2xl p-6 w-96 border border-white/10">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-1 bg-white/20 rounded-full" />
        
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-lg bg-white/10">
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-light text-white mb-2">
              {step.title}
            </h3>
            <p className="text-white/70">
              {step.description}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};