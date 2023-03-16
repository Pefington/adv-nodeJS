import fs from 'fs';

import { cartJSON } from '../data/data.js';
import { parseJSON } from '../utils/parseJSON.js';

export class Cart {
  static parseCart = () => parseJSON(cartJSON);

  static getIndex = (id) =>
    Cart.parseCart().products.findIndex((prod) => prod.id === id);

  static getCartProductFromID = (id) =>
    Cart.parseCart().products.find((prod) => prod.id === id);

  static addProduct(id, price) {
    let cart = { products: [], totalPrice: 0 };
    const parsedCart = Cart.parseCart();
    if (parsedCart.products) cart = JSON.parse(JSON.stringify(parsedCart));

    const index = Cart.getIndex(id);
    const isInCart = index !== -1;

    if (isInCart) {
      cart.products[index].quantity += 1;
    } else {
      cart.products.push({ id, quantity: 1 });
    }
    cart.totalPrice += price;

    fs.writeFileSync(cartJSON, JSON.stringify(cart));
  }

  static deleteProduct(id, price) {
    const cart = Cart.parseCart();
    const product = Cart.getCartProductFromID(id);
    cart.products = cart.products.filter((prod) => prod.id !== id);
    cart.totalPrice -= price * product.quantity;

    fs.writeFileSync(cartJSON, JSON.stringify(cart));
  }
}