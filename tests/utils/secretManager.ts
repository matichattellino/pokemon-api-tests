import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

export class SecretManager {
    private static getSecretKey(): string {
        const secretKey = process.env.SECRET_KEY;
        if (!secretKey) {
            throw new Error('SECRET_KEY no está definida en las variables de entorno');
        }
        return secretKey;
    }

    static getEncryptedSecret(): string {
        const secretKey = this.getSecretKey();
        const hash = crypto.createHash('sha256');
        hash.update(secretKey);
        return hash.digest('hex');
    }
}