const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const fs = require("fs");
const { s3Upload, BUCKET_NAME } = require("../../config/aws");
const Room = require("../../models/room");
const Book = require("../../models/book");

//rooms

router.route("/:roomId/books/:bookId").post((req, res) => {
	const { roomId, bookId } = req.params;
	console.log(roomId, bookId);
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
			console.log(err);
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
			console.log(data);
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

router.route("/:id").get((req, res) => {
	Room.findOne({
		where: { id: req.params.id },
		include: [
			{
				model: Book,
			},
		],
	})
		.then((room) => {
			res.json({ message: "방 조회 성공", data: room });
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({ message: "방 조회 실패", data: {} });
		});
});

router
	.route("/")
	.get(async (req, res) => {
		//검색어로 검색
		const name = req.query.name;
		console.log(name);
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
			res.json({ message: "방 조회 성공", data: allRooms });
		} catch (err) {
			console.log(err);
			res.status(500).json({ message: "방 조회 실패", data: [] });
		}
	})
	.post((req, res) => {
		// 데이터 추출
		const { roomName, maxParticipants, bookFile } = req.body;
		console.log(roomName, maxParticipants, bookFile);
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
				console.log(err);
				res.status(500).json({ message: "방 생성 실패", data: {} });
			});
	});

module.exports = router;
