const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const Room = require("../../models/room");
const Book = require("../../models/book");

// CREATE (room에 book 추가)
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
				console.log(err);
				res.status(500).json({ message: "방 조회 실패", data: {} });
			});
	})
	// UPDATE (room 수정)
	.put((req, res) => {
		const { roomName, maxParticipants } = req.body;
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
				console.log(err);
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
				console.log(err);
				res.status(500).json({ message: "방 삭제 실패", data: {} });
			});
	});

// READ (room 조회)
router
	.route("/")
	.get(async (req, res) => {
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
	// Create (room 생성)
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
