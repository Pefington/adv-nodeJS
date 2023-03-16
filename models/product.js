import fs from 'fs';
import { createApi } from 'unsplash-js';

import { productsJSON } from '../data/data.js';
import { UNSPLASH_KEY } from '../env/env.js';
import { capitalise } from '../utils/capitalise.js';
import { formatPrice } from '../utils/formatPrice.js';
import { parseJSON } from '../utils/parseJSON.js';
import { Cart } from './cart.js';

const unsplash = createApi({
  accessKey: UNSPLASH_KEY,
});

export class Product {
  constructor(name, description, price) {
    this.name = capitalise(name);
    this.description = capitalise(description);
    this.price = price * 100;
    this.displayPrice = formatPrice(this.price);
    this.photoURL = '';
  }

  async getPhotoURL() {
    const result = await unsplash.search.getPhotos({
      query: this.name,
      page: 1,
      perPage: 10,
      orientation: 'squarish',
    });
    result.errors && console.log('error occurred: ', result.errors[0]);

    const photos = result.response.results;
    const index = Math.floor(Math.random() * photos.length);
    this.photoURL ||= photos[index].urls.small;
  }

  save() {
    parseJSON(productsJSON, (products) => {
      if (this.id) {
        const productIndex = products.findIndex((prod) => prod.id === this.id);
        const productsCopy = [...products];
        productsCopy[productIndex] = this;
        fs.writeFile(productsJSON, JSON.stringify(productsCopy), (err) => {
          err && console.log(err);
        });
        return;
      }
      this.id = (products.length + 1).toString();
      products.push(this);
      fs.writeFile(productsJSON, JSON.stringify(products), (err) => {
        err && console.log(err);
      });
    });
  }

  static delete(id) {
    parseJSON( productsJSON, ( products ) => {
      const product = products.find(prod => prod.id === id)
      const updatedProducts = products.filter((prod) => prod.id !== id);
      fs.writeFile(productsJSON, JSON.stringify(updatedProducts), (err) =>
        err ? console.log(err) : Cart.deleteProduct(id, product.price)
      );
    });
  }
}
