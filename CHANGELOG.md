# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-09-17

### Added
- **Command Palette:** Global modal with fuzzy search and recent history via `Ctrl+K`.
- **i18n & Theme:** Bilingual (ES/EN) support and dark/light modes persisted locally.
- **Web3 Module:** Keccak-256, address validation (EVM/Solana), encoding conversions, and unit calculators.
- **PWA:** Full offline readiness with service workers, web manifest, and connection status indicator.
- **Security:** Enterprise-grade Content-Security-Policy (CSP) blocking external telemetry.
- **Core Tools:** JSON formatting, MD5 pure-JS implementation, Wildcard network calculations.

### Changed
- Complete visual overhaul aligning with ATM DOCS design system (dark modes, typography, gap structure).
- App routing setup changed to support robust SPA navigation with Cloudflare `_routes.json`.
- Bundle optimization implemented with granular `manualChunks` function.

### Fixed
- Resolved all TypeScript inconsistencies and any-types in cryptographic tools.
- Harmonized card padding and responsive breakpoints.

### Security
- Strengthened `window.crypto.getRandomValues` usage for password generators instead of Math.random.
- Applied zero-trust policy ensuring 100% client-side operation with strict `connect-src` directives.
