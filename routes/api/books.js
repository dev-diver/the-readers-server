var express = require("express");
var router = express.Router();
const { Op } = require("sequelize");
const Book = require("../../models/book.js");

<<<<<<< HEAD
// Read (고유 id를 기준으로 책 조회)
router
	.route("/:id")
	.get((req, res) => {
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
	})
	// UPDATE (책 수정)
	.put((req, res) => {
		const { url } = req.body;
		Book.findByPk(req.params.id)
			.then((book) => {
				if (book) {
					return book.update({
						url: url,
					});
				} else {
					res.status(404).json({ message: "책을 찾을 수 없습니다." });
				}
			})
			.then((updateBook) => {
				res.json({ message: "책 수정 성공", data: updateBook });
			})
			.catch((err) => {
				console.log(err);
				res.status(500).json({ message: "책 수정 실패", data: null });
			});
	})
	// DELETE (책 삭제)
	.delete((req, res) => {
		Book.findByPk(req.params.id)
			.then((book) => {
				if (book) {
					return book.destroy();
				} else {
					res.status(404).json({ message: "책을 찾을 수 없습니다." });
				}
			})
			.then(() => {
				res.json({ message: "책 삭제 성공", data: {} });
			})
			.catch((err) => {
				console.log(err);
				res.status(500).json({ message: "책 삭제 실패", data: null });
			});
	});

router
	// READ (책 검색)
	.route("/")
	.get((req, res) => {
		const bookname = req.query.bookname;

		Book.findAll({
			where: {
				name: {
					[Op.like]: `%${bookname}%`,
				},
			},
		})
=======
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
>>>>>>> upstream/dev
			.then((books) => {
				console.log(books);
				res.json({ message: "검색 성공", data: books });
			})
			.catch((err) => {
				console.log(err);
				res.status(500).json({ message: "검색 실패", data: [] });
			});
	})
<<<<<<< HEAD
	// CREATE (책 추가)
	.post((req, res) => {
		const { name, url } = req.body;
		console.log(name, url);
		// 데이터 검증
		if (!name || !url) {
			return res.json({ message: "모든 정보를 입력해주세요.", data: {} });
		}
		// BOOK 모델을 사용하여 데이터베이스에 새로운 책 생성
		Book.create({ name, url })
			.then((book) => {
				res.json({ message: "책 추가 성공", data: book });
			})
			.catch((err) => {
				console.log(err);
				res.status(500).json({ message: "책 추가 실패", data: {} });
=======
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
>>>>>>> upstream/dev
			});
	});

module.exports = router;
