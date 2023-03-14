import fs from 'fs';
import { createApi } from 'unsplash-js';

import { productsJSON } from '../data/data.js';
import { UNSPLASH_KEY } from '../env/env.js';
import { capitalise } from '../utils/capitalise.js';
import { formatPrice } from '../utils/formatPrice.js';

const unsplash = createApi({
  accessKey: UNSPLASH_KEY,
});

const parseProducts = (cb) => {
  fs.readFile(productsJSON, (readError, fileContent) =>
    readError ? cb([]) : cb(JSON.parse(fileContent))
  );
};

export class Product {
  constructor(name, description, price) {
    this.name = capitalise(name);
    this.description = capitalise(description);
    this.price = price * 100;
    this.displayPrice = formatPrice(this.price);
  }

  async getPhotoURL() {
    const result = await unsplash.search.getPhotos({
      query: this.name,
      page: 1,
      perPage: 100,
      orientation: 'squarish',
    });
    if (result.errors) {
      // eslint-disable-next-line no-console
      console.log('error occurred: ', result.errors[0]);
    }
    const photos = result.response.results;
    const index = Math.floor(Math.random() * photos.length);
    this.photoURL = photos[index].urls.regular;
  }

  save() {
    parseProducts( ( products ) => {
      this.id = products.length + 1
      products.push(this);
      fs.writeFile(productsJSON, JSON.stringify(products), (writeError) => {
        // eslint-disable-next-line no-console
        if (writeError) console.log(writeError);
      });
    });
  }

  static fetchAll(cb) {
    parseProducts(cb);
  }

  static findByID( id, cb ) {
    parseProducts( products => {
      const product = products.find( prod => prod.id == id )
      cb(product)
    })
  }
}
