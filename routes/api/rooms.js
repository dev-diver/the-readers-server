const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const Room = require("../../models/room");
const Book = require("../../models/book");

//rooms
router.get("/search", async (req, res) => {
	const bookName = req.query.bookname;
	Room.findAll({
		include: [
			{
				model: Book,
				where: {
					name: { [Op.like]: `%${bookName}%` },
				},
				attribute: [],
			},
		],
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

module.exports = router;
