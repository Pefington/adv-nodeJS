import { Product } from '../models/product.js';
import { formatPrice } from '../utils/formatPrice.js';

export const getIndex = async (_, res) => {
  try {
    const products = await Product.findAll();
    res.render('shop/index', {
      pageTitle: 'Shop',
      formatPrice,
      products,
    });
  } catch (error) {
    console.error(`\n\n\n${error}\n`);
  }
};

export const getProducts = async (_, res) => {
  try {
    const products = await Product.findAll();
    res.render('shop/products', {
      pageTitle: 'Products',
      formatPrice,
      products,
    });
  } catch (error) {
    console.error(`\n\n\n${error}\n`);
  }
};

export const getProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByPk(id);
    res.render('shop/product', {
      // @ts-ignore
      pageTitle: product.name,
      formatPrice,
      product,
    });
  } catch (error) {
    console.error(`\n\n\n${error}\n`);
  }
};

export const getCart = async (req, res) => {
  try {
    const cart = await req.user.getCart();
    const products = await cart.getProducts();
    res.render('shop/cart', {
      pageTitle: 'Cart',
      formatPrice,
      products,
      //   price: cartPrice,
    });
  } catch (error) {
    console.error(`\n\n\n${error}\n`);
  }
};

export const postCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const { user } = req;
    const cart = await user.getCart();
    let [product] = (await cart.getProducts({ where: { id: productId } })) || [
      null,
    ];
    let quantity = 1;
    if (product) {
      quantity = product.cartItem.quantity;
      quantity += 1;
      cart.addProduct(product, { through: { quantity } });
    } else {
      product = await Product.findByPk(productId);
      await cart.addProduct(product, { through: { quantity } });
    }
    res.redirect('/cart');
  } catch (error) {
    console.error(`\n\n\n${error}\n`);
  }
};

export const postRemoveFromCart = async (req, res) => {
  try {
    const { user } = req;
    const { productID } = req.body;
    const cart = await user.getCart();
    const [product] = await cart.getProducts({ where: { id: productID } });
    await product.cartItem.destroy();
    res.redirect('/cart');
  } catch (error) {
    console.error(`\n\n\n${error}\n`);
  }
};

export const getCheckout = (_, res) => {
  res.render('shop/checkout', {
    pageTitle: 'Checkout',
  });
};

export const getOrders = async (req, res) => {
  const { user } = req;
  const orders = await user.getOrders();
  res.render('shop/orders', {
    pageTitle: 'Orders',
    formatPrice,
    orders,
  });
};

export const postOrder = async (req, res) => {
  try {
    const cart = await req.user.getCart();
    let products = await cart.getProducts();
    products = products.map(({ orderItem, cartItem, ...product }) => ({
      ...product,
      orderItem: { quantity: cartItem.quantity },
    }));

    // const order = await req.user.createOrder();
    // await order.addProducts(products);
    req.user.createOrder().then((order) => order.addProducts(products))
    // .catch((err) => console.log(err));

    await cart.setProducts(null);
  } catch (error) {
    console.error(`\n\n\n${error}\n`);
  }
  res.redirect('/orders');
};

// exports.postOrder = (req, res, next) => {
//   let fetchedCart;
//   req.user
//     .getCart()
//     .then((cart) => {
//       fetchedCart = cart;
//       return cart.getProducts();
//     })
//     .then((products) => {
//       return req.user
//         .createOrder()
//         .then((order) => {
//           return order.addProducts(
//             products.map((product) => {
//               product.orderItem = { quantity: product.cartItem.quantity };
//               return product;
//             })
//           );
//         })
//         .catch((err) => console.log(err));
//     })
//     .then((result) => {
//       return fetchedCart.setProducts(null);
//     })
//     .then((result) => {
//       res.redirect('/orders');
//     })
//     .catch((err) => console.log(err));
// };
