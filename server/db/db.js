require("dotenv").config();
const Sequelize = require("sequelize");

const db = new Sequelize(
  process.env.DATABASE_NAME,
  process.env.DATABASE_USERNAME,
  process.env.DATABASE_PASSWORD,
  {
    port: 5432,
    dialect: 'postgres',
    logging: false
  }
);

module.exports = db;
