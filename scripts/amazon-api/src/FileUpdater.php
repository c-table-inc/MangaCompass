<?php

namespace MangaCompass\AmazonAPI;

use Monolog\Logger;

class FileUpdater
{
    private Logger $logger;
    private string $mockDataPath;
    private string $backupPath;
    
    public function __construct(Logger $logger, string $mockDataPath, string $backupPath)
    {
        $this->logger = $logger;
        $this->mockDataPath = $mockDataPath;
        $this->backupPath = $backupPath;
        
        // Ensure backup directory exists
        if (!is_dir($this->backupPath)) {
            mkdir($this->backupPath, 0755, true);
        }
    }
    
    /**
     * Add new manga entry to mockData.ts
     */
    public function addManga(array $manga): bool
    {
        try {
            $this->logger->info("Adding manga to mock data", ['id' => $manga['id']]);
            
            // Create backup before modification
            $this->createBackup();
            
            // Check if manga already exists
            if ($this->mangaExists($manga['id'])) {
                throw new \Exception("Manga with ID '{$manga['id']}' already exists");
            }
            
            // Read current file content
            $content = file_get_contents($this->mockDataPath);
            if ($content === false) {
                throw new \Exception("Cannot read mock data file");
            }
            
            // Generate TypeScript entry
            $dataMapper = new DataMapper($this->logger);
            $tsEntry = $dataMapper->mangaToTypeScript($manga);
            
            // Find the insertion point (before the closing bracket of the array)
            $insertionPoint = $this->findInsertionPoint($content);
            if ($insertionPoint === false) {
                throw new \Exception("Cannot find insertion point in mock data file");
            }
            
            // Insert new entry
            $newContent = substr($content, 0, $insertionPoint) . $tsEntry . "\n" . substr($content, $insertionPoint);
            
            // Write updated content
            if (file_put_contents($this->mockDataPath, $newContent) === false) {
                throw new \Exception("Cannot write to mock data file");
            }
            
            $this->logger->info("Successfully added manga", ['id' => $manga['id']]);
            return true;
            
        } catch (\Exception $e) {
            $this->logger->error("Failed to add manga: " . $e->getMessage());
            throw $e;
        }
    }
    
    /**
     * Update existing manga entry
     */
    public function updateManga(string $mangaId, array $updates): bool
    {
        try {
            $this->logger->info("Updating manga in mock data", ['id' => $mangaId]);
            
            // Create backup before modification
            $this->createBackup();
            
            // Read current file content
            $content = file_get_contents($this->mockDataPath);
            if ($content === false) {
                throw new \Exception("Cannot read mock data file");
            }
            
            // Find and update the manga entry
            $pattern = "/\{\s*id:\s*['\"]" . preg_quote($mangaId, '/') . "['\"].*?\},/s";
            
            if (!preg_match($pattern, $content)) {
                throw new \Exception("Manga with ID '{$mangaId}' not found");
            }
            
            // Parse existing entry and apply updates
            $existingManga = $this->extractMangaData($content, $mangaId);
            $updatedManga = array_merge($existingManga, $updates);
            
            // Generate new TypeScript entry
            $dataMapper = new DataMapper($this->logger);
            $newTsEntry = $dataMapper->mangaToTypeScript($updatedManga);
            
            // Replace the entry
            $newContent = preg_replace($pattern, $newTsEntry, $content);
            
            // Write updated content
            if (file_put_contents($this->mockDataPath, $newContent) === false) {
                throw new \Exception("Cannot write to mock data file");
            }
            
            $this->logger->info("Successfully updated manga", ['id' => $mangaId]);
            return true;
            
        } catch (\Exception $e) {
            $this->logger->error("Failed to update manga: " . $e->getMessage());
            throw $e;
        }
    }
    
    /**
     * Get all manga entries from mock data
     */
    public function getAllManga(): array
    {
        try {
            $content = file_get_contents($this->mockDataPath);
            if ($content === false) {
                throw new \Exception("Cannot read mock data file");
            }
            
            return $this->parseAllMangaData($content);
            
        } catch (\Exception $e) {
            $this->logger->error("Failed to get all manga: " . $e->getMessage());
            return [];
        }
    }
    
    /**
     * Check if manga with given ID exists
     */
    public function mangaExists(string $mangaId): bool
    {
        $content = file_get_contents($this->mockDataPath);
        if ($content === false) {
            return false;
        }
        
        $pattern = "/id:\s*['\"]" . preg_quote($mangaId, '/') . "['\"]/";
        return preg_match($pattern, $content) === 1;
    }
    
