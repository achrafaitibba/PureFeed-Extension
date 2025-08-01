/**
 * Toggle section use case
 */
export class ToggleSectionUseCase {
    constructor(settingsRepository) {
        this.settingsRepository = settingsRepository;
    }

    /**
     * Execute the toggle section use case
     * @param {Settings} settings - Current settings
     * @param {string} sectionId - Section ID to toggle
     * @returns {Promise<boolean>} New section enabled state
     */
    async execute(settings, sectionId) {
        const newState = settings.toggleSection(sectionId);
        await this.settingsRepository.saveSectionSettings(settings.sectionSettings);
        return newState;
    }
}
