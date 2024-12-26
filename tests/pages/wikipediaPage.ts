import { Page } from '@playwright/test';
import { BasePage } from './basePage';

export class WikipediaPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    async navigateToPokemon(pokemonName: string) {
        await this.navigateTo(`https://en.wikipedia.org/wiki/${pokemonName}`);
    }

    async getMainImage(): Promise<string | null> {
        return await this.page.evaluate(() => {
            const infoboxImage = document.querySelector('.infobox img');
            if (infoboxImage && infoboxImage instanceof HTMLImageElement) {
                return infoboxImage.src;
            }
            
            const contentImage = document.querySelector('#mw-content-text img');
            if (contentImage && contentImage instanceof HTMLImageElement) {
                return contentImage.src;
            }
            
            return null;
        });
    }

    async getArtistInfo(): Promise<string> {
        const artworkInfo = await this.page.evaluate(() => {
            const infobox = document.querySelector('.infobox');
            if (!infobox) return 'No infobox found';

            const rows = infobox.querySelectorAll('tr');
            let artistInfo = '';

            for (const row of rows) {
                const text = row.textContent || '';
                if (text.toLowerCase().includes('designer') || 
                    text.toLowerCase().includes('artist') || 
                    text.toLowerCase().includes('artwork')) {
                    artistInfo = text;
                    break;
                }
            }

            if (!artistInfo) {
                const paragraphs = document.querySelectorAll('#mw-content-text p');
                for (const p of paragraphs) {
                    const text = p.textContent || '';
                    if (text.toLowerCase().includes('designed by') || 
                        text.toLowerCase().includes('created by') ||
                        text.toLowerCase().includes('ken sugimori') ||
                        text.toLowerCase().includes('atsuko nishida')) {
                        artistInfo = text;
                        break;
                    }
                }
            }

            return artistInfo || 'No artist information found';
        });

        return artworkInfo
            .replace(/\[\d+\]/g, '')
            .replace(/\n/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    }
}