const bcrypt = require("bcrypt");
const passport = require("passport");
const User = require("../models/");
//회원가입 controller
exports.signup = async (req, res, next) => {
  const { email, nick, password } = req.body;
  try {
    const exUser = await User.findOne({ where: { email } }); // 기존에 같은 이메일쓰는 사용자있는지?
    if (exUser) {
      return res.redirect("/signup?error=exist"); // 회원가입 페이지로 다시 돌아가게함.
      // 주소 뒤에 에러를 쿼리스트링으로 표시
    }
    const hash = await bcrypt.hash(password, 12); // 비밀번호를 암호화 (12이상 추천, 31까지 사용 가능)
    await User.create({
      email,
      nick,
      password: hash,
    }); //사용자 정보 생성
    return res.redirect("/");
  } catch (error) {
    console.error(error);
    return next(error);
  }
};
// 로그인 controller
exports.login = (req, res, next) => {
  // local 로그인 전략을 수행
  passport.authenticate("local", (authError, user, info) => {
    if (authError) {
      console.error(authError);
      return next(authError);
    }
    if (!user) {
      return res.redirect(`/?error=${info.message}`);
    }
    return req.login(user, (loginError) => {
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }
      return res.redirect("/");
    });
  })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙임.
};
// 로그아웃 controller
// req.logout 객체는 req.user 객체와 req.session 객체를 제거함.
// 세션 정보를 지운 후, 콜백 함수가 실행
exports.logout = (req, res) => {
  req.logout(() => {
    res.redirect("/");
  });
};
