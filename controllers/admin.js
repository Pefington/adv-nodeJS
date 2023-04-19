import fs from 'fs/promises';

import { Product } from '../models/product.js';
import { capitalise } from '../utils/capitalise.js';
import { formatPrice } from '../utils/formatPrice.js';
import { getPhoto } from '../utils/getPhoto.js';

export const getProducts = async (req, res, next) => {
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
    next(new Error(error));
  }
};

export const getAddProduct = (_, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    edit: false,
  });
};

export const postAddProduct = async (req, res, _) => {
  const { name, description, price, photoUrl } = req.body;
  const photoFile = req.file;
  const photo = await getPhoto(name);
  const product = new Product({
    name: capitalise(name),
    description: capitalise(description || photo.alt),
    price: price * 100,
    photoUrl:
      // eslint-disable-next-line no-useless-escape
      (photoFile && `\/${photoFile?.path.split('/').slice(1).join('/')}`) ||
      photoUrl ||
      photo.url,
    userId: req.session.user._id,
  });
  await product.save();
  res.redirect('products');
};

export const getEditProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
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
    next(new Error(error));
  }
};

export const postEditProduct = async (req, res, next) => {
  try {
    const { name, description, price, photoUrl, productId } = req.body;
    const photoFile = req.file;
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
    product.photoUrl = `${photoFile?.path}` || photoUrl || photo.url;
    await product.save();
  } catch (error) {
    next(new Error(error));
    res.redirect('/');
    // res.status(422).render('admin/edit-product', {
    //   pageTitle: 'Add Product',
    //   path: '/admin/add-product',
    //   editing: false,
    //   hasError: true,
    //   message: 'Attached file is not an image.',
    //   validationErrors: [],
    // });
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product || product.userId.toString() !== req.user._id.toString()) {
      req.flash('message', '🕵️Look, no.');
      res.redirect('/signout');
      return;
    }
    if (product?.photoUrl.split('/').includes('photos'))
      await fs.unlink(`data/${product.photoUrl}`);

    await product.deleteOne({ _id: id });

    res.status(200).json({ message: 'Success' });
  } catch (error) {
    res.status(500).json({ message: 'Deleting product failed' });
  }
};
