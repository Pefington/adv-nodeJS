import express from 'express';

import * as auth from '../controllers/auth.js';

export const router = express.Router();

router.get('/signup', auth.getSignup);
router.post('/signup', auth.postSignup);

router.get('/signin', auth.getSignin);
router.post('/signin', auth.postSignin);

router.get('/signout', auth.postSignout);
