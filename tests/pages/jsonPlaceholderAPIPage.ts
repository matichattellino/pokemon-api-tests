import { APIRequestContext } from '@playwright/test';

export class JsonPlaceholderAPIPage {
    constructor(private request: APIRequestContext) {}

    async createPost(data: {title: string, body: string, userId: number}) {
        const startTime = Date.now();
        const response = await this.request.post('https://jsonplaceholder.typicode.com/posts', {
            data: data
        });
        const responseTime = Date.now() - startTime;
        
        return {
            response,
            data: await response.json(),
            responseTime
        };
    }
}