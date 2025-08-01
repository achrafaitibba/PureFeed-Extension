import { SettingsRepository } from '../../domain/repositories/SettingsRepository.js';
import { Settings } from '../../domain/entities/Settings.js';

/**
 * Chrome extension settings repository implementation
 */
export class ChromeSettingsRepository extends SettingsRepository {
    /**
     * Load settings from Chrome storage
     * @returns {Promise<Settings>} Settings object
     */
    async loadSettings() {
        try {
            const result = await chrome.storage.sync.get(['extensionEnabled', 'sectionSettings']);
            return Settings.fromStorageObject(result);
        } catch (error) {
            console.error('Failed to load settings:', error);
            return new Settings();
        }
    }

    /**
     * Save settings to Chrome storage
     * @param {Settings} settings - Settings to save
     * @returns {Promise<void>}
     */
    async saveSettings(settings) {
        try {
            await chrome.storage.sync.set(settings.toStorageObject());
        } catch (error) {
            console.error('Failed to save settings:', error);
            throw error;
        }
    }

    /**
     * Save extension enabled state
     * @param {boolean} enabled - Extension enabled state
     * @returns {Promise<void>}
     */
    async saveExtensionEnabled(enabled) {
        try {
            await chrome.storage.sync.set({ extensionEnabled: enabled });
        } catch (error) {
            console.error('Failed to save extension enabled state:', error);
            throw error;
        }
    }

    /**
     * Save section settings
     * @param {Object} sectionSettings - Section settings object
     * @returns {Promise<void>}
     */
    async saveSectionSettings(sectionSettings) {
        try {
            await chrome.storage.sync.set({ sectionSettings });
        } catch (error) {
            console.error('Failed to save section settings:', error);
            throw error;
        }
    }
}
