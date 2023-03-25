import { config as dotenvConfig } from 'dotenv';

dotenvConfig({ path: './env/.env' });

export const { UNSPLASH_KEY, SQL_PASSWORD, MONGO_URL } = process.env;
