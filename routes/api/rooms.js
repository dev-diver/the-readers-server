const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const Room = require("../../models/room");
const Book = require("../../models/book");

//rooms
router.get("/search", async (req, res) => {
	const bookName = req.query.bookname;
	Room.findAll({
		where: {
			bookFile: { [Op.like]: `%${bookName}%` }, // Room 모델의 bookFile 필드 검색
		},
	})
		.then((rooms) => {
			res.json(rooms);
		})
		.catch((err) => {
			console.log(err);
			res.json({ message: "검색 실패", data: [] });
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
			res.json({ message: "방 조회 실패", data: {} });
		});
});

router.route("/make").post((req, res) => {
	// 데이터 추출
	const { roomName, maxParticipants, bookFile } = req.body;
	console.log(roomName, maxParticipants, bookFile);
	//데이터 검증
	if (!roomName || !maxParticipants || !bookFile) {
		return res.json({ message: "데이터를 정확하게 추가하세요.", data: {} });
	}

	// Room 모델을 사용하여 데이터베이스에 새 방을 생성
	Room.create({ title: roomName, usermax: maxParticipants, bookFile: bookFile })
		.then((room) => {
			res.json({ message: "방 생성 성공", data: room });
		})
		.catch((err) => {
			console.log(err);
			res.json({ message: "방 생성 실패", data: {} });
		});
});

module.exports = router;
