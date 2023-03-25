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
    console.log('Connected to MongoDB');
    db = client.db();
  } catch (err) {
    console.log('Error connecting to MongoDB');
    console.log(err);
    throw err;
  }
};

export const getDb = () => {
  if (db) {
    return db;
  }
  console.error('No database found');
  return null;
};
