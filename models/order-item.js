import { DataTypes } from 'sequelize';

import { sequelize } from '../data/database.js';

export const OrderItem = sequelize.define('orderItem', {
  quantity: DataTypes.INTEGER,
});
