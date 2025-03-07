// src/components/RadialMenu/helpers.ts
/**
 * Convierte un ángulo en grados + un radio a coordenadas cartesianas (x, y),
 * asumiendo el centro en (centerX, centerY).
 *
 * @param radius   Radio del círculo donde quieres ubicar el punto
 * @param angleInDegrees  Ángulo en grados (0° = eje X positivo, sentido horario)
 * @param centerX  Coordenada X del centro (por defecto 300)
 * @param centerY  Coordenada Y del centro (por defecto 300)
 */
export function polarToCartesian(radius, angleInDegrees, centerX = 300, centerY = 300) {
    // Ajuste: el ángulo 0° lo consideramos arriba (eje Y negativo) y crece en sentido horario
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180;
    const x = centerX + radius * Math.cos(angleInRadians);
    const y = centerY + radius * Math.sin(angleInRadians);
    return { x, y };
}
/**
 * Genera el path SVG para dibujar un sector de anillo (arco exterior e interior).
 */
export function createArcPath(startAngle, endAngle, outerRadius, innerRadius, centerX = 300, centerY = 300) {
    // Coordenadas del arco exterior
    const startOuter = polarToCartesian(outerRadius, startAngle, centerX, centerY);
    const endOuter = polarToCartesian(outerRadius, endAngle, centerX, centerY);
    // Coordenadas del arco interior (en orden inverso para cerrar el sector)
    const startInner = polarToCartesian(innerRadius, endAngle, centerX, centerY);
    const endInner = polarToCartesian(innerRadius, startAngle, centerX, centerY);
    // ¿Es mayor de 180°? => largeArcFlag = 1
    const largeArcFlagOuter = (endAngle - startAngle) <= 180 ? 0 : 1;
    const largeArcFlagInner = (endAngle - startAngle) <= 180 ? 0 : 1;
    // Barrido en sentido horario => sweepFlag = 1
    // El arco interior lo dibujamos con sweepFlag = 0 (inverso)
    return `
    M ${startOuter.x},${startOuter.y}
    A ${outerRadius},${outerRadius} 0 ${largeArcFlagOuter} 1 ${endOuter.x},${endOuter.y}
    L ${startInner.x},${startInner.y}
    A ${innerRadius},${innerRadius} 0 ${largeArcFlagInner} 0 ${endInner.x},${endInner.y}
    Z
  `;
}
/**
 * Genera un path para colocar texto curvo (sin grosor, sólo el arco).
 * Útil para usar <textPath> con startOffset="50%" y textAnchor="middle".
 */
export function createTextArcPath(startAngle, endAngle, radius, centerX, centerY) {
    const start = polarToCartesian(radius, startAngle, centerX, centerY);
    const end = polarToCartesian(radius, endAngle, centerX, centerY);
    const angleDiff = endAngle - startAngle;
    const largeArcFlag = angleDiff <= 180 ? 0 : 1;
    // Sentido horario => sweepFlag = 1
    const sweepFlag = 1;
    return `
    M ${start.x},${start.y}
    A ${radius},${radius} 0 ${largeArcFlag} ${sweepFlag} ${end.x},${end.y}
  `;
}
/**
 * Genera un ID de gradiente para macro o memory, por ejemplo:
 * "gradient-macro-pacifico".
 */
export function createGradientId(type, id) {
    return `gradient-${type}-${id}`;
}
/**
 * Objeto que agrupa todas las funciones anteriores
 */
export const radialHelpers = {
    polarToCartesian,
    createArcPath,
    createTextArcPath,
    createGradientId,
};
