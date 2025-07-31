    </main>
    
    <!-- Footer -->
    <footer class="footer mt-5">
        <div class="container">
            <div class="row">
                <div class="col-md-6">
                    <p class="mb-0">
                        <strong>MangaCompass Data Manager</strong> - 
                        Amazon API Integration Tool
                    </p>
                </div>
                <div class="col-md-6 text-md-end">
                    <p class="mb-0">
                        Last Updated: <span id="lastUpdated">Never</span>
                    </p>
                </div>
            </div>
        </div>
    </footer>
    
    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    
    <!-- Custom JS -->
    <script src="assets/js/placeholder.js"></script>
    <script src="assets/js/main.js"></script>
    
    <script>
        // Update last updated timestamp
        document.getElementById('lastUpdated').textContent = new Date().toLocaleString();
    </script>
</body>
</html>