import { Product } from '../models/product.js';
import { formatPrice } from '../utils/formatPrice.js';

export const getIndex = async (_, res) => {
  try {
    const products = await Product.fetchAll();
    res.render('shop/index', {
      pageTitle: 'Shop',
      formatPrice,
      products,
    });
  } catch (error) {
    console.error(`\n\n${error}\n`);
  }
};

export const getProducts = async (_, res) => {
  try {
    const products = await Product.fetchAll();
    res.render('shop/products', {
      pageTitle: 'Products',
      formatPrice,
      products,
    });
  } catch (error) {
    console.error(`\n\n${error}\n`);
  }
};

export const getProduct = async (req, res) => {
  const { id: productId } = req.params;
  try {
    const product = await Product.findById(productId);
    res.render('shop/product', {
      pageTitle: product.name,
      formatPrice,
      product,
    });
  } catch (error) {
    console.error(`\n\n${error}\n`);
    res.render('shop/product', {
      pageTitle: 'Product not found',
      formatPrice,
      product: null,
    });
  }
};

export const postCart = async (req, res) => {
  const { productId } = req.body;
  try {
    const product = await Product.findById(productId);
    await req.user.addToCart(product);
    res.redirect('/cart');
  } catch (error) {
    console.error(`\n\n${error}\n`);
  }
};

export const getCart = async (req, res) => {
  try {
    const products = await req.user.getCart();
    res.render('shop/cart', {
      pageTitle: 'Cart',
      formatPrice,
      products,
    });
  } catch (error) {
    console.error(`\n\n${error}\n`);
  }
};

export const postRemoveFromCart = async (req, res) => {
  const { productId } = req.body;
  try {
    await req.user.removeFromCart(productId);
    res.redirect('/cart');
  } catch (error) {
    console.error(`\n\n${error}\n`);
  }
};

export const postOrder = async (req, res) => {
  try {
    await req.user.addOrder();
    res.redirect('/orders');
  } catch (error) {
    console.error(`\n\n${error}\n`);
  }
};

export const getOrders = async (req, res) => {
  try {
    const orders = await req.user.getOrders();
    res.render('shop/orders', {
      pageTitle: 'Orders',
      formatPrice,
      orders,
    });
  } catch (error) {
    console.error(`\n\n${error}\n`);
  }
};

export const getCheckout = (_, res) => {
  // res.render('shop/checkout', {
  //   pageTitle: 'Checkout',
  // });
};
