var express = require("express");
var router = express.Router();
const userRouter = require("./user");

var highlightsRouter = require("./highlights");
var drawingsRouter = require("./drawings");
var booksRouter = require("./books");
var storageRouter = require("./storage");
var roomRouter = require("./rooms");
var linkRouter = require("./link");
var outerlinksRouter = require("./outerlinks");

//api
router.use("/user", userRouter);
router.use("/highlights", highlightsRouter);
router.use("/drawings", drawingsRouter);
router.use("/books", booksRouter);
router.use("/rooms", roomRouter);
router.use("/storage", storageRouter);
router.use("/link", linkRouter);
router.use("/outerlinks", outerlinksRouter);

router.get("/", function (req, res, next) {
	res.status(500).send("없는 api"); //책 속의 한 줄
});

module.exports = router;
