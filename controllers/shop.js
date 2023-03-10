import Product from '../models/product.js';

export const getIndex = (_req, res) => {
  Product.fetchAll((productsArray) => {
    res.render('shop/index', {
      products: productsArray,
      pageTitle: 'Shop',
    });
  });
};

export const getProducts = (_req, res) => {
  Product.fetchAll((productsArray) => {
    res.render('shop/products', {
      products: productsArray,
      pageTitle: 'Products',
    });
  });
};

export const getProduct = (_req, res) => {
  res.render('shop/product', {
    pageTitle: 'Product',
  });
};

export const getCart = (_req, res) => {
  res.render('shop/cart', {
    pageTitle: 'Cart',
  });
};

export const getCheckout = (_req, res) => {
  res.render('shop/checkout', {
    pageTitle: 'Checkout',
  });
};
