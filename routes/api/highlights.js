/**
 * @swagger
 * components:
 *   schemas:
 *     Highlight:
 *       type: object
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: integer
 *           description: 하이라이트 고유 id
 *         num:
 *           type: integer
 *           description: 하이라이트 번호
 *         bookId:
 *           type: integer
 *           description: 책 고유 id
 *         pageNum:
 *           type: integer
 *           description: 페이지 번호
 *         text:
 *           type: string
 *           description: 하이라이트 텍스트
 *         startContainer:
 *           type: integer
 *           description: 시작점
 *         endContainer:
 *           type: integer
 *           description: 종료점
 *         startOffset:
 *           type: integer
 *           description: 시작점 오프셋
 *         endOffset:
 *           type: integer
 *           description: 종료점 오프셋
 *         outerlink:
 *           type: string
 *           description: 외부 링크
 */

var express = require("express");
var router = express.Router();
const { Op } = require("sequelize");
const Book = require("../../models/book");
const User = require("../../models/user");
const Highlight = require("../../models/highlight");
const book = require("../../models/book");

// READ (전체 highlight 조회_우선 bookId로 조회)
router.route("/book/:bookId").get(async (req, res) => {
	const bookId = req.params.bookId;
	try {
		console.log("통신", bookId);
		const highlight = await Highlight.findAll({
			where: {
				bookId: { [Op.like]: `%${bookId}%` },
			},
		});
		res.json({ message: "Highlight 조회 성공", data: highlight });
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Highlight 조회 실패", data: [] });
	}
});

router.get("/user/:userId/book/:bookId/page/:pageNum", (req, res) => {
	const { userId, bookId, pageNum } = req.params;
	Highlight.findAll({
		include: [
			{
				model: User,
				where: { id: userId },
				through: { attributes: [] }, // 연결 테이블의 속성을 제외하고자 할 때
			},
		],
		where: { bookId: bookId },
	})
		.then((highlights) => {
			console.log(highlights);
			res.json(highlights);
		})
		.catch((err) => {
			console.error(err);
			res.status(500).json({ message: "검색 실패", data: [] });
		});
});

router.route("/user/:userId").post((req, res) => {
	const userId = req.params.userId;
	// const highlights = ({ bookId, pageNum, text, startContainer, startOffset, endContainer, endOffset } = req.body);
	const highlights = req.body;
	Highlight.create(highlights)
		.then((highlight) => {
			return User.findByPk(userId).then((user) => {
				return highlight.addUser(user);
			});
		})
		.then((result) => {
			res.json({ message: "하이라이트 성공", data: result });
		})
		.catch((err) => {
			console.error(err);
			res.status(500).json({ message: "하이라이트 쓰기 실패", data: [] });
		});
});

// 메모 삽입 api
router.route("/user/:userId/memo").post((req, res) => {
	// const userId = req.params.userId;
	const { highlightId, memo } = req.body;
	Highlight.findByPk(highlightId)
		.then((highlight) => {
			console.log("highlight", req.body);
			highlight.memo = memo;
			return highlight.save();
		})
		.then((result) => {
			res.json({ message: "메모 삽입 성공", data: result });
		})
		.catch((err) => {
			console.error(err);
			res.status(500).json({ message: "메모 삽입 실패", data: null });
		});
});

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
			console.error(err);
			res.json({ message: "검색 실패", data: [] });
		});
});

router
	//Read (고유 id를 기준으로 highlight 조회)
	.route("/:id")
	.get(async (req, res) => {
		await Highlight.findOne({
			where: { id: req.params.id },
		})
			.then((highlight) => {
				if (!highlight) {
					return res.status(404).json({ message: "Highlight를 찾을 수 없습니다.", data: {} });
				}
				res.json({ message: "Highlight 조회 성공", data: highlight });
			})
			.catch((err) => {
				console.error(err);
				res.status(500).json({ message: "Highlight 조회 실패", data: [] });
			});
	})
	// Update (고유 id를 기준으로 highlight 수정)
	.put(async (req, res) => {
		try {
			const highlight = await Highlight.findOne({ where: { id: req.params.id } });
			if (!highlight) {
				return res.status(404).json({ message: "Highlight를 찾을 수 없습니다.", data: {} });
			}

			const updatedHighlight = await highlight.update(req.body);
			res.json({ message: "Highlight 수정 성공", data: updatedHighlight });
		} catch (err) {
			console.error(err);
			res.status(500).json({ message: "Highlight 수정 실패", data: {} });
		}
	})
	// Delete (고유 id를 기준으로 highlight 삭제)
	.delete(async (req, res) => {
		Highlight.destroy({
			where: { id: req.params.id },
		})
			.then((response) => {
				res.send("Highlight deleted");
			})
			.catch((err) => {
				console.error(err);
				res.json({ message: "삭제 실패", data: [] });
			});
	});

// Create (highlight 생성)
router.route("/").post((req, res) => {
	// console.log(req.body);
	// const { num, bookId, pageNum, text, startContainer, endContainer, startOffset, endOffset } = req.body;
	// Highlight.create({
	// 	num: num,
	// 	bookId: bookId,
	// 	pageNum: pageNum,
	// 	text: text,
	// 	startContainer: startContainer,
	// 	endContainer: endContainer,
	// 	startOffset: startOffset,
	// 	endOffset: endOffset,
	// })
	Highlight.create(req.body)
		.then((highlight) => {
			res.json({ message: "하이라이트 저장", data: highlight });
		})
		.catch((err) => {
			console.error(err);
			res.status(500).json({ message: "업로드 실패", data: [] });
		});
});

// READ (전체 highlight 조회_우선 num으로 조회)
// router.route("/").get(async (req, res) => {
// 	const num = req.query.num;
// 	try {
// 		const highlight = await Highlight.findAll({
// 			where: {
// 				num: { [Op.like]: `%${num}%` },
// 			},
// 		});
// 		res.json({ message: "Highlight 조회 성공", data: highlight });
// 	} catch (err) {
// 		console.error(err);
// 		res.status(500).json({ message: "Highlight 조회 실패", data: [] });
// 	}
// });

module.exports = router;
