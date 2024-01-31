var express = require("express");
var router = express.Router();
const { Op } = require("sequelize");
const Book = require("../../models/book.js");

router.route("/:id").get((req, res) => {
	const id = req.params.id;
	console.log(Book);
	Book.findOne({
		where: {
			id: id,
		},
	})
		.then((book) => {
			console.log(book);
			res.json({ message: "조회 성공", data: book });
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({ message: "조회 실패", data: null });
		});
});

router
	.route("/")
	.get((req, res) => {
		//bookname으로 검색
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
				res.status(500).json({ message: "검색 실패", data: [] });
			});
	})
	.post((req, res) => {
		const { name, author, publisher, image } = req.body;
		Book.create({
			name: name,
		})
			.then((book) => {
				res.json({ message: "생성 성공", data: book });
			})
			.catch((err) => {
				console.log(err);
				res.status(500).json({ message: "생성 실패", data: null });
			});
	});

module.exports = router;