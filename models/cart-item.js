import { DataTypes } from 'sequelize';

import { sequelize } from '../data/database.js';

export const CartItem = sequelize.define('cartItem', {
  quantity: DataTypes.INTEGER,
});
