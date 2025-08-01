import { PopupController } from './presentation/popup/PopupController.js';

/**
 * Popup script entry point
 * Initializes the popup interface
 */
class PopupMain {
    constructor() {
        this.controller = null;
        this.init();
    }

    /**
     * Initialize the popup
     */
    init() {
        try {
            this.controller = new PopupController();
        } catch (error) {
            console.error('Failed to initialize PureFeed popup:', error);
            this.showError();
        }
    }

    /**
     * Show error state in popup
     */
    showError() {
        const status = document.getElementById('status');
        if (status) {
            status.textContent = 'Error loading extension';
            status.className = 'status error';
        }
    }
}

// Initialize the popup
new PopupMain();
