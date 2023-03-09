import express from 'express';

const router = express.Router();
const productsList = [];

router.get( '/add-product', ( _req, res ) => {
  res.render('add-product', {
    pageTitle: 'Add Product',
    path: '/add-product',
  });
});

router.post('/add-product', (req, res) => {
  productsList.push( { title: req.body.title } );
  // eslint-disable-next-line no-console
  console.log(productsList)
  res.redirect('/');
});

export {router as adminRoutes, productsList}
