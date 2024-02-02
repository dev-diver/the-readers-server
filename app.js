var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
var dotenv = require("dotenv");

// 스웨거
const swaggerjsdoc = require("swagger-jsdoc");
const swaggerui = require("swagger-ui-express");

dotenv.config();
var reactRouter = require("./routes/react");

var apiRouter = require("./routes/api");
var authRouter = require("./routes/auth");

var { sequelize } = require("./models");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

sequelize
	.sync({ force: false })
	.then(() => {
		console.log("데이터베이스 연결 성공");
	})
	.catch((err) => {
		console.error(err);
	});

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/src", express.static("public"));
app.use("/", express.static(path.join(__dirname, "public")));
app.use("/auth", authRouter);
// 스웨거
const options = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "theReaders 데이터 스키마 & API 명세서",
			version: "1.0.0",
			description: "2024.02.02. 김진태 작성",
			contact: {
				name: "김진태",
				email: "realbig4119@gmail.com",
			},
		},
		servers: [
			{
				url: "http://localhost:3000/",
			},
		],
	},
	apis: ["./routes/api/*.js"],
};

const spacs = swaggerjsdoc(options);

app.use("/api-docs", swaggerui.serve, swaggerui.setup(spacs));

app.use("/api", apiRouter);
app.use("/auth", authRouter);
app.use("*", reactRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404)); //책 속의 한줄 넣으면 어떨지?
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render("error");
});

module.exports = app;
