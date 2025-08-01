/**
 * Settings repository interface
 * Handles loading, saving and managing user settings
 */
export class SettingsRepository {
    /**
     * Load settings from storage
     * @returns {Promise<Settings>} Settings object
     */
    async loadSettings() {
        throw new Error('loadSettings method must be implemented');
    }

    /**
     * Save settings to storage
     * @param {Settings} _settings - Settings to save
     * @returns {Promise<void>}
     */
    async saveSettings(_settings) {
        throw new Error('saveSettings method must be implemented');
    }

    /**
     * Save extension enabled state
     * @param {boolean} _enabled - Extension enabled state
     * @returns {Promise<void>}
     */
    async saveExtensionEnabled(_enabled) {
        throw new Error('saveExtensionEnabled method must be implemented');
    }

    /**
     * Save section settings
     * @param {Object} _sectionSettings - Section settings object
     * @returns {Promise<void>}
     */
    async saveSectionSettings(_sectionSettings) {
        throw new Error('saveSectionSettings method must be implemented');
    }
}
