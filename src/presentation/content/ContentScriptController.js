import { ChromeConfigRepository } from '../../infrastructure/repositories/ChromeConfigRepository.js';
import { ChromeSettingsRepository } from '../../infrastructure/repositories/ChromeSettingsRepository.js';
import { ElementHidingService } from '../../domain/services/ElementHidingService.js';
import { RedirectService } from '../../domain/services/RedirectService.js';
import { DOMManipulator } from '../../infrastructure/dom/DOMManipulator.js';
import { URLChangeDetector } from '../../infrastructure/dom/URLChangeDetector.js';
import { InitializeExtensionUseCase } from '../../application/usecases/InitializeExtensionUseCase.js';
import { ApplySectionHidingUseCase } from '../../application/usecases/ApplySectionHidingUseCase.js';
import { HandleRedirectsUseCase } from '../../application/usecases/HandleRedirectsUseCase.js';
import { MessageTypes, DefaultConfig } from '../../shared/constants.js';
import { Utils } from '../../shared/utils.js';

/**
 * Content script controller
 * Orchestrates the extension functionality in the content script context
 */
export class ContentScriptController {
    constructor() {
        // Repositories
        this.configRepository = new ChromeConfigRepository();
        this.settingsRepository = new ChromeSettingsRepository();
        
        // Services
        this.elementHidingService = new ElementHidingService();
        this.redirectService = new RedirectService();
        
        // Use cases
        this.initializeExtensionUseCase = new InitializeExtensionUseCase(
            this.configRepository, 
            this.settingsRepository
        );
        this.applySectionHidingUseCase = new ApplySectionHidingUseCase(this.elementHidingService);
        this.handleRedirectsUseCase = new HandleRedirectsUseCase(this.redirectService);
        
        // State
        this.settings = null;
        this.sections = [];
        this.observer = null;
        this.urlChangeDetector = null;
        this.initialized = false;
        
        // Bound methods for event handlers
        this.boundHandleMessage = this.handleMessage.bind(this);
        this.boundHandleUrlChange = this.handleUrlChange.bind(this);
        this.boundHandleDOMUpdates = Utils.debounce(
            this.handleDOMUpdates.bind(this), 
            DefaultConfig.DEBOUNCE_DELAY
        );
        
        this.init();
    }

    /**
     * Initialize the content script
     */
    async init() {
        try {
            Utils.log('Initializing PureFeed extension...');
            
            // Initialize extension data
            const initResult = await this.initializeExtensionUseCase.execute();
            this.settings = initResult.settings;
            this.sections = initResult.sections;
            
            // Smart platform detection - only activate if current site has sections
            const currentHostname = window.location.hostname;
            const hasSectionsForThisSite = this.sections.some(section => 
                section.appliesToHostname(currentHostname)
            );
            
            if (!hasSectionsForThisSite) {
                Utils.log(`No sections configured for ${currentHostname}, extension inactive`);
                return; // Don't initialize if no sections for this site
            }
            
            Utils.log(`Found sections for ${currentHostname}, activating extension`);
            
            // Setup event listeners
            this.setupMessageListener();
            this.setupUrlChangeDetection();
            this.setupDOMObserver();
            
            // Handle initial state
            await this.handleInitialState();
            
            this.initialized = true;
            Utils.log('PureFeed extension initialized successfully');
        } catch (error) {
            Utils.log(`Failed to initialize extension: ${error.message}`, 'error');
        }
    }

    /**
     * Handle initial state - redirects and hiding
     */
    async handleInitialState() {
        if (!this.settings.isEnabled()) {return;}
        
        const enabledSections = this.settings.getEnabledSections(this.sections);
        
        // Handle redirects first
        this.handleRedirects(enabledSections);
        
        // Apply initial hiding
        this.applyHiding(enabledSections);
    }

    /**
     * Setup message listener for communication with popup
     */
    setupMessageListener() {
        chrome.runtime.onMessage.addListener(this.boundHandleMessage);
    }

    /**
     * Setup URL change detection
     */
    setupUrlChangeDetection() {
        this.urlChangeDetector = new URLChangeDetector(this.boundHandleUrlChange);
    }

    /**
     * Setup DOM mutation observer
     */
    setupDOMObserver() {
        this.observer = DOMManipulator.createMutationObserver((mutations) => {
            let shouldReapply = false;
            
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    shouldReapply = true;
                }
            });
            
