/**
 * @swagger
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       required:
 *         - id
 *         - name
 *       properties:
 *         id:
 *           type: integer
 *           description: 책 고유 id
 *         name:
 *           type: string
 *           description: 책 이름
 *         url:
 *           type: string
 *           description: 책 url
 */

/**
 * @swagger
 * tags:
 *   name: Book
 *   description: 책 API 정리
 * /api/books/{id}:
 *   get:
 *     tags: [Book]
 *     summary: ID로 책 조회
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID로 책 조회
 *     responses:
 *       200:
 *         description: 책 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       404:
 *         description: 책을 찾을 수 없습니다.
 *       500:
 *         description: 서버 에러
 *
 *   put:
 *     tags: [Book]
 *     summary: ID로 책을 찾고 수정
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID로 책을 찾고 수정
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *       description: 책 수정
 *     responses:
 *       200:
 *         description: 책 수정 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       404:
 *         description: 책을 찾을 수 없습니다.
 *       500:
 *         description: 서버 에러
 *
 *   delete:
 *     tags: [Book]
 *     summary: ID로 책을 찾고 삭제
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID로 책을 찾고 삭제
 *     responses:
 *       200:
 *         description: 책 삭제 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       404:
 *         description: 책을 찾을 수 없습니다.
 *       500:
 *         description: 서버 에러
 *
 * /api/books:
 *   get:
 *     tags: [Book]
 *     summary: 책 이름으로 책 검색
 *     parameters:
 *       - in: query
 *         name: bookname
 *         schema:
 *           type: string
 *         description: 책 이름으로 책 검색
 *     responses:
 *       200:
 *         description: 책 검색 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 *       404:
 *         description: 책을 찾을 수 없습니다.
 *       500:
 *         description: 서버 에러
 *   post:
 *     tags: [Book]
 *     summary: 책 추가
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: 책 이름
 *               url:
 *                 type: string
 *                 description: 책 url
 *     responses:
 *       200:
 *         description: 책 추가 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       500:
 *         description: 책 추가 실패
 */
var express = require("express");
var router = express.Router();
const { Op } = require("sequelize");
const Book = require("../../models/book.js");

// Read (고유 id를 기준으로 책 조회)
router
	.route("/:id")
	.get((req, res) => {
		const id = req.params.id;
		Book.findOne({
			where: {
				id: id,
			},
		})
			.then((book) => {
				if (book === null) {
					return res.status(404).json({ message: "책을 찾을 수 없습니다." });
				}
				console.log(book);
				res.json({ message: "조회 성공", data: book });
			})
			.catch((err) => {
				console.error(err);
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
				console.error(err);
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
				console.error(err);
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
			.then((books) => {
				if (books.length === 0) {
					return res.status(404).json({ message: "찾으시는 책이 없습니다." });
				}
				console.log(books);
				res.json({ message: "검색 성공", data: books });
			})
			.catch((err) => {
				console.error(err);
				res.status(500).json({ message: "검색 실패", data: [] });
			});
	})
	// CREATE (책 추가)
	.post((req, res) => {
		const { name, url } = req.body;
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
				console.error(err);
				res.status(500).json({ message: "책 추가 실패", data: {} });
			});
	});

module.exports = router;
