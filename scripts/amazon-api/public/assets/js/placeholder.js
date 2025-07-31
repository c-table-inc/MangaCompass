/**
 * Local placeholder images to avoid external dependencies
 */

// Pre-generated placeholder images for common sizes using SVG
const PlaceholderImages = {
    // Small thumbnail (50x70)
    thumbnail: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`
        <svg width="50" height="70" xmlns="http://www.w3.org/2000/svg">
            <rect width="50" height="70" fill="#f1f5f9" stroke="#e2e8f0" stroke-width="1"/>
            <rect x="15" y="20" width="20" height="26" fill="#94a3b8"/>
            <rect x="17" y="22" width="16" height="22" fill="#cbd5e1"/>
            <text x="25" y="55" font-family="Arial,sans-serif" font-size="8" text-anchor="middle" fill="#64748b">No Image</text>
        </svg>
    `),
    
    // Medium card (300x400)  
    card: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`
        <svg width="300" height="400" xmlns="http://www.w3.org/2000/svg">
            <rect width="300" height="400" fill="#f1f5f9" stroke="#e2e8f0" stroke-width="2"/>
            <rect x="130" y="160" width="40" height="52" fill="#94a3b8"/>
            <rect x="133" y="163" width="34" height="46" fill="#cbd5e1"/>
            <text x="150" y="240" font-family="Arial,sans-serif" font-size="16" font-weight="bold" text-anchor="middle" fill="#64748b">No Image</text>
            <text x="150" y="260" font-family="Arial,sans-serif" font-size="12" text-anchor="middle" fill="#94a3b8">Available</text>
        </svg>
    `),
    
    // Large preview
    large: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`
        <svg width="400" height="500" xmlns="http://www.w3.org/2000/svg">
            <rect width="400" height="500" fill="#f1f5f9" stroke="#e2e8f0" stroke-width="2"/>
            <rect x="180" y="200" width="40" height="52" fill="#94a3b8"/>
            <rect x="183" y="203" width="34" height="46" fill="#cbd5e1"/>
            <text x="200" y="280" font-family="Arial,sans-serif" font-size="18" font-weight="bold" text-anchor="middle" fill="#64748b">No Image</text>
            <text x="200" y="305" font-family="Arial,sans-serif" font-size="14" text-anchor="middle" fill="#94a3b8">Available</text>
        </svg>
    `)
};

// Function to get appropriate placeholder
function getPlaceholderImage(type = 'card') {
    return PlaceholderImages[type] || PlaceholderImages.card;
}

// Export for use in main.js
window.PlaceholderImages = PlaceholderImages;
window.getPlaceholderImage = getPlaceholderImage;