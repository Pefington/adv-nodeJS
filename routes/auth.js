import express from 'express';
import { check } from 'express-validator';

import * as auth from '../controllers/auth.js';
import { User } from '../models/user.js';

export const router = express.Router();

router.get('/signup', auth.getSignup);
router.post(
  '/signup',
  check('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email.')
    .custom(async (value) => {
      const user = await User.findOne({ email: value });
      if (user) throw new Error('❌Email already exists.');
    }),
  check('password')
    .trim()
    .isLength({ min: 12 })
    .withMessage('❗Password must be at least 12 characters long.'),
  check('confirmPassword', '❗Passwords must match.').custom(
    (value, { req }) => value === req.body.password
  ),
  auth.postSignup
);

router.get('/signin', auth.getSignin);
router.post(
  '/signin',
  check('email', 'Please enter a valid email.').isEmail(),
  check('password')
    .trim()
    .isLength({ min: 12 })
    .withMessage('❗Your password is at least 12 characters long.'),
  check('confirmPassword', '❗Passwords must match.').custom(
    (value, { req }) => value === req.body.password
  ),
  auth.postSignin
);

router.get('/signout', auth.postSignout);

router.get('/reset', auth.getReset);
router.post('/reset', check(), auth.postReset);

router.get('/reset/:token', auth.getNewPassword);
router.post('/new-password', check(), auth.postNewPassword);
