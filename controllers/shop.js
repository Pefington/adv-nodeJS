/* eslint-disable camelcase */
import fs from 'fs';
import path, { dirname } from 'path';
import PDFDocument from 'pdfkit';
import Stripe from 'stripe';
import { fileURLToPath } from 'url';

import { Product } from '../models/product.js';
import { formatPrice } from '../utils/formatPrice.js';

// @ts-ignore
const stripe = new Stripe(process.env.STRIPE_KEY);

const ITEMS_PER_PAGE = 4;

export const getIndex = async (req, res, next) => {
  try {
    const { page } = req.query;

    const totalItems = await Product.find().countDocuments();
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    const currentPage = page ? +page : 1;
    const hasPreviousPage = currentPage > 1;
    const hasNextPage = currentPage < totalPages;
    const previousPage = currentPage - 1;
    const nextPage = currentPage + 1;

    const products = await Product.find()
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE);
    res.render('shop/index', {
      pageTitle: 'Shop',
      formatPrice,
      products,
      totalItems,
      currentPage,
      hasNextPage,
      hasPreviousPage,
      nextPage,
      previousPage,
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
    res.redirect('/');
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

export const getCheckout = async (req, res, next) => {
  try {
    const { user } = req;
    const products = await user.getCart();
    const total = products.reduce(
      (acc, product) => acc + product.price * product.quantity,
      0
    );
    res.render('shop/checkout', {
      pageTitle: 'Checkout',
      formatPrice,
      products,
      total,
    });
  } catch (error) {
    next(new Error(error));
  }
};

export const postCheckout = async (req, res, next) => {
  try {
    const { user } = req;
    const products = await user.getCart();

    const line_items = products.map((product) => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: product.name,
          description: product.description,
        },
        unit_amount: product.price,
      },
      quantity: product.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: 'payment',
      success_url: `${req.protocol}://${req.get('host')}/checkout-success`,
      cancel_url: `${req.protocol}://${req.get('host')}/checkout-cancel`,
    });

    res.redirect(303, session.url);
  } catch (error) {
    next(new Error(error));
  }
};

export const getCheckoutSuccess = async (req, res, next) => {
  const { user } = req;
  await user.clearCart();

  res.render('shop/checkout-success', {
    pageTitle: 'Checkout Success',
  });
};

export const getCheckoutCancel = (req, res, next) => {
  res.render('shop/checkout-cancel', {
    pageTitle: 'Checkout Canceled',
  });
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

export const getInvoice = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { user } = req;

    try {
      const order = await user.getOrder(id);
      if (!order || order.user.id.toString() !== user.id.toString()) {
        req.flash('error', '🕵️Look, no.');
        res.status(401).redirect('shop/orders');
      }
    } catch (error) {
      return next(new Error('🕵️Look, no.'));
    }

    const order = await user.getOrder(id);

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const invoicePath = path.resolve(
      __dirname,
      `../data/invoices/invoice-${id}.pdf`
    );

    const invoice = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `inline; filename="invoice-${id}.pdf"`
    );
    invoice.pipe(fs.createWriteStream(invoicePath));
    invoice.pipe(res);

    invoice.fontSize(26).text('Invoice', {
      underline: true,
    });
    invoice.text('----------------');
    let totalPrice = 0;
    order.products.forEach((product) => {
      totalPrice += product.price * product.quantity;
      invoice
        .fontSize(14)
        .text(
          `${product.name} - ${product.quantity} x ${formatPrice(
            product.price
          )}`
        );
    });
    invoice.text('----------------');
    invoice.fontSize(20).text(`Total Price: ${formatPrice(totalPrice)}`);
    return invoice.end();
  } catch (error) {
    return next(new Error(error));
  }
};
