import fs from 'fs';
import { createApi } from 'unsplash-js';

import { productsJSON } from '../data/data.js';
import { UNSPLASH_KEY } from '../env/env.js';
import { capitalise } from '../utils/capitalise.js';
import { formatPrice } from '../utils/formatPrice.js';
import { parseJSON } from '../utils/parseJSON.js';
import { Cart } from './cart.js';

const unsplash = createApi({ accessKey: UNSPLASH_KEY });

export class Product {
  constructor(name, description, price) {
    this.name = capitalise(name);
    this.description = capitalise(description);
    this.price = price * 100;
    this.displayPrice = formatPrice(this.price);
    this.photoURL = '';
  }

  static parseProducts = () => parseJSON(productsJSON);

  static getProductFromID = (id) =>
    Product.parseProducts().find((prod) => prod.id === id);

  static getIndexFromID = (id) =>
    Product.parseProducts().findIndex((prod) => prod.id === id);

  save() {
    const products = Product.parseProducts();

    if (this.id) {
      const index = Product.getIndexFromID(this.id);
      products[index] = this;
      fs.writeFileSync(productsJSON, JSON.stringify(products));
    } else {
      this.id = (products.length + 1).toString();
      products.push(this);
      fs.writeFileSync(productsJSON, JSON.stringify(products));
    }
  }

  async getPhotoURL() {
    const request = await unsplash.search.getPhotos({
      query: this.name,
      page: 1,
      perPage: 10,
      orientation: 'squarish',
    });
    request.errors && console.log('Unsplash error: ', request.errors[0]);

    const photos = request.response.results;
    const index = Math.floor(Math.random() * photos.length);

    this.photoURL ||= photos[index].urls.small;
  }

  static delete(id) {
    const products = Product.parseProducts();
    const updatedProducts = products.filter((prod) => prod.id !== id);
    fs.writeFileSync(productsJSON, JSON.stringify(updatedProducts));

    const { price } = Product.getProductFromID(id);
    Cart.deleteProduct(id, price);
  }
}
