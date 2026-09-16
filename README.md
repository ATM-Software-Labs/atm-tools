# ATM Tools | TrujilloMingorance

Una suite minimalista de herramientas 100% Client-Side. Construida sin dependencias de backend para garantizar privacidad, rendimiento y costo cero en infraestructura.

## 🚀 Características
- **Procesamiento Local:** Todas las operaciones (imágenes, PDF, IA) se realizan en el navegador del cliente.
- **Privacidad Total:** Los archivos nunca abandonan tu dispositivo.
- **Cero Costes de Servidor:** Desplegado como Cloudflare Worker / Pages, con 0 llamadas a backend.
- **Diseño Inclusivo:** Interfaz adaptada para personas mayores, con alto contraste y usabilidad clara.

## 🛠️ Herramientas Incluidas
1. **Quitar Fondo (Background Remover):** Basado en WebAssembly, elimina fondos instantáneamente.
2. **Mejorar Foto (Quick Editor):** Controles de brillo, saturación, y filtros preestablecidos.
3. **Cambiar Formato (Converter):** Conversor rápido y redimensionador a JPG/WEBP para reducir peso.
4. **Documentos PDF (Manager):** Fusión de múltiples imágenes en un único archivo PDF ligero.

## 💻 Desarrollo

El ecosistema utiliza Vite + React + TypeScript + Tailwind CSS.

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Construir para producción
npm run build
```

## 🌍 Arquitectura Edge

Desplegado en **Cloudflare Workers** utilizando rutas específicas (`tools.trujillomingorance.com/*`) para bypassear reglas comodín (Wildcard) de la capa Edge superior del ecosistema.

*© Alberto Trujillo Mingorance - ATM Software Labs*
