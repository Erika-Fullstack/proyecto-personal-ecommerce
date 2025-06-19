// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  webServer: {
    command: 'npm start',        // Este comando arranca el servidor (usa tu script "start")
    port: 3000,                   // Puerto donde corre tu web
    reuseExistingServer: true,   // Reutiliza el servidor si ya está abierto
  },
  use: {
    headless: false,             // Muestra el navegador (si quieres que sea visual)
  },
});
