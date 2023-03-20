import { DataTypes } from 'sequelize';

import { sequelize } from '../data/database.js';

export const Product = sequelize.define('product', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  photoURL: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});
