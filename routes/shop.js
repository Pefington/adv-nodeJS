import express from 'express';

import * as shop from '../controllers/shop.js';

const router = express.Router();

router.get('/', shop.getIndex);

router.get('/products', shop.getProducts);

router.get('/cart', shop.getCart);

router.get('/checkout', shop.getCheckout);

export default router;
