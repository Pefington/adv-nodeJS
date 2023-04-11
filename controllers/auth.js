// @ts-nocheck
import bcrypt from 'bcryptjs';

import { User } from '../models/user.js';
import { logError } from '../utils/logError.js';
import { sendEmail } from '../utils/mailer.js';

export const getSignup = async (_, res) => {
  res.render('auth/signup', {
    pageTitle: 'Sign up',
  });
};

export const postSignup = async ( req, res ) => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 12);
  try {
    const user = new User({
      email,
      password: hashedPassword,
    });
    await user.save();
    await sendEmail(email);
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
    flashMessage: req.flash('error'),
  });
};

export const postSignin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    const match = user && (await bcrypt.compare(password, user.password));
    if (user && match) {
      req.session.user = user;
      req.session.save();
      req.session.isSignedIn = true;
      return res.redirect('/');
    }

    req.flash('error', 'Invalid email or password.');
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
