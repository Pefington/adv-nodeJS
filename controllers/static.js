export const get404 = ( _req, res ) => {
  res.status(404).render('static/404', { pageTitle: '404 - Not Found :(' });
};
