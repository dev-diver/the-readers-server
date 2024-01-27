require("dotenv").config();

const developmentConfig = {
	username: "root",
	password: process.env.DEVELOPMENT_DB_PASSWORD,
	database: "theReader",
	host: process.env.DEVELOPMENT_DB_HOST,
	port: 3306,
	dialect: "mysql",
};

const testConfig = {
	username: "root",
	password: process.env.TEST_DB_PASSWORD,
	database: "jungle",
	host: process.env.TEST_DB_HOST,
	port: 3306,
	dialect: "mysql",
};

const productionConfig = {
	username: "root",
	password: process.env.PRODUCTION_DB_PASSWORD,
	database: "jungle2",
	host: process.env.PRODUCTION_DB_HOST,
	port: 3306,
	dialect: "mysql",
};

module.exports = {
	development: developmentConfig,
	test: testConfig,
	production: productionConfig,
};
