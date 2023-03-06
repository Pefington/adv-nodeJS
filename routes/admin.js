import express from 'express';

import sendPage from '../utils/sendPage.js';

const router = express.Router();

router.get('/add-product', (_req, res) => {
  sendPage(res, 'views', 'add-product.html');
});

router.post('/add-product', (req, res) => {
  // eslint-disable-next-line no-console
  console.log(req.body);
  res.redirect('/');
});

export default router;
