import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { colombiaRegions } from '../../data/regions';
import { MENU_CONFIG } from './config';
import { createArcPath, createTextArcPath, } from './helpers';
const DeptSection = ({ selectedMacro, hoveredItem, highlightSection, onHover, onSelect }) => {
    if (!selectedMacro)
        return null;
    const { outer, inner } = MENU_CONFIG.dimensions.rings.department;
    const center = MENU_CONFIG.dimensions.viewBox.center;
    const textRadius = (outer + inner) / 2;
    const departments = colombiaRegions[selectedMacro].departments;
    const itemCount = departments.length;
    const anglePerItem = 360 / itemCount;
    const isHighlighted = highlightSection === 'department';
    return (_jsx(_Fragment, { children: departments.map((dept, index) => {
            const startAngle = index * anglePerItem;
            const endAngle = startAngle + anglePerItem;
            const isHovered = hoveredItem === `dept-${dept.id}`;
            // ID único para la trayectoria del texto
            const textArcId = `dept-textarc-${dept.id}`;
            return (_jsxs("g", { onMouseEnter: () => onHover(`dept-${dept.id}`), onMouseLeave: () => onHover(null), onClick: () => onSelect('department', dept.id), style: { cursor: 'pointer' }, className: "transition-transform duration-300 hover:scale-[1.02]", children: [_jsx("path", { d: createArcPath(startAngle, endAngle, outer, inner, center, center), fill: "rgba(255,255,255,0.08)", stroke: "rgba(255,255,255,0.3)", strokeWidth: 0.5, className: `
                transition-all duration-300 ease-out
                ${isHovered || isHighlighted ? 'filter brightness-110' : ''}
              ` }), _jsx("defs", { children: _jsx("path", { id: textArcId, fill: "none", stroke: "none", d: createTextArcPath(startAngle, endAngle, textRadius, center, center) }) }), _jsx("text", { fill: "white", fontSize: "8", fontWeight: "400", opacity: "0.9", children: _jsx("textPath", { href: `#${textArcId}`, startOffset: "50%", textAnchor: "middle", children: dept.name }) })] }, `dept-${dept.id}`));
        }) }));
};
export default DeptSection;
