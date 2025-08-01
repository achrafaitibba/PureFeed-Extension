import { ContentScriptController } from './presentation/content/ContentScriptController.js';

/**
 * Content script entry point
 * Initializes the extension in the content script context
 */
class ContentScriptMain {
    constructor() {
        this.controller = null;
        this.init();
    }

    /**
     * Initialize the content script
     */
    init() {
        // Initialize immediately if DOM is ready, otherwise wait
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeController());
        } else {
            this.initializeController();
        }

        // Cleanup on page unload
        window.addEventListener('beforeunload', () => this.cleanup());
    }

    /**
     * Initialize the controller
     */
    initializeController() {
        try {
            this.controller = new ContentScriptController();
        } catch (error) {
            console.error('Failed to initialize PureFeed extension:', error);
        }
    }

    /**
     * Cleanup resources
     */
    cleanup() {
        if (this.controller) {
            this.controller.destroy();
            this.controller = null;
        }
    }
}

// Initialize the extension
new ContentScriptMain();
