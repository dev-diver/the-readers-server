// var app = require("../app");
var express = require('express');
var router = express.Router();

var highlightsRouter = require('./highlights');

// app.use('/highlights', highlightsRouter);
router.use('/highlights', highlightsRouter);

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