import bodyParser from 'body-parser';
import express from 'express';

import { get404 } from './controllers/static.js';
import { sequelize } from './data/database.js';
import { router as adminRoutes } from './routes/admin.js';
import { router as shopRoutes } from './routes/shop.js';

const app = express();

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(get404);

try {
  await sequelize.sync();
  console.log('Sequelize started...');
  app.listen(3000);
  console.log('Dev server started...');
} catch (error) {
  console.error(error);
}
