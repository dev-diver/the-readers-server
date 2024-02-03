var express = require("express");
var router = express.Router();
const { Op } = require("sequelize");
const Translation = require("../../models/translation");

// Create (translation 생성)
router.route("/").post(async (req, res) => {