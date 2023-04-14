import { Product } from '../models/product.js';
import { capitalise } from '../utils/capitalise.js';
import { formatPrice } from '../utils/formatPrice.js';
import { getPhoto } from '../utils/getPhoto.js';
import { logError } from '../utils/logError.js';

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({
      userId: req.session.user._id,
    });
    res.render('admin/products', {
      pageTitle: 'Admin Products',
      formatPrice,
      products,
    });
  } catch (error) {
    logError(error);
  }
};

export const getAddProduct = (_, res) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    edit: false,
  });
};

export const postAddProduct = async (req, res) => {
  try {
    const { name, description, price, photoUrl } = req.body;
    const photo = await getPhoto(name);
    const product = new Product({
      name: capitalise(name),
      description: capitalise(description || photo.alt),
      price: price * 100,
      photoUrl: photoUrl || photo.url,
      userId: req.session.user._id,
    });
    await product.save();
  } catch (error) {
    logError(error);
  } finally {
    res.redirect('/');
  }
};

export const getEditProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById( id );
    if (product) {
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        edit: true,
        product,
      });
    } else {
      res.redirect('/');
    }
  } catch (error) {
    logError(error);
  }
};

export const postEditProduct = async (req, res) => {
  try {
    const { name, description, price, photoUrl, productId } = req.body;
    const product = await Product.findById(productId);

    if (product.userId.toString() !== req.user._id.toString()) {
      req.flash('message', '🕵️Look, no.');
      res.redirect('/signout');
      return;
    }

    const photo = await getPhoto(name);
    product.name = capitalise(name);
    product.description = capitalise(description || photo.alt);
    product.price = price * 100;
    product.photoUrl = photoUrl || photo.url;
    await product.save();
  } catch (error) {
    logError(error);
    res.redirect('/');
  }
};

export const postDeleteProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await Product.findById(productId);
    if (product.userId.toString() !== req.user._id.toString()) {
      req.flash('message', '🕵️Look, no.');
      res.redirect('/signout');
      return;
    }
    await product.deleteOne({ _id: productId });

    res.redirect('products');
  } catch (error) {
    logError(error);
  }
};
