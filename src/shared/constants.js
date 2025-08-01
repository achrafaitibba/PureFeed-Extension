/**
 * Message types for communication between content script and popup
 */
export const MessageTypes = {
    TOGGLE_EXTENSION: 'toggleExtension',
    TOGGLE_SECTION: 'toggleSection',
    CHECK_REDIRECT: 'checkRedirect'
};

/**
 * Extension events
 */
export const ExtensionEvents = {
    EXTENSION_TOGGLED: 'extensionToggled',
    SECTION_TOGGLED: 'sectionToggled',
    URL_CHANGED: 'urlChanged',
    DOM_UPDATED: 'domUpdated'
};

/**
 * Platform types - dynamically populated from config
 * No need to manually add platforms anymore!
 */
export const Platforms = {
    // This will be populated dynamically from config.json
    // Just add your platform to config.json and it will work!
};

/**
 * Default configuration
 */
export const DefaultConfig = {
    DEBOUNCE_DELAY: 100,
    CLICK_DELAY: 100,
    MUTATION_OBSERVER_OPTIONS: {
        childList: true,
        subtree: true
    }
};
