var express = require("express");
var router = express.Router();
const userRouter = require("./user");

var highlightsRouter = require("./highlights");
var drawingsRouter = require("./drawings");
var booksRouter = require("./books");
var storageRouter = require("./storage");
var roomRouter = require("./rooms");

router.use("/user", userRouter);
router.use("/highlights", highlightsRouter);
router.use("/drawings", drawingsRouter);
router.use("/books", booksRouter);
router.use("/rooms", roomRouter);
router.use("/storage", storageRouter);

router.get("/", function (req, res, next) {
	res.send("없는 api");
});
// app.use(function(req, res, next) {
//   next(createError(404)); //책 속의 한줄 넣으면 어떨지?
// });

// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

module.exports = router;
