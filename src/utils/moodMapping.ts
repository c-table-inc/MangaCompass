import { Manga, MoodType, MOOD_CATEGORIES } from '@/lib/types';

/**
 * 気分ベース推薦システムのマッピングとユーティリティクラス
 */
export class MoodMapper {
  /**
   * 気分からジャンル重み付けを取得
   */
  getGenreWeights(mood: MoodType): Record<string, number> {
    return mood.genreWeights;
  }

  /**
   * 気分に基づく作品フィルタリング
   * 気分に関連するジャンルを持つ作品を優先的に抽出
   */
  filterMangaByMood(manga: Manga[], mood: MoodType, limit: number = 50): Manga[] {
    const weights = this.getGenreWeights(mood);
    
    // 各漫画の気分適合度を計算
    const scoredManga = manga.map(m => ({
      manga: m,
      moodScore: this.calculateMoodMatch(m, mood)
    }))
    .filter(item => item.moodScore > 0) // 全く関連がない作品を除外
    .sort((a, b) => b.moodScore - a.moodScore); // 適合度順でソート

    return scoredManga.slice(0, limit).map(item => item.manga);
  }

  /**
   * 気分適合度計算
   * 漫画のジャンルと選択された気分の重み付けに基づいてスコアを計算
   */
  calculateMoodMatch(manga: Manga, mood: MoodType): number {
    const weights = this.getGenreWeights(mood);
    let totalScore = 0;
    let matchedGenres = 0;

    // 漫画の各ジャンルについて重み付けスコアを計算
    for (const genre of manga.genres) {
      if (weights[genre]) {
        totalScore += weights[genre];
        matchedGenres++;
      }
    }

    // ジャンルマッチがない場合は0を返す
    if (matchedGenres === 0) {
      return 0;
    }

    // 平均スコアを計算（0-1の範囲）
    const averageScore = totalScore / matchedGenres;
    
    // 複数ジャンルマッチのボーナス（最大1.2倍）
    const genreBonus = Math.min(1.2, 1 + (matchedGenres - 1) * 0.1);
    
    return Math.min(1.0, averageScore * genreBonus);
  }

  /**
   * 推薦理由生成
   * 気分と漫画の特徴に基づいて自然な推薦理由を生成
   */
  generateMoodReason(manga: Manga, mood: MoodType, score: number): string {
    const weights = this.getGenreWeights(mood);
    const matchedGenres: string[] = [];
    
    // マッチしたジャンルを抽出
    for (const genre of manga.genres) {
      if (weights[genre] && weights[genre] > 0.5) {
        matchedGenres.push(genre);
      }
    }

    // 気分別の理由テンプレート
    const reasonTemplates: Record<string, string[]> = {
      adventure: [
        `${matchedGenres.join('・')}要素で新しい世界への冒険が楽しめます`,
        `壮大な${matchedGenres[0]}ストーリーで冒険心を満たします`,
        `未知の世界を探検する${matchedGenres.join('・')}が魅力的です`
      ],
      relax: [
        `${matchedGenres.join('・')}の要素で心穏やかに読めます`,
        `日常的な${matchedGenres[0]}で癒やされます`,
        `ゆったりした${matchedGenres.join('・')}の雰囲気が魅力です`
      ],
      excitement: [
        `${matchedGenres.join('・')}のスリルで興奮できます`,
        `迫力満点の${matchedGenres[0]}シーンが楽しめます`,
        `熱血的な${matchedGenres.join('・')}展開が魅力です`
      ],
      emotional: [
        `${matchedGenres.join('・')}の深い感動が味わえます`,
        `心を揺さぶる${matchedGenres[0]}ストーリーです`,
        `感情豊かな${matchedGenres.join('・')}が心に響きます`
      ],
      thoughtful: [
        `${matchedGenres.join('・')}の深いテーマが考えさせられます`,
        `哲学的な${matchedGenres[0]}要素が印象的です`,
        `思索的な${matchedGenres.join('・')}内容が魅力です`
      ],
      thrilling: [
        `${matchedGenres.join('・')}のサスペンスでハラハラします`,
        `緊張感溢れる${matchedGenres[0]}展開が楽しめます`,
        `スリリングな${matchedGenres.join('・')}が魅力的です`
      ],
      nostalgic: [
        `${matchedGenres.join('・')}の懐かしい雰囲気が楽しめます`,
        `郷愁を誘う${matchedGenres[0]}設定が魅力です`,
        `温かい${matchedGenres.join('・')}の世界観が心地よいです`
      ],
      light: [
        `${matchedGenres.join('・')}で気軽に楽しめます`,
        `軽やかな${matchedGenres[0]}で気分転換できます`,
        `明るい${matchedGenres.join('・')}の雰囲気が魅力です`
      ]
    };

    const templates = reasonTemplates[mood.id] || [`${matchedGenres.join('・')}が${mood.name}にぴったりです`];
    const reasonIndex = Math.floor(Math.random() * templates.length);
    let reason = templates[reasonIndex];

    // 高評価作品の場合は評価情報を追加
    if (manga.rating >= 8.0) {
      reason += `（評価${manga.rating}/10）`;
    }

    // 人気作品の場合は人気情報を追加
    if (manga.popularity >= 80) {
      reason += '・人気作品';
    }

    return reason;
  }

  /**
   * 気分IDから気分オブジェクトを取得
   */
  getMoodById(moodId: string): MoodType | undefined {
    return MOOD_CATEGORIES.find(mood => mood.id === moodId);
  }

  /**
   * 複数の気分の重み付けを統合
   * 将来的な機能拡張用（複数気分選択対応）
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
   * 推薦精度の向上のため、読書履歴を考慮した気分マッチング
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

    // 読書履歴の平均ジャンル分布を計算
    const historyGenres: Record<string, number> = {};
    let totalGenres = 0;

    readHistory.forEach(historyManga => {
      historyManga.genres.forEach(genre => {
        historyGenres[genre] = (historyGenres[genre] || 0) + 1;
        totalGenres++;
      });
    });

    // 履歴ベースの適合度を計算
    let historyMatch = 0;
    manga.genres.forEach(genre => {
      const historyFreq = (historyGenres[genre] || 0) / totalGenres;
      historyMatch += historyFreq;
    });

    historyMatch = historyMatch / manga.genres.length;

    // 気分マッチ70% + 履歴マッチ30%で統合
    return baseMoodMatch * 0.7 + historyMatch * 0.3;
  }
}

// デフォルトインスタンスをエクスポート
export const moodMapper = new MoodMapper();