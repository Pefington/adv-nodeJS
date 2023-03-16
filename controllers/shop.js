import { Cart } from '../models/cart.js';
import { Product } from '../models/product.js';

export const getIndex = (_req, res) => {
  const products = Product.parseProducts();
  res.render('shop/index', {
    pageTitle: 'Shop',
    products,
  });
};

export const getProducts = (_req, res) => {
  const products = Product.parseProducts();
  res.render('shop/products', {
    pageTitle: 'Products',
    products,
  });
};

export const getProduct = (req, res) => {
  const { id } = req.params;
  const product = Product.getProductFromID(id);
  res.render('shop/product', {
    pageTitle: product.name,
    product,
  });
};

export const getCart = (_req, res) => {
  const cart = Cart.parseCart();
  res.render('shop/cart', {
    pageTitle: 'Cart',
    cart,
  });
};

export const postCart = (req, res) => {
  const { productID } = req.body;
  const product = Product.getProductFromID(productID);
  Cart.addProduct(productID, product.price);
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
