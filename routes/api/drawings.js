/**
 * @swagger
 * components:
 *   schemas:
 *     Drawing:
 *       type: object
 *       required:
 *         - id
 *         - bookId
 *         - pageNum
 *         - imageUrl
 *       properties:
 *         id:
 *           type: integer
 *           description: 그리기 고유 id
 *         bookId:
 *           type: integer
 *           description: 책 고유 id
 *         pageNum:
 *           type: integer
 *           description: 페이지 번호
 *         imageUrl:
 *            type: string
 *            description: 이미지 url
 */

var express = require("express");
var router = express.Router();
const { Op } = require("sequelize");
const Drawing = require("../../models/drawing");
const User = require("../../models/user");

const multer = require("multer");
const DEST = "uploads";
const path = require("path");
const fs = require("fs");

const { s3, s3Upload, BUCKET_NAME } = require("../../config/aws");

const drawUpload = multer({ dest: path.join(DEST, "drawings") });
router.route("/drawings").post(drawUpload.single("file"), async (req, res) => {});

router
	.route("/book/:bookId/page/:pageNum/user/:userId")
	.get((req, res) => {
		const { bookId, pageNum, userId } = req.params;
		const urlName = `${bookId}_${pageNum}_${userId}`;
		const fileExtension = "png";
		const contentType = `image/${fileExtension}`;
		Drawing.findAll({
			where: { bookId: bookId, pageNum: pageNum, urlName: urlName },
		})
			.then((drawings) => {
				if (drawings.length <= 0) {
					return res.status(500).json({ message: "Drawing not found", data: null });
				}
				const Key = `drawings/${urlName}.${fileExtension}`;
				const params = {
					Bucket: BUCKET_NAME,
					Key: Key,
				};
				s3.getObject(params, (err, data) => {
					if (err) {
						console.error("Error fetching from S3", err);
						return res.status(500).send("Failed to fetch file");
					}
					res.writeHead(200, { "Content-Type": contentType });
					res.write(data.Body);
					res.end();
				});
			})
			.catch((err) => {
				console.error(err);
				res.json({ message: "검색 실패", data: [] });
			});
	})
	.post(drawUpload.single("file"), (req, res) => {
		console.log("upload start");
		const { bookId, pageNum, userId } = req.params;
		const file = req.file;
		const fileExtension = ".png"; //path.extname(file.originalname);
		const urlName = `${bookId}_${pageNum}_${userId}`;
		if (file) {
			// console.log("File received: ", file);
			const uploadParams = {
				Bucket: BUCKET_NAME,
				Key: `drawings/${urlName}${fileExtension}`,
				Body: fs.createReadStream(file.path),
			};
			// console.log("uploadParams:", uploadParams);
			s3Upload(uploadParams)
				.then((data) => {
					console.log("s3 업로드 성공", data.Location);
					return Drawing.findAll({
						where: { bookId: bookId, pageNum: pageNum, urlName: urlName },
					}).then((drawings) => {
						if (drawings.length > 0) {
							return res.json({ message: "Drawing update success", data: null });
						}
						return Drawing.create({ bookId: bookId, pageNum: pageNum, urlName: urlName }).then((response) => {
							return User.findByPk(userId).then((user) => {
								return user.addDrawing(drawings[0]).then((response) => {
									return res.json({ message: "Drawing saved", data: response });
								});
							});
						});
					});
				})
				.catch((err) => {
					console.error(err);
					res.status(500).send({ error: "file upload failed" });
				});
		} else {
			res.status(400).send("No file received");
		}
	});

router.delete("/:id", async (req, res) => {
	Drawing.destroy({
		where: { id: req.params.id },
	})
		.then((response) => {
			res.send("Drawing deleted");
		})
		.catch((err) => {
			console.error(err);
			res.json({ message: "삭제 실패", data: [] });
		});
});

router.post("/", (req, res) => {
	Drawing.create(req.body)
		.then((response) => {
			res.json({ message: "Drawing saved", data: response });
		})
		.catch((err) => {
			console.err(err);
			res.status(500).json({ message: "업로드 실패", data: [] });
		});
});

module.exports = router;
