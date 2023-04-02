import express from 'express';

import * as auth from '../controllers/auth.js';

export const router = express.Router();

router.get('/login', auth.getLogin);

router.post( '/login', auth.postLogin );

router.get( '/logout', auth.postLogout );
