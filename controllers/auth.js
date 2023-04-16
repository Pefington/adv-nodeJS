import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { validationResult } from 'express-validator';

import { User } from '../models/user.js';
import {
  sendNewPasswordEmail,
  sendResetPasswordEmail,
  sendWelcomeEmail,
} from '../utils/mailer.js';

export const getSignup = async (_, res, next) => {
  res.render('auth/signup', {
    pageTitle: 'Sign up',
    values: {
      email: 'maabaa@yopmail.com',
      password: '123456789012',
      confirmPassword: '123456789012',
    },
    validationErrors: [],
  });
};

export const postSignup = async (req, res, next) => {
  const { email, password, confirmPassword } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(422).render('auth/signup', {
      pageTitle: 'Sign up',
      flashMessage: errors.array()[0].msg,
      values: {
        email,
        password,
        confirmPassword,
      },
      validationErrors: errors.array(),
    });
    // @ts-ignore
    console.error(errors.array().find((error) => error.param === 'email'));
    return;
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      email,
      password: hashedPassword,
    });
    await user.save();
    await sendWelcomeEmail(email);
    // @ts-ignore
    await user.clearCart();
    req.session.user = user;
    req.session.isSignedIn = true;
    req.session.save();
    res.redirect('/');
  } catch (error) {
    next(new Error(error));
  }
};

export const getSignin = (_, res, next) => {
  res.render('auth/signin', {
    pageTitle: 'Sign in',
    values: {
      email: 'maabaa@yopmail.com',
      password: '123456789012',
    },
  });
};

export const postSignin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    const match = user && (await bcrypt.compare(password, user.password));
    if (user && match) {
      req.session.user = user;
      req.session.isSignedIn = true;
      req.session.save();
      res.redirect('/');
      return;
    }

    res.status(422).render('auth/signin', {
      pageTitle: 'Sign in',
      flashMessage: 'Invalid email or password.',
      values: {
        email,
        password,
      },
    });
  } catch (error) {
    next(new Error(error));
    res.redirect('/signin');
  }
};

export const postSignout = (req, res, next) => {
  req.session.destroy((err) => {
    err && console.error(err);
    res.redirect('/signin');
  });
};

export const getReset = (_, res, next) => {
  res.render('auth/reset', {
    pageTitle: 'Reset Password',
  });
};

export const postReset = async (req, res, next) => {
  const { email } = req.body;

  try {
    const buffer = await crypto.randomBytes(32);
    const token = buffer.toString('hex');

    const user = await User.findOne({ email });
    user.resetToken = token;
    user.resetTokenExpiration = new Date(Date.now() + 3600000);

    await user.save();
    await sendResetPasswordEmail(email, token);
  } catch (error) {
    next(new Error(error));
  } finally {
    req.flash(
      'message',
      'If this email exists, you will receive a reset link.'
    );
    res.redirect('/reset');
  }
};

export const getNewPassword = async (req, res, next) => {
  const { token } = req.params;

  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() },
    });

    if (!user) {
      req.flash('message', 'Invalid or expired link.');
      res.redirect('/reset');
      return;
    }

    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;

    res.render('auth/new-password', {
      pageTitle: 'New Password',
      userId: user._id.toString(),
    });
  } catch (error) {
    next(new Error(error));
  }
};

export const postNewPassword = async (req, res, next) => {
  const { password, userId } = req.body;

  try {
    const user = await User.findById(userId);
    const { email } = user;
    const hashedPassword = await bcrypt.hash(password, 12);
    user.password = hashedPassword;
    await user.save();
    await sendNewPasswordEmail(email);

    req.session.user = user;
    req.session.isSignedIn = true;

    req.flash('message', 'Password updated successfully.');
    res.redirect('/');
  } catch (error) {
    req.flash('message', 'Something went wrong.');
    next(new Error(error));
    res.redirect('/reset');
  }
};
