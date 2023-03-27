import bodyParser from 'body-parser';
import express from 'express';

import { get404 } from './controllers/static.js';
import { mongoConnect } from './data/database.js';
import { User } from './models/user.js';
import { router as adminRoutes } from './routes/admin.js';
import { router as shopRoutes } from './routes/shop.js';

const app = express();

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

app.use(async (req, _, next) => {
  const user = await User.findById('6420293439f227dd3416337e');
  // @ts-ignore
  req.user = new User(user.name, user.email, user.cart, user._id);
  next();
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(get404);

await mongoConnect();
app.listen(3000);
