import express from 'express';

import * as admin from '../controllers/admin.js';
import { authed } from '../middleware/authUtils.js';

export const router = express.Router();

router.get('/products', authed, admin.getAdminProducts);

router.get('/add-product', authed, admin.getAddProduct);
router.post('/add-product', authed, admin.postAddProduct);

router.get('/edit-product/:id', authed, admin.getEditProduct);
router.post('/edit-product', authed, admin.postEditProduct);

router.post('/delete-product', authed, admin.postDeleteProduct);
