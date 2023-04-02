import bodyParser from 'body-parser';
import connectMongoSession from 'connect-mongodb-session';
import express from 'express';
import session from 'express-session';
import mongoose from 'mongoose';

import { get404 } from './controllers/static.js';
import { MONGO_URL } from './env/env.js';
import { router as adminRoutes } from './routes/admin.js';
import { router as authRoutes } from './routes/auth.js';
import { router as shopRoutes } from './routes/shop.js';
import { logError } from './utils/logError.js';
import { User } from './models/user.js';

const MongoDBStore = connectMongoSession(session);

const app = express();
const mongoStore = new MongoDBStore({
  uri: MONGO_URL,
  collection: 'sessions',
});

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(
  session({
    secret: 'dummySecret',
    resave: false,
    saveUninitialized: false,
    store: mongoStore,
  })
);

app.use( async ( req, _, next ) => {
  // @ts-ignore
  req.session.user || next();
  // @ts-ignore
  req.user = await User.findById(req.session.user._id);
  next();
});

app.use(authRoutes);
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
