import bodyParser from 'body-parser';
import express from 'express';

import adminRoutes from './routes/admin.js';
import shopRoutes from './routes/shop.js';
import sendPage from './utils/sendPage.js';

const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use((_req, res) => {
  res.status(404);
  sendPage(res, 'views', '404.html');
});

app.listen(3000);
