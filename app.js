import bodyParser from 'body-parser';
import express from 'express';

import { adminRoutes } from './routes/admin.js';
import shopRoutes from './routes/shop.js';

const app = express();

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use((_req, res) => {
  res.status(404).render('404', { pageTitle: '404 - Not Found :(' });
});

app.listen(3000);
