require("dotenv").config();

const developmentConfig = {
	username: process.env.DEVELOPMENT_DB_USERNAME,
	password: process.env.DEVELOPMENT_DB_PASSWORD,
	database: process.env.DEVELOPMENT_DB_DBNAME,
	host: process.env.DEVELOPMENT_DB_HOST,
	port: 3306,
	dialect: "mysql",
};

const testConfig = {
	username: process.env.TEST_DB_USERNAME,
	password: process.env.TEST_DB_PASSWORD,
	database: process.env.TEST_DB_DBNAME,
	host: process.env.TEST_DB_HOST,
	port: 3306,
	dialect: "mysql",
};

const productionConfig = {
	username: process.env.PRODUCTION_DB_USERNAME,
	password: process.env.PRODUCTION_DB_PASSWORD,
	database: process.env.PRODUCTION_DB_DBNAME,
	host: process.env.PRODUCTION_DB_HOST,
	port: 3306,
	dialect: "mysql",
};

module.exports = {
	development: developmentConfig,
	test: testConfig,
	production: productionConfig,
};
