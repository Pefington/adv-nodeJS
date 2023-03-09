import express from 'express';

import { productsList } from './admin.js';

const router = express.Router();

router.get('/', (_req, res) => {
  res.render('shop', {
    products: productsList,
    pageTitle: 'Shop',
    path: '/',
  });
});

export default router
