# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- **Pre-money vs. Post-money SAFE Toggle**: Implemented a toggle in "Pro Mode" to switch between pre-money and post-money SAFE calculations, a feature of Milestone 2.
- **Simple/Pro Mode Toggle**: Implemented a toggle switch in the SAFE simulator to switch between a simplified view and a professional view with more detailed inputs.
- **Component Refactoring**: Broke down the `SafeSimulatorClient` into smaller, more focused components (`SafeAgreementCard`, `ScenarioModelingCard`) to improve code organization and maintainability.
- **CHANGELOG.md**: Created this file to track development progress and bug fixes.

### Fixed
- **Hydration Errors**: Resolved persistent React hydration errors by isolating client-specific rendering logic into a dedicated `SafeSimulatorClient` component, ensuring server and client renders match.
