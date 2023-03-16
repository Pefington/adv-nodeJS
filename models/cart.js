import fs from 'fs';

import { cartJSON, productsJSON } from '../data/data.js';
import { parseJSON } from '../utils/parseJSON.js';

export class Cart {
  static addProduct(id, productPrice) {
    parseJSON(cartJSON, (parsedCart) => {
      const cart = parsedCart.products
        ? JSON.parse(JSON.stringify(parsedCart))
        : { products: [], totalPrice: 0 };

      const productIndex = cart.products.findIndex((prod) => prod.id === id);
      const isInCart = productIndex !== -1;

      if (isInCart) {
        cart.products[productIndex].quantity += 1;
      } else {
        cart.products.push({ id, quantity: 1 });
      }
      cart.totalPrice += productPrice;

      fs.writeFile(
        cartJSON,
        JSON.stringify(cart),
        (writeError) => writeError && console.log(writeError)
      );
    });
  }

  static deleteProduct(id, productPrice) {
    parseJSON(cartJSON, (parsedCart) => {
      const cart = JSON.parse(JSON.stringify(parsedCart));
      const product = cart.products.find((prod) => prod.id === id);
      console.log(cart.totalPrice, product);
      cart.products = cart.products.filter((prod) => prod.id !== id);
      cart.totalPrice -= productPrice * product.quantity;
      console.log(cart.totalPrice);

      fs.writeFile(cartJSON, JSON.stringify(cart), (err) => {
        err && console.log(err);
      });
    });
  }
}
