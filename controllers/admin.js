import { productsJSON } from '../data/data.js';
import { Product } from '../models/product.js';

export const getAdminProducts = (_req, res) => {
  const products = Product.getProducts();

  res.render('admin/products', {
    pageTitle: 'Admin Products',
    products,
  });
};

export const getCreateProduct = (_req, res) => {
  res.render('admin/edit-product', {
    pageTitle: 'Create Product',
    edit: false,
  });
};

export const postCreateProduct = async (req, res) => {
  const { name, description, price } = req.body;
  const product = new Product(name, description, price);
  await product.getPhotoURL();
  product.save();

  res.redirect('/');
};

export const getEditProduct = (req, res) => {
  const { id } = req.params;
  const product = Product.getProductFromID(id);

  if (product) {
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      edit: true,
      product,
    });
  } else {
    res.redirect('/');
  }
};

export const postEditProduct = (req, res) => {
  const { id, name, description, price, photoURL } = req.body;
  const product = new Product(name, description, price);
  product.id = id;
  product.photoURL = photoURL;
  product.save();
  res.redirect('products');
};

export const postDeleteProduct = (req, res) => {
  const { id } = req.body;
  Product.delete(id);
  res.redirect('products');
};
