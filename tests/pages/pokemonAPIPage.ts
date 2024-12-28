import { APIRequestContext } from '@playwright/test';

export class PokemonAPIPage {
    constructor(private request: APIRequestContext) {}

    async getPokemonById(id: number) {
        const startTime = Date.now();
        const response = await this.request.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
        const responseTime = Date.now() - startTime;
        
        return {
            response,
            data: await response.json(),
            responseTime
        };
    }

    async getPokemonByName(name: string) {
        const startTime = Date.now();
        const response = await this.request.get(`https://pokeapi.co/api/v2/pokemon/${name}`);
        const responseTime = Date.now() - startTime;
        
        return {
            response,
            data: await response.json(),
            responseTime
        };
    }
}

