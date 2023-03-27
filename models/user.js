import { ObjectId } from 'mongodb';

import { getDb } from '../data/database.js';

export class User {
  constructor(name, email, cart, id) {
    this.name = name;
    this.email = email;
    this.cart = cart ?? { items: [] };
    this._id = id ?? new ObjectId(id);
  }

  save = async () => {
    const db = getDb();
    if (this._id) {
      try {
        await db
          .collection('users')
          .updateOne({ _id: this._id }, { $set: this });
      } catch (error) {
        console.error(`\n\n${error}\n`);
      }
    } else {
      try {
        await db.collection('users').insertOne(this);
      } catch (error) {
        console.error(`\n\n${error}\n`);
      }
    }
  };

  addToCart = async (product) => {
    const db = getDb();
    const cartProductIndex = this.cart.items.findIndex(
      (prod) => prod._id.toString() === product._id.toString()
    );

    const cartItems = [...this.cart.items];

    if (cartProductIndex >= 0) {
      cartItems[cartProductIndex].quantity += 1;
    } else {
      cartItems.push({ _id: new ObjectId(product._id), quantity: 1 });
    }

    const updatedCart = { items: cartItems };

    try {
      await db
        .collection('users')
        .updateOne(
          { _id: new ObjectId(this._id) },
          { $set: { cart: updatedCart } }
        );
    } catch (error) {
      console.error(`\n\n${error}\n`);
    }
  };

  getCart = async () => {
    const db = getDb();
    try {
      const products = await db
        .collection('products')
        .find({ _id: { $in: this.cart.items.map((item) => item._id) } })
        .toArray();

      return Promise.all(
        products.map(async (product) => {
          const { quantity } = this.cart.items.find(
            (item) => item._id.toString() === product._id.toString()
          );
          return { ...product, quantity };
        })
      );
    } catch (error) {
      console.error(`\n\n${error}\n`);
      return null;
    }
  };

  removeFromCart = async (productId) => {
    const db = getDb();
    const updatedCartItems = this.cart.items.filter(
      (item) => item._id.toString() !== productId.toString()
    );
    try {
      await db
        .collection('users')
        .updateOne(
          { _id: this._id },
          { $set: { cart: { items: updatedCartItems } } }
        );
    } catch (error) {
      console.error(`\n\n${error}\n`);
    }
  };

  addOrder = async () => {
    const db = getDb();
    const products = await this.getCart();
    const order = {
      items: products,
      user: {
        _id: this._id,
        name: this.name,
      },
    };
    try {
      await db.collection('orders').insertOne(order);
      this.cart = { items: [] };
      await this.save();
    } catch (error) {
      console.error(`\n\n${error}\n`);
    }
  };

  getOrders = async () => {
    const db = getDb();
    try {
      return db.collection('orders').find({ 'user._id': this._id }).toArray();
    } catch (error) {
      console.error(`\n\n${error}\n`);
      return null;
    }
  };

  static findById = async (id) => {
    const db = getDb();
    try {
      return db.collection('users').findOne({ _id: new ObjectId(id) });
    } catch (error) {
      console.error(`\n\n${error}\n`);
      return null;
    }
  };
}
