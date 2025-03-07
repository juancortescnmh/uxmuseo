import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from 'framer-motion';
import { MENU_CONFIG } from './config';
const CenterSection = ({ highlightSection, onClick, isDemoMode = false }) => {
    const { center } = MENU_CONFIG.dimensions.viewBox;
    const rCenter = MENU_CONFIG.dimensions.rings.center;
    const isHighlighted = highlightSection === 'center';
    return (_jsxs(motion.g, { onClick: onClick, style: { cursor: 'pointer' }, whileHover: { scale: 1.1 }, whileTap: { scale: 0.98 }, initial: { scale: 0.9, opacity: 0 }, animate: { scale: 1, opacity: 1 }, transition: { duration: 0.5, ease: "easeOut" }, children: [_jsx("circle", { cx: center, cy: center, r: rCenter, fill: "url(#centerGradient)", stroke: "rgba(255,255,255,0.15)", strokeWidth: isHighlighted ? 2 : 1, className: `
          transition-all duration-300 ease-out
          ${isHighlighted ? 'filter drop-shadow(0 0 6px rgba(255,255,255,0.3))' : ''}
        ` }), _jsx("circle", { cx: center, cy: center, r: rCenter - 10, fill: "none", stroke: "rgba(255,255,255,0.15)", strokeWidth: 1 }), _jsx("text", { x: center, y: center - 12, textAnchor: "middle", dominantBaseline: "middle", fill: "white", fontSize: "14", fontWeight: "500", letterSpacing: "1", children: "LUGARES" }), _jsx("text", { x: center, y: center + 3, textAnchor: "middle", dominantBaseline: "middle", fill: "white", fontSize: "14", fontWeight: "500", letterSpacing: "1", children: "DE" }), _jsx("text", { x: center, y: center + 18, textAnchor: "middle", dominantBaseline: "middle", fill: "white", fontSize: "14", fontWeight: "500", letterSpacing: "1", children: "MEMORIA" })] }));
};
export default CenterSection;
