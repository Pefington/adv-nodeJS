import bodyParser from 'body-parser';
import express from 'express';

import { get404 } from './controllers/static.js';
import { sequelize } from './data/database.js';
import { Cart } from './models/cart.js';
import { CartItem } from './models/cart-item.js';
import { Order } from './models/order.js';
import { OrderItem } from './models/order-item.js';
import { Product } from './models/product.js';
import { User } from './models/user.js';
import { router as adminRoutes } from './routes/admin.js';
import { router as shopRoutes } from './routes/shop.js';
import { getphotoUrl } from './utils/getPhotoUrl.js';

const app = express();

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

app.use(async (req, _, next) => {
  const user = await User.findByPk(1);
  // @ts-ignore
  req.user = user;
  next();
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(get404);

Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });
Product.belongsToMany(Order, { through: OrderItem });

try {
  await sequelize.sync({
    // force: true,
  });
  const user =
    (await User.findByPk(1)) ||
    (await User.create({ username: 'Pef', email: 'abc@test.com' }));
  // @ts-ignore
  const products = await user.getProducts();
  if (products.length === 0) {
    // @ts-ignore
    await user.createProduct({
      name: 'Cat',
      description: 'Lorem ipsum',
      price: 1000,
      photoUrl: await getphotoUrl('cat'),
    });
    // @ts-ignore
    await user.createProduct({
      name: 'Dog',
      description: 'Lorem ipsum',
      price: 1000,
      photoUrl: await getphotoUrl('dog'),
    });
  }
  // @ts-ignore
  (await Cart.findByPk(1)) || (await user.createCart());
  app.listen(3000);
} catch (error) {
  console.error(`\n\n\n${error}\n`);
}
