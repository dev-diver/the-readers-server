const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const { User } = require("../../models");
const { isLoggedIn } = require("../../middlewares");
const { follow } = require("../../controllers/user");
router
	.route(":/id")
	.get(async (req, res, next) => {
		const id = req.params.id;
		User.findAll({
			attributes: ["nick"],
		})
			.then((data) => {
				console.log(data);
				res.json(data);
			})
			.catch((err) => {
				console.log(err);
			});
	})
	.post(async (req, res, next) => {
		const id = req.params.id;
		User.findAll({
			attributes: ["nick"],
		})
			.then((data) => {
				console.log(data);
				res.json(data);
			})
			.catch((err) => {
				console.log(err);
			});
	});

module.exports = router;
