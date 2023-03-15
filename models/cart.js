import fs from 'fs';

import { cartJSON } from '../data/data.js';

export class Cart {
  static addProduct(id, productPrice) {
    fs.readFile(cartJSON, (err, fileContent) => {
      let cart = { products: [], totalPrice: 0 };
      if (!err) cart = JSON.parse(fileContent);

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
        (writeError) =>
          writeError && console.log(writeError)
      );
    });
  }
}
