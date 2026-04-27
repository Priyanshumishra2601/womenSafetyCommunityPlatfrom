require('dotenv').config();

const common = {
  dialect: 'mysql',
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || 3306),
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || ''
};

module.exports = {
  development: {
    ...common,
    database: process.env.DB_NAME || 'women_safety'
  },
  test: {
    ...common,
    database: process.env.DB_NAME_TEST || process.env.DB_NAME || 'women_safety'
  },
  production: {
    ...common,
    database: process.env.DB_NAME || 'women_safety'
  }
};

