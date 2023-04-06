// @ts-nocheck
import bcrypt from 'bcryptjs';

import { User } from '../models/user.js';
import { logError } from '../utils/logError.js';

export const getSignup = (req, res) => {
  res.render('auth/signup', {
    pageTitle: 'Sign up',
  });
};

export const postSignup = async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 12);
  try {
    const user = new User({
      email: req.body.email,
      password: hashedPassword,
    });
    await user.save();
    await user.clearCart();
    req.session.user = user;
    req.session.isSignedIn = true;
  } catch (error) {
    logError(error);
  } finally {
    res.redirect('/');
  }
};

export const getSignin = (req, res) => {
  res.render('auth/signin', {
    pageTitle: 'Sign in',

  });
};

export const postSignin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      req.session.user = user;
      req.session.isSignedIn = true;
      req.session.save();
      return res.redirect('/');
    }

    return res.redirect('/signin');
  } catch (error) {
    logError(error);
    return res.redirect('/signin');
  }
};

export const postSignout = (req, res) => {
  req.session.destroy((err) => {
    err && logError(err);
    res.redirect('/');
  });
};
