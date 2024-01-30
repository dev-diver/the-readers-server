const express = require("express");
const { isLoggedIn, isNotLoggedIn } = require("../middlewares");
const { renderProfile, renderSignup, renderMain } = require("../controllers/page");

var router = express.Router();

router.get("/", function (req, res, next) {
	res.send("hello");
});

router.use((req, res, next) => {
	res.locals.user = req.user;
	res.locals.followerCount = req.user?.Followers?.length || 0;
	res.locals.followingCount = req.user?.Followings?.length || 0;
	res.locals.followingIdList = req.user?.Followings?.map((f) => f.id) || [];
	next();
});

router.get("/profile", isLoggedIn, renderProfile);

router.get("/signup", isNotLoggedIn, renderSignup);

router.get("/", renderMain);

module.exports = router;
