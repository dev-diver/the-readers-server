/**
 * @swagger
 * components:
 *   schemas:
 *     Room:
 *       type: object
 *       required:
 *         - id
 *         - title
 *       properties:
 *         id:
 *           type: integer
 *           description: 방 고유 id
 *         title:
 *           type: string
 *           description: 방 이름
 *         usermax:
 *           type: integer
 *           description: 최대 참가자 수
 */

/**
 * @swagger
 * tags:
 *   name: Room
 *   description: 방 API 정리
 * /api/rooms/{roomId}/books/{bookId}:
 *   post:
 *     tags: [Room]
 *     summary: ID로 방에 책 추가
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 방 ID
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 책 ID
 *     responses:
 *       200:
 *         description: 책 추가 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Room'
 *       500:
 *         description: 서버 에러
 *
 * /api/rooms/{roomId}/books:
 *   post:
 *     tags: [Room]
 *     summary: 파일 업로드로 방에 책 추가
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 방의 고유 ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *               - fileName
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: 업로드할 책 파일
 *               fileName:
 *                 type: string
 *                 description: 책의 이름
 *     responses:
 *       200:
 *         description: 책 파일 업로드 및 추가 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 책 추가 성공
 *                 data:
 *                   $ref: '#/components/schemas/Room'
 *       400:
 *         description: 책 파일 업로드 실패
 *       500:
 *         description: 서버 에러
 *
 * /api/rooms/{id}:
 *   get:
 *     tags: [Room]
 *     summary: ID로 방 조회
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID로 방 조회
 *     responses:
 *       200:
 *          description: 방 조회 성공
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Room'
 *       404:
 *         description: 방을 찾을 수 없습니다.
 *       500:
 *         description: 서버 에러
 *
 *   put:
 *     tags: [Room]
 *     summary: ID로 방을 찾고 수정
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID로 방을 찾고 수정
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Room'
 *       description: 수정할 방의 정보
 *     responses:
 *       200:
 *         description: 방 수정 성공
 *         content:
 *           application/json:
 *             schema:
 *              $ref: '#/components/schemas/Room'
 *       404:
 *         description: 방을 찾을 수 없습니다.
 *       500:
 *         description: 서버 에러
 *   delete:
 *     tags: [Room]
 *     summary: ID로 방 삭제
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID로 방 삭제
 *     responses:
 *       200:
 *         description: 방 삭제 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Room'
 *       404:
 *          description: 방을 찾을 수 없습니다.
 *       500:
 *         description: 서버 에러
 *
 * /api/rooms:
 *   get:
 *     tags: [Room]
 *     summary: 방 이름으로 방 검색
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: 방 이름으로 방 검색
 *     responses:
 *       200:
 *         description: 방 검색 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Room'
 *       404:
 *         description: 방을 찾을 수 없습니다.
 *       500:
 *         description: 서버 에러
 *   post:
 *     tags: [Room]
 *     summary: 방 생성
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               roomName:
 *                 type: string
 *                 description: 방 이름
 *               maxParticipants:
 *                 type: integer
 *                 description: 최대 참가자 수
 *               bookFile:
 *                 type: string
 *                 description: 책 파일
 *     responses:
 *       200:
 *         description: 방 생성 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Room'
 *       500:
 *         description: 방 생성 실패
 */

const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const fs = require("fs");
const { s3Upload, BUCKET_NAME } = require("../../config/aws");
const Room = require("../../models/room");
const Book = require("../../models/book");

