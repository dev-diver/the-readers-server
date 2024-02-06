/**
 * @swagger
 * components:
 *   schemas:
 *     Outerlinks:
 *       type: object
 *       required:
 *         - id
 *         - url
 *       properties:
 *         id:
 *           type: integer
 *           description: 외부 링크 고유 id
 *         url:
 *           type: string
 *           description: 외부 링크 url
 */

const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const Outerlinks = require("../../models/outerlinks"); // Outerlink 모델 가져오기

// Outerlink 생성 API
router
	.route("/")
	// Create (외부 링크 생성)
	.post(async (req, res) => {
		const { url } = req.body;
		try {
			const outerlink = await Outerlinks.create({
				url,
			});
			res.status(201).json({ message: "외부 링크 생성 성공", data: outerlink });
		} catch (error) {
			console.log(error);
			res.status(500).json({ message: "외부 링크 생성 실패", data: [] });
		}
	})
	// Read (외부 링크 조회)
	.get(async (req, res) => {
		const outerlinks = await Outerlinks.findAll();
		try {
			res.json({ message: "외부 링크 없음.", data: outerlinks });
		} catch (error) {
			console.log(error);
			res.status(500).json({ message: "외부 링크 있음.", data: [] });
		}
	})
	// Update (외부 링크 수정)
	.put(async (req, res) => {
		const { id, url } = req.body;
		const outerlink = await Outerlinks.findByPk(id);
		try {
			if (outerlink) {
				outerlink.url = url;
				await outerlink.save();
				res.json({ message: "외부 링크 수정 성공", data: outerlink });
			} else {
				res.json({ message: "없는 외부 링크입니다.", data: [] });
			}
		} catch (error) {
			console.log(error);
			res.status(500).json({ message: "외부 링크 수정 실패", data: [] });
		}
	})
	// Delete (외부 링크 삭제)
	.delete(async (req, res) => {
		const id = req.body.id;
		const outerlink = await Outerlinks.findByPk(id);
		try {
			if (outerlink) {
				await outerlink.destroy();
				res.json({ message: "외부 링크 삭제 성공", data: outerlink });
			} else {
				res.json({ message: "없는 외부 링크입니다.", data: [] });
			}
		} catch (error) {
			console.log(error);
			res.status(500).json({ message: "외부 링크 삭제 실패", data: [] });
		}
	});

module.exports = router;
