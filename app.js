import bodyParser from 'body-parser';
import express from 'express';

import { get404 } from './controllers/static.js';
import { router as adminRoutes } from './routes/admin.js';
import { router as shopRoutes } from './routes/shop.js';
import db from './utils/database.js';

const app = express();

db.execute('SELECT * from products')
  .then((res) => console.log(res))
  .catch((err) => console.error(err));

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(get404);

app.listen(3000);
