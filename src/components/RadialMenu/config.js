// src/components/RadialMenu/config.ts
export const MENU_CONFIG = {
    dimensions: {
        viewBox: {
            width: 600,
            height: 600,
            center: 300
        },
        rings: {
            memory: {
                outer: 250,
                inner: 195
            },
            department: {
                outer: 185,
                inner: 130
            },
            macro: {
                outer: 120,
                inner: 70
            },
            center: 60
        }
    },
    colors: {
        // Colores para macroregiones
        macro: {
            pacifico: {
                base: '#57CACC',
                hover: '#7DE4E6',
                gradientStart: '#57CACC',
                gradientEnd: '#188889'
            },
            amazonia: {
                base: '#6BD88B',
                hover: '#96E8AE',
                gradientStart: '#6BD88B',
                gradientEnd: '#35974E'
            },
            andina: {
                base: '#D4A76A',
                hover: '#E8C28A',
                gradientStart: '#D4A76A',
                gradientEnd: '#B07D3A'
            },
            caribe: {
                base: '#F9B45C',
                hover: '#FFC785',
                gradientStart: '#F9B45C',
                gradientEnd: '#D97A1F'
            },
            orinoquia: {
                base: '#D76D6D',
                hover: '#F79090',
                gradientStart: '#D76D6D',
                gradientEnd: '#A33030'
            }
        },
        // Colores para tipos de memoria
        memory: {
            identificados: {
                base: '#ffffff',
                hover: '#ffffff'
            },
            caracterizados: {
                base: '#ffffff',
                hover: '#ffffff'
            },
            solicitud: {
                base: '#ffffff',
                hover: '#ffffff'
            },
            horror: {
                base: '#ffffff',
                hover: '#ffffff'
            },
            sanaciones: {
                base: '#ffffff',
                hover: '#ffffff'
            }
        }
    },
    styles: {
        text: {
            macro: 'text-sm font-semibold uppercase',
            department: 'text-xs font-medium',
            memory: 'text-xs font-medium uppercase'
        }
    }
};
