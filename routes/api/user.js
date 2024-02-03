/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - id
 *         - nick
 *       properties:
 *         id:
 *           type: integer
 *           description: 유저 고유 id
 *         email:
 *           type: string
 *           description: 이메일
 *         nick:
 *           type: string
 *           description: 닉네임
 *         password:
 *           type: string
 *           description: 비밀번호
 *         provider:
 *           type: string
 *           description: 제공자
 *         snsid:
 *           type: string
 *           description: SNS ID
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: 생성일시
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: 수정일시
 */

/**
 * @swagger
 * tags:
 *   name: User
 *   description: 유저 API 정리
 * /api/user/{id}:
 *   get:
 *     tags: [User]
 *     summary: ID로 유저 조회
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID로 유저 조회
 *     responses:
 *       200:
 *         description: 유저 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: 유저를 찾을 수 없습니다.
 *       500:
 *         description: 서버 에러
 *
 *   put:
 *     tags: [User]
 *     summary: ID로 유저를 찾고 PASSWORD 수정
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID로 유저를 찾고 PASSWORD 수정
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 description: 비밀번호
 *     responses:
 *       200:
 *         description: 유저 수정 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: 유저를 찾을 수 없습니다.
 *       500:
 *         description: 서버 에러
 *
 *   delete:
 *     tags: [User]
 *     summary: ID로 유저를 찾고 삭제
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID로 유저를 찾고 삭제
 *     responses:
 *       200:
 *         description: 유저 삭제 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: 유저를 찾을 수 없습니다.
 *       500:
 *         description: 서버 에러
 *
 * /api/user:
 *   get:
 *     tags: [User]
 *     summary: 닉네임으로 유저 검색
 *     parameters:
 *       - in: query
 *         name: nick
 *         schema:
 *           type: string
 *         description: 닉네임으로 유저 검색
 *     responses:
 *       200:
 *         description: 유저 검색 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       404:
 *         description: 유저를 찾을 수 없습니다.
 *       500:
 *         description: 서버 에러
 *   post:
 *     tags: [User]
 *     summary: 유저 추가
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: 유저 추가 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: 유저 추가 실패
 */

const express = require("express");
const router = express.Router();
const { User } = require("../../models");
router
	.route("/")
	.get(async (req, res) => {
		const nick = req.query.nick;
		try {
			const user = await User.findAll({
				where: {
					nick: { [Op.like]: `%${nick}%` },
				},
			});
			res.json({ message: "유저 조회 성공", data: user });
		} catch (err) {
			console.error(err);
			res.status(500).json({ message: "유저 조회 실패", data: [] });
		}
	})
	// Create (user 생성)
	.post(async (req, res) => {
		const { email, nick, password, provider, snsid } = req.body;

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

		// provider 필드의 값이 'local' 또는 'kakao'인지 확인 (sns 로그인 업데이트 되면 수정 필요)
		if (provider !== "local" && provider !== "kakao") {
			return res.status(400).json({ message: "provider 필드는 local 또는 kakao여야 합니다." });
		}

		User.create({ email, nick, password, provider, snsid })
			.then((user) => {
				res.json({ message: "회원가입 성공", data: user });
			})
			.catch((err) => {
				console.error(err);
				res.status(500).json({ message: "회원가입 실패", data: {} });
			});
	});

// Read (고유 id를 기준으로 user 조회)
router
	.route("/:id")
	.get(async (req, res) => {
		console.log(req.params.id);
		await User.findOne({
			where: { id: req.params.id },
		})
			.then((user) => {
				console.log(user);
				if (!user) {
					return res.status(404).json({ message: "유저를 찾을 수 없습니다.", data: {} });
				}
				res.json({ message: "유저 조회 성공", data: user });
			})
			.catch((err) => {
				console.error(err);
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
						console.error(err);
						res.status(500).json({ message: "유저 비밀번호 수정 실패", data: {} });
					});
			})
			.catch((err) => {
				console.error(err);
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
						console.error(err);
						res.status(500).json({ message: "유저 삭제 실패", data: {} });
					});
			})
			.catch((err) => {
				console.error(err);
				res.status(500).json({ message: "유저 조회 실패", data: {} });
			});
	});

module.exports = router;
