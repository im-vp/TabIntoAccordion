# Changelog

## [1.1.0] - 2025-05-19

### Fixed

- Fixed component transformation relative to browser window width instead of component width
- Fixed scrolling issue to content
- Fixed bug where active accordion button was not marked when transforming from tab to accordion

### Added

- Added ability to close active tab/accordion via `accordionToggle` and `tabToggle` settings
- Added parameters `e.currentTarget` and `tabId` to `tabIntoAccordion:click` event
