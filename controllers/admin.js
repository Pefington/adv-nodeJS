import Product from '../models/product.js';
import capitalise from '../utils/capitalise.js';

export const getAdminProducts = (_req, res) => {
  Product.fetchAll((productsArray) => {
    res.render('admin/products', {
      products: productsArray,
      pageTitle: 'Add Product',
    });
  });
};

export const getAddProduct = (_req, res) => {
  res.render('admin/add-product', {
    pageTitle: 'Add Product',
  });
};

export const postAddProduct = (req, res) => {
  const name = capitalise(req.body.name);
  const product = new Product(name);
  product.save();
  res.redirect('/');
};

export const getEditProduct = (_req, res) => {
  res.render('admin/edit-product', {
    pageTitle: 'Edit Product',
  });
};

export const postEditProduct = (req, res) => {
  const { product } = req;
  product.save();
  res.redirect('/');
};
