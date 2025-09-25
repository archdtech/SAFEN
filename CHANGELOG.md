# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- **Component Refactoring**: Broke down the `SafeSimulatorClient` into smaller, more focused components (`SafeAgreementCard`, `ScenarioModelingCard`) to improve code organization and maintainability.
- **Valuable PDF Export**: Enhanced the PDF export to be a well-formatted, professional, and shareable report, significantly increasing its value.
- **Multiple SAFE Stacking**: Implemented simulation for multiple, stacked SAFE agreements, a feature of Milestone 2.
- **Pre-money vs. Post-money SAFE Toggle**: Implemented a toggle in "Pro Mode" to switch between pre-money and post-money SAFE calculations, a feature of Milestone 2.
- **Simple/Pro Mode Toggle**: Implemented a toggle switch in the SAFE simulator to switch between a simplified view and a professional view with more detailed inputs.
- **CHANGELOG.md**: Created this file to track development progress and bug fixes.
- **Scenario Templates**: Added a section with pre-built scenarios to help users explore common fundraising situations.
- **Interactive Valuation Slider**: Replaced the future valuation input with a slider for dynamic "what-if" analysis.
- **AI Explanation Engine**: Implemented a card where users can generate plain-language explanations of SAFE terms, with an option to add custom questions.
- **Key Metrics Display**: Added a card to show crucial calculated metrics like effective SAFE price and total shares issued.

### Fixed
- **PDF Export Errors**: Resolved a recurring `findDOMNode` error by restructuring the component hierarchy to ensure the `react-to-print` hook has the correct context.
- **Hydration Errors**: Resolved persistent React hydration errors by isolating client-specific rendering logic into a dedicated `SafeSimulatorClient` component, ensuring server and client renders match.
- **Runtime Errors**: Fixed a variable name typo (`discountrate` vs `discountRate` and `discountPrice` vs `discountedPrice`) that was causing a runtime error.
