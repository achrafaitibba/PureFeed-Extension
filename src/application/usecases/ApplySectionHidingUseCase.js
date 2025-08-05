/**
 * Apply section hiding use case
 */
export class ApplySectionHidingUseCase {
    constructor(elementHidingService) {
        this.elementHidingService = elementHidingService;
    }

    /**
     * Execute the apply section hiding use case
     * @param {Array<Section>} enabledSections - Enabled hiding sections
     * @param {Function} xpathEvaluator - XPath evaluation function
     * @param {Function} elementClicker - Element clicking function
     */
    execute(enabledSections, xpathEvaluator, elementClicker) {
        const hidingSections = enabledSections.filter(section => section.isHideSection());
        this.elementHidingService.applySectionHiding(
            hidingSections,
            xpathEvaluator,
            elementClicker
        );
    }
}
