import express from 'express';

import sendPage from '../utils/sendPage.js';

const router = express.Router();

router.get('/', (_req, res) => {
  sendPage(res, 'views', 'shop.html');
});

export default router;
