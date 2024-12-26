import { test as base, expect } from '@playwright/test';
import { PokemonAPIPage } from './pages/pokemonAPIPage';
import { FileHelper } from './utils/fileHelper';
import { SecretManager } from './utils/secretManager';

// Definición del fixture para la clave secreta encriptada
type TestFixtures = {
  encryptedSecret: string;
  pokemonAPI: PokemonAPIPage;
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
      
      expect(responseByName.status()).toBe(200);
      expect(responseTimeByName).toBeLessThan(10000);

      console.log(`Test API finalizado - ${new Date().toLocaleString()}`);
    }
  });
});