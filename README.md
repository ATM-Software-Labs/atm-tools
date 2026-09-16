# ATM Tools - Engineering Suite

> Herramientas de ingeniería y privacidad de ATM Software Labs.
> Procesamiento 100% client-side sin persistencia de datos ni telemetría externa.

## Arquitectura Técnica
- **Framework:** React 19 + TypeScript + Vite 8
- **Estilos:** Tailwind CSS 4 (con modo oscuro y variables corporativas)
- **PWA:** Soporte offline-first mediante `vite-plugin-pwa` y manifest integrado.
- **Routing:** Single Page Application (SPA) sin 404s en recargas.
- **Seguridad:** Cero peticiones de red externas, política estricta CSP (`wasm-unsafe-eval`, `connect-src 'self'`). Zero Server Telemetry.
- **i18n:** Soporte bilingüe ES/EN mediante diccionario reactivo y `localStorage`.
- **Navegación:** Menú Command Palette global accesible vía `Cmd/Ctrl + K`.

## Catálogo de Herramientas
- **Web3 & Crypto:** Hashing (Keccak-256, SHA-256, MD5), decodificadores (Base64, JWT), calculadoras de Wei/Gwei y validadores de direcciones.
- **SysAdmin & Redes:** Calculadora de subredes IPv4 y CIDR con wildcard.
- **Documentos & Datos:** Manipulación PDF local, visor OCR, formateador y validador JSON.
- **Multimedia:** Eliminador de fondos AI local, edición de imágenes rápida y lupas de texto.
- **Contraseñas:** Generador de passwords robustos utilizando `window.crypto.getRandomValues`.

## Instrucciones Locales
```bash
# Instalación (Ignorar scripts si hay error PWA)
pnpm install --ignore-scripts

# Servidor de desarrollo
pnpm run dev

# Build de producción y verificación TS
pnpm run lint
pnpm run build
```

## Garantía de Privacidad
Todos los procesos criptográficos, conversores y procesamientos multimedia de ATM TOOLS operan **exclusivamente en memoria** dentro del hilo principal o Worker del navegador. En ningún caso se envían payloads, imágenes, credenciales o direcciones Web3 a servidores externos.

*© 2026 ATM Software Labs. Todos los derechos reservados.*
