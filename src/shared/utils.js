/**
 * Utility functions
 */
export class Utils {
    /**
     * Debounce a function
     * @param {Function} func - Function to debounce
     * @param {number} delay - Delay in milliseconds
     * @returns {Function} Debounced function
     */
    static debounce(func, delay) {
        let timeoutId;
        return function (...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    }

    /**
     * Deep clone an object
     * @param {Object} obj - Object to clone
     * @returns {Object} Cloned object
     */
    static deepClone(obj) {
        if (obj === null || typeof obj !== 'object') {
            return obj;
        }
        if (obj instanceof Date) {
            return new Date(obj.getTime());
        }
        if (obj instanceof Array) {
            return obj.map(item => this.deepClone(item));
        }
        if (typeof obj === 'object') {
            const clonedObj = {};
            for (const key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key)) {
                    clonedObj[key] = this.deepClone(obj[key]);
                }
            }
            return clonedObj;
        }
    }

    /**
     * Check if object is empty
     * @param {Object} obj - Object to check
     * @returns {boolean} True if empty
     */
    static isEmpty(obj) {
        return Object.keys(obj).length === 0;
    }

    /**
     * Get hostname from URL
     * @param {string} url - URL to parse
     * @returns {string} Hostname
     */
    static getHostname(url) {
        try {
            return new URL(url).hostname;
        } catch {
            return window.location.hostname;
        }
    }

    /**
     * Get pathname from URL
     * @param {string} url - URL to parse
     * @returns {string} Pathname
     */
    static getPathname(url) {
        try {
            return new URL(url).pathname;
        } catch {
            return window.location.pathname;
        }
    }

    /**
     * Log with timestamp
     * @param {string} message - Message to log
     * @param {string} level - Log level (info, warn, error)
     */
    static log(message, level = 'info') {
        const timestamp = new Date().toISOString();
        const prefix = `[PureFeed ${timestamp}]`;

        switch (level) {
        case 'warn':
            console.warn(prefix, message);
            break;
        case 'error':
            console.error(prefix, message);                break;
        default:
            console.log(prefix, message);
        }
    }
}
