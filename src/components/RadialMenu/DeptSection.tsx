// src/components/RadialMenu/DeptSection.tsx

import React from 'react';
import { colombiaRegions, type MacroRegion } from '../../data/regions';
import { MENU_CONFIG } from './config';
import {
  createArcPath,
  createTextArcPath,
} from './helpers';

interface DeptSectionProps {
  selectedMacro: MacroRegion | null;
  hoveredItem: string | null;
  highlightSection?: string;
  onHover: (id: string | null) => void;
  onSelect: (type: 'department', id: string) => void;
}

const DeptSection: React.FC<DeptSectionProps> = ({
  selectedMacro,
  hoveredItem,
  highlightSection,
  onHover,
  onSelect
}) => {
  if (!selectedMacro) return null;

  const { outer, inner } = MENU_CONFIG.dimensions.rings.department;
  const center = MENU_CONFIG.dimensions.viewBox.center;
  const textRadius = (outer + inner) / 2;

  const departments = colombiaRegions[selectedMacro].departments;
  const itemCount = departments.length;
  const anglePerItem = 360 / itemCount;
  const isHighlighted = highlightSection === 'department';

  return (
    <>
      {departments.map((dept, index) => {
        const startAngle = index * anglePerItem;
        const endAngle = startAngle + anglePerItem;
        const isHovered = hoveredItem === `dept-${dept.id}`;

        // ID único para la trayectoria del texto
        const textArcId = `dept-textarc-${dept.id}`;

        return (
          <g
            key={`dept-${dept.id}`}
            onMouseEnter={() => onHover(`dept-${dept.id}`)}
            onMouseLeave={() => onHover(null)}
            onClick={() => onSelect('department', dept.id)}
            style={{ cursor: 'pointer' }}
            className="transition-transform duration-300 hover:scale-[1.02]"
          >
            {/* Arco para el departamento */}
            <path
              d={createArcPath(startAngle, endAngle, outer, inner, center, center)}
              fill="rgba(255,255,255,0.08)"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth={0.5}
              className={`
                transition-all duration-300 ease-out
                ${isHovered || isHighlighted ? 'filter brightness-110' : ''}
              `}
            />

            {/* Definición de la trayectoria para texto */}
            <defs>
              <path
                id={textArcId}
                fill="none"
                stroke="none"
                d={createTextArcPath(
                  startAngle,
                  endAngle,
                  textRadius,
                  center,
                  center
                )}
              />
            </defs>

            {/* Texto curvo */}
            <text
              fill="white"
              fontSize="8"
              fontWeight="400"
              opacity="0.9"
            >
              <textPath
                href={`#${textArcId}`}
                startOffset="50%"
                textAnchor="middle"
              >
                {dept.name}
              </textPath>
            </text>
          </g>
        );
      })}
    </>
  );
};

export default DeptSection;