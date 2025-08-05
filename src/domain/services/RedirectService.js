/**
 * Redirect service
 * Handles URL redirections based on section configuration
 */
export class RedirectService {
    /**
     * Handle redirects for current URL
     * @param {Array<Section>} sections - Enabled redirect sections
     * @param {string} currentPath - Current URL path
     * @param {string} currentHost - Current hostname
     * @param {Function} redirectFunction - Function to perform redirect
     * @returns {boolean} True if redirect was performed
     */
    handleRedirects(sections, currentPath, currentHost, redirectFunction) {
        const redirectSections = sections.filter(
            section => section.isRedirectSection() && section.appliesToHostname(currentHost)
        );

        for (const section of redirectSections) {
            if (section.shouldRedirect(currentPath)) {
                const newUrl =
                    window.location.origin +
                    section.newPath +
                    window.location.search +
                    window.location.hash;

                console.warn(`Redirecting from ${currentPath} to ${section.newPath}`);
                redirectFunction(newUrl);
                return true; // Only redirect once
            }
        }

        return false;
    }

    /**
     * Check if any redirect sections are available for current platform
     * @param {Array<Section>} sections - All sections
     * @param {string} hostname - Current hostname
     * @returns {boolean} True if redirect sections exist for current platform
     */
    hasRedirectsForPlatform(sections, hostname) {
        return sections.some(
            section => section.isRedirectSection() && section.appliesToHostname(hostname)
        );
    }
}
