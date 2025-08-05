import { ConfigRepository } from '../../domain/repositories/ConfigRepository.js';
import { Section } from '../../domain/entities/Section.js';

/**
 * Chrome extension configuration repository implementation
 */
export class ChromeConfigRepository extends ConfigRepository {
    constructor() {
        super();
        this.config = null;
        this.sections = [];
    }

    /**
     * Load configuration from config.json file
     * @returns {Promise<Object>} Configuration object
     */
    async loadConfig() {
        try {
            const response = await fetch(chrome.runtime.getURL('config.json'));
            this.config = await response.json();

            // Convert raw config to Section entities
            this.sections = (this.config.sections || []).map(
                sectionData => new Section(sectionData)
            );

            return this.config;
        } catch (error) {
            console.error('Failed to load config:', error);
            this.config = { sections: [] };
            this.sections = [];
            return this.config;
        }
    }

    /**
     * Get all sections
     * @returns {Array<Section>} Array of sections
     */
    getSections() {
        return [...this.sections];
    }

    /**
     * Get a specific section by ID
     * @param {string} sectionId - Section identifier
     * @returns {Section|null} Section or null if not found
     */
    getSection(sectionId) {
        return this.sections.find(section => section.id === sectionId) || null;
    }
}
