import mysql from 'mysql2';

import { SQL_PASSWORD } from '../env/env.js';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: SQL_PASSWORD,
  database: 'nodejs-shop',
} );

export default pool.promise()
