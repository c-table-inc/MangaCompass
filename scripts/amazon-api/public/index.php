<?php

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../vendor/autoload.php';

use Monolog\Logger;
use Monolog\Handler\StreamHandler;

// Initialize logger
$logger = new Logger('manga_manager');
$logger->pushHandler(new StreamHandler(__DIR__ . '/../logs/app.log', Logger::INFO));

// Basic authentication check
$config = Config::getWebUIConfig();
if (!isset($_SERVER['PHP_AUTH_USER']) || 
    $_SERVER['PHP_AUTH_USER'] !== $config['username'] || 
    $_SERVER['PHP_AUTH_PW'] !== $config['password']) {
    
    header('WWW-Authenticate: Basic realm="MangaCompass Data Manager"');
    header('HTTP/1.0 401 Unauthorized');
    echo 'Access denied. Please provide valid credentials.';
    exit;
}

// Include header
include_once 'templates/header.php';

// Define available manga genres
$mangaGenres = [
    'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Mystery',
    'Romance', 'Sci-Fi', 'Slice of Life', 'Sports', 'Supernatural', 'Thriller',
    'Historical', 'Psychological', 'School', 'Mecha', 'Military', 'Music', 'Cooking'
];

?>

<!-- Search Tab -->
<div id="searchTab" class="tab-content" style="display: block;">
    <div class="row">
        <div class="col-lg-4">
            <div class="card">
                <div class="card-header">
                    <h5 class="mb-0">🔍 Search Amazon Products</h5>
                </div>
                <div class="card-body">
                    <form id="searchForm">
                        <div class="mb-3">
                            <label for="searchQuery" class="form-label">Search Query</label>
                            <input type="text" class="form-control" id="searchQuery" 
                                   placeholder="Enter manga title, author, or ASIN" required>
                        </div>
                        
                        <div class="mb-3">
                            <label for="searchType" class="form-label">Search Type</label>
                            <select class="form-select" id="searchType">
                                <option value="title">Title</option>
                                <option value="author">Author</option>
                                <option value="asin">ASIN</option>
                                <option value="isbn">ISBN</option>
                            </select>
                        </div>
                        
                        <button type="submit" class="btn btn-primary w-100">
                            🔍 Search
                        </button>
                    </form>
                </div>
            </div>
        </div>
        
        <div class="col-lg-8">
            <div class="card">
                <div class="card-header">
                    <h5 class="mb-0">Search Results</h5>
                </div>
                <div class="card-body">
                    <div id="searchResults" class="row">
                        <div class="col-12">
                            <p class="text-muted text-center">Enter a search query to find manga products</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Add/Edit Tab -->
<div id="addTab" class="tab-content" style="display: none;">
    <div class="row">
        <div class="col-lg-4">
            <div id="productPreview">
                <!-- Product preview will be populated here -->
            </div>
        </div>
        
        <div class="col-lg-8">
            <div class="card">
                <div class="card-header">
                    <h5 class="mb-0">📝 Add/Edit Manga</h5>
                </div>
                <div class="card-body">
                    <form id="addMangaForm">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label for="mangaId" class="form-label">Manga ID</label>
                                    <input type="text" class="form-control" id="mangaId" name="id" required>
                                    <div class="form-text">Unique identifier (auto-generated from title)</div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label for="mangaStatus" class="form-label">Status</label>
                                    <select class="form-select" id="mangaStatus" name="status">
                                        <option value="completed">Completed</option>
                                        <option value="ongoing">Ongoing</option>
                                        <option value="hiatus">Hiatus</option>
                                        <option value="cancelled">Cancelled</option>
                                        <option value="incomplete">Incomplete</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        
                        <div class="row">
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label for="mangaTitle" class="form-label">Title</label>
                                    <input type="text" class="form-control" id="mangaTitle" name="title" required>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label for="mangaAuthor" class="form-label">Author</label>
                                    <input type="text" class="form-control" id="mangaAuthor" name="author" required>
                                </div>
                            </div>
                        </div>
                        
                        <div class="mb-3">
                            <label class="form-label">Genres</label>
                            <div class="genre-checkbox-group">
                                <?php foreach ($mangaGenres as $genre): ?>
                                <div class="genre-checkbox">
                                    <input type="checkbox" class="form-check-input" 
                                           id="genre<?= $genre ?>" name="genres[]" value="<?= $genre ?>">
                                    <label class="form-check-label" for="genre<?= $genre ?>">
                                        <?= $genre ?>
                                    </label>
                                </div>
                                <?php endforeach; ?>
                            </div>
                        </div>
                        
                        <div class="mb-3">
                            <label for="mangaDescription" class="form-label">Description</label>
                            <textarea class="form-control" id="mangaDescription" name="description" rows="3"></textarea>
                        </div>
                        
                        <div class="row">
                            <div class="col-md-4">
                                <div class="mb-3 range-slider">
                                    <label for="mangaVolumes" class="form-label">
                                        Volumes: <span class="range-value">1</span>
                                    </label>
                                    <input type="range" class="form-range" id="mangaVolumes" name="volumes" 
                                           min="1" max="100" value="1">
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="mb-3 range-slider">
                                    <label for="mangaRating" class="form-label">
                                        Rating: <span class="range-value">8.0</span>
                                    </label>
                                    <input type="range" class="form-range" id="mangaRating" name="rating" 
                                           min="1" max="10" step="0.1" value="8.0">
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="mb-3 range-slider">
                                    <label for="mangaPopularity" class="form-label">
                                        Popularity: <span class="range-value">75</span>
                                    </label>
                                    <input type="range" class="form-range" id="mangaPopularity" name="popularity" 
                                           min="1" max="100" value="75">
                                </div>
                            </div>
                        </div>
                        
                        <div class="mb-3">
                            <label for="mangaYear" class="form-label">Publication Year</label>
                            <input type="number" class="form-control" id="mangaYear" name="year" 
                                   min="1950" max="<?= date('Y') ?>" placeholder="e.g., 1999">
                        </div>
                        
                        <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                            <button type="button" class="btn btn-outline-secondary" onclick="manager.resetForm()">
                                🔄 Reset
                            </button>
                            <button type="submit" class="btn btn-success">
                                ✅ Add Manga
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            
            <!-- Preview Section -->
            <div class="preview-section mt-4">
                <h6>TypeScript Preview:</h6>
                <pre id="previewCode" class="preview-code">// Enter manga details to see preview</pre>
            </div>
        </div>
    </div>
