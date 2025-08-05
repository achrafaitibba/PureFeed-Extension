import { HiddenElement } from '../entities/HiddenElement.js';

/**
 * Element hiding service
 * Handles the logic for hiding and showing elements
 */
export class ElementHidingService {
    constructor() {
        this.hiddenElements = new Map();
    }

    /**
     * Hide elements for a specific section
     * @param {Section} section - Section to hide
     * @param {Function} xpathEvaluator - Function to evaluate XPath expressions
     * @param {Function} elementClicker - Function to click elements
     */
    hideSection(section, xpathEvaluator, elementClicker) {
        if (!section.isHideSection()) {
            return false;
        }

        let elementsHidden = false;

        section.xpaths.forEach(xpath => {
            const elements = xpathEvaluator(xpath);
            elements.forEach(element => {
                // Skip if element is null, undefined, or already hidden by us
                if (!element || this.hiddenElements.has(element)) {
                    return;
                }

                // Only hide elements that are currently visible
                if (element.style.display !== 'none') {
                    const originalDisplay = element.style.display || 'block';
                    const hiddenElement = new HiddenElement(element, section.id, originalDisplay);

                    this.hiddenElements.set(element, hiddenElement);
                    hiddenElement.hide();
                    elementsHidden = true;
                }
            });
        });

        // Click the specified element if any elements were hidden and toClick is defined
        if (elementsHidden && section.hasClickAction()) {
            elementClicker(section.toClick);
        }

        return elementsHidden;
    }

    /**
     * Show elements for a specific section
     * @param {string} sectionId - Section ID to show
     */
    showSection(sectionId) {
        const elementsToRemove = [];

        this.hiddenElements.forEach((hiddenElement, element) => {
            if (hiddenElement.belongsToSection(sectionId)) {
                hiddenElement.show();
                elementsToRemove.push(element);
            }
        });

        elementsToRemove.forEach(element => {
            this.hiddenElements.delete(element);
        });
    }

    /**
     * Show all hidden elements
     */
    showAllElements() {
        this.hiddenElements.forEach(hiddenElement => {
            hiddenElement.show();
        });
        this.hiddenElements.clear();
    }

    /**
     * Apply hiding for multiple sections
     * @param {Array<Section>} sections - Sections to hide
     * @param {Function} xpathEvaluator - Function to evaluate XPath expressions
     * @param {Function} elementClicker - Function to click elements
     */
    applySectionHiding(sections, xpathEvaluator, elementClicker) {
        sections.forEach(section => {
            this.hideSection(section, xpathEvaluator, elementClicker);
        });
    }

    /**
     * Get count of hidden elements
     */
    getHiddenElementsCount() {
        return this.hiddenElements.size;
    }
}
