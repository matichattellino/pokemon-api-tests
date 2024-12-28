import { test as base, expect } from '@playwright/test';
import { PokemonAPIPage } from './pages/pokemonAPIPage';
import { JsonPlaceholderAPIPage } from './pages/jsonPlaceholderAPIPage';
import { FileHelper } from './utils/fileHelper';
import { SecretManager } from './utils/secretManager';

// Definición del fixture para la clave secreta encriptada
type TestFixtures = {
  encryptedSecret: string;
  pokemonAPI: PokemonAPIPage;
  jsonPlaceholderAPI: JsonPlaceholderAPIPage;
};

const test = base.extend<TestFixtures>({
  encryptedSecret: async ({}, use) => {
    const encryptedValue = SecretManager.getEncryptedSecret();
    console.log('Clave secreta encriptada:', encryptedValue);
    await use(encryptedValue);
  },
  pokemonAPI: async ({ request }, use) => {
    const api = new PokemonAPIPage(request);
    await use(api);
  },
  jsonPlaceholderAPI: async ({ request }, use) => {
    const api = new JsonPlaceholderAPIPage(request);
    await use(api);
  }
});

// Tests
test.describe('Pokemon API Tests', () => {
  test('Validar datos de Pokemon por ID y nombre', async ({ pokemonAPI, encryptedSecret }) => {
    const testData = await FileHelper.readExcelFile();
    
    for (const pokemon of testData) {
      console.log(`\nProbando Pokemon API para ${pokemon.name} (ID: ${pokemon.id})`);

      // Test usando ID
      const { response: responseById, data: dataById, responseTime: responseTimeById } 
        = await pokemonAPI.getPokemonById(pokemon.id);
      
      expect(responseById.status()).toBe(200);
      expect(responseTimeById).toBeLessThan(10000);
      expect(dataById.id).toBe(pokemon.id);
      expect(dataById.name).toBe(pokemon.name);
      const actualAbilitiesById = dataById.abilities.map(a => a.ability.name);
      expect(actualAbilitiesById).toEqual(expect.arrayContaining(pokemon.abilities));

      // Test usando nombre
      const { response: responseByName, responseTime: responseTimeByName } 
        = await pokemonAPI.getPokemonByName(pokemon.name);

      console.log(`Tiempo de respuesta por nombre: ${responseTimeByName}ms`);
      
      expect(responseByName.status()).toBe(200);
      expect(responseTimeByName).toBeLessThan(10000);

      console.log(`Test API finalizado - ${new Date().toLocaleString()}`);
    }
  });
});

// JSONPlaceholder Tests
test.describe('JSONPlaceholder API Tests', () => {
  test('Crear nuevo post', async ({ jsonPlaceholderAPI, encryptedSecret }) => {
    // Log de inicio del test
    console.log('\nIniciando test de creación de post en JSONPlaceholder');
    
    const postData = {
      title: 'Test post',
      body: 'Test body content',
      userId: 1
    };
    
    // Log de los datos a enviar
    console.log('Datos a enviar:', JSON.stringify(postData, null, 2));

    // Realizar la petición POST
    const { response, data: responseData, responseTime } = 
      await jsonPlaceholderAPI.createPost(postData);

    // Log de la respuesta
    console.log(`Tiempo de respuesta: ${responseTime}ms`);
    console.log('Respuesta del servidor:', JSON.stringify(responseData, null, 2));
    console.log(`Status code: ${response.status()}`);

    // Assertions
    expect(response.status()).toBe(201);
    expect(responseTime).toBeLessThan(10000);
    expect(responseData).toHaveProperty('id');
    expect(responseData.title).toBe(postData.title);
    expect(responseData.body).toBe(postData.body);
    expect(responseData.userId).toBe(postData.userId);

    // Log de finalización con más detalles
    console.log(`\nTest completado exitosamente`);
    console.log(`ID del post creado: ${responseData.id}`);
    console.log(`Test finalizado - ${new Date().toLocaleString()}`);
  });
});