const AWS = require("aws-sdk");

const REGION = process.env.S3_REGION;
const ACCESS_KEY_ID = process.env.S3_ACCESS_KEY_ID;
const SECRET_ACCESS_KEY_ID = process.env.S3_SECRET_ACCESS_KEY_ID;
exports.BUCKET_NAME = process.env.S3_BUCKET_NAME;

AWS.config.update({
	region: REGION,
	accessKeyId: ACCESS_KEY_ID,
	secretAccessKey: SECRET_ACCESS_KEY_ID,
});

exports.s3 = new AWS.S3();
