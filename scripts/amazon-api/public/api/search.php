<?php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

require_once __DIR__ . '/../../config/config.php';
require_once __DIR__ . '/../../vendor/autoload.php';

use MangaCompass\AmazonAPI\AmazonApiClient;
use Monolog\Logger;
use Monolog\Handler\StreamHandler;

// Initialize logger
$logger = new Logger('api_search');
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
    
    $query = trim($input['query'] ?? '');
    $type = $input['type'] ?? 'title';
    
    if (empty($query)) {
        throw new Exception('Search query is required');
    }
    
    $logger->info("Search request", ['query' => $query, 'type' => $type]);
    
    // Initialize Amazon API client
    $amazonConfig = Config::getAmazonConfig();
    $client = new AmazonApiClient($amazonConfig, $logger);
    
    // Perform search based on type
    $results = [];
    
    switch ($type) {
        case 'asin':
            $product = $client->getProductByAsin($query);
            if ($product) {
                $results = [$product];
            }
            break;
            
        case 'isbn':
            $product = $client->getProductByIsbn($query);
            if ($product) {
                $results = [$product];
            }
            break;
            
        case 'title':
        case 'author':
        default:
            $results = $client->searchByKeyword($query);
            break;
    }
    
    $logger->info("Search completed", ['results_count' => count($results)]);
    
    // Return results
    echo json_encode([
        'success' => true,
        'data' => $results,
        'count' => count($results),
        'query' => $query,
        'type' => $type
    ]);
    
} catch (Exception $e) {
    $logger->error("Search API error: " . $e->getMessage());
    
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage(),
        'data' => [],
        'count' => 0
    ]);
}