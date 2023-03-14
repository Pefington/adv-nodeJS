import express from 'express';

import * as shop from '../controllers/shop.js';

export const router = express.Router();

router.get('/', shop.getIndex);

router.get('/products', shop.getProducts);

router.get('/products/:id', shop.getProduct);

router.get('/cart', shop.getCart);

router.post('/cart', shop.postCart);

router.get('/checkout', shop.getCheckout);

router.get('/orders', shop.getOrders);
