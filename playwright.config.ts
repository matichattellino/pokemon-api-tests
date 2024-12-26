import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  expect: {
    timeout: 10000
  },
  /* Configurar múltiples reportes */
  reporter: [
    ['html'], // Reporte HTML
    ['list']  // Reporte en consola
  ],
  /* Configuración para todos los tests */
  use: {
    baseURL: 'https://pokeapi.co/api/v2',
    actionTimeout: 0,
    // Capturar screenshot solo cuando falla un test
    screenshot: 'only-on-failure',
    // Grabar video solo cuando falla un test
    video: 'retain-on-failure',
    // Guardar trace para debugging
    trace: 'retain-on-failure',
  },
  /* Directorio para resultados de test */
  outputDir: 'test-results/',
  /* Reintentar tests fallidos una vez */
  retries: 1,
  /* Ejecutar tests en secuencia para mejor debugging */
  workers: 1,
  /* Configuración para diferentes proyectos/navegadores */
  projects: [
    {
      name: 'chromium',
      use: {
        browserName: 'chromium',
      },
    },
  ],
});
