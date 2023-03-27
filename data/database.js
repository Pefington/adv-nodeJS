import { MongoClient, ServerApiVersion } from 'mongodb';

import { MONGO_URL } from '../env/env.js';

const client = new MongoClient(MONGO_URL, {
  // @ts-ignore
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

let db;

export const mongoConnect = async () => {
  try {
    await client.connect();
    db = client.db('shop');
  } catch (error) {
    console.error(`\n\n${error}\n`);
    throw error;
  }
};

export const getDb = () => {
  if (db) {
    return db;
  }
  console.error('No database found');
  return null;
};
