/**
 * Handle redirects use case
 */
export class HandleRedirectsUseCase {
    constructor(redirectService) {
        this.redirectService = redirectService;
    }

    /**
     * Execute the handle redirects use case
     * @param {Array<Section>} enabledSections - Enabled redirect sections
     * @param {string} currentPath - Current URL path
     * @param {string} currentHost - Current hostname
     * @param {Function} redirectFunction - Function to perform redirect
     * @returns {boolean} True if redirect was performed
     */
    execute(enabledSections, currentPath, currentHost, redirectFunction) {
        const redirectSections = enabledSections.filter(section => section.isRedirectSection());
        return this.redirectService.handleRedirects(redirectSections, currentPath, currentHost, redirectFunction);
    }
}
