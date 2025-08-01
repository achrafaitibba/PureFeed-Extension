// Build script to bundle modules into a single file
const fs = require('fs');
const path = require('path');

console.log('Starting PureFeed build process...');

// Step 1: Generate universal manifests (works on ANY website)
console.log('Generating universal manifests...');
require('./generate-universal-manifest.cjs');

// Step 2: Bundle the modules
console.log('Bundling modules...');

// // Read all the source files and combine them
// const srcDir = 'src';

// Order matters - dependencies first
const files = [
    // Shared utilities
    'src/shared/constants.js',
    'src/shared/utils.js',
    
    // Domain entities
    'src/domain/entities/HiddenElement.js',
    'src/domain/entities/Section.js',
    'src/domain/entities/Settings.js',
    
    // Domain repositories (interfaces)
    'src/domain/repositories/ConfigRepository.js',
    'src/domain/repositories/SettingsRepository.js',
    
    // Domain services
    'src/domain/services/ElementHidingService.js',
    'src/domain/services/RedirectService.js',
    
    // Infrastructure
    'src/infrastructure/dom/DOMManipulator.js',
    'src/infrastructure/dom/URLChangeDetector.js',
    'src/infrastructure/repositories/ChromeConfigRepository.js',
    'src/infrastructure/repositories/ChromeSettingsRepository.js',
    
    // Application
    'src/application/usecases/InitializeExtensionUseCase.js',
    'src/application/usecases/ToggleExtensionUseCase.js',
    'src/application/usecases/ToggleSectionUseCase.js',
    'src/application/usecases/ApplySectionHidingUseCase.js',
    'src/application/usecases/HandleRedirectsUseCase.js',
    
    // Presentation
    'src/presentation/content/ContentScriptController.js',
    'src/content-main.js'
];

let bundledContent = '// Bundled PureFeed Extension Content Script\n';
bundledContent += '// Generated automatically - do not edit directly\n\n';

files.forEach(file => {
    if (fs.existsSync(file)) {
        console.log(`Adding ${file}...`);
        let content = fs.readFileSync(file, 'utf8');
        
        // Remove import statements
        content = content.replace(/^import\s+.*?from\s+.*?;?\s*$/gm, '');
        
        // Remove export statements but keep the classes/functions
        content = content.replace(/^export\s+/gm, '');
        
        bundledContent += `// === ${file} ===\n`;
        bundledContent += content;
        bundledContent += '\n\n';
    } else {
        console.warn(`File not found: ${file}`);
    }
});

// Write bundled file
fs.writeFileSync('content-bundled.js', bundledContent);
console.log('Bundle created: content-bundled.js');

// Also create popup bundle
//todo - make it dynamically analyse whole project, no hard coded files paths
const popupFiles = [
    'src/shared/constants.js',
    'src/shared/utils.js',
    'src/domain/entities/Settings.js',
    'src/domain/entities/Section.js',
    'src/domain/repositories/ConfigRepository.js',
    'src/domain/repositories/SettingsRepository.js',
    'src/infrastructure/repositories/ChromeConfigRepository.js',
    'src/infrastructure/repositories/ChromeSettingsRepository.js',
    'src/application/usecases/InitializeExtensionUseCase.js',
    'src/application/usecases/ToggleExtensionUseCase.js',
    'src/application/usecases/ToggleSectionUseCase.js',
    'src/presentation/popup/PopupController.js',
    'src/popup-main.js'
];

let popupBundled = '// Bundled PureFeed Extension Popup Script\n';
popupBundled += '// Generated automatically - do not edit directly\n\n';

popupFiles.forEach(file => {
    if (fs.existsSync(file)) {
        console.log(`Adding ${file} to popup...`);
        let content = fs.readFileSync(file, 'utf8');
        
        // Remove import statements
        content = content.replace(/^import\s+.*?from\s+.*?;?\s*$/gm, '');
        
        // Remove export statements but keep the classes/functions
        content = content.replace(/^export\s+/gm, '');
        
        popupBundled += `// === ${file} ===\n`;
        popupBundled += content;
        popupBundled += '\n\n';
    }
});

fs.writeFileSync('popup-bundled.js', popupBundled);
console.log('Popup bundle created: popup-bundled.js');

// Step 3: Update popup.html to use bundled script for production
console.log('Updating popup.html for production...');
if (fs.existsSync('popup.html')) {
    let popupContent = fs.readFileSync('popup.html', 'utf8');
    
    // Replace modular script with bundled script
    popupContent = popupContent.replace(
        '<script type="module" src="src/popup-main.js"></script>',
        '<script src="popup-bundled.js"></script>'
    );
    
    // Remove DEV mode indicator for production
    popupContent = popupContent.replace(
        /<div style="position: fixed;[^>]*>DEV mode<\/div>\s*/,
        ''
    );
    
    fs.writeFileSync('popup.html', popupContent);
    console.log('popup.html updated to use bundled script');
    console.log('DEV indicator removed for production');
} else {
    console.warn('popup.html not found');
}

console.log('Production build complete!');
