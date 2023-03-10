import express from 'express';

import * as admin from '../controllers/admin.js';

const router = express.Router();

router.get('/products', admin.getAdminProducts);

router.get('/add-product', admin.getAddProduct);
router.post('/add-product', admin.postAddProduct);

router.get('/edit-product', admin.getEditProduct);
router.post('/edit-product', admin.postEditProduct);

export default router;
