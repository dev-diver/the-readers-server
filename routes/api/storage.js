const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const fs = require("fs");
const s3 = require("../../config/aws");
const BUCKET_NAME = require("../../config/aws");

router.route("/").post(upload.single("file"), async (req, res, next) => {
	const file = req.file;
	console.log(file.originalname, file.path);
	const uploadParams = {
		Bucket: BUCKET_NAME,
		Key: `pdfs/${file.originalname}`,
		Body: fs.createReadStream(file.path),
	};

	const s3Upload = s3.ManagedUpload({ params: uploadParams });
	s3Upload
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
