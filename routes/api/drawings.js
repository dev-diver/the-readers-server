var express = require("express");
var router = express.Router();
const { Op } = require("sequelize");
const Drawing = require("../../models/drawing");

router.get("/book/:bookId/page/:pageNum", (req, res) => {
	const { bookId, pageNum } = req.params;
	Drawing.findAll({
		where: { bookId: bookId, roomId: roomId, pageNum: pageNum },
	})
		.then((drawings) => {
			res.json(drawings);
		})
		.catch((err) => {
			console.error(err);
			res.json({ message: "검색 실패", data: [] });
		});
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
