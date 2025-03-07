import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/components/NotificacionesGuardianes.tsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Shield, ExternalLink } from 'lucide-react';
import { getPendingNotificationsCount } from '../utils/memoryHistory';
const NotificacionesGuardianes = ({ onClick }) => {
    const [notificationCount, setNotificationCount] = useState(0);
    const [showTooltip, setShowTooltip] = useState(false);
    // Simular carga de notificaciones
    useEffect(() => {
        // Carga inicial
        setNotificationCount(getPendingNotificationsCount());
        // Simulación de notificaciones periódicas
        const interval = setInterval(() => {
            // Simular una notificación aleatoria cada 30-60 segundos
            if (Math.random() > 0.7) {
                setNotificationCount(prev => prev + 1);
            }
        }, 30000);
        return () => clearInterval(interval);
    }, []);
    return (_jsxs("div", { className: "relative", children: [_jsxs("button", { onClick: onClick, onMouseEnter: () => setShowTooltip(true), onMouseLeave: () => setShowTooltip(false), className: "p-2 text-white rounded-full hover:bg-white/10 transition-all relative flex items-center gap-1", children: [_jsx(Shield, { size: 20, className: "text-amber-400" }), _jsx("span", { className: "text-sm font-medium hidden md:inline", children: "Guardianes" }), notificationCount > 0 && (_jsx("span", { className: "absolute -top-1 -right-1 bg-amber-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center border border-black/10", children: notificationCount > 9 ? '9+' : notificationCount }))] }), _jsx(AnimatePresence, { children: showTooltip && (_jsx(motion.div, { initial: { opacity: 0, y: 5 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 5 }, className: "absolute top-full right-0 mt-2 w-64 bg-gray-800/90 backdrop-blur-md text-white rounded-md shadow-lg border border-amber-500/20 z-50", children: _jsxs("div", { className: "p-3", children: [_jsxs("h3", { className: "text-sm font-medium flex items-center gap-1.5", children: [_jsx(Shield, { size: 14, className: "text-amber-400" }), "Guardianes de la Memoria"] }), _jsx("p", { className: "text-xs text-gray-300 mt-1", children: "Sistema de monitoreo y protecci\u00F3n para lugares y archivos de memoria hist\u00F3rica." }), notificationCount > 0 && (_jsx("div", { className: "mt-2 pt-2 border-t border-gray-700/50", children: _jsxs("div", { className: "flex items-center gap-1.5 text-xs text-amber-300", children: [_jsx(Bell, { size: 12 }), notificationCount, " ", notificationCount === 1 ? 'cambio' : 'cambios', " pendiente", notificationCount === 1 ? '' : 's', " de revisi\u00F3n"] }) })), _jsx("div", { className: "mt-2 pt-2 text-right", children: _jsxs("button", { onClick: onClick, className: "text-xs text-amber-300 hover:text-amber-200 flex items-center gap-1 ml-auto", children: ["Ver panel ", _jsx(ExternalLink, { size: 10 })] }) })] }) })) })] }));
};
export default NotificacionesGuardianes;
