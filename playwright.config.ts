import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  expect: {
    timeout: 10000
  },
  reporter: [
    ['html'],
    ['list']
  ],
  use: {
    baseURL: 'https://pokeapi.co/api/v2',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
  },
  // Configuración de paralelización
  workers: 2,          // Ejecutar 2 workers en paralelo
  fullyParallel: true, // Habilitar paralelización completa
  // Agrupar tests por tipo
  projects: [
    {
      name: 'API Tests',
      testMatch: /pokemon\.spec\.ts/
    },
    {
      name: 'Web Tests',
      testMatch: /pokemon-wiki\.spec\.ts/
    }
  ],
  // Agregar medición de tiempo
  reportSlowTests: {
    max: 0,
    threshold: 60000
  },
});