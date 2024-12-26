import * as XLSX from 'xlsx';
import * as fs from 'fs/promises';
import * as path from 'path';

export interface PokemonTestData {
    id: number;
    name: string;
    abilities: string[];
}

export class FileHelper {
    static async readExcelFile(): Promise<PokemonTestData[]> {
        try {
            const workbook = XLSX.readFile('Datos-pruebas.xlsx');
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            
            const rawData = XLSX.utils.sheet_to_json<any[]>(worksheet, {
                header: 1,
                raw: false,
                defval: ''
            });

            console.log('Datos crudos del Excel:', rawData);

            const processedData: PokemonTestData[] = [];
            for (let i = 0; i < rawData.length; i++) {
                const row = rawData[i];
                if (row && row[0] && !isNaN(Number(row[0]))) {
                    const pokemonData: PokemonTestData = {
                        id: Number(row[0]),
                        name: String(row[1]).trim().toLowerCase(),
                        abilities: String(row[2]).split(',').map(ability => ability.trim())
                    };
                    processedData.push(pokemonData);
                }
            }

            console.log('Datos procesados:', processedData);
            return processedData;
        } catch (error) {
            console.error('Error leyendo archivo Excel:', error);
            throw error;
        }
    }

    static async ensureImagesFolder(): Promise<string> {
        const imagesPath = path.join(process.cwd(), 'images');
        try {
            await fs.access(imagesPath);
            console.log('Carpeta "images" existe');
        } catch {
            console.log('Creando carpeta "images"...');
            await fs.mkdir(imagesPath);
        }
        return imagesPath;
    }

    static isValidImageExtension(filename: string): boolean {
        const validExtensions = ['.jpg', '.jpeg', '.png', '.svg'];
        const extension = path.extname(filename).toLowerCase();
        return validExtensions.includes(extension);
    }

    static async downloadAndValidateImage(url: string, imagePath: string) {
        try {
            if (!this.isValidImageExtension(url)) {
                throw new Error('La extensión del archivo no corresponde a una imagen válida');
            }

            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const buffer = await response.arrayBuffer();

            const sizeInBytes = buffer.byteLength;
            if (sizeInBytes >= 500000) {
                throw new Error(`El tamaño de la imagen (${sizeInBytes} bytes) excede el límite de 500000 bytes`);
            }

            await fs.writeFile(imagePath, Buffer.from(buffer));
            console.log(`Imagen guardada en: ${imagePath}`);
            console.log(`Tamaño del archivo: ${sizeInBytes} bytes`);

            return {
                size: sizeInBytes,
                extension: path.extname(imagePath).toLowerCase()
            };
        } catch (error) {
            console.error('Error procesando imagen:', error);
            throw error;
        }
    }
}