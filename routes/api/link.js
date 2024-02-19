/**
 * @swagger
 * components:
 *   schemas:
 *     Link:
 *       type: object
 *       required:
 *         - id
 *         - fromHighlightId
 *         - toHighlightId
 *       properties:
 *         id:
 *           type: integer
 *           description: 링크 고유 id
 *         note:
 *           type: string
 *           description: >
 *             링크 간의 관계를 정의 (예: 정의, 반대 개념, 유사 개념 등)
 *         fromHighlightId:
 *           type: integer
 *           description: 하이라이트를 연결하는 출발점 ID
 *         toHighlightId:
 *           type: integer
 *           description: 하이라이트를 연결하는 도착점 ID
 */

/**
 * @swagger
 * tags:
 *   name: Link
 *   description: 하이라이트 간에 연결하는 링크 API 정리
 * /api/link:
 *   post:
 *     tags: [Link]
 *     summary: 하이라이트끼리 링크로 연결
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Link'
 *     responses:
 *       201:
 *         description: 하이라이트 연결 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Link'
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
const Link = require("../../models/link"); // Link 모델 가져오기
const Highlight = require("../../models/highlight"); // Highlight 모델 가져오기
const User = require("../../models/user"); // User 모델 가져오기

// Link 생성 API
router
	.route("/")
	// Create (하이라이트끼리 링크로 연결)
	.post(async (req, res) => {
		// console.log("받은 것", req.body);
		// const { fromHighlightId, toHighlightId, note } = req.body;
		// // 필수 필드 검증
		// if (!fromHighlightId || !toHighlightId) {
		// 	return res.status(400).json({ message: "필수 필드가 누락되었습니다." });
		// }
		// try {
		// 	const link = await Link.create({
		// 		fromHighlightId,
		// 		toHighlightId,
		// 		note,
		// 	});
		// 	res.status(201).json({ message: "하이라이트 연결 성공", data: link });
		// } catch (error) {
		// 	console.log(error);
		// 	res.status(500).json({ message: "Link 생성 실패", error: error.message });
		// }
		const { userId, fromHighlightId, toHighlightId, note } = req.body;
		// 필수 필드 검증
		if (!fromHighlightId || !toHighlightId || !userId) {
			return res.status(400).json({ message: "필수 필드가 누락되었습니다." });
		}

		try {
			// 원본 하이라이트 정보 조회
			// const originalHighlight = await Highlight.findByPk(toHighlightId);
			const originalHighlight = await Highlight.findByPk(toHighlightId, {
				include: [
					{
						model: User, // User 모델을 include (User 모델과의 연결을 확인하는 설정 필요)
					},
				],
			});
			if (!originalHighlight) {
				return res.status(404).json({ message: "원본 하이라이트를 찾을 수 없습니다." });
			}

			// 원본 하이라이트의 소유자 확인 (여러 소유자가 있을 수 있으므로 적절한 로직 적용 필요)
			const isOwner = originalHighlight.Users.some((user) => user.id === userId);

			let targetHighlightId = toHighlightId;
			let highlightToConnect = originalHighlight;

			if (!isOwner) {
				// 원본 하이라이트의 정보를 복사하여 새 하이라이트 생성
				const highlightCopy = await Highlight.create({
					bookId: originalHighlight.bookId,
					pageNum: originalHighlight.pageNum,
					text: originalHighlight.text,
					startContainer: originalHighlight.startContainer,
					endContainer: originalHighlight.endContainer,
					startOffset: originalHighlight.startOffset,
					endOffset: originalHighlight.endOffset,
					memo: originalHighlight.memo,
					// 기타 필요한 필드가 있다면 여기에 추가
				});
				targetHighlightId = highlightCopy.id;
				highlightToConnect = highlightCopy;
			}

			console.log("원본 유저 아이디", originalHighlight, "유저 아이디", userId);
			// // 사용자 ID가 원본 하이라이트의 사용자와 다를 경우 복사본 생성
			// if (originalHighlight.userId !== userId) {
			// 	// 원본 하이라이트의 정보를 복사하여 새 하이라이트 생성
			// 	const highlightCopy = await Highlight.create({
			// 		bookId: originalHighlight.bookId,
			// 		pageNum: originalHighlight.pageNum,
			// 		text: originalHighlight.text,
			// 		startContainer: originalHighlight.startContainer,
			// 		endContainer: originalHighlight.endContainer,
			// 		startOffset: originalHighlight.startOffset,
			// 		endOffset: originalHighlight.endOffset,
			// 		memo: originalHighlight.memo,
			// 		// 기타 필요한 필드가 있다면 여기에 추가
			// 	});

			// 	// 복사본 하이라이트의 ID를 타겟 ID로 설정
			// 	targetHighlightId = highlightCopy.id;
			// 	highlightToConnect = highlightCopy;
			// }

			// 새로운 링크 생성
			const newLink = await Link.create({
				fromHighlightId,
				toHighlightId: targetHighlightId,
				note,
			});

			// 사용자와 복사된 하이라이트 연결 (User_Highlight 테이블에 연결)
			await highlightToConnect.addUser(userId);

			res.status(201).json({ message: "하이라이트 연결 성공", data: newLink });
		} catch (error) {
			console.error("링크 생성 실패: ", error);
			res.status(500).json({ message: "서버 오류 발생", error: error.message });
		}
	})
	// Read (링크 조회)
	.get(async (req, res) => {
		const links = await Link.findAll();
		try {
			res.json({ message: "링크 없음.", data: links });
		} catch (error) {
			console.log(error);
			res.status(500).json({ message: "링크 있음.", data: [] });
		}
	})
	// Update (링크 수정)
	.put(async (req, res) => {
		const { id, note, fromHighlightId, toHighlightId } = req.body;
		const link = await Link.findByPk(id);
		try {
			if (link) {
				link.note = note;
				link.fromHighlightId = fromHighlightId;
				link.toHighlightId = toHighlightId;
				await link.save();
				res.json({ message: "링크 수정 성공", data: link });
			} else {
				res.json({ message: "없는 링크입니다.", data: [] });
			}
		} catch (error) {
			console.log(error);
			res.status(500).json({ message: "링크 수정 실패", data: [] });
		}
	})
	// Delete (링크 삭제)
	.delete(async (req, res) => {
		const id = req.body.id;
		const link = await Link.findByPk(id);
		try {
			if (link) {
				await link.destroy();
				res.json({ message: "링크 삭제 성공", data: link });
			} else {
				res.json({ message: "없는 링크입니다.", data: [] });
			}
		} catch (error) {
			console.log(error);
			res.status(500).json({ message: "링크 삭제 실패", data: [] });
		}
	});

router.get("/:fromHighlightId", async (req, res) => {
	const fromHighlightId = req.params.fromHighlightId;
	try {
		const links = await Link.findAll({
			where: { fromHighlightId: fromHighlightId },
		});
		if (links && links.length > 0) {
			res.json({ message: "링크 찾음", data: links });
		} else {
			res.json({ message: "링크 없음", data: [] });
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "서버 오류", data: [] });
	}
});

router.route("/many").post(async (req, res) => {
	try {
		const { userId, links } = req.body;
		const createdLinks = [];
		console.log("유저 아이디", userId, "링크 데이터", links);

		for (const link of links) {
			// const originalHighlight = await Highlight.findByPk(link.toHighlightId);
			const originalHighlight = await Highlight.findByPk(link.toHighlightId, {
				include: [
					{
						model: User, // User 모델을 include (User 모델과의 연결 설정 필요)
					},
				],
			});
			if (!originalHighlight) {
				return res.status(404).json({ message: "Highlight not found." });
			}

			// 원본 하이라이트의 소유자 확인
			const isOwner = originalHighlight.Users.some((user) => user.id === userId);

			let targetHighlightId = originalHighlight.id;
			let highlightToConnect = originalHighlight;

			if (!isOwner) {
				// 원본 하이라이트의 필요한 정보를 이용하여 복사본 생성
				const copiedHighlightData = {
					bookId: originalHighlight.bookId,
					pageNum: originalHighlight.pageNum,
					text: originalHighlight.text,
					startContainer: originalHighlight.startContainer,
					endContainer: originalHighlight.endContainer,
					startOffset: originalHighlight.startOffset,
					endOffset: originalHighlight.endOffset,
					memo: originalHighlight.memo,
				};

				const copiedHighlight = await Highlight.create(copiedHighlightData);
				targetHighlightId = copiedHighlight.id; // 복사본 하이라이트의 ID를 연결 대상으로 설정

				// 복사본 하이라이트에 현재 사용자를 연결
				await copiedHighlight.addUser(userId);
			}

			// 연결 대상 하이라이트(원본 또는 복사본)에 대한 링크 생성
			const newLinkData = {
				fromHighlightId: link.fromHighlightId,
				toHighlightId: targetHighlightId,
				note: link.note,
				userId: userId, // 링크 생성자
			};

			const createdLink = await Link.create(newLinkData);
			createdLinks.push(createdLink);
		}

		res.status(201).json({ message: "다중 링크 생성 성공", data: createdLinks });
	} catch (error) {
		console.error("Error creating multiple links and connecting highlights with user: ", error);
		res
			.status(500)
			.json({ message: "다중 링크 생성 및 하이라이트와 사용자 연결 중 서버 오류 발생", error: error.message });
	}
});

module.exports = router;