// CREATE (room에 book 추가)
router.route("/:roomId/books/:bookId").post((req, res) => {
	const { roomId, bookId } = req.params;
	Room.findByPk(roomId)
		.then((room) => {
			return Book.findByPk(bookId).then((book) => {
				return room.addBook(book);
			});
		})
		.then((result) => {
			res.json({ message: "책 추가 성공", data: result });
		})
		.catch((err) => {
			console.error(err);
			res.status(500).json({ message: "책 추가 실패", data: {} });
		});
});
//book 업로드 후 room에 추가
router.route("/:roomId/books").post(upload.single("file"), async (req, res) => {
	const file = req.file;
	const fileName = req.body.fileName;
	const roomId = req.params.roomId;
	console.log(file.originalname, file.path);
	const uploadParams = {
		Bucket: BUCKET_NAME,
		Key: `pdfs/${file.originalname}`,
		Body: fs.createReadStream(file.path),
	};

	s3Upload(uploadParams)
		.promise()
		.then((data) => {
			return Book.create({
				name: fileName,
				url: data.Location,
			});
		})
		.then((book) => {
			return Room.findByPk(roomId).then((room) => {
				return room.addBook(book);
			});
		})
		.then((result) => {
			res.json({ message: "책 추가 성공", data: result });
		})
		.catch((err) => {
			console.error(err);
			res.status(500).send({ error: "file upload failed" });
		});
});

// READ (room에서 book 조회)
router
	.route("/:id")
	.get((req, res) => {
		Room.findOne({
			where: { id: req.params.id },
			include: [
				{
					model: Book,
				},
			],
		})
			.then((room) => {
				if (!room) {
					return res.status(404).json({ message: "방을 찾을 수 없습니다.", data: {} });
				}
				res.json({ message: "방 조회 성공", data: room });
			})
			.catch((err) => {
				console.error(err);
				res.status(500).json({ message: "방 조회 실패", data: {} });
			});
	})
	// UPDATE (room 수정)
	.put((req, res) => {
		const { roomName, maxParticipants } = req.body;
		console.log(roomName, maxParticipants);
		Room.findByPk(req.params.id)
			.then((room) => {
				if (room) {
					return room.update({
						title: roomName,
						usermax: maxParticipants,
					});
				} else {
					res.status(404).json({ message: "방을 찾을 수 없습니다." });
				}
			})
			.then((updateRoom) => {
				res.json({ message: "방 업데이트 성공", data: updateRoom });
			})
			.catch((err) => {
				console.error(err);
				res.status(500).json({ message: "방 업데이트 실패", data: {} });
			});
	})
	// DELETE (room 삭제)
	.delete((req, res) => {
		Room.findByPk(req.params.id)
			.then((room) => {
				if (room) {
					return room.destroy();
				} else {
					res.status(404).json({ message: "방을 찾을 수 없습니다." });
				}
			})
			.then(() => {
				res.json({ message: "방 삭제 성공", data: {} });
			})
			.catch((err) => {
				console.error(err);
				res.status(500).json({ message: "방 삭제 실패", data: {} });
			});
	});

// READ (room 조회)
router
	.route("/")
	.get(async (req, res) => {
		//검색어로 검색
		const name = req.query.name;
		try {
			const rooms1 = await Room.findAll({
				where: {
					title: { [Op.like]: `%${name}%` }, // Room 모델의 bookFile 필드 검색
				},
			});

			const rooms2 = await Room.findAll({
				include: [
					{
						model: Book,
						where: { name: { [Op.like]: `%${name}%` } },
					},
				],
			});
			const allRooms = [...rooms1, ...rooms2];
			if (allRooms.length === 0) {
				return res.status(404).json({ message: "방을 찾을 수 없습니다.", data: [] });
			}
			res.json({ message: "방 조회 성공", data: allRooms });
		} catch (err) {
			console.error(err);
			res.status(500).json({ message: "방 조회 실패", data: [] });
		}
	})
	// Create (room 생성)
	.post((req, res) => {
		// 데이터 추출
		const { roomName, maxParticipants, bookFile } = req.body;
		//데이터 검증
		if (!roomName || !maxParticipants) {
			return res.json({ message: "데이터를 정확하게 추가하세요.", data: {} });
		}

		// Room 모델을 사용하여 데이터베이스에 새 방을 생성
		Room.create({ title: roomName, usermax: maxParticipants, bookFile: bookFile })
			.then((room) => {
				res.json({ message: "방 생성 성공", data: room });
			})
			.catch((err) => {
				console.error(err);
				res.status(500).json({ message: "방 생성 실패", data: {} });
			});
	});

module.exports = router;
