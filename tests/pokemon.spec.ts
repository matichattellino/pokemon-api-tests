import { test as base, expect } from '@playwright/test';
import { PokemonAPIPage } from './pages/pokemonAPIPage';
import { JsonPlaceholderAPIPage } from './pages/jsonPlaceholderAPIPage';
import { FileHelper } from './utils/filehelper';
import { SecretManager } from './utils/secretManager';

type TestFixtures = {
  encryptedSecret: string;
  pokemonAPI: PokemonAPIPage;
  jsonPlaceholderAPI: JsonPlaceholderAPIPage;
};

const test = base.extend<TestFixtures>({
  encryptedSecret: async ({}, use) => {
    const encryptedValue = SecretManager.getEncryptedSecret();
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
test.describe.serial('API Tests', () => {
  // Pokemon API Test
  test('1. Pokemon API Test', async ({ pokemonAPI, encryptedSecret }) => {
    console.log('\n========== POKEMON API TEST ==========');
    console.log('Clave secreta encriptada:', encryptedSecret);
    
    const testData = await FileHelper.readExcelFile();
    
    for (const pokemon of testData) {
      console.log(`\nProbando Pokemon: ${pokemon.name.toUpperCase()} (ID: ${pokemon.id})`);

      // Test usando ID
      const { response: responseById, data: dataById, responseTime: responseTimeById } 
        = await pokemonAPI.getPokemonById(pokemon.id);
      
      console.log(`Tiempo de respuesta (ID): ${responseTimeById}ms`);
      
      expect(responseById.status()).toBe(200);
      expect(responseTimeById).toBeLessThan(10000);
      expect(dataById.id).toBe(pokemon.id);
      expect(dataById.name).toBe(pokemon.name);
      const actualAbilitiesById = dataById.abilities.map(a => a.ability.name);
      expect(actualAbilitiesById).toEqual(expect.arrayContaining(pokemon.abilities));

      // Test usando nombre
      const { response: responseByName, responseTime: responseTimeByName } 
        = await pokemonAPI.getPokemonByName(pokemon.name);
      
      console.log(`Tiempo de respuesta (nombre): ${responseTimeByName}ms`);
      
      expect(responseByName.status()).toBe(200);
      expect(responseTimeByName).toBeLessThan(10000);

      console.log(`Test completado: ${new Date().toLocaleString()}`);
    }
    
    console.log('\n========== FIN POKEMON API TEST ==========\n');
  });

  // JSONPlaceholder Test
  test('2. JSONPlaceholder API Test', async ({ jsonPlaceholderAPI, encryptedSecret }) => {
    console.log('\n========== JSONPLACEHOLDER API TEST ==========');
    console.log('Clave secreta encriptada:', encryptedSecret);
    
    const postData = {
      title: 'Test post',
      body: 'Test body content',
      userId: 1
    };
    
    console.log('\nCreando nuevo post:', JSON.stringify(postData, null, 2));

    const { response, data: responseData, responseTime } = 
      await jsonPlaceholderAPI.createPost(postData);

    console.log(`\nTiempo de respuesta: ${responseTime}ms`);
    console.log('Respuesta:', JSON.stringify(responseData, null, 2));
    console.log(`Status code: ${response.status()}`);

    expect(response.status()).toBe(201);
    expect(responseTime).toBeLessThan(10000);
    expect(responseData).toHaveProperty('id');
    expect(responseData.title).toBe(postData.title);
    expect(responseData.body).toBe(postData.body);
    expect(responseData.userId).toBe(postData.userId);

    console.log(`\nTest completado exitosamente`);
    console.log(`Post creado con ID: ${responseData.id}`);
    console.log(`Finalizado: ${new Date().toLocaleString()}`);
    
    console.log('\n========== FIN JSONPLACEHOLDER API TEST ==========\n');
  });
});