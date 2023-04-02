import { Product } from '../models/product.js';
import { formatPrice } from '../utils/formatPrice.js';
import { logError } from '../utils/logError.js';

export const getIndex = async (req, res) => {
  try {
    const products = await Product.find();
    res.render('shop/index', {
      pageTitle: 'Shop',
      formatPrice,
      products,
      isLoggedIn: req.session.isLoggedIn,
    });
  } catch (error) {
    logError(error);
  }
};

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.render('shop/products', {
      pageTitle: 'Products',
      formatPrice,
      products,
      isLoggedIn: req.session.isLoggedIn,
    });
  } catch (error) {
    logError(error);
  }
};

export const getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.render('shop/product', {
      pageTitle: product.name,
      formatPrice,
      product,
      isLoggedIn: req.session.isLoggedIn,
    });
  } catch (error) {
    logError(error);
    res.render('shop/product', {
      pageTitle: 'Product not found',
      formatPrice,
      product: null,
      isLoggedIn: req.session.isLoggedIn,
    });
  }
};

export const postCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await Product.findById(productId);
    await req.user.addToCart(product);
    res.redirect('/cart');
  } catch (error) {
    logError(error);
  }
};

export const getCart = async (req, res) => {
  try {
    const { user } = req;
    const products = await user.getCart();
    res.render('shop/cart', {
      pageTitle: 'Cart',
      formatPrice,
      products,
      isLoggedIn: req.session.isLoggedIn,
    });
  } catch (error) {
    logError(error);
  }
};

export const postRemoveFromCart = async (req, res) => {
  try {
    const { id } = req.body;
    await req.user.removeFromCart(id);
  } catch (error) {
    logError(error);
  } finally {
    res.redirect('/cart');
  }
};

export const postOrder = async (req, res) => {
  try {
    const { user } = req;
    await user.postOrder();
  } catch (error) {
    logError(error);
  } finally {
    res.redirect('/orders');
  }
};

export const getOrders = async (req, res) => {
  try {
    const { user } = req;
    const orders = await user.getOrders();
    res.render('shop/orders', {
      pageTitle: 'Orders',
      formatPrice,
      orders,
      isLoggedIn: req.session.isLoggedIn,
    });
  } catch (error) {
    logError(error);
  }
};

export const getCheckout = (req, res) => {
  // res.render('shop/checkout', {
  //   pageTitle: 'Checkout',
  // isLoggedIn: req.session.isLoggedIn,
  // });
};
