/**
 * Configuration repository interface
 * Handles loading and accessing configuration data
 */
export class ConfigRepository {
    /**
     * Load configuration from source
     * @returns {Promise<Object>} Configuration object
     */
    async loadConfig() {
        throw new Error('loadConfig method must be implemented');
    }

    /**
     * Get all sections from configuration
     * @returns {Array<Section>} Array of sections
     */
    getSections() {
        throw new Error('getSections method must be implemented');
    }

    /**
     * Get a specific section by ID
     * @param {string} _sectionId - Section identifier
     * @returns {Section|null} Section or null if not found
     */
    getSection(_sectionId) {
        throw new Error('getSection method must be implemented');
    }
}
