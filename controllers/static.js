export const get404 = (req, res) => {
  res.status(404).render('static/404', {
    pageTitle: '404 - Not Found :(',
    isLoggedIn: req.session.isLoggedIn,
  });
};
