<?php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once __DIR__ . '/../../config/config.php';

try {
    $appConfig = Config::getAppConfig();
    
    // Test file paths
    $mockDataPath = realpath(__DIR__ . '/../../' . $appConfig['mock_data_path']);
    $backupPath = realpath(__DIR__ . '/../../' . $appConfig['backup_path']) ?: __DIR__ . '/../../backups';
    
    // Check if composer autoload exists
    $vendorPath = __DIR__ . '/../../vendor/autoload.php';
    $vendorExists = file_exists($vendorPath);
    
    // Check if .env exists
    $envPath = __DIR__ . '/../../.env';
    $envExists = file_exists($envPath);
    
    echo json_encode([
        'success' => true,
        'php_version' => PHP_VERSION,
        'config' => $appConfig,
        'paths' => [
            'mock_data_path' => [
                'config' => $appConfig['mock_data_path'],
                'resolved' => $mockDataPath,
                'exists' => $mockDataPath ? file_exists($mockDataPath) : false,
                'readable' => $mockDataPath ? is_readable($mockDataPath) : false
            ],
            'backup_path' => [
                'resolved' => $backupPath,
                'exists' => is_dir($backupPath),
                'writable' => is_dir($backupPath) ? is_writable($backupPath) : false
            ],
            'vendor_autoload' => [
                'path' => $vendorPath,
                'exists' => $vendorExists
            ],
            'env_file' => [
                'path' => $envPath,
                'exists' => $envExists
            ]
        ],
        'current_dir' => __DIR__,
        'working_dir' => getcwd()
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
        'trace' => $e->getTraceAsString()
    ]);
}