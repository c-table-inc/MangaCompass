# MangaCompass Project Structure

## Root Directory
```
MangaCompass/
├── src/                    # Source code
├── public/                 # Static assets
├── docs/                   # Documentation & development logs
├── .serena/               # Serena configuration
├── .claude/               # Claude configuration
├── package.json           # Project dependencies
├── tsconfig.json          # TypeScript configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── next.config.js         # Next.js configuration
├── postcss.config.js      # PostCSS configuration
├── .eslintrc.json         # ESLint rules
├── CLAUDE.md              # Project instructions
└── requirements.md        # Project requirements
```

## Source Directory Structure
```
src/
├── app/                   # Next.js App Router pages
│   ├── page.tsx          # Landing page
│   ├── layout.tsx        # Root layout
│   ├── dashboard/        
│   │   └── page.tsx      # Recommendation dashboard
│   ├── onboarding/       
│   │   └── page.tsx      # User preference setup
│   └── not-found.tsx     # 404 page
├── components/           # React components
│   ├── layout/          # Header, Footer, MobileNav
│   ├── manga/           # MangaCard, MangaGrid, MangaSelector
│   ├── recommendation/  # RecommendationCard, RecommendationGrid
│   └── ui/              # Button, Card, Badge, Input
├── lib/                 # Core logic
│   ├── mockData.ts      # 50+ manga mock data
│   ├── types.ts         # TypeScript type definitions
│   └── recommendations.ts # Recommendation engine
└── utils/               # Utilities
    ├── affiliate.ts     # Amazon affiliate link generation
    └── analytics.ts     # Demo analytics functionality
```

## Key Data Flow
1. User lands on homepage (`app/page.tsx`)
2. Navigates to onboarding (`app/onboarding/page.tsx`)
3. Selects manga and genres (stored in localStorage)
4. Redirected to dashboard (`app/dashboard/page.tsx`)
5. Recommendation engine processes preferences
6. Displays personalized recommendations with affiliate links