/**
 * @swagger
 * components:
 *   schemas:
 *     Translation:
 *       type: object
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: integer
 *           description: 번역 고유 id
 *         text:
 *           type: string
 *           description: 번역 텍스트
 *         startContainer:
 *           type: string
 *           description: 시작 컨테이너
 */

/**
 * @swagger
 * tags:
 *   name: Translation
 *   description: 번역 API 정리
 * /api/translations:
 *   get:
 *     tags: [Translation]
 *     summary: 번역 조회
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *         description: 번역 조회
 *     responses:
 *       200:
 *         description: 번역 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 $ref: '#/components/schemas/Translation'
 *       500:
 *         description: 서버 에러
 *   post:
 *     tags: [Translation]
 *     summary: 번역 생성
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Translation'
 *     responses:
 *       200:
 *         description: 번역 생성 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Translation'
 *       500:
 *         description: 서버 에러
 * /api/translations/{id}:
 *   get:
 *     tags: [Translation]
 *     summary: ID를 기준으로 번역 조회
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID를 기준으로 번역 조회
 *     responses:
 *       200:
 *          description: 번역 조회 성공
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                items:
 *                  $ref: '#/components/schemas/Translation'
 *       500:
 *          description: 서버 에러
 *   put:
 *     tags: [Translation]
 *     summary: ID를 기준으로 번역 수정
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID를 기준으로 번역 수정
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *                 description: 번역 텍스트
 *               startContainer:
 *                 type: string
 *                 description: 시작 컨테이너
 *     responses:
 *       200:
 *         description: 번역 수정 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Translation'
 *       500:
 *          description: 서버 에러
 */

var express = require("express");
var router = express.Router();
const { Op } = require("sequelize");
const Translation = require("../../models/translation");

router
	.route("/")
	// 번역 조회
	.get(async (req, res) => {
		const translations = req.query.text;
		try {
			const translation = await Translation.findAll({
				where: {
					text: {
						[Op.like]: `%${translations}%`,
					},
				},
			});
			res.json({ message: "번역 조회 성공", data: translation });
		} catch (err) {
			console.error(err);
			res.status(500).send({ error: "번역 조회 실패", data: [] });
		}
	})
	// 번역 생성
	.post(async (req, res) => {
		const { text, startContainer } = req.body;
		console.log(text, startContainer);
		try {
			const translation = await Translation.create({ text, startContainer });
			res.json({ message: "번역 생성 성공", data: translation });
		} catch (err) {
			console.error(err);
			res.status(500).send({ message: "번역 생성 실패", data: [] });
		}
	});

router
	.route("/:id")
	// id를 기준으로 번역 조회
	.get(async (req, res) => {
		console.log(req.params.id);
		try {
			const translation = await Translation.findOne({
				where: { id: req.params.id },
			});
			res.json({ message: "번역 조회 성공", data: translation });
		} catch (err) {
			console.error(err);
			res.status(500).send({ message: "번역 조회 실패", data: [] });
		}
	})
	// id를 기준으로 번역 수정
	.put(async (req, res) => {
		console.log(req.params.id);
		try {
			const translation = await Translation.findOne({ where: { id: req.params.id } });

			if (!translation) {
				return res.status(404).send({ message: "번역을 찾을 수 없습니다." });
			}

			const { text, startContainer } = req.body;
			await Translation.update({ text, startContainer }, { where: { id } });

			res.json({ message: "번역 수정 성공", data: { id, text, startContainer } });
		} catch (err) {
			console.error(err);
			res.status(500).send({ message: "번역 수정 실패", data: [] });
		}
	})
	.delete(async (req, res) => {
		try {
			const translation = await Translation.findOne({ where: { id: req.params.id } });

			if (!translation) {
				return res.status(404).send({ message: "번역을 찾을 수 없습니다." });
			}

			await Translation.destroy({ where: { id } });

			res.json({ message: "번역 삭제 성공", data: { id } });
		} catch (err) {
			console.error(err);
			res.status(500).send({ message: "번역 삭제 실패", data: [] });
		}
	});
