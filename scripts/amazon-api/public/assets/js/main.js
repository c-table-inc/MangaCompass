/**
 * MangaCompass Data Manager - Main JavaScript
 */

class MangaDataManager {
    constructor() {
        this.currentTab = 'search';
        this.searchResults = [];
        this.selectedProduct = null;
        this.mangaList = [];
        
        this.init();
    }
    
    init() {
        this.bindEventListeners();
        this.loadMangaList();
        this.showTab('search');
    }
    
    bindEventListeners() {
        // Tab navigation
        document.querySelectorAll('[data-tab]').forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                const tabName = e.target.getAttribute('data-tab');
                this.showTab(tabName);
            });
        });
        
        // Search form
        const searchForm = document.getElementById('searchForm');
        if (searchForm) {
            searchForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.performSearch();
            });
        }
        
        // Add manga form
        const addMangaForm = document.getElementById('addMangaForm');
        if (addMangaForm) {
            addMangaForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addManga();
            });
        }
        
        // Range sliders
        document.querySelectorAll('input[type="range"]').forEach(slider => {
            slider.addEventListener('input', (e) => {
                const valueDisplay = e.target.parentNode.querySelector('.range-value');
                if (valueDisplay) {
                    valueDisplay.textContent = e.target.value;
                }
            });
        });
        
        // Auto-generate ID from title
        const titleInput = document.getElementById('mangaTitle');
        const idInput = document.getElementById('mangaId');
        if (titleInput && idInput) {
            titleInput.addEventListener('input', (e) => {
                if (!idInput.dataset.userModified) {
                    idInput.value = this.generateMangaId(e.target.value);
                }
            });
            
            idInput.addEventListener('input', () => {
                idInput.dataset.userModified = 'true';
            });
        }
    }
    
    showTab(tabName) {
        // Update active tab
        document.querySelectorAll('[data-tab]').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        
        // Show corresponding content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.style.display = 'none';
        });
        document.getElementById(`${tabName}Tab`).style.display = 'block';
        
        this.currentTab = tabName;
        
        // Load tab-specific data
        if (tabName === 'list') {
            this.loadMangaList();
        } else if (tabName === 'logs') {
            this.loadLogs();
        }
    }
    
    async performSearch() {
        const query = document.getElementById('searchQuery').value.trim();
        const searchType = document.getElementById('searchType').value;
        
        if (!query) {
            this.showMessage('Please enter a search query', 'warning');
            return;
        }
        
        this.showLoading('searchResults', true);
        
        try {
            const response = await fetch('api/search.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query: query,
                    type: searchType
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                this.searchResults = data.data;
                this.displaySearchResults();
                this.showMessage(`Found ${data.data.length} results`, 'success');
            } else {
                throw new Error(data.message || 'Search failed');
            }
        } catch (error) {
            console.error('Search error:', error);
            this.showMessage('Search failed: ' + error.message, 'error');
        } finally {
            this.showLoading('searchResults', false);
        }
    }
    
    displaySearchResults() {
        const container = document.getElementById('searchResults');
        
        if (this.searchResults.length === 0) {
            container.innerHTML = '<div class="col-12"><p class="text-muted text-center">No results found</p></div>';
            return;
        }
        
        container.innerHTML = this.searchResults.map(product => `
            <div class="col-md-4 col-lg-3">
                <div class="card search-result-card" onclick="manager.selectProduct('${product.asin}')">
                    <img src="${product.image_url || product.imageUrl || getPlaceholderImage('card')}" 
                         class="card-img-top search-result-image" 
                         alt="${product.title}" 
                         onerror="this.src=getPlaceholderImage('card')"
                         loading="lazy">
                    <div class="card-body">
                        <h6 class="search-result-title">${product.title}</h6>
                        <p class="search-result-author text-muted">${product.author}</p>
                        <p class="search-result-price">${product.price}</p>
                        <small class="text-muted">ASIN: ${product.asin}</small>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    selectProduct(asin) {
        this.selectedProduct = this.searchResults.find(p => p.asin === asin);
        if (this.selectedProduct) {
            this.populateAddForm();
            this.showTab('add');
        }
    }
    
    populateAddForm() {
        if (!this.selectedProduct) return;
        
        const form = document.getElementById('addMangaForm');
        const p = this.selectedProduct;
        
        // Populate form fields
        form.querySelector('#mangaTitle').value = p.title;
        form.querySelector('#mangaAuthor').value = p.author;
        form.querySelector('#mangaDescription').value = p.description || '';
        form.querySelector('#mangaId').value = this.generateMangaId(p.title);
        
        // Show product preview
        document.getElementById('productPreview').innerHTML = `
            <div class="card">
                <div class="card-header">
                    <h6>Selected Product</h6>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-4">
                            <img src="${p.image_url || p.imageUrl || getPlaceholderImage('large')}" 
                                 class="img-fluid rounded" alt="${p.title}"
                                 onerror="this.src=getPlaceholderImage('large')"
                                 loading="lazy">
                        </div>
                        <div class="col-md-8">
                            <h6>${p.title}</h6>
                            <p class="text-muted">${p.author}</p>
                            <p><strong>Price:</strong> ${p.price}</p>
                            <p><strong>ASIN:</strong> ${p.asin}</p>
                            <p class="small">${p.description}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Auto-select genres based on categories
        this.autoSelectGenres(p.categories || []);
        
        // Update preview
        this.updatePreview();
    }
    
    autoSelectGenres(categories) {
        // Clear existing selections
        document.querySelectorAll('.genre-checkbox input[type="checkbox"]').forEach(cb => {
            cb.checked = false;
        });
        
        // Genre mapping logic
        const genreMap = {
            'action': ['action'],
            'adventure': ['adventure'],
            'romance': ['romance'],
            'comedy': ['comedy'],
            'humor': ['comedy'],
            'fantasy': ['fantasy'],
            'science fiction': ['sci-fi'],
            'horror': ['horror'],
            'mystery': ['mystery'],
            'drama': ['drama'],
            'school': ['school'],
            'sports': ['sports'],
            'supernatural': ['supernatural']
        };
        
        const selectedGenres = new Set();
        
        categories.forEach(category => {
            const lowerCategory = category.toLowerCase();
            Object.keys(genreMap).forEach(key => {
                if (lowerCategory.includes(key)) {
                    genreMap[key].forEach(genre => selectedGenres.add(genre));
                }
            });
        });
        
        // If no genres detected, default to Adventure
        if (selectedGenres.size === 0) {
            selectedGenres.add('adventure');
        }
        
        // Check the appropriate checkboxes
        selectedGenres.forEach(genre => {
            const checkbox = document.querySelector(`input[value="${genre}"]`);
            if (checkbox) {
                checkbox.checked = true;
            }
        });
    }
    
    updatePreview() {
        const formData = this.getFormData();
        const tsCode = this.generateTypeScriptCode(formData);
        
        document.getElementById('previewCode').textContent = tsCode;
    }
    
    getFormData() {
        const form = document.getElementById('addMangaForm');
        const formData = new FormData(form);
        
        const data = {
            id: formData.get('id'),
            title: formData.get('title'),
            author: formData.get('author'),
            genres: formData.getAll('genres'),
            status: formData.get('status'),
            volumes: parseInt(formData.get('volumes')) || 1,
            rating: parseFloat(formData.get('rating')) || 8.0,
            description: formData.get('description'),
            popularity: parseInt(formData.get('popularity')) || 75,
            year: parseInt(formData.get('year')) || null
        };
        
        if (this.selectedProduct) {
            data.asin = this.selectedProduct.asin;
            data.imageUrl = this.selectedProduct.image_url;
            data.amazonLink = `https://amazon.com/dp/${this.selectedProduct.asin}/?tag=mangacompass-20`;
        }
        
        return data;
    }
    
    generateTypeScriptCode(data) {
        const formatValue = (value) => {
            if (typeof value === 'string') {
                return `'${value.replace(/'/g, "\\'")}'`;
            } else if (Array.isArray(value)) {
                return `[${value.map(v => `'${v}'`).join(', ')}]`;
            } else if (value === null) {
                return 'null';
            } else {
                return value;
            }
        };
        
        let code = '  {\n';
        Object.entries(data).forEach(([key, value]) => {
            if (value !== null && value !== '' && !(Array.isArray(value) && value.length === 0)) {
                code += `    ${key}: ${formatValue(value)},\n`;
            }
        });
        code += '  },';
        
        return code;
    }
    
    async addManga() {
        const formData = this.getFormData();
        
        this.showLoading('addMangaForm', true);
        
        try {
            const response = await fetch('api/add.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    manga_data: formData
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                this.showMessage('Manga added successfully!', 'success');
                this.resetForm();
                this.loadMangaList();
            } else {
                throw new Error(data.message || 'Failed to add manga');
            }
        } catch (error) {
            console.error('Add manga error:', error);
            this.showMessage('Failed to add manga: ' + error.message, 'error');
        } finally {
            this.showLoading('addMangaForm', false);
        }
    }
    
    async loadMangaList() {
        if (this.currentTab !== 'list') return;
        
        this.showLoading('mangaListContainer', true);
        
        try {
            const response = await fetch('api/list.php');
            const data = await response.json();
            
            if (data.success) {
                this.mangaList = data.data;
                this.displayMangaList();
            } else {
                throw new Error(data.message || 'Failed to load manga list');
            }
        } catch (error) {
            console.error('Load manga list error:', error);
            this.showMessage('Failed to load manga list: ' + error.message, 'error');
        } finally {
            this.showLoading('mangaListContainer', false);
        }
    }
    
    displayMangaList() {
        const container = document.getElementById('mangaListContainer');
        
        if (this.mangaList.length === 0) {
            container.innerHTML = '<p class="text-muted text-center">No manga found</p>';
            return;
        }
        
        const tableHTML = `
            <table class="table table-striped manga-list-table">
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Genres</th>
                        <th>Rating</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${this.mangaList.map(manga => `
                        <tr>
                            <td>
                                <img src="${manga.imageUrl || manga.coverImage || getPlaceholderImage('thumbnail')}" 
                                     class="manga-thumbnail" alt="${manga.title}"
                                     onerror="this.src=getPlaceholderImage('thumbnail')"
                                     loading="lazy">
                            </td>
                            <td><strong>${manga.title}</strong></td>
                            <td>${manga.author}</td>
                            <td><small>${(manga.genres || []).join(', ')}</small></td>
                            <td><span class="badge bg-primary">${manga.rating || 'N/A'}</span></td>
                            <td><span class="badge bg-secondary">${manga.status || 'unknown'}</span></td>
                            <td>
                                <button class="btn btn-sm btn-outline-primary" onclick="manager.editManga('${manga.id}')">
                                    Edit
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        
        container.innerHTML = tableHTML;
    }
    
    async loadLogs() {
        if (this.currentTab !== 'logs') return;
        
        try {
            const response = await fetch('api/logs.php');
            const data = await response.json();
            
            if (data.success) {
                document.getElementById('logViewer').textContent = data.logs;
            } else {
                throw new Error(data.message || 'Failed to load logs');
            }
        } catch (error) {
            console.error('Load logs error:', error);
            document.getElementById('logViewer').textContent = 'Failed to load logs: ' + error.message;
        }
    }
    
    generateMangaId(title) {
        return title.toLowerCase()
                   .replace(/,?\s*vol\.?\s*\d+/gi, '')
                   .replace(/,?\s*volume\s*\d+/gi, '')
                   .replace(/[^a-z0-9]+/g, '-')
                   .replace(/^-+|-+$/g, '') + '-1';
    }
    
    resetForm() {
        document.getElementById('addMangaForm').reset();
        document.getElementById('productPreview').innerHTML = '';
        document.getElementById('previewCode').textContent = '';
        this.selectedProduct = null;
        
        // Reset range value displays
        document.querySelectorAll('.range-value').forEach(valueDisplay => {
            const slider = valueDisplay.parentNode.querySelector('input[type="range"]');
            if (slider) {
                valueDisplay.textContent = slider.value;
            }
        });
        
        // Reset ID generation flag
        document.getElementById('mangaId').dataset.userModified = 'false';
    }
    
    showLoading(elementId, show) {
        const element = document.getElementById(elementId);
        if (show) {
            element.classList.add('loading');
        } else {
            element.classList.remove('loading');
        }
    }
    
    showMessage(message, type = 'info') {
        const alertClass = {
            'success': 'alert-success',
            'error': 'alert-danger',
            'warning': 'alert-warning',
            'info': 'alert-info'
        }[type] || 'alert-info';
        
        const alertHTML = `
            <div class="alert ${alertClass} alert-dismissible fade show status-message" role="alert">
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;
        
        // Remove existing messages
        document.querySelectorAll('.status-message').forEach(msg => msg.remove());
        
        // Add new message
        document.body.insertAdjacentHTML('beforeend', alertHTML);
        
        // Auto-dismiss after 5 seconds
        setTimeout(() => {
            document.querySelectorAll('.status-message').forEach(msg => {
                if (msg.parentNode) {
                    msg.remove();
                }
            });
        }, 5000);
    }
    
    editManga(mangaId) {
        // This would open an edit form - simplified for demo
        this.showMessage(`Edit functionality for ${mangaId} would be implemented here`, 'info');
    }
}

// Initialize the manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.manager = new MangaDataManager();
    
    // Update preview when form changes
    document.addEventListener('input', (e) => {
        if (e.target.closest('#addMangaForm')) {
            window.manager.updatePreview();
        }
    });
    
    document.addEventListener('change', (e) => {
        if (e.target.closest('#addMangaForm')) {
            window.manager.updatePreview();
        }
    });
});