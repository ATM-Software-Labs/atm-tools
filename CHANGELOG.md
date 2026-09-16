# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **Design System**: Completamente rediseñado para alinear al 100% con ATM DOCS.
- **Crypto & Security**: Añadido decodificador JWT, generador de Passphrases seguras y soporte para MD5.
- **Network Tools**: Nueva calculadora CIDR y Subnet IPv4.
- **JSON Tools**: Nuevo formateador, minificador y visor JSON.
- **CI/CD**: Configuración de GitHub Actions para despliegue automático en Cloudflare Pages con pnpm.
- **Seguridad**: Políticas estrictas de Content-Security-Policy en `_headers`.

### Changed
- **UI**: Cambio de fuente a Inter (técnica e industrial), paleta de colores Dark Surface, y layout en grid responsive de 3 columnas.
- **Navbar & Footer**: Headers y footers corporativos con selectores de tema e idioma y badges de usuario.
- **UX**: Buscador en tiempo real y chips de filtrado para encontrar herramientas rápidamente.

### Fixed
- **Scrollbar**: Scrollbar personalizada oscura adaptada al Design System.
