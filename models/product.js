import { ObjectId } from 'mongodb';

import { getDb } from '../data/database.js';

export class Product {
  constructor(name, description, price, photoURL, id) {
    this.id = id ? new ObjectId(id) : null;
    this.name = name;
    this.description = description;
    this.price = price;
    this.photoUrl = photoURL || null;
  }

  save = async () => {
    const db = getDb();
    if (this.id !== null) {
      try {
        await db
          .collection('products')
          .updateOne({ _id: this.id }, { $set: this });
      } catch (error) {
        console.error(`\n\n${error}\n`);
      }
    } else {
      console.log('Inserting product...');
      try {
        await db.collection('products').insertOne(this);
      } catch (error) {
        console.error(`\n\n${error}\n`);
      }
    }
  };

  static delete = async (id) => {
    const db = getDb();
    try {
      await db.collection('products').deleteOne({ _id: new ObjectId(id) });
    } catch (error) {
      console.error(`\n\n${error}\n`);
    }
  };

  static fetchAll = async () => {
    const db = getDb();
    try {
      return db.collection('products').find().toArray();
    } catch (error) {
      console.error(`\n\n${error}\n`);
      return [];
    }
  };

  static findById = async (id) => {
    const db = getDb();
    try {
      return db.collection('products').findOne({ _id: new ObjectId(id) });
    } catch (error) {
      console.error(`\n\n${error}\n`);
      return null;
    }
  };
}
