// Universal manifest generator - works with ANY domain automatically
const fs = require('fs');

console.log('Generating universal manifest with wildcard permissions...');

// Universal manifest that works with ALL websites
const universalManifest = {
    "manifest_version": 3,
    "name": "PureFeed - Social Media Cleaner",
    "version": "2.0",
    "description": "Clean up your social media feeds by hiding distracting sections and redirecting to focused content",
    "permissions": [
        "storage",
        "activeTab"
    ],
    // UNIVERSAL PERMISSIONS - Works on ANY website!
    "host_permissions": [
        "https://*/*",
        "http://*/*"
    ],
    "content_scripts": [
        {
            // UNIVERSAL MATCHES - Runs on ANY website!
            "matches": [
                "https://*/*",
                "http://*/*"
            ],
            "js": ["content-bundled.js"],
            "run_at": "document_start"
        }
    ],
    "action": {
        "default_popup": "popup.html",
        "default_title": "PureFeed"
    },
    "icons": {
        "16": "icons/icon16.png",
        "48": "icons/icon48.png",
        "128": "icons/icon128.png"
    },
    "web_accessible_resources": [
        {
            "resources": ["config.json"],
            "matches": ["<all_urls>"]
        }
    ]
};

// Modular version
const universalModularManifest = {
    ...universalManifest,
    "name": "PureFeed - Social Media Cleaner (Modular)",
    "content_scripts": [
        {
            "matches": [
                "https://*/*",
                "http://*/*"
            ],
            "js": ["src/content-main.js"],
            "type": "module",
            "run_at": "document_start"
        }
    ],
    "action": {
        "default_popup": "popup-template.html",
        "default_title": "PureFeed"
    },
    "web_accessible_resources": [
        {
            "resources": ["config.json", "src/**/*.js"],
            "matches": ["<all_urls>"]
        }
    ]
};

// Write universal manifests
fs.writeFileSync('manifest.json', JSON.stringify(universalManifest, null, 2));
fs.writeFileSync('manifest-modular.json', JSON.stringify(universalModularManifest, null, 2));

console.log('Generated UNIVERSAL manifest.json - works on ANY website!');
console.log('Generated UNIVERSAL manifest-modular.json');
console.log('Now you can add ANY platform to config.json without touching manifests!');
