import { Product } from '../models/product.js';

export const getAdminProducts = (_req, res) => {
  Product.fetchAll((productsArray) => {
    res.render('admin/products', {
      products: productsArray,
      pageTitle: 'Admin Products',
    });
  });
};

export const getAddProduct = (_req, res) => {
  res.render('admin/add-product', {
    pageTitle: 'Add Product',
  });
};

export const postAddProduct = async (req, res) => {
  const { name, description, price } = req.body;
  const product = new Product(name, description, price);
  await product.getPhotoURL();
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
