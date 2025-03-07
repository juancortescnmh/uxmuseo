import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/components/TourMessage.tsx
import { useState, useEffect } from 'react';
import { X, ChevronRight, MapPin, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
export const TourMessage = ({ title, message, location, icon = _jsx(MapPin, { className: "w-6 h-6 text-white" }), onClose, onNext, isLastStep = false, skipFunction }) => {
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const timer = setTimeout(() => setVisible(true), 500);
        return () => clearTimeout(timer);
    }, []);
    return (_jsx(AnimatePresence, { children: visible && (_jsxs(motion.div, { initial: { opacity: 0, y: 20, scale: 0.95 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: -20, scale: 0.95 }, transition: { duration: 0.6, ease: [0.19, 1, 0.22, 1] }, className: "tour-message-container", children: [_jsxs("div", { className: "tour-message-box", children: [_jsxs("div", { className: "tour-message-sidebar", children: [_jsx("div", { className: "tour-message-icon-container", children: icon }), _jsx("div", { className: "tour-message-vertical-line" })] }), _jsxs("div", { className: "tour-message-content", children: [_jsxs("div", { className: "tour-message-header", children: [location && (_jsx("div", { className: "tour-message-location", children: location })), title && (_jsx("h3", { className: "tour-message-title", children: title }))] }), _jsx("div", { className: "tour-message-body", children: _jsx("p", { children: message }) }), _jsxs("div", { className: "tour-message-footer", children: [skipFunction && title === "Mapa de la Memoria Histórica" && (_jsxs("button", { className: "px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 \n                      backdrop-blur-sm flex items-center gap-3 group transition-all duration-300 mr-3", onClick: skipFunction, children: [_jsx("span", { className: "text-white", children: "Ir al mapa" }), _jsx(ChevronRight, { className: "w-5 h-5 text-white group-hover:translate-x-1 transition-transform" })] })), onNext && (_jsxs("button", { className: "tour-message-next-btn", onClick: onNext, children: [_jsx("span", { children: isLastStep ? 'Finalizar recorrido' : 'Continuar' }), _jsx(ArrowRight, { className: "tour-message-next-icon" })] }))] })] }), onClose && (_jsx("button", { className: "tour-message-close", onClick: onClose, children: _jsx(X, { size: 18 }) }))] }), _jsx("div", { className: "tour-message-floating-shape" })] })) }));
};
