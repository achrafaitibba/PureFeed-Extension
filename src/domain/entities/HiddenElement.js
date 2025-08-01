/**
 * HiddenElement entity representing an element that has been hidden
 */
export class HiddenElement {
    constructor(element, sectionId, originalDisplay = 'block') {
        this.element = element;
        this.sectionId = sectionId;
        this.originalDisplay = originalDisplay;
    }

    /**
     * Hide the element
     */
    hide() {
        this.element.style.display = 'none';
        this.element.setAttribute('data-smh-hidden', this.sectionId);
    }

    /**
     * Show the element
     */
    show() {
        this.element.style.display = this.originalDisplay;
        this.element.removeAttribute('data-smh-hidden');
    }

    /**
     * Check if element belongs to a specific section
     */
    belongsToSection(sectionId) {
        return this.sectionId === sectionId;
    }
}
