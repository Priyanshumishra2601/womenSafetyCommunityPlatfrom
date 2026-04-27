const dotenv = require('dotenv');
const { Sequelize } = require('sequelize');

dotenv.config();

// Centralized Sequelize connection so both migrations and runtime can reuse it.
const sequelize = new Sequelize(
  process.env.DB_NAME || 'women_safety',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT || 3306),
    dialect: 'mysql',
    logging: false
  }
);

async function connectDb() {
  try {
    await sequelize.authenticate();
    // eslint-disable-next-line no-console
    console.log('MySQL connected successfully.');
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('MySQL connection failed:', err);
    process.exit(1);
  }
}

module.exports = { sequelize, connectDb };

