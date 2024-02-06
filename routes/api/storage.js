const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const fs = require("fs");
const { s3Upload, BUCKET_NAME } = require("../../config/aws");

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

router.route("/").post(upload.single("file"), async (req, res, next) => {
	const file = req.file;
	console.log(file.originalname, file.path);
	const uploadParams = {
		Bucket: BUCKET_NAME,
		Key: `pdfs/${file.originalname}`,
		Body: fs.createReadStream(file.path),
	};

	s3Upload(uploadParams)
		.promise()
		.then((data) => {
			res.json({ url: data.Location });
		})
		.catch((err) => {
			console.error(err);
			res.status(500).send({ error: "file upload failed" });
		});
	// 시퀼라이저에 넣는 로직 구현 (방에 들어가서 필요)
});

module.exports = router;
