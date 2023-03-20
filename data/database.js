import { Sequelize } from 'sequelize';

import { SQL_PASSWORD } from '../env/env.js';

export const sequelize = new Sequelize('nodeshop', 'root', SQL_PASSWORD, {
  dialect: 'mysql',
  host: 'localhost',
});
