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
const Page = require("../../models/page"); // Page 모델 가져오기

router.get("/book/:bookId/user/:userId", async (req, res) => {
	const { bookId, userId } = req.params;
	const initializePagesForChart = async (chartId, totalPages) => {
		const pages = Array.from({ length: totalPages }, (_, i) => {
			return { ChartId: chartId, pageNumber: i + 1, readTime: 0 };
		});
		try {
			// bulkCreate를 사용하여 모든 페이지 인스턴스를 한 번에 삽입
			await Page.bulkCreate(pages);
			console.log(`All ${totalPages} pages initialized for chart ID ${chartId}.`);
		} catch (error) {
			console.error("Failed to initialize pages:", error);
			throw error; // 오류를 다시 던져서 상위 호출자가 처리할 수 있도록 함
		}
	};

	try {
		// Chart 찾기
		let chart = await Chart.findOne({
			where: {
				UserId: userId,
				BookId: bookId,
			},
		});

		if (chart) {
			// 페이지 찾기
			const pages = await Page.findAll({
				where: { ChartId: chart.id },
				attributes: ["pageNumber", "readTime"],
				order: [["pageNumber", "ASC"]],
			});
			return res.status(200).json({ chartId: chart.id, pages });
		} else {
			// Chart가 없으면 새로 생성
			chart = await Chart.create({
				UserId: userId,
				BookId: bookId,
				// totalPages: book.totalPages, // 책의 총 페이지 수를 사용, 적절히 조정 필요
				totalPages: 20, // 임시
			});
			// page 초기화
			await initializePagesForChart(chart.id, 20); // 20 임시. book.totalPages
			// 페이지 정보 반환
			const pages = await Page.findAll({
				where: { ChartId: chart.id },
				attributes: ["pageNumber", "readTime"],
				order: [["pageNumber", "ASC"]],
			});

			return res.status(201).json({ chartId: chart.id, pages, message: "Chart created and pages initialized." });
		}
	} catch (error) {
		console.error("Error handling chart:", error);
		return res.status(500).json({ message: "Internal server error." });
	}
});

router.put("/:chartId", async (req, res) => {
	const { chartId } = req.params;
	const { currentPage, time } = req.body;

	console.log("chartId:", chartId);
	console.log("currentPage:", currentPage);
	console.log("time:", time);
	if (!time) {
		return res.status(400).json({ message: "Time is required." });
	}

	try {
		// 페이지 찾기
		const page = await Page.findOne({
			where: {
				ChartId: chartId,
				pageNumber: currentPage,
			},
		});

		if (page) {
			// 페이지 업데이트
			page.readTime = time;
			await page.save();
			return res.status(200).json({ message: "Page updated.", data: page });
		} else {
			return res.status(404).json({ message: "Page not found." });
		}
	} catch (error) {
		console.error("Error updating page:", error);
		return res.status(500).json({ message: "Internal server error." });
	}
});

module.exports = router;
