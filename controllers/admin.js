import { Product } from '../models/product.js';
import { capitalise } from '../utils/capitalise.js';
import { formatPrice } from '../utils/formatPrice.js';
import { getphotoUrl } from '../utils/getPhotoUrl.js';
import { logError } from '../utils/logError.js';

export const getAdminProducts = async (_, res) => {
  try {
    const products = await Product.find();
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
    const product = new Product({
      name: capitalise(name),
      description: capitalise(description),
      price: price * 100,
      photoUrl: photoUrl || (await getphotoUrl(name)),
      userId: req.user._id,
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
    logError(error);
  }
};

export const postEditProduct = async (req, res) => {
  try {
    const { name, description, price, photoUrl, id } = req.body;
    const product = await Product.findById(id);
    product.name = capitalise(name);
    product.description = capitalise(description);
    product.price = price * 100;
    product.photoUrl = photoUrl || (await getphotoUrl(name));
    await product.save();
  } catch (error) {
    logError(error);
  } finally {
    res.redirect('products');
  }
};

export const postDeleteProduct = async (req, res) => {
  try {
    const { id } = req.body;
    await Product.findByIdAndDelete(id);
    res.redirect('products');
  } catch (error) {
    logError(error);
  }
};
