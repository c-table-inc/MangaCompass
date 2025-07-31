<?php

namespace MangaCompass\AmazonAPI;

use Monolog\Logger;

class DataMapper
{
    private Logger $logger;
    private array $genreMapping;
    
    public function __construct(Logger $logger)
    {
        $this->logger = $logger;
        $this->initializeGenreMapping();
    }
    
    /**
     * Convert Amazon product data to Manga format
     */
    public function amazonToManga(array $amazonData, array $additionalData = []): array
    {
        $this->logger->info("Converting Amazon data to Manga format", ['asin' => $amazonData['asin']]);
        
        $mangaId = $this->generateMangaId($amazonData['title']);
        
        $manga = [
            'id' => $additionalData['id'] ?? $mangaId,
            'title' => $this->cleanTitle($amazonData['title']),
            'author' => $amazonData['author'],
            'genres' => $this->mapGenres($amazonData['categories'] ?? []),
            'status' => $additionalData['status'] ?? 'completed',
            'volumes' => $additionalData['volumes'] ?? 1,
            'rating' => $additionalData['rating'] ?? 8.0,
            'description' => $amazonData['description'] ?? '',
            'amazonLink' => $this->generateAffiliateLink($amazonData['asin']),
            'imageUrl' => $amazonData['image_url'] ?? '',
            'asin' => $amazonData['asin'],
            'popularity' => $additionalData['popularity'] ?? 75,
            'year' => $this->extractYear($amazonData['publication_date'] ?? null)
        ];
        
        // Remove empty optional fields
        $manga = array_filter($manga, function($value) {
            return $value !== '' && $value !== null;
        });
        
        return $manga;
    }
    
    /**
     * Generate TypeScript code for manga entry
     */
    public function mangaToTypeScript(array $manga): string
    {
        $indent = '  ';
        $lines = [];
        
        $lines[] = $indent . '{';
        
        foreach ($manga as $key => $value) {
            $formattedValue = $this->formatTypeScriptValue($value);
            $lines[] = $indent . $indent . "{$key}: {$formattedValue},";
        }
        
        $lines[] = $indent . '},';
        
        return implode("\n", $lines);
    }
    
    /**
     * Generate unique manga ID from title
     */
    private function generateMangaId(string $title): string
    {
        // Remove volume information and clean title
        $cleanTitle = preg_replace('/,?\s*Vol\.?\s*\d+/i', '', $title);
        $cleanTitle = preg_replace('/,?\s*Volume\s*\d+/i', '', $cleanTitle);
        
        // Convert to lowercase and replace spaces/special chars with hyphens
        $id = strtolower($cleanTitle);
        $id = preg_replace('/[^a-z0-9]+/', '-', $id);
        $id = trim($id, '-');
        
        return $id . '-1'; // Add -1 for volume 1
    }
    
    /**
     * Clean manga title
     */
    private function cleanTitle(string $title): string
    {
        // Remove extra whitespace
        $title = preg_replace('/\s+/', ' ', trim($title));
        
        return $title;
    }
    
    /**
     * Map Amazon categories to manga genres
     */
    private function mapGenres(array $categories): array
    {
        $mappedGenres = [];
        
        foreach ($categories as $category) {
            $category = strtolower($category);
            
            foreach ($this->genreMapping as $pattern => $genres) {
                if (strpos($category, $pattern) !== false) {
                    $mappedGenres = array_merge($mappedGenres, $genres);
                }
            }
        }
        
        // Remove duplicates and return unique genres
        $mappedGenres = array_unique($mappedGenres);
        
        // If no genres mapped, default to 'Adventure'
        if (empty($mappedGenres)) {
            $mappedGenres = ['Adventure'];
        }
        
        return array_values($mappedGenres);
    }
    
    /**
     * Generate affiliate link with partner tag
     */
    private function generateAffiliateLink(string $asin): string
    {
        return "https://amazon.com/dp/{$asin}/?tag=mangacompass-20";
    }
    
    /**
     * Extract year from publication date
     */
    private function extractYear(?string $publicationDate): ?int
    {
        if (!$publicationDate) {
            return null;
        }
        
        $timestamp = strtotime($publicationDate);
        if ($timestamp === false) {
            return null;
        }
        
        return (int)date('Y', $timestamp);
    }
    
    /**
     * Format value for TypeScript output
     */
    private function formatTypeScriptValue($value): string
    {
        if (is_string($value)) {
            return "'" . addslashes($value) . "'";
        } elseif (is_array($value)) {
            $items = array_map(function($item) {
                return "'" . addslashes($item) . "'";
            }, $value);
            return '[' . implode(', ', $items) . ']';
        } elseif (is_bool($value)) {
            return $value ? 'true' : 'false';
        } elseif (is_null($value)) {
            return 'null';
        } else {
            return (string)$value;
        }
    }
    
    /**
     * Initialize genre mapping from Amazon categories to manga genres
     */
    private function initializeGenreMapping(): void
    {
        $this->genreMapping = [
            'action' => ['Action'],
            'adventure' => ['Adventure'],
            'romance' => ['Romance'],
            'comedy' => ['Comedy'],
            'humor' => ['Comedy'],
            'fantasy' => ['Fantasy'],
            'science fiction' => ['Sci-Fi'],
            'sci-fi' => ['Sci-Fi'],
            'horror' => ['Horror'],
            'thriller' => ['Thriller'],
            'mystery' => ['Mystery'],
            'detective' => ['Mystery'],
            'drama' => ['Drama'],
            'slice of life' => ['Slice of Life'],
            'school' => ['School'],
            'sports' => ['Sports'],
            'historical' => ['Historical'],
            'war' => ['Military'],
            'military' => ['Military'],
            'mecha' => ['Mecha'],
            'robot' => ['Mecha'],
            'music' => ['Music'],
            'cooking' => ['Cooking'],
            'food' => ['Cooking'],
            'supernatural' => ['Supernatural'],
            'magic' => ['Fantasy', 'Supernatural'],
            'psychological' => ['Psychological']
        ];
    }
}