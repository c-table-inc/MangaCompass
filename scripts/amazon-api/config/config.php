<?php

require_once __DIR__ . '/../vendor/autoload.php';

use Dotenv\Dotenv;

// Load environment variables
try {
    $dotenv = Dotenv::createImmutable(__DIR__ . '/..');
    $dotenv->load();
} catch (Exception $e) {
    // .env file not found - use defaults
    error_log("Warning: .env file not found, using defaults: " . $e->getMessage());
}

// Configuration class
class Config
{
    public static function get(string $key, $default = null)
    {
        return $_ENV[$key] ?? $default;
    }
    
    public static function getAmazonConfig(): array
    {
        return [
            'access_key' => self::get('AMAZON_ACCESS_KEY'),
            'secret_key' => self::get('AMAZON_SECRET_KEY'),
            'partner_tag' => self::get('AMAZON_PARTNER_TAG', 'mangacompass-20'),
            'region' => self::get('AMAZON_REGION', 'com'),
            'host' => self::get('AMAZON_HOST', 'webservices.amazon.com')
        ];
    }
    
    public static function getWebUIConfig(): array
    {
        return [
            'username' => self::get('WEB_UI_USERNAME', 'admin'),
            'password' => self::get('WEB_UI_PASSWORD', 'admin'),
        ];
    }
    
    public static function getAppConfig(): array
    {
        return [
            'cache_duration' => (int)self::get('CACHE_DURATION', 86400),
            'log_level' => self::get('LOG_LEVEL', 'INFO'),
            'debug_mode' => self::get('DEBUG_MODE', 'false') === 'true',
            'mock_data_path' => self::get('MOCK_DATA_PATH', '../../src/lib/mockData.ts'),
            'backup_path' => self::get('BACKUP_PATH', './backups/')
        ];
    }
}