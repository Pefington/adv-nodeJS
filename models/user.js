/* eslint-disable func-names */
import mongoose from 'mongoose';

import { Order } from './order.js';

const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },

  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },

  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
  },
});

userSchema.methods.addToCart = function (product) {
  // @ts-ignore
  const updatedCartItems = [...this.cart.items];
  const index = updatedCartItems.findIndex(
    (item) => item.productId.toString() === product._id.toString()
  );
  if (index >= 0) {
    updatedCartItems[index].quantity += 1;
  } else {
    updatedCartItems.push({
      productId: product._id,
      quantity: 1,
    });
  }
  const updatedCart = {
    items: updatedCartItems,
  };
  this.cart = updatedCart;
  // @ts-ignore
  return this.save();
};

userSchema.methods.removeFromCart = function (productId) {
  const updatedCartItems = this.cart.items.filter(
    (item) => item.productId.toString() !== productId.toString()
  );

  this.cart.items = updatedCartItems;
  return this.save();
};

userSchema.methods.getCart = async function () {
  const user = await this.populate('cart.items.productId');
  return user.cart.items.map((item) => ({
    ...item.productId.toJSON(),
    quantity: item.quantity,
  }));
};

userSchema.methods.clearCart = function () {
  this.cart = { items: [] };
  // @ts-ignore
  return this.save();
};

userSchema.methods.postOrder = async function () {
  const products = await this.getCart();
  const { _id: id, name } = this;

  const order = new Order({
    user: {
      name,
      id,
    },
    products,
  });

  await order.save();
  await this.clearCart();
};

userSchema.methods.getOrders = async function () {
  return Order.find({ 'user.id': this._id });
};

export const User = mongoose.model('User', userSchema);
