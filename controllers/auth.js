import bcrypt from 'bcryptjs';
import crypto from 'crypto';

import { User } from '../models/user.js';
import { logError } from '../utils/logError.js';
import {
  sendNewPasswordEmail,
  sendResetPasswordEmail,
  sendWelcomeEmail,
} from '../utils/mailer.js';

export const getSignup = async (req, res) => {
  res.render('auth/signup', {
    pageTitle: 'Sign up',
  });
};

export const postSignup = async (req, res) => {
  const { email, password } = req.body;

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
    const match = user && (await bcrypt.compare(password, user.password));
    if (user && match) {
      req.session.user = user;
      req.session.save();
      req.session.isSignedIn = true;
      res.redirect('/');
      return;
    }

    req.flash('message', 'Invalid email or password.');
    res.redirect('/signin');
  } catch (error) {
    logError(error);
    res.redirect('/signin');
  }
};

export const postSignout = (req, res) => {
  req.session.destroy((err) => {
    err && logError(err);
    res.redirect('/');
  });
};

export const getReset = (req, res) => {
  res.render('auth/reset', {
    pageTitle: 'Reset Password',
  });
};

export const postReset = async (req, res) => {
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
    logError(error);
  } finally {
    req.flash(
      'message',
      'If this email exists, you will receive a reset link.'
    );
    res.redirect('/reset');
  }
};

export const getNewPassword = async (req, res) => {
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
    logError(error);
  }
};

export const postNewPassword = async (req, res) => {
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
    logError(error);
    res.redirect('/reset');
  }
};
