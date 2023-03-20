// import { Cart } from '../models/cart.js';
import { Product } from '../models/product.js';
import { formatPrice } from '../utils/formatPrice.js';

export const getIndex = async (_, res) => {
  try {
    const products = await Product.findAll();

    res.render('shop/index', {
      pageTitle: 'Shop',
      formatPrice,
      products,
    });
  } catch (error) {
    console.error(error);
  }
};

export const getProducts = async (_, res) => {
  try {
    const products = await Product.findAll();

    res.render('shop/products', {
      pageTitle: 'Products',
      formatPrice,
      products,
    });
  } catch (error) {
    console.error(error);
  }
};

export const getProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByPk(id);

    res.render('shop/product', {
      // @ts-ignore
      pageTitle: product.name,
      formatPrice,
      product,
    });
  } catch (error) {
    console.error(error);
  }
};

export const getCart = (_, res) => {
  // const cart = Cart.getCart();
  // const cartProds = cart.products;
  // const cartPrice = formatPrice(cart.totalPrice);
  // const allProds = Product.fetchAll();
  // const cartProducts = new Map();
  // cartProds.forEach((cartProd) => {
  //   const tempProd = allProds.find((prod) => prod.id === cartProd.id);
  //   tempProd.price = formatPrice(tempProd.price * cartProd.quantity);
  //   cartProducts.set(tempProd, cartProd.quantity);
  // });
  // res.render('shop/cart', {
  //   pageTitle: 'Cart',
  //   products: cartProducts,
  //   price: cartPrice,
  // });
};

export const postCart = (req, res) => {
  // const { productID } = req.body;
  // const product = Product.getProductFromID(productID);
  // Cart.addProduct(productID, product.price);
  // res.redirect('/cart');
};

export const postRemoveFromCart = (req, res) => {
  // const { productID } = req.body;
  // const product = Product.getProductFromID(productID);
  // Cart.deleteProduct(productID, product.price);
  // res.redirect('/cart');
};

export const getCheckout = (_, res) => {
  res.render('shop/checkout', {
    pageTitle: 'Checkout',
  });
};

export const getOrders = (_, res) => {
  res.render('shop/orders', {
    pageTitle: 'Orders',
  });
};
