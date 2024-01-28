const express = require("express");
const passport = require("passport");
const { isLoggedIn, isNotLoggedIn } = require("@middlewares");
const { signup, login, logout } = require("@controllers/auth");
var router = express.Router();
// POST /auth/signup
router.post("/signup", isNotLoggedIn, signup);
// POST /auth/login
router.post("/login", isNotLoggedIn, login);
// GET /auth/logout
router.get("/logout", isLoggedIn, logout);
// GET /auth/kakao -> 카카오 로그인 과정이 시작
router.get("/kakao", passport.authenticate("kakao"));
// GET /auth/kakao/callback -> 로그인 후 성공 여부 결과를 여기로 받는다.
// 로컬 로그인과 다른 점은 passport.authenticate 메서도에 콜백 함수를 제공하지 않는다.
// kakao 로그인은 성공 시 내부적으로 req.login을 호출하므로
router.get(
	"/kakao/callback",
	passport.authenticate("kakao", {
		failureRedirect: "/?error=카카오로그인 실패",
	}),
	(req, res) => {
		res.redirect("/"); // 성공 시에는 /로 이동
	}
);
module.exports = router;