    /**
     * Create backup of current mock data file
     */
    private function createBackup(): void
    {
        $timestamp = date('Y-m-d_H-i-s');
        $backupFile = $this->backupPath . "/mockData_backup_{$timestamp}.ts";
        
        if (!copy($this->mockDataPath, $backupFile)) {
            $this->logger->warning("Failed to create backup file");
        } else {
            $this->logger->info("Created backup file", ['file' => $backupFile]);
        }
        
        // Clean old backups (keep only last 10)
        $this->cleanOldBackups();
    }
    
    /**
     * Find insertion point for new manga entry
     */
    private function findInsertionPoint(string $content): int|false
    {
        // Look for the closing bracket of the mockMangaData array
        $pattern = '/\];\s*$/';
        if (preg_match($pattern, $content, $matches, PREG_OFFSET_CAPTURE)) {
            return $matches[0][1];
        }
        
        return false;
    }
    
    /**
     * Extract manga data from content by ID
     */
    private function extractMangaData(string $content, string $mangaId): array
    {
        // This is a simplified implementation
        // In a real scenario, you might want to use a proper TypeScript parser
        $pattern = "/\{\s*id:\s*['\"]" . preg_quote($mangaId, '/') . "['\"].*?\},/s";
        
        if (!preg_match($pattern, $content, $matches)) {
            throw new \Exception("Cannot extract manga data for ID: {$mangaId}");
        }
        
        // Basic parsing - this is simplified for demo purposes
        $entryText = $matches[0];
        
        // Extract basic fields using regex (simplified approach)
        $manga = ['id' => $mangaId];
        
        if (preg_match("/title:\s*['\"]([^'\"]*)['\"]/",$entryText, $m)) $manga['title'] = $m[1];
        if (preg_match("/author:\s*['\"]([^'\"]*)['\"]/",$entryText, $m)) $manga['author'] = $m[1];
        if (preg_match("/status:\s*['\"]([^'\"]*)['\"]/",$entryText, $m)) $manga['status'] = $m[1];
        if (preg_match("/rating:\s*([0-9.]+)/",$entryText, $m)) $manga['rating'] = (float)$m[1];
        if (preg_match("/volumes:\s*([0-9]+)/",$entryText, $m)) $manga['volumes'] = (int)$m[1];
        if (preg_match("/popularity:\s*([0-9]+)/",$entryText, $m)) $manga['popularity'] = (int)$m[1];
        if (preg_match("/year:\s*([0-9]+)/",$entryText, $m)) $manga['year'] = (int)$m[1];
        if (preg_match("/asin:\s*['\"]([^'\"]*)['\"]/",$entryText, $m)) $manga['asin'] = $m[1];
        
        // Extract image URLs
        if (preg_match("/imageUrl:\s*['\"]([^'\"]*)['\"]/",$entryText, $m)) $manga['imageUrl'] = $m[1];
        if (preg_match("/coverImage:\s*['\"]([^'\"]*)['\"]/",$entryText, $m)) $manga['coverImage'] = $m[1];
        
        // Extract other optional fields
        if (preg_match("/description:\s*['\"]([^'\"]*)['\"]/",$entryText, $m)) $manga['description'] = $m[1];
        if (preg_match("/amazonLink:\s*['\"]([^'\"]*)['\"]/",$entryText, $m)) $manga['amazonLink'] = $m[1];
        
        // Extract genres array
        if (preg_match("/genres:\s*\[(.*?)\]/",$entryText, $m)) {
            $genresString = $m[1];
            preg_match_all("/['\"]([^'\"]*)['\"]/",$genresString, $genreMatches);
            $manga['genres'] = $genreMatches[1];
        }
        
        return $manga;
    }
    
    /**
     * Parse all manga data from content (simplified)
     */
    private function parseAllMangaData(string $content): array
    {
        // Simplified parsing for demo - would need proper TypeScript parsing in production
        $mangaList = [];
        
        // Extract all manga objects
        preg_match_all('/\{\s*id:\s*[\'"]([^\'"]*)[\'"].*?\},/s', $content, $matches, PREG_SET_ORDER);
        
        foreach ($matches as $match) {
            $mangaId = $match[1];
            try {
                $mangaList[] = $this->extractMangaData($content, $mangaId);
            } catch (\Exception $e) {
                $this->logger->warning("Failed to parse manga: " . $mangaId);
            }
        }
        
        return $mangaList;
    }
    
    /**
     * Clean old backup files
     */
    private function cleanOldBackups(): void
    {
        $backupFiles = glob($this->backupPath . '/mockData_backup_*.ts');
        
        if (count($backupFiles) > 10) {
            // Sort by modification time
            usort($backupFiles, function($a, $b) {
                return filemtime($a) - filemtime($b);
            });
            
            // Remove oldest files
            $filesToRemove = array_slice($backupFiles, 0, count($backupFiles) - 10);
            foreach ($filesToRemove as $file) {
                unlink($file);
                $this->logger->info("Removed old backup file", ['file' => $file]);
            }
        }
    }
}