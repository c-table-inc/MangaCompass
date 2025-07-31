<?php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

require_once __DIR__ . '/../../config/config.php';
require_once __DIR__ . '/../../vendor/autoload.php';

use MangaCompass\AmazonAPI\FileUpdater;
use Monolog\Logger;
use Monolog\Handler\StreamHandler;

// Initialize logger
$logger = new Logger('api_list');
$logger->pushHandler(new StreamHandler(__DIR__ . '/../../logs/api.log', Logger::INFO));

try {
    // Only accept GET requests
    if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
        throw new Exception('Only GET method allowed');
    }
    
    $logger->info("List manga request");
    
    // Initialize file updater
    $appConfig = Config::getAppConfig();
    $mockDataPath = realpath(__DIR__ . '/../../' . $appConfig['mock_data_path']);
    $backupPath = realpath(__DIR__ . '/../../' . $appConfig['backup_path']) ?: __DIR__ . '/../../backups';
    
    // Debug path information
    $logger->info("File paths", [
        'mock_data_path_config' => $appConfig['mock_data_path'],
        'mock_data_path_resolved' => $mockDataPath,
        'backup_path_resolved' => $backupPath,
        'file_exists' => $mockDataPath ? file_exists($mockDataPath) : false
    ]);
    
    if (!$mockDataPath || !file_exists($mockDataPath)) {
        throw new Exception("Mock data file not found at: " . ($mockDataPath ?: 'path resolution failed'));
    }
    
    $fileUpdater = new FileUpdater($logger, $mockDataPath, $backupPath);
    
    // Get all manga
    $mangaList = $fileUpdater->getAllManga();
    
    $logger->info("List manga completed", ['count' => count($mangaList)]);
    
    // Return results
    echo json_encode([
        'success' => true,
        'data' => $mangaList,
        'count' => count($mangaList)
    ]);
    
} catch (Exception $e) {
    $logger->error("List API error: " . $e->getMessage());
    
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage(),
        'data' => [],
        'count' => 0
    ]);
}