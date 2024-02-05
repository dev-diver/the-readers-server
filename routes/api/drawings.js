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

router.get("/book/:bookId/page/:pageNum", (req, res) => {
	const { bookId, pageNum } = req.params;
	Drawing.findAll({
		where: { bookId: bookId, pageNum: pageNum },
	})
		.then((drawings) => {
			res.json(drawings);
		})
		.catch((err) => {
			console.log(err);
			res.json({ message: "검색 실패", data: [] });
		});
});

router.delete("/:id", async (req, res) => {
	Drawing.destroy({
		where: { id: req.params.id },
	})
		.then((response) => {
			console.log(response);
			res.send("Drawing deleted");
		})
		.catch((err) => {
			console.log(err);
			res.json({ message: "삭제 실패", data: [] });
		});
});

router.post("/", (req, res) => {
	console.log(req.body);
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
