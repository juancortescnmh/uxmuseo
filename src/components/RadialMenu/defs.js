import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { MENU_CONFIG } from './config';
import { radialHelpers } from './helpers';
export const RadialMenuDefs = () => {
    const { center } = MENU_CONFIG.dimensions.viewBox;
    const rCenter = MENU_CONFIG.dimensions.rings.center;
    const macroColors = MENU_CONFIG.colors.macro;
    return (_jsxs("defs", { children: [_jsxs("radialGradient", { id: "centerGradient", gradientUnits: "userSpaceOnUse", cx: center, cy: center, r: rCenter, children: [_jsx("stop", { offset: "0%", stopColor: "rgba(255,255,255,0.2)" }), _jsx("stop", { offset: "100%", stopColor: "rgba(255,255,255,0.08)" })] }), _jsxs("filter", { id: "glow", x: "-20%", y: "-20%", width: "140%", height: "140%", children: [_jsx("feGaussianBlur", { stdDeviation: "2", result: "blur" }), _jsx("feComposite", { in: "SourceGraphic", in2: "blur", operator: "over" })] }), _jsxs("filter", { id: "glass", x: "-10%", y: "-10%", width: "120%", height: "120%", children: [_jsx("feGaussianBlur", { in: "SourceGraphic", stdDeviation: "1", result: "blur" }), _jsx("feComposite", { in: "SourceGraphic", in2: "blur", operator: "over", result: "composite" })] }), Object.entries(macroColors).map(([id, colors]) => (_jsxs("radialGradient", { id: radialHelpers.createGradientId('macro', id), gradientUnits: "userSpaceOnUse", cx: center, cy: center, r: MENU_CONFIG.dimensions.rings.macro.outer, children: [_jsx("stop", { offset: "0%", stopColor: colors.gradientStart, stopOpacity: "0.7" }), _jsx("stop", { offset: "100%", stopColor: colors.gradientEnd, stopOpacity: "0.5" })] }, `gradient-macro-${id}`)))] }));
};
