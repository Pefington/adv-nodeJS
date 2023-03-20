import { Product } from '../models/product.js';
import { capitalise } from '../utils/capitalise.js';
import { formatPrice } from '../utils/formatPrice.js';
import { getPhotoURL } from '../utils/getPhotoURL.js';

export const getAdminProducts = async (_, res) => {
  try {
    const products = await Product.findAll();

    res.render('admin/products', {
      pageTitle: 'Admin Products',
      formatPrice,
      products,
    });
  } catch (error) {
    console.error(error);
  }
};

export const getCreateProduct = (_, res) => {
  res.render('admin/edit-product', {
    pageTitle: 'Create Product',
    edit: false,
  });
};

export const postCreateProduct = async (req, res) => {
  const { name, description, price } = req.body;
  try {
    await Product.create({
      name: capitalise(name),
      description: capitalise(description),
      price: price * 100,
      photoURL: await getPhotoURL(name),
    });
  } catch (error) {
    console.error(error);
  }

  res.redirect('/');
};

export const getEditProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByPk(id);
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
    console.error(error);
  }
};

export const postEditProduct = async (req, res) => {
  const { id, name, description, price, photoURL } = req.body;
  try {
    const product = await Product.findByPk(id);
    // @ts-ignore
    product.name = name;
    // @ts-ignore
    product.description = description;
    // @ts-ignore
    product.price = price * 100;
    // @ts-ignore
    product.photoURL = photoURL || (await getPhotoURL(name));
    await product.save();

    res.redirect('products');
  } catch (error) {
    console.error(error);
  }
};

export const postDeleteProduct = async (req, res) => {
  const { id } = req.body;
  try {
    // @ts-ignore
    const product = await Product.findByPk(id);
    await product.destroy();

    res.redirect('products');
  } catch (error) {
    console.error(error);
  }
};
