import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  expect: {
    timeout: 10000
  },
  reporter: [
    ['html'], // Reporte HTML
    ['list']  // Reporte en la consola
  ],
  /* Configuración para todos los tests */
  use: {
    baseURL: 'https://pokeapi.co/api/v2',
    actionTimeout: 0,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
  },
  outputDir: 'test-results/',
  retries: 1,
  workers: 1,
  projects: [
    {
      name: 'chromium',
      use: {
        browserName: 'chromium',
      },
    },
  ],
});
