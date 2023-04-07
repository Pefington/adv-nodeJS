// @ts-nocheck
import bodyParser from 'body-parser';
import connectMongoSession from 'connect-mongodb-session';
import cookieParser from 'cookie-parser';
import { doubleCsrf } from 'csrf-csrf';
import express from 'express';
import session from 'express-session';
import mongoose from 'mongoose';

import { get404 } from './controllers/static.js';
import { MONGO_URL } from './env/env.js';
import { User } from './models/user.js';
import { router as adminRoutes } from './routes/admin.js';
import { router as authRoutes } from './routes/auth.js';
import { router as shopRoutes } from './routes/shop.js';
import { logError } from './utils/logError.js';

const { doubleCsrfProtection } = doubleCsrf({
  getSecret: () => 'dummyCSRFHashSecret',
  getTokenFromRequest: (req) => req.body.csrfToken,
});

const app = express();

const MongoDBStore = connectMongoSession(session);
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
    secret: 'dummySessionSecret',
    resave: false,
    saveUninitialized: false,
    store: mongoStore,
  })
);
app.use(async (req, _, next) => {
  if (req.session.user) req.user = await User.findById(req.session.user._id);
  next();
});

app.use(cookieParser());
app.use(doubleCsrfProtection);

app.use((req, res, next) => {
  res.locals.isSignedIn = req.session.isSignedIn;
  res.locals.csrfToken = req.csrfToken(true);
  next();
});

app.use(authRoutes);
app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(get404);

try {
  await mongoose.connect(MONGO_URL);
  app.listen(3000);
} catch (error) {
  logError(error);
}
