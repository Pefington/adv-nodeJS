import { Product } from '../models/product.js';
import { capitalise } from '../utils/capitalise.js';
import { formatPrice } from '../utils/formatPrice.js';
import { getphotoUrl } from '../utils/getPhotoUrl.js';

export const getAdminProducts = async (req, res) => {
  try {
    const products = await req.user.getProducts();
    res.render('admin/products', {
      pageTitle: 'Admin Products',
      formatPrice,
      products,
    });
  } catch (error) {
    console.error(`\n\n\n${error}\n`);
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
    await req.user.createProduct({
      name: capitalise(name),
      description: capitalise(description),
      price: price * 100,
      photoUrl: await getphotoUrl(name),
    });
  } catch (error) {
    console.error(`\n\n\n${error}\n`);
  }
  res.redirect('/');
};

export const getEditProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const products = await req.user.getProducts({ where: { id } });
    const product = products[0];
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
    console.error(`\n\n\n${error}\n`);
  }
};

export const postEditProduct = async (req, res) => {
  const { id, name, description, price, photoUrl } = req.body;
  try {
    const product = await Product.findByPk(id);
    // @ts-ignore
    product.name = name;
    // @ts-ignore
    product.description = description;
    // @ts-ignore
    product.price = price * 100;
    // @ts-ignore
    product.photoUrl = photoUrl || (await getphotoUrl(name));
    await product.save();
    res.redirect('products');
  } catch (error) {
    console.error(`\n\n\n${error}\n`);
  }
};

export const postDeleteProduct = async (req, res) => {
  const { id } = req.body;
  try {
    const product = await Product.findByPk(id);
    await product.destroy();
    res.redirect('products');
  } catch (error) {
    console.error(`\n\n\n${error}\n`);
  }
};
