export const get404 = (_, res) => {
  res.status(404).render('static/404', {
    pageTitle: '🤔 404 - Not Found',
  });
};

export const get500 = (error, _, res, _next) => {
  res.status(500).render('static/500', {
    pageTitle: '❌ 500 - Server Error',
    message: error.message,
  });
};
