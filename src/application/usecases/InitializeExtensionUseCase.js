/**
 * Initialize extension use case
 */
export class InitializeExtensionUseCase {
    constructor(configRepository, settingsRepository) {
        this.configRepository = configRepository;
        this.settingsRepository = settingsRepository;
    }

    /**
     * Execute the initialize extension use case
     * @returns {Promise<{config: Object, settings: Settings, sections: Array<Section>}>}
     */
    async execute() {
        // Load configuration
        const config = await this.configRepository.loadConfig();
        const sections = this.configRepository.getSections();
        
        // Load settings
        const settings = await this.settingsRepository.loadSettings();
        
        // Initialize section settings for any new sections
        settings.initializeSectionSettings(sections);
        
        // Save updated settings
        await this.settingsRepository.saveSettings(settings);
        
        return {
            config,
            settings,
            sections
        };
    }
}
