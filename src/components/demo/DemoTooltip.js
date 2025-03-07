import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from 'framer-motion';
export const DemoTooltip = ({ step }) => {
    const Icon = step.icon;
    return (_jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 }, className: "absolute top-full mt-8 left-1/2 transform -translate-x-1/2", children: _jsxs("div", { className: "relative bg-black/70 backdrop-blur-md rounded-2xl p-6 w-96 border border-white/10", children: [_jsx("div", { className: "absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-1 bg-white/20 rounded-full" }), _jsxs("div", { className: "flex items-start gap-4", children: [_jsx("div", { className: "p-3 rounded-lg bg-white/10", children: _jsx(Icon, { className: "w-6 h-6 text-white" }) }), _jsxs("div", { children: [_jsx("h3", { className: "text-xl font-light text-white mb-2", children: step.title }), _jsx("p", { className: "text-white/70", children: step.description })] })] })] }) }));
};
