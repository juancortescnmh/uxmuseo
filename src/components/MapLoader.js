import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/components/MapLoader.tsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
const MapLoader = ({ isLoading, progress }) => {
    const [dots, setDots] = useState('.');
    // Animación de puntos suspensivos
    useEffect(() => {
        if (!isLoading)
            return;
        const interval = setInterval(() => {
            setDots(prev => prev.length >= 3 ? '.' : prev + '.');
        }, 500);
        return () => clearInterval(interval);
    }, [isLoading]);
    if (!isLoading)
        return null;
    return (_jsxs(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, className: "fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/80 backdrop-blur-md", children: [_jsxs("div", { className: "relative w-40 h-40 flex items-center justify-center", children: [_jsxs("svg", { className: "absolute inset-0", viewBox: "0 0 100 100", children: [_jsx("circle", { cx: "50", cy: "50", r: "45", fill: "none", stroke: "rgba(255,255,255,0.1)", strokeWidth: "5" }), _jsx("circle", { cx: "50", cy: "50", r: "45", fill: "none", stroke: "rgba(255,255,255,0.9)", strokeWidth: "5", strokeDasharray: "283", strokeDashoffset: 283 - (283 * progress / 100), strokeLinecap: "round", transform: "rotate(-90 50 50)", style: { transition: 'stroke-dashoffset 0.5s ease' } })] }), _jsx("div", { className: "absolute", children: _jsxs("svg", { width: "48", height: "48", viewBox: "0 0 120 120", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [_jsx("circle", { cx: "60", cy: "60", r: "58", stroke: "white", strokeWidth: "2" }), _jsx("path", { d: "M34 60C34 46.1929 45.1929 35 59 35C72.8071 35 84 46.1929 84 60C84 73.8071 72.8071 85 59 85", stroke: "white", strokeWidth: "2", strokeLinecap: "round" }), _jsx("path", { d: "M59 85C52.3726 85 47 79.6274 47 73C47 66.3726 52.3726 61 59 61C65.6274 61 71 66.3726 71 73", stroke: "white", strokeWidth: "2", strokeLinecap: "round" }), _jsx("path", { d: "M59 47C53.4772 47 49 51.4772 49 57C49 62.5228 53.4772 67 59 67C64.5228 67 69 62.5228 69 57", stroke: "white", strokeWidth: "2", strokeLinecap: "round" })] }) })] }), _jsxs("div", { className: "text-white text-xl mt-6 font-light", children: ["Cargando mapa", dots] }), _jsxs("div", { className: "text-white/70 text-sm mt-2", children: [Math.floor(progress), "% completado"] }), _jsx("div", { className: "absolute bottom-6 text-white/50 text-xs", children: "Centro Nacional de Memoria Hist\u00F3rica" })] }));
};
export default MapLoader;
