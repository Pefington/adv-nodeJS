import express from 'express';

import * as shop from '../controllers/shop.js';
import { authed } from '../middleware/authUtils.js';

export const router = express.Router();

router.get('/', shop.getIndex);

router.get('/products', shop.getProducts);
router.get('/products/:id', shop.getProduct);

router.get('/cart', authed, shop.getCart);
router.post('/cart', authed, shop.postCart);

router.post('/delete-from-cart', authed, shop.postRemoveFromCart);

router.get( '/checkout', authed, shop.getCheckout );
router.post( '/checkout', authed, shop.postCheckout )
router.get( '/checkout-success', authed, shop.getCheckoutSuccess );
router.get( '/checkout-cancel', authed, shop.getCheckoutCancel);

router.get('/orders', authed, shop.getOrders);

router.get('/invoice/:id', authed, shop.getInvoice);

router.post('/create-order', authed, shop.postOrder);
