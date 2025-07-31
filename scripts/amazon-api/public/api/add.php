<?php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

require_once __DIR__ . '/../../config/config.php';
require_once __DIR__ . '/../../vendor/autoload.php';

use MangaCompass\AmazonAPI\DataMapper;
use MangaCompass\AmazonAPI\FileUpdater;
use Monolog\Logger;
use Monolog\Handler\StreamHandler;

// Initialize logger
$logger = new Logger('api_add');
$logger->pushHandler(new StreamHandler(__DIR__ . '/../../logs/api.log', Logger::INFO));

try {
    // Only accept POST requests
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('Only POST method allowed');
    }
    
    // Get request data
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        throw new Exception('Invalid JSON input');
    }
    
    $mangaData = $input['manga_data'] ?? null;
    $force = $input['force'] ?? false;
    
    if (!$mangaData) {
        throw new Exception('Manga data is required');
    }
    
    // Validate required fields
    $requiredFields = ['id', 'title', 'author', 'genres'];
    foreach ($requiredFields as $field) {
        if (empty($mangaData[$field])) {
            throw new Exception("Field '{$field}' is required");
        }
    }
    
    $logger->info("Add manga request", ['id' => $mangaData['id']]);
    
    // Initialize file updater
    $appConfig = Config::getAppConfig();
    $mockDataPath = realpath(__DIR__ . '/../../' . $appConfig['mock_data_path']);
    $backupPath = realpath(__DIR__ . '/../../' . $appConfig['backup_path']) ?: __DIR__ . '/../../backups';
    
    $fileUpdater = new FileUpdater($logger, $mockDataPath, $backupPath);
    
    // Check if manga already exists (unless force is true)
    if (!$force && $fileUpdater->mangaExists($mangaData['id'])) {
        throw new Exception("Manga with ID '{$mangaData['id']}' already exists. Use force=true to overwrite.");
    }
    
    // Validate and clean data
    $cleanedData = [
        'id' => trim($mangaData['id']),
        'title' => trim($mangaData['title']),
        'author' => trim($mangaData['author']),
        'genres' => is_array($mangaData['genres']) ? $mangaData['genres'] : [$mangaData['genres']],
        'status' => $mangaData['status'] ?? 'completed',
        'volumes' => max(1, intval($mangaData['volumes'] ?? 1)),
        'rating' => max(1, min(10, floatval($mangaData['rating'] ?? 8.0))),
        'popularity' => max(1, min(100, intval($mangaData['popularity'] ?? 75)))
    ];
    
    // Optional fields
    if (!empty($mangaData['description'])) {
        $cleanedData['description'] = trim($mangaData['description']);
    }
    
    if (!empty($mangaData['year']) && intval($mangaData['year']) >= 1950) {
        $cleanedData['year'] = intval($mangaData['year']);
    }
    
    if (!empty($mangaData['asin'])) {
        $cleanedData['asin'] = trim($mangaData['asin']);
        $cleanedData['amazonLink'] = "https://amazon.com/dp/{$cleanedData['asin']}/?tag=mangacompass-20";
    }
    
    if (!empty($mangaData['imageUrl'])) {
        $cleanedData['imageUrl'] = trim($mangaData['imageUrl']);
    }
    
    // Add manga to file
    $success = $fileUpdater->addManga($cleanedData);
    
    if ($success) {
        $logger->info("Manga added successfully", ['id' => $cleanedData['id']]);
        
        echo json_encode([
            'success' => true,
            'message' => 'Manga added successfully',
            'id' => $cleanedData['id'],
            'data' => $cleanedData
        ]);
    } else {
        throw new Exception('Failed to add manga to file');
    }
    
} catch (Exception $e) {
    $logger->error("Add API error: " . $e->getMessage());
    
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage(),
        'id' => null,
        'data' => null
    ]);
}