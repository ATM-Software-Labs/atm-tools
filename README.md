# ATM Tools (tools.trujillomingorance.com)

**ATM Tools** es la suite oficial de herramientas y utilidades de ingeniería, privacidad y procesamiento de datos de ATM Software Labs. Esta plataforma ofrece un conjunto de herramientas 100% *client-side*, garantizando máxima privacidad sin persistencia de datos ni telemetría externa.

El proyecto está diseñado de acuerdo con el **Design System corporativo de ATM DOCS**, ofreciendo una interfaz industrial, técnica y eficiente.

---

## 🏗️ Arquitectura y Tecnologías

- **Framework**: React 19 + TypeScript + Vite
- **Estilizado**: Tailwind CSS v4 (Design System corporativo)
- **Componentes / Iconos**: Lucide React
- **Infraestructura**: Cloudflare Pages
- **Seguridad**: Cabeceras HTTP estrictas (CSP, sin tracking, sin almacenamiento)

### 📂 Árbol de Directorios

```text
daily-toolbox/
├── .github/workflows/    # Pipelines CI/CD de GitHub Actions
├── public/               # Assets estáticos y configuraciones de Cloudflare
│   ├── _headers          # Políticas estrictas de seguridad (CSP, X-Frame-Options)
│   └── avatar.png        # Logo de la aplicación
├── src/
│   ├── components/       # Componentes React
│   │   ├── layout/       # Estructura principal (Navbar, Layout, Footer)
│   │   ├── tools/        # Herramientas de la suite (Crypto, PDF, JSON, Network...)
│   │   └── ui/           # Componentes base UI (Card, Button, Label)
│   ├── utils/            # Lógica y algoritmos puros
│   ├── App.tsx           # Router principal y catálogo con filtros
│   ├── index.css         # Tailwind y configuración CSS de la fuente Inter
│   └── main.tsx          # Punto de entrada de la app
├── wrangler.json         # Configuración de despliegue en Cloudflare Pages
└── package.json          # Dependencias y scripts
```

## 🛠️ Entorno de Desarrollo Local

El proyecto está optimizado para utilizar `pnpm` como gestor de paquetes.

1. **Instalar dependencias**:
   ```bash
   pnpm install
   ```

2. **Ejecutar servidor de desarrollo**:
   ```bash
   pnpm run dev
   ```

3. **Ejecutar linters y verificación de tipos**:
   ```bash
   pnpm run lint
   pnpm exec tsc --noEmit
   ```

4. **Construir para producción**:
   ```bash
   pnpm run build
   ```
   *La salida estática se generará en el directorio `dist/`.*

## 🔒 Políticas de Privacidad

Este proyecto implementa una arquitectura 100% **Client-Side Processing**.

- **No Persistencia**: Los archivos procesados (PDFs, Imágenes) se mantienen en la memoria RAM del navegador.
- **Sin Telemetría**: La plataforma no contiene rastreadores (trackers), analíticas ni llamadas a APIs de terceros.
- **Seguridad de Cabeceras**: CSP configurado para evitar inyecciones XSS y bloqueo estricto de iframes (`DENY`).

## 🚀 Despliegue CI/CD

El proyecto cuenta con integración continua a través de GitHub Actions. Cada *push* o *pull request* a la rama `main` ejecuta:
1. Instalación de dependencias.
2. `oxlint` y validación de tipos (`tsc`).
3. Build estático (`vite build`).
4. Despliegue automático a Cloudflare Pages mediante Wrangler utilizando `CLOUDFLARE_API_TOKEN` y `CLOUDFLARE_ACCOUNT_ID`.

## 📜 Licencia y Copyright

© 2026 ATM Software Labs. Todos los derechos reservados.
Uso interno y corporativo restringido a las normativas de la organización.
