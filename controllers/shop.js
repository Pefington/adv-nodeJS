import { Product } from '../models/product.js';
import { formatPrice } from '../utils/formatPrice.js';

export const getIndex = async ( _, res, next ) => {
  try {
    const products = await Product.find();
    res.render('shop/index', {
      pageTitle: 'Shop',
      formatPrice,
      products,
    });
  } catch (error) {
    next(new Error(error));
  }
};

export const getProducts = async (_, res, next) => {
  try {
    const products = await Product.find();
    res.render('shop/products', {
      pageTitle: 'Products',
      formatPrice,
      products,
    });
  } catch (error) {
    next(new Error(error));
  }
};

export const getProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId);
    res.render('shop/product', {
      pageTitle: product.name,
      formatPrice,
      product,
    });
  } catch (error) {
    next(new Error(error));
    res.render('shop/product', {
      pageTitle: 'Product not found',
      formatPrice,
      product: null,
    });
  }
};

export const postCart = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const product = await Product.findById(productId);
    await req.user.addToCart(product);
    res.redirect('/cart');
  } catch (error) {
    next(new Error(error));
  }
};

export const getCart = async (req, res, next) => {
  try {
    const { user } = req;
    const products = await user.getCart();
    res.render('shop/cart', {
      pageTitle: 'Cart',
      formatPrice,
      products,
    });
  } catch (error) {
    next(new Error(error));
  }
};

export const postRemoveFromCart = async (req, res, next) => {
  try {
    const { productId } = req.body;
    await req.user.removeFromCart(productId);
  } catch (error) {
    next(new Error(error));
  } finally {
    res.redirect('/cart');
  }
};

export const postOrder = async (req, res, next) => {
  try {
    const { user } = req;
    await user.postOrder();
  } catch (error) {
    next(new Error(error));
  } finally {
    res.redirect('/orders');
  }
};

export const getOrders = async (req, res, next) => {
  try {
    const { user } = req;
    const orders = await user.getOrders();
    res.render('shop/orders', {
      pageTitle: 'Orders',
      formatPrice,
      orders,
    });
  } catch (error) {
    next(new Error(error));
  }
};

export const getCheckout = (req, res, next) => {
  // res.render('shop/checkout', {
  //   pageTitle: 'Checkout',
  // });
};
