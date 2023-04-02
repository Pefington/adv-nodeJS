import { User } from '../models/user.js';
import { logError } from '../utils/logError.js';

export const getLogin = (req, res) => {
  res.render('auth/login', {
    pageTitle: 'Log in',
    isLoggedIn: req.session.isLoggedIn,
  });
};

export const postLogin = async (req, res) => {
  try {
    req.session.user = await User.findOne();
    req.session.isLoggedIn = true;
  } catch (error) {
    logError(error);
  } finally {
    res.redirect('/');
  }
};

export const postLogout = (req, res) => {
  req.session.destroy( ( err ) => {
    err && logError(err);
    res.redirect('/');
  });
};
