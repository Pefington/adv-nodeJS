import { config as dotenvConfig } from 'dotenv';

dotenvConfig({ path: './env/.env' });

export const { UNSPLASH_KEY, SQL_PASSWORD } = process.env;
