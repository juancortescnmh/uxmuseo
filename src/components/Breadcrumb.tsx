// src/components/Breadcrumb.tsx
import React from 'react';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbProps {
  items: {
    label: string;
    href?: string;
  }[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <div className="absolute top-20 left-6 z-40 flex items-center text-white/80 text-sm">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && <ChevronRight size={14} className="mx-1 opacity-60" />}
          {item.href ? (
            <a 
              href={item.href} 
              className={`hover:underline ${index === items.length - 1 ? 'text-amber-300 font-medium' : 'opacity-80'}`}
            >
              {item.label}
            </a>
          ) : (
            <span className={index === items.length - 1 ? 'text-amber-300 font-medium' : 'opacity-80'}>
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default Breadcrumb;