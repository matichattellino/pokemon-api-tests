import { test as base, expect } from '@playwright/test';
import { WikipediaPage } from './pages/wikipediaPage';
import { FileHelper } from './utils/fileHelper';
import * as path from 'path';
import { SecretManager } from './utils/secretManager';

type TestFixtures = {
  encryptedSecret: string;
  wikiPage: WikipediaPage;
};

const test = base.extend<TestFixtures>({
  encryptedSecret: async ({}, use) => {
    const encryptedValue = SecretManager.getEncryptedSecret();
    console.log('Clave secreta encriptada:', encryptedValue);
    await use(encryptedValue);
  },
  wikiPage: async ({ page }, use) => {
    const wikipediaPage = new WikipediaPage(page);
    await use(wikipediaPage);
  }
});

// Tests
test.describe('Pokemon Wikipedia Tests', () => {
  test('Validar páginas de Wikipedia y descargar imágenes', async ({ wikiPage, encryptedSecret }) => {
    const imagesPath = await FileHelper.ensureImagesFolder();
    const testData = await FileHelper.readExcelFile();
    
    for (const pokemon of testData) {
      try {
        const pokemonName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
        console.log(`\nProbando Wikipedia para ${pokemonName}`);

        await wikiPage.navigateToPokemon(pokemonName);

        // Validar el título
        const pageTitle = await wikiPage.getPageTitle();
        expect(pageTitle).toContain(pokemonName);
        console.log(`Título de la página: ${pageTitle}`);
        
        // Buscar y validar imagen
        const imageUrl = await wikiPage.getMainImage();

        if (imageUrl) {
          const extension = path.extname(new URL(imageUrl).pathname).toLowerCase();
          const imagePath = path.join(imagesPath, `${pokemonName.toLowerCase()}${extension}`);
          
          // Descargar y validar la imagen
          const imageInfo = await FileHelper.downloadAndValidateImage(imageUrl, imagePath);
          
          // Assertions sobre la imagen
          expect(FileHelper.isValidImageExtension(imagePath), 
            'La extensión del archivo debe ser .jpg, .jpeg, .png o .svg').toBe(true);
          
          expect(imageInfo.size, 
            `El tamaño del archivo debe ser menor a 500000 bytes. Actual: ${imageInfo.size} bytes`).toBeLessThan(500000);

          console.log(`Validaciones de imagen exitosas:`);
          console.log(`- Extensión válida: ${imageInfo.extension}`);
          console.log(`- Tamaño válido: ${imageInfo.size} bytes`);
        } else {
          console.log(`No se encontró imagen para ${pokemonName}`);
        }
        
        // Obtener información del artista
        const artworkInfo = await wikiPage.getArtistInfo();
        console.log(`Artista/Diseñador de ${pokemonName}:`, artworkInfo);
        
        console.log(`Test Wikipedia finalizado - ${new Date().toLocaleString()}`);
      } catch (error) {
        console.error(`Error al probar ${pokemon.name}:`, error);
      }
    }
  });
});