</div>

<!-- List Tab -->
<div id="listTab" class="tab-content" style="display: none;">
    <div class="card">
        <div class="card-header d-flex justify-content-between align-items-center">
            <h5 class="mb-0">📋 Current Mock Data</h5>
            <div>
                <button class="btn btn-outline-primary btn-sm" onclick="manager.loadMangaList()">
                    🔄 Refresh
                </button>
                <button class="btn btn-outline-success btn-sm">
                    📁 Create Backup
                </button>
            </div>
        </div>
        <div class="card-body">
            <div id="mangaListContainer">
                <p class="text-muted text-center">Loading manga list...</p>
            </div>
        </div>
    </div>
</div>

<!-- Logs Tab -->
<div id="logsTab" class="tab-content" style="display: none;">
    <div class="card">
        <div class="card-header d-flex justify-content-between align-items-center">
            <h5 class="mb-0">📝 System Logs</h5>
            <button class="btn btn-outline-primary btn-sm" onclick="manager.loadLogs()">
                🔄 Refresh Logs
            </button>
        </div>
        <div class="card-body">
            <pre id="logViewer" class="log-viewer">Loading logs...</pre>
        </div>
    </div>
</div>

<!-- Settings Tab -->
<div id="settingsTab" class="tab-content" style="display: none;">
    <div class="row">
        <div class="col-lg-6">
            <div class="card">
                <div class="card-header">
                    <h5 class="mb-0">⚙️ Configuration</h5>
                </div>
                <div class="card-body">
                    <h6>Amazon API Settings</h6>
                    <div class="mb-3">
                        <label class="form-label">Partner Tag</label>
                        <input type="text" class="form-control" value="mangacompass-20" readonly>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Region</label>
                        <input type="text" class="form-control" value="com" readonly>
                    </div>
                    
                    <hr>
                    
                    <h6>File Paths</h6>
                    <div class="mb-3">
                        <label class="form-label">Mock Data File</label>
                        <input type="text" class="form-control" value="../../src/lib/mockData.ts" readonly>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Backup Directory</label>
                        <input type="text" class="form-control" value="./backups/" readonly>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="col-lg-6">
            <div class="card">
                <div class="card-header">
                    <h5 class="mb-0">📊 Statistics</h5>
                </div>
                <div class="card-body">
                    <div class="row text-center">
                        <div class="col-4">
                            <h4 class="text-primary" id="totalManga">-</h4>
                            <small class="text-muted">Total Manga</small>
                        </div>
                        <div class="col-4">
                            <h4 class="text-success" id="apiCalls">-</h4>
                            <small class="text-muted">API Calls Today</small>
                        </div>
                        <div class="col-4">
                            <h4 class="text-warning" id="lastBackup">-</h4>
                            <small class="text-muted">Hours Since Backup</small>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="card mt-3">
                <div class="card-header">
                    <h5 class="mb-0">🔧 Actions</h5>
                </div>
                <div class="card-body">
                    <div class="d-grid gap-2">
                        <button class="btn btn-outline-primary">
                            🔄 Clear Cache
                        </button>
                        <button class="btn btn-outline-warning">
                            📁 View Backups
                        </button>
                        <button class="btn btn-outline-danger">
                            🗑️ Clear Logs
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<?php include_once 'templates/footer.php'; ?>