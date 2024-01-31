const express = require("express");
const router = express.Router();
const { User } = require("../../models");
router
	.route("/")
	.get(async (req, res) => {
		const nick = req.query.nick;
		console.log(nick);
		try {
			const user = await User.findAll({
				where: {
					nick: { [Op.like]: `%${nick}%` },
				},
			});
			res.json({ message: "유저 조회 성공", data: user });
		} catch (err) {
			console.log(err);
			res.status(500).json({ message: "유저 조회 실패", data: [] });
		}
	})
	// Create (user 생성)
	.post(async (req, res) => {
		const { email, nick, password, provider, snsid } = req.body;
		console.log(email, nick, password, provider, snsid);

		// 이메일, 닉네임 중복 검사
		const existingUser = await User.findOne({
			where: { email: email, nick: nick },
		});
		if (existingUser) {
			return res.status(400).json({ message: "이미 존재하는 회원정보입니다.", data: {} });
		}

		if (!email || !nick || !password || !provider || !snsid) {
			return res.json({ message: "모든 정보를 입력해주세요.", data: {} });
		}
		User.create({ email, nick, password, provider, snsid })
			.then((user) => {
				res.json({ message: "회원가입 성공", data: user });
			})
			.catch((err) => {
				console.log(err);
				res.status(500).json({ message: "회원가입 실패", data: {} });
			});
	});

// Read (고유 id를 기준으로 user 조회)
router
	.route("/:id")
	.get(async (req, res) => {
		await User.findOne({
			where: { id: req.params.id },
		})
			.then((user) => {
				if (!user) {
					return res.status(404).json({ message: "유저를 찾을 수 없습니다.", data: {} });
				}
				res.json({ message: "유저 조회 성공", data: user });
			})
			.catch((err) => {
				console.log(err);
				res.status(500).json({ message: "유저 조회 실패", data: {} });
			});
	})
	.put((req, res) => {
		const { password } = req.body;
		User.findOne({
			where: { id: req.params.id },
		})
			.then((user) => {
				if (!user) {
					return res.status(404).json({ message: "유저를 찾을 수 없습니다.", data: {} });
				}

				// 사용자 비밀번호 업데이트
				user
					.update({
						password: password,
					})
					.then((updateUser) => {
						res.json({ message: "유저 비밀번호 수정 성공", data: updateUser });
					})
					.catch((err) => {
						console.log(err);
						res.status(500).json({ message: "유저 비밀번호 수정 실패", data: {} });
					});
			})
			.catch((err) => {
				console.log(err);
				res.status(500).json({ message: "유저 조회 실패", data: {} });
			});
	})
	.delete((req, res) => {
		User.findOne({
			where: { id: req.params.id },
		})
			.then((user) => {
				if (!user) {
					return res.status(404).json({ message: "유저를 찾을 수 없습니다.", data: {} });
				}
				user
					.destroy()
					.then(() => {
						res.json({ message: "유저 삭제 성공", data: {} });
					})
					.catch((err) => {
						console.log(err);
						res.status(500).json({ message: "유저 삭제 실패", data: {} });
					});
			})
			.catch((err) => {
				console.log(err);
				res.status(500).json({ message: "유저 조회 실패", data: {} });
			});
	});

module.exports = router;
