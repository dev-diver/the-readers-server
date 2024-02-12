const express = require("express");
const router = express.Router();
const multer = require("multer");
const DEST = "uploads";
const path = require("path");

const fs = require("fs");
const { s3, s3Upload, BUCKET_NAME } = require("../../config/aws");

router.get("/pdf/:urlName/css", (req, res) => {
	const { urlName } = req.params;

	const params = {
		Bucket: BUCKET_NAME,
		Key: `pdfs/${urlName}/${urlName}.css`,
	};

	s3.getObject(params, (err, data) => {
		if (err) {
			console.error("Error fetching from S3", err);
			return res.status(500).send("Failed to fetch file");
		}

		res.writeHead(200, { "Content-Type": "text/css" });
		res.write(data.Body);
		res.end();
	});
});

router.get("/pdf/:urlName/pages/:fileName", (req, res) => {
	const { urlName, fileName } = req.params;

	const params = {
		Bucket: BUCKET_NAME,
		Key: `pdfs/${urlName}/${fileName}`,
	};

	s3.getObject(params, (err, data) => {
		if (err) {
			console.error("Error fetching from S3", err);
			return res.status(500).send("Failed to fetch file");
		}

		res.writeHead(200, { "Content-Type": "text/css" });
		res.write(data.Body);
		res.end();
	});
});

router.get("/pdf/:urlName", (req, res) => {
	const { urlName } = req.params;

	const params = {
		Bucket: BUCKET_NAME,
		Key: `pdfs/${urlName}/${urlName}.html`,
	};

	s3.getObject(params, (err, data) => {
		if (err) {
			console.error("Error fetching from S3", err);
			return res.status(500).send("Failed to fetch file");
		}
		res.writeHead(200, { "Content-Type": "text/html" });
		res.write(data.Body);
		res.end();
	});
});

module.exports = router;
