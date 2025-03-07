import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { motion } from 'framer-motion';
import { MapPin, ChevronRight } from 'lucide-react';
const LocationContext = ({ currentLocation, isActive }) => {
    if (!isActive || !currentLocation)
        return null;
    return (_jsx(motion.div, { initial: { opacity: 0, y: -10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 }, transition: { duration: 0.3 }, className: "bg-black/60 backdrop-blur-md rounded-full px-4 py-2\n                 border border-white/15 shadow-lg mt-4\n                 max-w-md w-full md:w-auto", children: _jsxs("div", { className: "flex items-center justify-center gap-2 text-white", children: [_jsx(MapPin, { size: 16, className: "text-amber-400" }), _jsxs("span", { className: "text-sm text-white/90", children: [currentLocation.name || 'Ubicación actual', ":"] }), _jsxs("div", { className: "flex items-center gap-1 text-sm", children: [currentLocation.region && (_jsx("span", { className: "text-amber-200", children: currentLocation.region })), currentLocation.department && (_jsxs(_Fragment, { children: [_jsx(ChevronRight, { size: 12, className: "text-white/50" }), _jsx("span", { className: "text-white", children: currentLocation.department })] })), currentLocation.coordinates && (_jsxs("span", { className: "ml-2 text-white/60 hidden md:inline-block", children: ["(", currentLocation.coordinates[0].toFixed(2), ", ", currentLocation.coordinates[1].toFixed(2), ")"] }))] })] }) }));
};
export default LocationContext;
