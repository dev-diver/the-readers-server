var express = require("express");
var router = express.Router();
const { Op } = require("sequelize");
const Book = require("../../models/book");
const Highlight = require("../../models/highlight");

router.get("/book/:bookId/page/:pageNum", (req, res) => {
	const bookId = req.params.bookId;
	const pageNum = req.params.pageNum;
	Highlight.findAll({
		where: { bookId: bookId, pageNum: pageNum },
	})
		.then((highlights) => {
			res.json(highlights);
		})
		.catch((err) => {
			console.log(err);
			res.json({ message: "검색 실패", data: [] });
		});
});

router.delete("/:id", async (req, res) => {
	Highlight.destroy({
		where: { id: req.params.id },
	})
		.then((response) => {
			console.log(response);
			res.send("Highlight deleted");
		})
		.catch((err) => {
			console.log(err);
			res.json({ message: "삭제 실패", data: [] });
		});
});

router.post("/", (req, res) => {
	console.log(req.body);
	Highlight.create(req.body)
		.then((response) => {
			console.log(response);
			res.send("Highlight saved");
		})
		.catch((err) => {
			console.err(err);
			res.status(500).json({ message: "업로드 실패", data: [] });
		});
});

module.exports = router;
