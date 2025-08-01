/**
 * Toggle extension use case
 */
export class ToggleExtensionUseCase {
    constructor(settingsRepository) {
        this.settingsRepository = settingsRepository;
    }

    /**
     * Execute the toggle extension use case
     * @param {Settings} settings - Current settings
     * @returns {Promise<boolean>} New extension enabled state
     */
    async execute(settings) {
        const newState = settings.toggleExtension();
        await this.settingsRepository.saveExtensionEnabled(newState);
        return newState;
    }
}
