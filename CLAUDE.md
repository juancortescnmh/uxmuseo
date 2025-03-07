# Project Guidelines for Memory Map

## Commands
- `npm run dev` - Start development server
- `npm run build` - Build the project (runs TypeScript compilation and Vite build)
- `npm run preview` - Preview the built application

## Code Style
- Use TypeScript with strict type checking
- Define interfaces in dedicated `types.ts` files
- Component file naming: PascalCase (e.g., `RadialMenu.tsx`)
- Interface naming: PascalCase with descriptive names (e.g., `LocationInfo`)
- Use absolute imports with `@/` alias (configured in vite.config.ts)
- Prefer functional components with React hooks
- Use named exports for components
- Include comment headers in files (e.g., `// src/components/demo/types.ts`)
- Follow ESLint configuration with React and TypeScript rules
- Maintain clean component architecture with small, focused components
- Style with TailwindCSS for consistent UI
- Use Framer Motion for animations

## Project Structure
- `/src/components` - React components
- `/src/data` - Static data files and constants
- `/src/utils` - Utility/helper functions
- `/src/services` - Service classes (e.g., MapService)
- `/src/types` - Shared TypeScript interfaces