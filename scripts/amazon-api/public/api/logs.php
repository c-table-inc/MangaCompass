<?php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

require_once __DIR__ . '/../../config/config.php';

try {
    // Only accept GET requests
    if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
        throw new Exception('Only GET method allowed');
    }
    
    $logType = $_GET['type'] ?? 'app';
    $lines = intval($_GET['lines'] ?? 100);
    
    // Determine log file path
    $logFile = '';
    switch ($logType) {
        case 'api':
            $logFile = __DIR__ . '/../../logs/api.log';
            break;
        case 'app':
        default:
            $logFile = __DIR__ . '/../../logs/app.log';
            break;
    }
    
    // Check if log file exists
    if (!file_exists($logFile)) {
        $logs = "Log file does not exist: {$logFile}";
    } else {
        // Read last N lines from log file
        $file = new SplFileObject($logFile);
        $file->seek(PHP_INT_MAX);
        $totalLines = $file->key();
        
        $startLine = max(0, $totalLines - $lines);
        $file->seek($startLine);
        
        $logs = '';
        while (!$file->eof()) {
            $logs .= $file->current();
            $file->next();
        }
        
        if (empty($logs)) {
            $logs = "No log entries found in {$logFile}";
        }
    }
    
    // Return logs
    echo json_encode([
        'success' => true,
        'logs' => $logs,
        'type' => $logType,
        'lines' => $lines
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage(),
        'logs' => 'Error loading logs: ' . $e->getMessage(),
        'type' => $logType ?? 'unknown',
        'lines' => 0
    ]);
}