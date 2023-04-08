export const authed = (_, res, next) => {
  if (!res.locals.isSignedIn) {
    return res.redirect('/signin');
  }
  return next();
};
