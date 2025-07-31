<?php

namespace MangaCompass\AmazonAPI;

use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;
use Monolog\Logger;

class AmazonApiClient
{
    private Client $httpClient;
    private array $config;
    private Logger $logger;
    
    public function __construct(array $config, Logger $logger)
    {
        $this->config = $config;
        $this->logger = $logger;
        $this->httpClient = new Client([
            'timeout' => 30,
            'headers' => [
                'User-Agent' => 'MangaCompass-DataManager/1.0'
            ]
        ]);
    }
    
    /**
     * Search products by keyword
     */
    public function searchByKeyword(string $keyword, string $searchIndex = 'Books'): array
    {
        try {
            $this->logger->info("Searching Amazon for keyword: {$keyword}");
            
            // For demo purposes, return mock data
            // In real implementation, use Amazon PA-API v5
            return $this->getMockSearchResults($keyword);
            
        } catch (RequestException $e) {
            $this->logger->error("Amazon API search failed: " . $e->getMessage());
            throw new \Exception("Amazon API search failed: " . $e->getMessage());
        }
    }
    
    /**
     * Get product details by ASIN
     */
    public function getProductByAsin(string $asin): ?array
    {
        try {
            $this->logger->info("Getting Amazon product details for ASIN: {$asin}");
            
            // For demo purposes, return mock data
            // In real implementation, use Amazon PA-API v5
            return $this->getMockProductDetails($asin);
            
        } catch (RequestException $e) {
            $this->logger->error("Amazon API product lookup failed: " . $e->getMessage());
            return null;
        }
    }
    
    /**
     * Get product details by ISBN
     */
    public function getProductByIsbn(string $isbn): ?array
    {
        // Convert ISBN to search and find matching ASIN
        $searchResults = $this->searchByKeyword($isbn);
        
        if (!empty($searchResults)) {
            return $searchResults[0];
        }
        
        return null;
    }
    
    /**
     * Generate affiliate link
     */
    public function generateAffiliateLink(string $asin): string
    {
        $region = $this->config['region'];
        $partnerTag = $this->config['partner_tag'];
        
        return "https://amazon.{$region}/dp/{$asin}/?tag={$partnerTag}";
    }
    
    /**
     * Mock search results for demo
     */
    private function getMockSearchResults(string $keyword): array
    {
        // Simulate different search results based on keyword
        $mockResults = [
            'naruto' => [
                [
                    'asin' => '1569319006',
                    'title' => 'Naruto, Vol. 1: Uzumaki Naruto',
                    'author' => 'Masashi Kishimoto',
                    'image_url' => 'https://m.media-amazon.com/images/I/51BucomQlHL._SY445_SX342_.jpg',
                    'price' => '$9.99',
                    'categories' => ['Books', 'Comics & Graphic Novels', 'Manga', 'Action & Adventure'],
                    'description' => 'The story of Naruto Uzumaki, a young ninja seeking recognition.'
                ]
            ],
            'fruits basket' => [
                [
                    'asin' => '1591826039',
                    'title' => 'Fruits Basket, Vol. 1',
                    'author' => 'Natsuki Takaya',
                    'image_url' => 'https://m.media-amazon.com/images/I/91H5ptmq5HL._SY466_.jpg',
                    'price' => '$10.99',
                    'categories' => ['Books', 'Comics & Graphic Novels', 'Manga', 'Romance'],
                    'description' => 'A girl discovers a family cursed to transform into zodiac animals.'
                ]
            ]
        ];
        
        $lowerKeyword = strtolower($keyword);
        
        foreach ($mockResults as $key => $results) {
            if (strpos($lowerKeyword, $key) !== false) {
                return $results;
            }
        }
        
        // Default mock result for any search
        return [
            [
                'asin' => '1234567890',
                'title' => 'Sample Manga Vol. 1',
                'author' => 'Sample Author',
                'image_url' => 'https://via.placeholder.com/300x400?text=No+Image',
                'price' => '$9.99',
                'categories' => ['Books', 'Comics & Graphic Novels', 'Manga'],
                'description' => 'Sample manga description for: ' . $keyword
            ]
        ];
    }
    
    /**
     * Mock product details for demo
     */
    private function getMockProductDetails(string $asin): array
    {
        $mockProducts = [
            '1569319006' => [
                'asin' => '1569319006',
                'title' => 'Naruto, Vol. 1: Uzumaki Naruto',
                'author' => 'Masashi Kishimoto',
                'image_url' => 'https://m.media-amazon.com/images/I/51BucomQlHL._SY445_SX342_.jpg',
                'price' => '$9.99',
                'categories' => ['Books', 'Comics & Graphic Novels', 'Manga', 'Action & Adventure'],
                'description' => 'The story of Naruto Uzumaki, a young ninja seeking recognition.',
                'publication_date' => '1999-09-21',
                'pages' => 192,
                'isbn10' => '1569319006',
                'isbn13' => '9781569319000'
            ],
            '1591826039' => [
                'asin' => '1591826039',
                'title' => 'Fruits Basket, Vol. 1',
                'author' => 'Natsuki Takaya',
                'image_url' => 'https://m.media-amazon.com/images/I/91H5ptmq5HL._SY466_.jpg',
                'price' => '$10.99',
                'categories' => ['Books', 'Comics & Graphic Novels', 'Manga', 'Romance'],
                'description' => 'A girl discovers a family cursed to transform into zodiac animals.',
                'publication_date' => '1998-07-06',
                'pages' => 200,
                'isbn10' => '1591826039',
                'isbn13' => '9781591826033'
            ]
        ];
        
        return $mockProducts[$asin] ?? [
            'asin' => $asin,
            'title' => 'Unknown Product',
            'author' => 'Unknown Author',
            'image_url' => 'https://via.placeholder.com/300x400?text=No+Image',
            'price' => 'N/A',
            'categories' => ['Books'],
            'description' => 'Product details not available.',
            'publication_date' => null,
            'pages' => null
        ];
    }
}