            if (shouldReapply && this.settings && this.settings.isEnabled()) {
                this.boundHandleDOMUpdates();
            }
        });
        
        if (document.body) {
            this.observer.observe(document.body, DefaultConfig.MUTATION_OBSERVER_OPTIONS);
        } else {
            // If body is not ready, wait for it
            document.addEventListener('DOMContentLoaded', () => {
                if (this.observer && document.body) {
                    this.observer.observe(document.body, DefaultConfig.MUTATION_OBSERVER_OPTIONS);
                }
            });
        }
    }

    /**
     * Handle messages from popup
     */
    handleMessage(message, _sender, _sendResponse) {
        try {
            switch (message.action) {
            case MessageTypes.TOGGLE_EXTENSION:
                this.handleToggleExtension(message.enabled);
                break;
                    
            case MessageTypes.TOGGLE_SECTION:
                this.handleToggleSection(message.sectionId, message.enabled);
                break;
                    
            case MessageTypes.CHECK_REDIRECT:
                this.handleCheckRedirect(message.sectionId);
                break;
                    
            default:
                Utils.log(`Unknown message action: ${message.action}`, 'warn');
            }
        } catch (error) {
            Utils.log(`Error handling message: ${error.message}`, 'error');
        }
    }

    /**
     * Handle extension toggle
     */
    handleToggleExtension(enabled) {
        this.settings.extensionEnabled = enabled;
        
        if (enabled) {
            const enabledSections = this.settings.getEnabledSections(this.sections);
            this.handleRedirects(enabledSections);
            this.applyHiding(enabledSections);
        } else {
            this.elementHidingService.showAllElements();
        }
    }

    /**
     * Handle section toggle
     */
    handleToggleSection(sectionId, enabled) {
        this.settings.sectionSettings[sectionId] = enabled;
        
        if (enabled) {
            const section = this.sections.find(s => s.id === sectionId);
            if (section && section.isHideSection()) {
                this.elementHidingService.hideSection(
                    section,
                    DOMManipulator.getElementsByXPath.bind(DOMManipulator),
                    DOMManipulator.clickElementByXPath.bind(DOMManipulator)
                );
            }
        } else {
            this.elementHidingService.showSection(sectionId);
        }
    }

    /**
     * Handle redirect check
     */
    handleCheckRedirect(sectionId) {
        this.settings.sectionSettings[sectionId] = true;
        const enabledSections = this.settings.getEnabledSections(this.sections);
        this.handleRedirects(enabledSections);
    }

    /**
     * Handle URL changes
     */
    handleUrlChange(newUrl, previousUrl) {
        if (!this.settings || !this.settings.isEnabled()) {return;}
        
        Utils.log(`URL changed from ${previousUrl} to ${newUrl}`);
        
        const enabledSections = this.settings.getEnabledSections(this.sections);
        this.handleRedirects(enabledSections);
    }

    /**
     * Handle DOM updates
     */
    handleDOMUpdates() {
        if (!this.settings || !this.settings.isEnabled()) {return;}
        
        const enabledSections = this.settings.getEnabledSections(this.sections);
        this.applyHiding(enabledSections);
    }

    /**
     * Handle redirects
     */
    handleRedirects(enabledSections) {
        const currentPath = window.location.pathname;
        const currentHost = window.location.hostname;
        
        this.handleRedirectsUseCase.execute(
            enabledSections,
            currentPath,
            currentHost,
            (url) => window.location.replace(url)
        );
    }

    /**
     * Apply section hiding
     */
    applyHiding(enabledSections) {
        this.applySectionHidingUseCase.execute(
            enabledSections,
            DOMManipulator.getElementsByXPath.bind(DOMManipulator),
            DOMManipulator.clickElementByXPath.bind(DOMManipulator)
        );
    }

    /**
     * Cleanup resources
     */
    destroy() {
        if (this.observer) {
            this.observer.disconnect();
            this.observer = null;
        }
        
        if (chrome.runtime.onMessage.hasListener(this.boundHandleMessage)) {
            chrome.runtime.onMessage.removeListener(this.boundHandleMessage);
        }
        
        this.elementHidingService.showAllElements();
        
        Utils.log('ContentScriptController destroyed');
    }
}
