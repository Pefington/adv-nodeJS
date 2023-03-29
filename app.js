import bodyParser from 'body-parser';
import express from 'express';
import mongoose from 'mongoose';

import { get404 } from './controllers/static.js';
import { MONGO_URL } from './env/env.js';
import User from './models/user.js';
import { router as adminRoutes } from './routes/admin.js';
import { router as shopRoutes } from './routes/shop.js';
import { logError } from './utils/logError.js';

const app = express();

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

app.use(async (req, _, next) => {
  try {
    // @ts-ignore
    req.user = await User.findOne();
  } catch (error) {
    logError(error);
  } finally {
    next();
  }
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(get404);

try {
  await mongoose.connect(MONGO_URL);
  // const user = new User({
  //   name: 'Jean-Micheng',
  //   email: 'jm@test.com',
  //   cart: {
  //     items: [],
  //   },
  // });
  // await user.save();
  app.listen(3000);
} catch (error) {
  logError(error);
}
