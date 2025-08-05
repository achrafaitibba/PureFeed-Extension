/**
 * Settings entity representing user preferences
 */
export class Settings {
    constructor({ extensionEnabled = true, sectionSettings = {} } = {}) {
        this.extensionEnabled = extensionEnabled;
        this.sectionSettings = sectionSettings;
    }

    /**
     * Check if extension is enabled
     */
    isEnabled() {
        return this.extensionEnabled;
    }

    /**
     * Check if a specific section is enabled
     */
    isSectionEnabled(sectionId) {
        return this.sectionSettings[sectionId] !== false; // Default to true
    }

    /**
     * Toggle extension on/off
     */
    toggleExtension() {
        this.extensionEnabled = !this.extensionEnabled;
        return this.extensionEnabled;
    }

    /**
     * Toggle a specific section on/off
     */
    toggleSection(sectionId) {
        this.sectionSettings[sectionId] = !this.isSectionEnabled(sectionId);
        return this.sectionSettings[sectionId];
    }

    /**
     * Initialize section settings for given sections
     */
    initializeSectionSettings(sections) {
        sections.forEach(section => {
            if (!(section.id in this.sectionSettings)) {
                this.sectionSettings[section.id] = true; // Default to enabled
            }
        });
    }

    /**
     * Get enabled sections from a list of sections
     */
    getEnabledSections(sections) {
        return sections.filter(section => this.isSectionEnabled(section.id));
    }

    /**
     * Convert to plain object for storage
     */
    toStorageObject() {
        return {
            extensionEnabled: this.extensionEnabled,
            sectionSettings: { ...this.sectionSettings }
        };
    }

    /**
     * Create from storage object
     */
    static fromStorageObject(obj = {}) {
        return new Settings({
            extensionEnabled: obj.extensionEnabled !== false,
            sectionSettings: obj.sectionSettings || {}
        });
    }
}
