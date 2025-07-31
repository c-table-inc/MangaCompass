<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MangaCompass Data Manager</title>
    
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    
    <!-- Custom CSS -->
    <link href="assets/css/style.css" rel="stylesheet">
</head>
<body>
    <!-- Header -->
    <header class="header">
        <div class="container">
            <div class="row align-items-center">
                <div class="col">
                    <h1>📚 MangaCompass Data Manager</h1>
                    <p class="mb-0 opacity-75">Amazon API Integration for Mock Data Management</p>
                </div>
                <div class="col-auto">
                    <span class="badge bg-light text-dark">
                        Status: <span id="connectionStatus" class="text-success">Connected</span>
                    </span>
                </div>
            </div>
        </div>
    </header>
    
    <!-- Navigation -->
    <nav class="navbar navbar-expand-lg navbar-light bg-white border-bottom">
        <div class="container">
            <ul class="nav nav-tabs border-0 w-100">
                <li class="nav-item">
                    <a class="nav-link active" href="#" data-tab="search">
                        🔍 Search & Add
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#" data-tab="list">
                        📋 Current Data
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#" data-tab="logs">
                        📝 Logs
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#" data-tab="settings">
                        ⚙️ Settings
                    </a>
                </li>
            </ul>
        </div>
    </nav>
    
    <!-- Main Content -->
    <main class="container py-4">