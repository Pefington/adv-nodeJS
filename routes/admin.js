import express from 'express';

import * as admin from '../controllers/admin.js';

export const router = express.Router();

router.get('/products', admin.getAdminProducts);

router.get('/create-product', admin.getCreateProduct);
router.post('/create-product', admin.postCreateProduct);

router.get('/edit-product/:id', admin.getEditProduct);
router.post('/edit-product', admin.postEditProduct);

router.post('/delete-product', admin.postDeleteProduct);
