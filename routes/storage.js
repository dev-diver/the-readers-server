const express = require("express");
const router = express.Router();
const AWS = require("aws-sdk");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const fs = require("fs");

const REGION = process.env.S3_REGION;
const ACCESS_KEY_ID = process.env.S3_ACCESS_KEY_ID;
const SECRET_ACCESS_KEY_ID = process.env.S3_SECRET_ACCESS_KEY_ID;
const BUCKET_NAME = process.env.S3_BUCKET_NAME;

AWS.config.update({
	region: REGION,
	accessKeyId: ACCESS_KEY_ID,
	secretAccessKey: SECRET_ACCESS_KEY_ID,
});

router.route("/").post(upload.single("file"), async (req, res, next) => {
	const file = req.file;
	console.log(file.originalname, file.path);
	const uploadParams = {
		Bucket: BUCKET_NAME,
		Key: `pdfs/${file.originalname}`,
		Body: fs.createReadStream(file.path),
	};

	const uploads3 = new AWS.S3.ManagedUpload({ params: uploadParams });
	uploads3
		.promise()
		.then((data) => {
			console.log(data);
			res.json({ url: data.Location });
		})
		.catch((err) => {
			console.error(err);
			res.status(500).send({ error: "file upload failed" });
		});
});

module.exports = router;
