/**
 * @swagger
 * components:
 *   schemas:
 *     Chart:
 *       type: object
 *       required:
 *         - id
 *         - UserId
 *         - BookId
 *         - page
 *         - time
 *       properties:
 *         id:
 *           type: integer
 *           description: 링크 고유 id
 *         UserId:
 *          type: integer
 *          description: 사용자 id
 *         BookId:
 *          type: integer
 *          description: 책 id
 *         page:
 *          type: integer
 *          description: 페이지 번호
 *         time:
 *          type: integer
 *          description: 페이지 별 읽은 시간
 */

/**
 * @swagger
 * tags:
 *   name: Chart
 *   description: 사용자가 읽은 페이지별 시간을 저장하는 API 정리
 * /api/chart:
 *   post:
 *     tags: [Chart]
 *     summary: 사용자가 읽은 페이지별 시간을 저장
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Chart'
 *     responses:
 *       201:
 *         description: 사용자가 읽은 페이지별 시간 저장 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Chart'
 *       400:
 *         description: 필수 필드가 누락되었습니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: 필수 필드가 누락되었습니다.
 *       500:
 *         description: 서버 에러
 */

const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const Chart = require("../../models/chart"); // Chart 모델 가져오기

// 차트 생성 API
router
	.route("/")
	// Create (차트 페이지 별 시간 저장)
	.post(async (req, res) => {
		const { UserId, BookId, page, time } = req.body;
		// 필수 필드 검증
		if (!UserId || !BookId || !page || !time) {
			res.status(400).json({ message: "필수 필드가 누락되었습니다." });
			return;
		}
		try {
			const chart = await Chart.create({
				UserId,
				BookId,
				page,
				time,
			});

			res.status(201).json({ message: "차트 연결 성공", data: chart });
		} catch (error) {
			console.log(error);
			res.status(500).json({ message: "Chart 생성 실패", error: error.message });
		}
	})
	// Read (차트 조회)
	.get(async (req, res) => {
		const charts = await Chart.findAll();
		try {
			res.json({ message: "차트 있음", data: charts });
		} catch (error) {
			console.log(error);
			res.status(500).json({ message: "차트 없음", data: [] });
		}
	})
	// Update (차트 수정)
	.put(async (req, res) => {
		const { id, UserId, BookId, page, time } = req.body;
		const chart = await Chart.findByPk(id);
		try {
			if (chart) {
				chart.UserId = UserId;
				chart.BookId = BookId;
				chart.page = page;
				chart.time = time;
				await chart.save();
				res.json({ message: "차트 수정 성공", data: chart });
			} else {
				res.json({ message: "없는 차트입니다.", data: [] });
			}
		} catch (error) {
			console.log(error);
			res.status(500).json({ message: "차트 수정 실패", data: [] });
		}
	})
	// Delete (차트 삭제)
	.delete(async (req, res) => {
		const id = req.body.id;
		const chart = await Chart.findByPk(id);
		try {
			if (chart) {
				await chart.destroy();
				res.json({ message: "차트 삭제 성공", data: chart });
			} else {
				res.json({ message: "없는 차트입니다.", data: [] });
			}
		} catch (error) {
			console.log(error);
			res.status(500).json({ message: "차트 삭제 실패", data: [] });
		}
	});

// router.get("/:bookId/:userId", async (req, res) => {
// 	const { bookId, userId } = req.params;
// 	try {
//     // Chart 찾기 또는 생성
//     let chart = await Chart.findOne({
//       where: {
//         UserId: userId,
//         BookId: bookId
//       }
//     });

//     if (!chart) {
//       // 책 정보 불러오기
//       const book = await Book.findByPk(bookId);
//       if (!book) {
//         return res.status(404).json({ message: "Book not found." });
//       }

//       // Chart가 없으면 새로 생성
//       chart = await Chart.create({
//         UserId: userId,
//         BookId: bookId,
//         totalPages: book.totalPages // 책의 총 페이지 수를 사용, 적절히 조정 필요
//       });

//       // Page 초기화
//       await initializePagesForChart(chart.id, book.totalPages);

//       return res.status(201).json({ message: "Chart created and pages initialized." });
//     } else {
//       // 기존 Chart에 대한 Page 정보 불러오기
//       const pages = await Page.findAll({
//         where: { ChartId: chart.id },
//         attributes: ['pageNum', 'readTime'],
//         order: [['pageNum', 'ASC']]
//       });

//       return res.status(200).json(pages);
//     }
//   } catch (error) {
//     console.error('Error handling chart:', error);
//     return res.status(500).json({ message: "Internal server error." });
//   }
// });

module.exports = router;
