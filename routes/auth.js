const express = require("express");
const router = express.Router();
const { UniqueConstraintError } = require("sequelize");

// Load User model
const User = require("../models/user");

router.get("/", (req, res) => {
	res.send("auth test");
});

//  /signup 으로 넘어오는 id, 비밀번호를 sequelize를 이용해 DB에 저장
router.post("/signup", (req, res) => {
	const user = ({ nick, email, password, profileImg } = req.body);
	User.create(user)
		.then((user) => {
			var token = createToken();
			let result = {
				id: user.id,
				nick: user.nick,
				email: user.email,
				profileImg: user.profileImg,
				token: token,
			};
			console.log(result);
			res.status(201).json({
				message: "가입 성공",
				data: result,
			});
		})
		.catch((err) => {
			if (err instanceof UniqueConstraintError) {
				return res.status(409).json({ message: "이미 존재하는 이메일입니다.", data: null });
			}
			console.error(err);
			res.status(500).json({ message: "알 수 없는 에러", data: null });
		});
});

function createToken() {
	var token = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	for (var i = 0; i < 16; i++) token += possible.charAt(Math.floor(Math.random() * possible.length));
	return token;
}
// /login 으로 넘어오는 id, 비밀번호를 sequelize를 이용해 DB에 저장
router.post("/login", async (req, res) => {
	User.findOne({
		where: {
			email: req.body.email,
			password: req.body.password,
		},
	})
		.then((user) => {
			if (!user) {
				return res.status(404).json({ success: false });
			} else {
				var token = createToken();
				let result = {
					id: user.id,
					nick: user.nick,
					email: user.email,
					profileImg: user.profileImg,
					token: token,
				};
				console.log(result);
				res.status(200).json({
					message: "로그인 성공",
					data: result,
				});
			}
		})
		.catch((err) => {
			console.error(err);
			res.status(500).json({ message: "로그인 실패", data: null });
		});
});

module.exports = router;
