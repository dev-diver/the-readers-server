const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const fs = require("fs");
const { s3, s3Upload, BUCKET_NAME } = require("../../config/aws");

router.route("/drawings").post(upload.single("file"), async (req, res, next) => {
	const file = req.file;
	if (file) {
		console.log("File received: ", file);
		const uploadParams = {
			Bucket: BUCKET_NAME,
			Key: `drawings/${file.originalname}`,
			Body: fs.createReadStream(file.path),
		};
		console.log("uploadParams:", uploadParams);
		s3Upload(uploadParams)
			.promise()
			.then((data) => {
				res.json({ url: data.Location });
			})
			.catch((err) => {
				console.error(err);
				res.status(500).send({ error: "file upload failed" });
			});
	} else {
		res.status(400).send("No file received");
	}
});

router.get("/pdfs/:urlName", (req, res) => {
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

router.get("/pdfCss/:urlName", (req, res) => {
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

router.get("/pdfPages/:urlName/pages/:fileName", (req, res) => {
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

module.exports = router;
