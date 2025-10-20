# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- Grid snapping functionality for precise card alignment
- Dark mode support across all components
- Card edit functionality with input fields and buttons
- Pinia state management with automatic localStorage persistence
- Dashboard API composable (useDashboardAPI) for programmatic control
- Multiple dashboard instances support with separate localStorage
- Raw JSON data viewer page
- Import/Export functionality for dashboard configurations
- Browser console access to dashboard API

### Fixed
- Dashboard now fills full viewport width
- Dark mode rendering issues
- Layout flow and height distribution

### Changed
- Improved package build configuration
- Enhanced TypeScript type definitions
- Updated documentation structure

## [1.0.0] - 2025-10-16

### Added
- Initial release of vue3-moveable-dashboard package
- Core `MoveableDashboard` component with drag, resize, and rotate functionality
- `DashboardCard` component with slot-based content injection
- Full TypeScript support with complete type definitions
- Comprehensive event system (card-selected, card-moved, card-resized, card-rotated, etc.)
- Scoped slots for custom card rendering
- Edit mode toggle functionality
- Demo application with multiple card examples:
  - Chart card
  - Stats card
  - List card
  - Text card
  - Default card
- State persistence example with localStorage
- Add/remove cards dynamically
- Multiple dashboard instances support
- Vuetify 3 integration
- Full documentation:
  - README.md with complete API reference
  - QUICKSTART.md for quick setup
  - EXAMPLES.md with 8+ usage examples
  - PACKAGE_SUMMARY.md with package overview
- Build configuration for ES and CommonJS modules
- CSS extraction and bundling
- Proper dependency externalization

### Features
- Drag and drop cards anywhere on the dashboard
- Resize cards with corner handles
- Rotate cards with rotation handle
- Visual feedback for selected cards
- Configurable interaction controls (draggable, resizable, rotatable)
- Edit mode for enabling/disabling interactions
- Card header with optional title and actions
- Event emission for all user interactions
- Exposed methods for programmatic control
- Support for custom card types
- Responsive design
- Material Design UI with Vuetify

### Technical Details
- Built with Vite 6.3.6
- Vue 3.5.14 compatible
- Vuetify 3.8.0 compatible
- vue3-moveable 0.28.0 integration
- TypeScript 5.x support
- ES and CommonJS module formats
- Tree-shakeable exports
- ~100KB ES module size
- ~45KB CSS bundle
- Full TypeScript definitions included

### Dependencies
- Peer dependencies:
  - vue ^3.0.0
  - vuetify ^3.0.0
  - vue3-moveable ^0.28.0

### Package
- Package name: vue3-moveable-dashboard
- License: MIT
- Entry points:
  - ES Module: dist/index.es.js
  - CommonJS: dist/index.cjs.js
  - Types: dist/index.d.ts
  - CSS: dist/vue3-moveable-dashboard.css

### Documentation
- Complete API documentation
- Quick start guide
- 8+ usage examples
- TypeScript interface documentation
- Installation instructions
- Integration guide

[1.0.0]: https://github.com/yourusername/vue3-moveable-dashboard/releases/tag/v1.0.0
