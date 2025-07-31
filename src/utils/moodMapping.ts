import { Manga, MoodType, MOOD_CATEGORIES } from '@/lib/types';

/**
 * Mood-based recommendation system mapping and utility class
 */
export class MoodMapper {
  /**
   * Get genre weights from mood
   */
  getGenreWeights(mood: MoodType): Record<string, number> {
    return mood.genreWeights;
  }

  /**
   * Filter works based on mood
   * Prioritize extraction of works with genres related to mood
   */
  filterMangaByMood(manga: Manga[], mood: MoodType, limit: number = 50): Manga[] {
    const weights = this.getGenreWeights(mood);
    
    // Calculate mood compatibility for each manga
    const scoredManga = manga.map(m => ({
      manga: m,
      moodScore: this.calculateMoodMatch(m, mood)
    }))
    .filter(item => item.moodScore > 0) // Exclude completely unrelated works
    .sort((a, b) => b.moodScore - a.moodScore); // Sort by compatibility score

    return scoredManga.slice(0, limit).map(item => item.manga);
  }

  /**
   * Calculate mood compatibility
   * Calculate score based on manga genres and selected mood weighting
   */
  calculateMoodMatch(manga: Manga, mood: MoodType): number {
    const weights = this.getGenreWeights(mood);
    let totalScore = 0;
    let matchedGenres = 0;

    // Calculate weighted score for each manga genre
    for (const genre of manga.genres) {
      if (weights[genre]) {
        totalScore += weights[genre];
        matchedGenres++;
      }
    }

    // Return 0 if no genre match
    if (matchedGenres === 0) {
      return 0;
    }

    // Calculate average score (0-1 range)
    const averageScore = totalScore / matchedGenres;
    
    // Multi-genre match bonus (max 1.2x)
    const genreBonus = Math.min(1.2, 1 + (matchedGenres - 1) * 0.1);
    
    return Math.min(1.0, averageScore * genreBonus);
  }

  /**
   * Generate recommendation reason
   * Generate natural recommendation reasons based on mood and manga characteristics
   */
  generateMoodReason(manga: Manga, mood: MoodType, score: number): string {
    const weights = this.getGenreWeights(mood);
    const matchedGenres: string[] = [];
    
    // Extract matched genres
    for (const genre of manga.genres) {
      if (weights[genre] && weights[genre] > 0.5) {
        matchedGenres.push(genre);
      }
    }

    // Reason templates by mood
    const reasonTemplates: Record<string, string[]> = {
      adventure: [
        `Adventure awaits with ${matchedGenres.join(' & ')} elements`,
        `Epic ${matchedGenres[0]} story satisfies your adventurous spirit`,
        `Exploring unknown worlds through ${matchedGenres.join(' & ')} is captivating`
      ],
      relax: [
        `Relaxing read with ${matchedGenres.join(' & ')} elements`,
        `Soothing ${matchedGenres[0]} for peaceful moments`,
        `Gentle ${matchedGenres.join(' & ')} atmosphere is charming`
      ],
      excitement: [
        `Thrilling excitement with ${matchedGenres.join(' & ')}`,
        `Action-packed ${matchedGenres[0]} scenes to enjoy`,
        `Passionate ${matchedGenres.join(' & ')} development is captivating`
      ],
      emotional: [
        `Deep emotional impact with ${matchedGenres.join(' & ')}`,
        `Heart-touching ${matchedGenres[0]} story`,
        `Emotionally rich ${matchedGenres.join(' & ')} resonates deeply`
      ],
      thoughtful: [
        `Deep themes in ${matchedGenres.join(' & ')} make you think`,
        `Philosophical ${matchedGenres[0]} elements are impressive`,
        `Thoughtful ${matchedGenres.join(' & ')} content is appealing`
      ],
      thrilling: [
        `Heart-pounding suspense with ${matchedGenres.join(' & ')}`,
        `Tension-filled ${matchedGenres[0]} development to enjoy`,
        `Thrilling ${matchedGenres.join(' & ')} is captivating`
      ],
      nostalgic: [
        `Nostalgic atmosphere with ${matchedGenres.join(' & ')}`,
        `Nostalgic ${matchedGenres[0]} setting is charming`,
        `Warm ${matchedGenres.join(' & ')} world is comforting`
      ],
      light: [
        `Light enjoyment with ${matchedGenres.join(' & ')}`,
        `Light ${matchedGenres[0]} for a mood change`,
        `Bright ${matchedGenres.join(' & ')} atmosphere is appealing`
      ]
    };

    const templates = reasonTemplates[mood.id] || [`${matchedGenres.join(' & ')} perfect for ${mood.name}`];
    const reasonIndex = Math.floor(Math.random() * templates.length);
    let reason = templates[reasonIndex];

    // Add rating info for highly rated works
    if (manga.rating >= 8.0) {
      reason += ` (Rating ${manga.rating}/10)`;
    }

    // Add popularity info for popular works
    if (manga.popularity >= 80) {
      reason += ' • Popular';
    }

    return reason;
  }

  /**
   * Get mood object from mood ID
   */
  getMoodById(moodId: string): MoodType | undefined {
    return MOOD_CATEGORIES.find(mood => mood.id === moodId);
  }

  /**
   * Integrate weighting of multiple moods
   * For future feature expansion (multiple mood selection support)
   */
  combineGenreWeights(moods: MoodType[], weights: number[] = []): Record<string, number> {
    const defaultWeights = moods.map(() => 1 / moods.length);
    const actualWeights = weights.length === moods.length ? weights : defaultWeights;
    
    const combined: Record<string, number> = {};
    
    moods.forEach((mood, index) => {
      const moodWeights = this.getGenreWeights(mood);
      const weight = actualWeights[index];
      
      Object.entries(moodWeights).forEach(([genre, genreWeight]) => {
        combined[genre] = (combined[genre] || 0) + (genreWeight * weight);
      });
    });

    return combined;
  }

  /**
   * Mood matching considering reading history to improve recommendation accuracy
   */
  calculateHistoryInfluencedMoodMatch(
    manga: Manga, 
    mood: MoodType, 
    readHistory: Manga[]
  ): number {
    const baseMoodMatch = this.calculateMoodMatch(manga, mood);
    
    if (readHistory.length === 0) {
      return baseMoodMatch;
    }

    // Calculate average genre distribution of reading history
    const historyGenres: Record<string, number> = {};
    let totalGenres = 0;

    readHistory.forEach(historyManga => {
      historyManga.genres.forEach(genre => {
        historyGenres[genre] = (historyGenres[genre] || 0) + 1;
        totalGenres++;
      });
    });

    // Calculate history-based compatibility
    let historyMatch = 0;
    manga.genres.forEach(genre => {
      const historyFreq = (historyGenres[genre] || 0) / totalGenres;
      historyMatch += historyFreq;
    });

    historyMatch = historyMatch / manga.genres.length;

    // Integrate with 70% mood match + 30% history match
    return baseMoodMatch * 0.7 + historyMatch * 0.3;
  }
}

// Export default instance
export const moodMapper = new MoodMapper();