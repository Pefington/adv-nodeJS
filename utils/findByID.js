import { parseJSON } from './parseJSON.js';

export function findByID(JSONfile, id, cb) {
  parseJSON(JSONfile, (products) => {
    const product = products.find((prod) => prod.id === id);
    cb(product);
  });
}
