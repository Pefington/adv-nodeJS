import bodyParser from 'body-parser';
import flash from 'connect-flash';
import connectMongoSession from 'connect-mongodb-session';
import { csrfSync } from 'csrf-sync';
import express from 'express';
import session from 'express-session';
import mongoose from 'mongoose';
import multer from 'multer';

import { get404, get500 } from './controllers/static.js';
import { User } from './models/user.js';
import { router as adminRoutes } from './routes/admin.js';
import { router as authRoutes } from './routes/auth.js';
import { router as shopRoutes } from './routes/shop.js';

const { csrfSynchronisedProtection } = csrfSync({
  getTokenFromRequest: (req) => req.body.csrfToken ?? req.headers.csrftoken, // headers are lowercase
});

const app = express();

const MongoDBStore = connectMongoSession(session);
const mongoStore = new MongoDBStore({
  uri: process.env.MONGO_URL,
  collection: 'sessions',
});

const storage = multer.diskStorage({
  destination: (_, _file, cb) => {
    cb(null, 'data/photos');
  },
  filename: (_, file, cb) => {
    cb(null, `${new Date().toISOString()}-${file.originalname}`);
  },
});

const fileFilter = (_, file, cb) => {
  if (
    file.mimetype === 'image/webp' ||
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ storage, fileFilter }).single('photoFile'));

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.static('public'));
app.use(express.static('data'));
app.use(
  session({
    secret: 'dummySessionSecret',
    resave: false,
    saveUninitialized: false,
    store: mongoStore,
  })
);
app.use(async (req, _, next) => {
  try {
    // @ts-ignore
    if (req.session.user) req.user = await User.findById(req.session.user._id);
    next();
  } catch (error) {
    throw new Error(error);
  }
});

app.use(csrfSynchronisedProtection);

app.use(flash());

app.use((req, res, next) => {
  // @ts-ignore
  res.locals.isSignedIn = req.session.isSignedIn;
  res.locals.csrfToken = req.csrfToken();
  res.locals.flashMessage = req.flash('message');
  next();
});

app.use(authRoutes);
app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(get404);
app.use(get500);

try {
  await mongoose.connect(process.env.MONGO_URL);
  app.listen(3000);
} catch (error) {
  console.error(`MONGOOSE? ${error}`);
}
