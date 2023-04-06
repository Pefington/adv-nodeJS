export const authed = (req, res, next) => {
  if (!req.session.isSignedIn) {
    return res.redirect('/signin');
  }
  return next();
};
