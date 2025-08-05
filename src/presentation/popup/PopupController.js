import { ChromeConfigRepository } from '../../infrastructure/repositories/ChromeConfigRepository.js';
import { ChromeSettingsRepository } from '../../infrastructure/repositories/ChromeSettingsRepository.js';
import { InitializeExtensionUseCase } from '../../application/usecases/InitializeExtensionUseCase.js';
import { ToggleExtensionUseCase } from '../../application/usecases/ToggleExtensionUseCase.js';
import { ToggleSectionUseCase } from '../../application/usecases/ToggleSectionUseCase.js';
import { MessageTypes } from '../../shared/constants.js';
import { Utils } from '../../shared/utils.js';

/**
 * Popup controller
 * Handles the popup UI logic and user interactions
 */
export class PopupController {
    constructor() {
        // Repositories
        this.configRepository = new ChromeConfigRepository();
        this.settingsRepository = new ChromeSettingsRepository();
        
        // Use cases
        this.initializeExtensionUseCase = new InitializeExtensionUseCase(
            this.configRepository, 
            this.settingsRepository
        );
        this.toggleExtensionUseCase = new ToggleExtensionUseCase(this.settingsRepository);
        this.toggleSectionUseCase = new ToggleSectionUseCase(this.settingsRepository);
        
        // State
        this.settings = null;
        this.sections = [];
        
        // DOM elements
        this.mainToggle = null;
        this.sectionsContainer = null;
        this.status = null;
        
        // Bound methods
        this.boundToggleExtension = this.toggleExtension.bind(this);
        
        this.init();
    }

    /**
     * Initialize the popup
     */
    async init() {
        try {
            Utils.log('Initializing popup...');
            
            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.initializeUI());
            } else {
                await this.initializeUI();
            }
        } catch (error) {
            Utils.log(`Failed to initialize popup: ${error.message}`, 'error');
        }
    }

    /**
     * Initialize the UI
     */
    async initializeUI() {
        try {
            // Get DOM elements
            this.getDOMElements();
            
            // Load data
            const initResult = await this.initializeExtensionUseCase.execute();
            this.settings = initResult.settings;
            this.sections = initResult.sections;
            
            // Setup UI
            this.setupMainToggle();
            this.setupSectionToggles();
            this.updateUI();
            
            Utils.log('Popup initialized successfully');
        } catch (error) {
            Utils.log(`Failed to initialize popup UI: ${error.message}`, 'error');
            this.showError('Failed to load extension data');
        }
    }

    /**
     * Get DOM elements
     */
    getDOMElements() {
        this.mainToggle = document.getElementById('mainToggle');
        this.sectionsContainer = document.getElementById('sectionsContainer');
        this.status = document.getElementById('status');
        
        if (!this.mainToggle || !this.sectionsContainer || !this.status) {
            throw new Error('Required DOM elements not found');
        }
    }

    /**
     * Setup main toggle
     */
    setupMainToggle() {
        this.mainToggle.addEventListener('click', this.boundToggleExtension);
    }

    /**
     * Setup section toggles
     */
    setupSectionToggles() {
        // Clear any existing content
        this.sectionsContainer.innerHTML = '';
        
        this.sections.forEach(section => {
            const sectionElement = this.createSectionElement(section);
            this.sectionsContainer.appendChild(sectionElement);
        });
    }

    /**
     * Create a section element
     */
    createSectionElement(section) {
        const sectionItem = document.createElement('div');
        sectionItem.className = 'section-item';
        
        const label = document.createElement('div');
        label.className = 'section-label';
        
        // Build label text with indicators
        //todo - keep this emojis ?
        // let labelText = section.name;
        // if (section.isRedirectSection()) {
        //     labelText += ' 🔄';
        // }
        // if (section.hasClickAction()) {
        //     labelText += ' 👆';
        // }
        
        label.textContent = section.name;
        
        const toggle = document.createElement('div');
        toggle.className = 'section-toggle';
        
        // Add special styling for redirect sections
        if (section.isRedirectSection()) {
            toggle.classList.add('redirect-toggle');
        }
        
        toggle.classList.toggle('active', this.settings.isSectionEnabled(section.id));
        toggle.dataset.sectionId = section.id;
        
        // Add click handler
        toggle.addEventListener('click', () => this.toggleSection(section.id, toggle));
        
        sectionItem.appendChild(label);
        sectionItem.appendChild(toggle);
        
        return sectionItem;
    }

    /**
     * Toggle extension
     */
    async toggleExtension() {
        try {
            const newState = await this.toggleExtensionUseCase.execute(this.settings);
            await this.notifyContentScript(MessageTypes.TOGGLE_EXTENSION, { enabled: newState });
            this.updateUI();
        } catch (error) {
            Utils.log(`Failed to toggle extension: ${error.message}`, 'error');
            this.showError('Failed to toggle extension');
        }
    }

    /**
     * Toggle section
     */
    async toggleSection(sectionId, toggleElement) {
        if (!this.settings.isEnabled()) {return;}
        
        try {
            const newState = await this.toggleSectionUseCase.execute(this.settings, sectionId);
            
            // Update UI
            toggleElement.classList.toggle('active', newState);
            
            // Find the section to determine message type
            const section = this.sections.find(s => s.id === sectionId);
            const messageType = section && section.isRedirectSection() && newState
                ? MessageTypes.CHECK_REDIRECT
                : MessageTypes.TOGGLE_SECTION;
            
            await this.notifyContentScript(messageType, {
                sectionId,
                enabled: newState
            });
            
            this.updateStatus();
        } catch (error) {
            Utils.log(`Failed to toggle section: ${error.message}`, 'error');
            this.showError('Failed to toggle section');
        }
    }

    /**
     * Update the entire UI
     */
    updateUI() {
        this.updateMainToggle();
        this.updateSectionsContainer();
        this.updateStatus();
    }

    /**
     * Update main toggle
     */
    updateMainToggle() {
        this.mainToggle.classList.toggle('active', this.settings.isEnabled());
    }

    /**
     * Update sections container
     */
    updateSectionsContainer() {
        this.sectionsContainer.classList.toggle('disabled', !this.settings.isEnabled());
    }

    /**
     * Update status text
     */
    updateStatus() {
        if (this.settings.isEnabled()) {
            const enabledSections = this.settings.getEnabledSections(this.sections);
            
            const hideCount = enabledSections.filter(s => s.isHideSection()).length;
            const redirectCount = enabledSections.filter(s => s.isRedirectSection()).length;
            
            let statusText = 'Extension enabled';
            if (hideCount > 0 || redirectCount > 0) {
                const parts = [];
                if (hideCount > 0) {parts.push(`${hideCount} sections hidden`);}
                if (redirectCount > 0) {parts.push(`${redirectCount} redirects active`);}
                statusText += ` - ${parts.join(', ')}`;
            }
            
            this.status.textContent = statusText;
            this.status.className = 'status enabled';
        } else {
            this.status.textContent = 'Extension disabled';
            this.status.className = 'status disabled';
        }
    }

    /**
     * Notify content script
     */
    async notifyContentScript(action, data = {}) {
        try {
            const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
            if (tabs[0]) {
                await chrome.tabs.sendMessage(tabs[0].id, { action, ...data });
            }
        } catch (error) {
            Utils.log(`Failed to notify content script: ${error.message}`, 'error');
        }
    }

    /**
     * Show error message
     */
    showError(message) {
        if (this.status) {
            this.status.textContent = message;
            this.status.className = 'status error';
        }
    }
}
