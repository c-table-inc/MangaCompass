# MangaCompass Code Style & Conventions

## TypeScript Configuration
- Strict mode enabled
- Module resolution: bundler
- Target: ES6
- JSX: preserve

## Component Structure
- Functional components with React.FC type
- Props interfaces defined with explicit types
- Component files use PascalCase (e.g., Button.tsx, MangaCard.tsx)
- Destructured props with default values

## Styling Conventions
- Tailwind CSS for all styling
- Component classes organized with template literals
- Base classes → variant classes → size classes → conditional classes
- Mobile-first responsive design approach

## File Organization
```
src/
├── app/         # Next.js 14 App Router pages
├── components/  # Reusable UI components
│   ├── layout/  # Layout components
│   ├── manga/   # Manga-specific components
│   ├── recommendation/ # Recommendation components
│   └── ui/      # Generic UI components
├── lib/         # Core business logic & data
└── utils/       # Utility functions
```

## Import Conventions
- Use path aliases: `@/components/...` instead of relative paths
- Group imports: React → Next.js → Third-party → Local

## Component Patterns
- Export default for page components
- Named exports for other components
- Props interface defined above component
- Loading states handled with conditional rendering
- Icon components from lucide-react

## Data Types
- All main types defined in `lib/types.ts`
- Use TypeScript interfaces (not types) for object shapes
- Enum-like constants for fixed values (e.g., MANGA_GENRES)