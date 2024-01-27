var express = require("express");
var router = express.Router();
const Book = require("../models/book");
const { Op } = require("sequelize");

router.get("/search", function (req, res) {
	const bookname = req.query.bookname;

	Book.findAll({
		where: {
			name: {
				[Op.like]: `%${bookname}%`,
			},
		},
	})
		.then((books) => {
			console.log(books);
			res.json({ message: "검색 성공", data: books });
		})
		.catch((err) => {
			console.log(err);
			res.json({ message: "검색 실패", data: [] });
		});
});

module.exports = router;
