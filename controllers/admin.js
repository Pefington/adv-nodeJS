import { Product } from '../models/product.js';

export const getAdminProducts = (_req, res) => {
  Product.fetchAll((productsArray) => {
    res.render('admin/products', {
      products: productsArray,
      pageTitle: 'Admin Products',
    });
  });
};

export const getCreateProduct = (_req, res) => {
  res.render('admin/edit-product', {
    pageTitle: 'Create Product',
    edit: false,
  });
};

export const postCreateProduct = async ( req, res ) => {


  console.log( req.body )


  const { name, description, price } = req.body;
  const product = new Product(name, description, price);
  await product.getPhotoURL();
  product.save();
  res.redirect('/');
};

export const getEditProduct = (req, res) => {
  const { id } = req.params;
  Product.findByID(id, (product) =>
    product
      ? res.render('admin/edit-product', {
          pageTitle: 'Edit Product',
          edit: true,
          product,
        })
      : res.redirect('/')
  );
};

export const postEditProduct = (req, res) => {
  const { id, name, description, price, photoURL } = req.body;
  const product = new Product( name, description, price )
  product.id = id
  product.photoURL = photoURL
  product.save()
  res.redirect('products')
};
