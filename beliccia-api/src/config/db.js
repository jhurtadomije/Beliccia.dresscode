// src/config/db.js  (o como lo tengas)
import mysql from 'mysql2/promise';
import { config } from './env.js';

let pool = null;

export const getPool = () => {
  if (!pool) {
    pool = mysql.createPool({
      host: config.db.host,
      port: config.db.port,
      user: config.db.user,
      password: config.db.password,
      database: config.db.database,
      connectionLimit: 10,
      timezone: 'Z',
    });
    console.log('✅ Pool MySQL creado');
  }
  return pool;
};
