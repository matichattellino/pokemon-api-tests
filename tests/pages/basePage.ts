import { Page } from '@playwright/test';

export class BasePage {
    constructor(protected page: Page) {}

    async navigateTo(url: string) {
        await this.page.goto(url);
    }

    async getPageTitle(): Promise<string> {
        return await this.page.title();
    }
}