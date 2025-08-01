/**
 * DOM manipulation utilities
 */
export class DOMManipulator {
    /**
     * Evaluate XPath expression and return matching elements
     * @param {string} xpath - XPath expression
     * @returns {Array<Element>} Array of matching elements
     */
    static getElementsByXPath(xpath) {
        const result = document.evaluate(
            xpath,
            document,
            null,
            XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
            null
        );
        
        const elements = [];
        for (let i = 0; i < result.snapshotLength; i++) {
            elements.push(result.snapshotItem(i));
        }
        
        return elements;
    }

    /**
     * Click an element by XPath
     * @param {string} xpath - XPath expression
     * @param {number} delay - Delay before clicking (default: 100ms)
     */
    static clickElementByXPath(xpath, delay = 100) {
        setTimeout(() => {
            try {
                const elements = this.getElementsByXPath(xpath);
                if (elements.length > 0) {
                    const element = elements[0];
                    if (element.offsetParent !== null) {
                        if (typeof element.click === 'function') {
                            element.click();
                        } else {
                            const clickEvent = new MouseEvent('click', {
                                bubbles: true,
                                cancelable: true,
                                view: window
                            });
                            element.dispatchEvent(clickEvent);
                        }
                        console.warn(`Clicked element with xpath: ${xpath}`);
                    }
                }
            } catch (error) {
                console.error(`Error clicking element with xpath ${xpath}:`, error);
            }
        }, delay);
    }

    /**
     * Create a mutation observer for DOM changes
     * @param {Function} callback - Callback function for mutations
     * @param {Object} _options - Observer options (unused in current implementation)
     * @returns {MutationObserver} Created observer
     */
    static createMutationObserver(callback, _options = { childList: true, subtree: true }) {
        return new MutationObserver(callback);
    }

    /**
     * Debounce a function call
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
}
