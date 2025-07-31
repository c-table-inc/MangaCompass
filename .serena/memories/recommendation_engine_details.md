# MangaCompass Recommendation Engine

## Algorithm Overview
The recommendation engine uses a weighted scoring system based on user preferences and manga attributes.

## Scoring Weights
- **Genre Match**: 40% - How well manga genres match user's favorite genres
- **Rating**: 30% - Manga rating score (higher ratings preferred)
- **Popularity**: 20% - Based on readership/popularity metrics
- **Status**: 10% - Preference for completed vs ongoing series

## Data Types

### Core Interfaces
- **Manga**: Contains id, title, author, genres[], status, volumes, rating, amazonLink, asin, imageUrl
- **User**: Contains readHistory[], favoriteGenres[], preferences
- **Recommendation**: Contains manga, score, reason, matchPercentage

### Genre System
- Fixed genre list defined in `MANGA_GENRES` constant
- Supports multiple genres per manga
- Genre matching uses array intersection

## Implementation Location
- Engine code: `src/lib/recommendations.ts`
- Mock data: `src/lib/mockData.ts`
- Type definitions: `src/lib/types.ts`

## Amazon Integration
- All recommendations include affiliate links
- Affiliate tag: `mangacompass-20`
- Link generation utility: `src/utils/affiliate.ts`

## User Data Storage
- User preferences stored in localStorage
- Key: `mangacompass_user_data`
- Persists between sessions
- No server-side storage needed