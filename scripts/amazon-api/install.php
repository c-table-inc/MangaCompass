<?php
/**
 * MangaCompass Amazon API Manager - Installation Script
 * 
 * This script helps set up the required directories and permissions
 */

echo "🚀 MangaCompass Amazon API Manager - Installation\n";
echo "================================================\n\n";

// Check PHP version
if (version_compare(PHP_VERSION, '8.0.0') < 0) {
    echo "❌ Error: PHP 8.0 or higher is required. Current version: " . PHP_VERSION . "\n";
    exit(1);
}
echo "✅ PHP version: " . PHP_VERSION . " (OK)\n";

// Check if Composer is available
$composerCheck = shell_exec('composer --version 2>/dev/null');
if (!$composerCheck) {
    echo "❌ Error: Composer is not installed or not in PATH\n";
    echo "   Please install Composer first: https://getcomposer.org/\n";
    exit(1);
}
echo "✅ Composer is available\n";

// Create required directories
$directories = [
    'logs',
    'cache', 
    'backups',
    'public/uploads'
];

echo "\n📁 Creating directories...\n";
foreach ($directories as $dir) {
    if (!is_dir($dir)) {
        if (mkdir($dir, 0755, true)) {
            echo "✅ Created: {$dir}\n";
        } else {
            echo "❌ Failed to create: {$dir}\n";
        }
    } else {
        echo "✅ Already exists: {$dir}\n";
    }
}

// Set permissions
echo "\n🔒 Setting permissions...\n";
foreach ($directories as $dir) {
    if (is_dir($dir)) {
        chmod($dir, 0755);
        echo "✅ Set permissions for: {$dir}\n";
    }
}

// Install Composer dependencies
echo "\n📦 Installing Composer dependencies...\n";
$output = shell_exec('composer install 2>&1');
if (strpos($output, 'error') !== false || strpos($output, 'Error') !== false) {
    echo "❌ Composer install failed:\n";
    echo $output . "\n";
    exit(1);
}
echo "✅ Composer dependencies installed\n";

// Check if .env file exists
echo "\n⚙️  Environment configuration...\n";
if (!file_exists('.env')) {
    if (file_exists('.env.example')) {
        copy('.env.example', '.env');
        echo "✅ Created .env file from .env.example\n";
        echo "📝 Please edit .env file to configure your settings\n";
    } else {
        echo "❌ .env.example file not found\n";
    }
} else {
    echo "✅ .env file already exists\n";
}

// Create initial log files
echo "\n📋 Creating initial log files...\n";
$logFiles = ['logs/app.log', 'logs/api.log'];
foreach ($logFiles as $logFile) {
    if (!file_exists($logFile)) {
        file_put_contents($logFile, date('Y-m-d H:i:s') . " - Log file created\n");
        chmod($logFile, 0644);
        echo "✅ Created: {$logFile}\n";
    } else {
        echo "✅ Already exists: {$logFile}\n";
    }
}

// Check web server requirements
echo "\n🌐 Web server requirements...\n";

// Check if running via web server
if (isset($_SERVER['SERVER_SOFTWARE'])) {
    echo "✅ Running via web server: " . $_SERVER['SERVER_SOFTWARE'] . "\n";
    
    // Check if mod_rewrite is available (Apache)
    if (function_exists('apache_get_modules')) {
        $modules = apache_get_modules();
        if (in_array('mod_rewrite', $modules)) {
            echo "✅ mod_rewrite is enabled\n";
        } else {
            echo "⚠️  mod_rewrite might not be enabled\n";
        }
    }
} else {
    echo "ℹ️  Running via CLI - Web server checks skipped\n";
}

// Check required PHP extensions
echo "\n🔧 PHP Extensions...\n";
$requiredExtensions = [
    'json' => 'JSON support',
    'curl' => 'HTTP requests', 
    'mbstring' => 'Multibyte string handling',
    'fileinfo' => 'File type detection'
];

foreach ($requiredExtensions as $ext => $description) {
    if (extension_loaded($ext)) {
        echo "✅ {$ext}: {$description}\n";
    } else {
        echo "❌ {$ext}: {$description} (MISSING)\n";
    }
}

// Display next steps
echo "\n\n🎉 Installation completed!\n";
echo "=========================\n\n";

echo "📝 Next steps:\n";
echo "1. Edit .env file with your configuration:\n";
echo "   - Amazon API credentials\n";
echo "   - Web UI authentication\n";
echo "   - File paths\n\n";

echo "2. Configure your web server:\n";
echo "   - Point document root to: public/\n";
echo "   - Enable .htaccess (Apache) or equivalent\n\n";

echo "3. Access the web interface:\n";
echo "   http://yourserver/scripts/amazon-api/public/\n\n";

echo "4. Test the installation:\n";
echo "   - Try logging in with credentials from .env\n";
echo "   - Perform a test search\n";
echo "   - Check logs for any errors\n\n";

echo "📚 Documentation:\n";
echo "   - README.md for detailed setup instructions\n";
echo "   - docs/ folder for requirements and specifications\n\n";

echo "🔒 Security reminders:\n";
echo "   - Change default passwords in .env\n";
echo "   - Ensure sensitive directories are protected\n";
echo "   - Only use in trusted environments\n\n";

echo "✨ Happy manga cataloging!\n";
?>