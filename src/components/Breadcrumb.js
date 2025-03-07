import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/components/Breadcrumb.tsx
import React from 'react';
import { ChevronRight } from 'lucide-react';
const Breadcrumb = ({ items }) => {
    return (_jsx("div", { className: "absolute top-20 left-6 z-40 flex items-center text-white/80 text-sm", children: items.map((item, index) => (_jsxs(React.Fragment, { children: [index > 0 && _jsx(ChevronRight, { size: 14, className: "mx-1 opacity-60" }), item.href ? (_jsx("a", { href: item.href, className: `hover:underline ${index === items.length - 1 ? 'text-amber-300 font-medium' : 'opacity-80'}`, children: item.label })) : (_jsx("span", { className: index === items.length - 1 ? 'text-amber-300 font-medium' : 'opacity-80', children: item.label }))] }, index))) }));
};
export default Breadcrumb;
