import fs from "fs";
import path from "path";

import rootDir from "../utils/rootDir.js";

const productsJSON = path.join( rootDir, "data", "products.json" );

const parseProducts = (cb) => {
  fs.readFile(productsJSON, (readError, fileContent) =>
    readError ? cb([]) : cb(JSON.parse(fileContent))
  );
};

class Product {
  constructor(title) {
    this.title = title;
  }

  save() {
    parseProducts((products) => {
      products.push(this);
      fs.writeFile(productsJSON, JSON.stringify(products), (writeError) => {
        // eslint-disable-next-line no-console
        console.log(writeError);
      });
    });
  }

  static fetchAll(cb) {
    parseProducts(cb);
  }
}

export default Product;
