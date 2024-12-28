# Pokemon Test Automation Project

## Descripción
Este proyecto automatiza pruebas para la PokeAPI y Wikipedia usando Playwright + TypeScript. Incluye validaciones de API, manejo de imágenes y verificación de contenido web.

## Prerrequisitos
- Node.js (v14 o superior)
- npm (viene con Node.js)
- Git

## Instalación

1. Clonar el repositorio:
git clone <url-del-repositorio>
cd pokemon-api-tests

2. Instalar dependencias:
npm install

3. Instalar navegadores de Playwright:
npx playwright install


4. Configurar variables de entorno:
# Crear archivo .env en la raíz del proyecto
- Agregar la siguiente variable (reemplazar con tu clave secreta):
SECRET_KEY=tu_clave_secreta


## Estructura del Proyecto
pokemon-api-tests/
├── tests/
│   ├── pages/                # Page Objects
│   │   ├── basePage.ts       # Clase base para Page Objects
│   │   ├── pokemonAPIPage.ts # Manejo de la API
│   │   └── wikipediaPage.ts  # Manejo de Wikipedia
│   ├── utils/
│   │   ├── fileHelper.ts     # Utilidades para archivos
│   │   └── secretManager.ts  # Manejo de clave secreta
│   ├── pokemon.spec.ts       # Pruebas de API
│   └── pokemon-wiki.spec.ts  # Pruebas de Wikipedia
├── images/                   # Imágenes descargadas
├── test-results/            # Resultados y evidencias
├── Datos-pruebas.xlsx       # Datos de prueba
├── playwright.config.ts     # Configuración de Playwright
├── package.json
├── .env                     # Variables de entorno
└── .gitignore
```

## Comandos de Ejecución

## Ejecución de Tests y Reportes
IMPORTANTE: Seguir estos pasos en orden para ejecutar los tests y generar reportes

### Ejecutar todas las pruebas
npm test

### Ejecutar pruebas específicas
# Solo pruebas de API
npx playwright test pokemon.spec.ts

# Solo pruebas de Wikipedia
npx playwright test pokemon-wiki.spec.ts

### Modos de ejecución especiales
# Modo debug
npx playwright test --debug

# Con interfaz visual
npx playwright test --ui

# Con navegador visible
npx playwright test --headed

⚠️ IMPORTANTE
### Ver reporte de resultados
npx playwright show-report

### Ver las trazas de errores si falla un test
npx playwright show-trace test-results/trace.zip


## Funcionalidades

### Tests de API
- Validación de datos de Pokémon por ID y nombre
- Verificación de habilidades
- Control de tiempos de respuesta
- Validación de respuestas HTTP

### Tests de Wikipedia
- Validación de contenido de páginas
- Descarga y validación de imágenes
- Verificación de información del artista
- Validación de extensiones y tamaños de archivos

### Características Técnicas
- Encriptación SHA256 de clave secreta
- Lectura de archivos Excel
- Validación de imágenes (extensión y tamaño)
- Implementación del patrón Page Object Model
- Uso de fixtures personalizados
- Sistema de logging detallado

## Ubicación de Evidencias

### Archivos Generados
- Imágenes: `/images/`
- Screenshots: `/test-results/`
- Videos: `/test-results/`
- Trazas: `/test-results/`

### Tipos de Logs
- Logs de ejecución en consola
- Logs de errores detallados
- Registro de tiempos de respuesta
- Información de validaciones

## Mantenimiento

### Agregar Nuevos Tests
1. Crear archivo de test en `/tests`
2. Extender Page Objects si es necesario
3. Utilizar fixtures existentes
4. Seguir patrón de logging establecido

### Actualizar Datos de Prueba
1. Modificar `Datos-pruebas.xlsx`
2. Mantener estructura: ID, NAME, ABILITIES

## Solución de Problemas

En caso de encontrar errores:

1. Verificar configuración y asegurarse de que :
   - Archivo `.env` existe y tiene la clave secreta
   - Node.js y npm están actualizados
   - Todas las dependencias están instaladas

2. Problemas comunes:
   - Conexión a Internet activa
   - Permisos de escritura en carpetas
   - Formato correcto del Excel

3. Revisar evidencias:
   - Consultar logs en consola
   - Revisar screenshots en `/test-results/`
   - Verificar videos de fallos


## Guía de Ejemplo: Hacer Fallar un Test y Ver el Reporte

### 1. Modificar el Test Para que Falle
En el archivo `tests/jsonPlaceholder.spec.ts`, modifica la aserción del status code (linea 86 del codigo):
    expect(response.status()).toBe(201);

// Original (test exitoso)
expect(response.status()).toBe(201); // JSONPlaceholder retorna 201 para creaciones

// Modificar a (test fallido)
expect(response.status()).toBe(200); // Esto hará que el test falle

### Ejecutar todas las pruebas
npx playwright test


### Vas a ver un mensaje de error similar al siguiente:
Error: expect(received).toBe(expected)
Expected: 200
Received: 201


### Analizar el reporte
npx playwright show-report



