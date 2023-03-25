import { Product } from '../models/product.js';
import { capitalise } from '../utils/capitalise.js';
import { formatPrice } from '../utils/formatPrice.js';
import { getphotoUrl } from '../utils/getPhotoUrl.js';

export const getAdminProducts = async (_, res) => {
  try {
    const products = await Product.fetchAll();
    res.render('admin/products', {
      pageTitle: 'Admin Products',
      formatPrice,
      products,
    });
  } catch (error) {
    console.error(`\n\n${error}\n`);
  }
};

export const getCreateProduct = (_, res) => {
  res.render('admin/edit-product', {
    pageTitle: 'Create Product',
    edit: false,
  });
};

export const postAddProduct = async (req, res) => {
  const { name, description, price } = req.body;
  try {
    const product = new Product(
      capitalise(name),
      capitalise(description),
      price * 100
    );
    product.photoUrl = await getphotoUrl(name);
    await product.save();
  } catch (error) {
    console.error(`\n\n${error}\n`);
  }
  res.redirect('/');
};

export const getEditProduct = async (req, res) => {
  const { id } = req.params;
  try {
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
    console.error(`\n\n${error}\n`);
  }
};

export const postEditProduct = async (req, res) => {
  const { name, description, price, photoUrl, id } = req.body;
  try {
    const product = new Product(
      capitalise(name),
      capitalise(description),
      price * 100,
      photoUrl,
      id
    );
    product.photoUrl = photoUrl || (await getphotoUrl(name));
    await product.save();
    res.redirect('products');
  } catch (error) {
    console.error(`\n\n${error}\n`);
  }
};

export const postDeleteProduct = async (req, res) => {
  const { id } = req.body;
  try {
    await Product.delete(id);
    res.redirect('products');
  } catch (error) {
    console.error(`\n\n${error}\n`);
  }
};
