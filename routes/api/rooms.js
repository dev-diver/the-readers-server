const express = require("express");
const Room = require("../../models/room");
const Book = require("../../models/book");

const router = express.Router();
// GET /api/rooms/:bookName
router.get("/search", async (req, res) => {
	const bookName = req.query.bookname;
	Room.findAll({
		include: [
			{
				model: Book,
				where: {
					name: bookName,
				},
			},
		],
	})
		.then((rooms) => {
			console.log(rooms);
			res.json(rooms);
		})
		.catch((err) => {
			console.log(err);
			res.json({ message: "검색 실패", data: [] });
		});
});

module.exports = router;
