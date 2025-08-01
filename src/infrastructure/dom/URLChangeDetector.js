/**
 * URL change detector for single-page applications
 */
export class URLChangeDetector {
    constructor(callback) {
        this.callback = callback;
        this.currentUrl = window.location.href;
        this.setupDetection();
    }

    /**
     * Setup URL change detection
     */
    setupDetection() {
        // Override history methods
        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;
        
        history.pushState = (...args) => {
            originalPushState.apply(history, args);
            this.checkUrlChange();
        };
        
        history.replaceState = (...args) => {
            originalReplaceState.apply(history, args);
            this.checkUrlChange();
        };
        
        // Listen for popstate events
        window.addEventListener('popstate', () => {
            this.checkUrlChange();
        });
    }

    /**
     * Check if URL has changed and call callback if it has
     */
    checkUrlChange() {
        setTimeout(() => {
            if (this.currentUrl !== window.location.href) {
                const previousUrl = this.currentUrl;
                this.currentUrl = window.location.href;
                this.callback(this.currentUrl, previousUrl);
            }
        }, 100);
    }

    /**
     * Get current URL
     */
    getCurrentUrl() {
        return this.currentUrl;
    }

    /**
     * Update current URL manually
     */
    updateCurrentUrl() {
        this.currentUrl = window.location.href;
    }
}
