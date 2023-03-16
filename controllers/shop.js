import { productsJSON } from '../data/data.js';
import { Cart } from '../models/cart.js';
import { findByID } from '../utils/findByID.js';
import { parseJSON } from '../utils/parseJSON.js';

export const getIndex = (_req, res) => {
  parseJSON(productsJSON, (products) => {
    res.render('shop/index', {
      products,
      pageTitle: 'Shop',
    });
  });
};

export const getProducts = (_req, res) => {
  parseJSON(productsJSON, (products) => {
    res.render('shop/products', {
      products,
      pageTitle: 'Products',
    });
  });
};

export const getProduct = (req, res) => {
  const { id } = req.params;
  findByID(productsJSON, id, (product) =>
    res.render('shop/product', {
      product,
      pageTitle: product.name,
    })
  );
};

export const getCart = (_req, res) => {
  res.render('shop/cart', {
    pageTitle: 'Cart',
  });
};

export const postCart = (req, res) => {
  const { productID } = req.body;
  findByID(productsJSON, productID, (product) => {
    Cart.addProduct(productID, product.price);
  });
  res.redirect('/cart');
};

export const getCheckout = (_req, res) => {
  res.render('shop/checkout', {
    pageTitle: 'Checkout',
  });
};

export const getOrders = (_req, res) => {
  res.render('shop/orders', {
    pageTitle: 'Orders',
  });
};
