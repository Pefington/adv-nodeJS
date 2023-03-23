import { DataTypes } from 'sequelize';

import { sequelize } from '../data/database.js';

export const User = sequelize.define('user', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});
