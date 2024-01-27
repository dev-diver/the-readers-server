const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const User = require('../models/user');
// LocalStrategy 
// 첫번째 인수는 전략 설정
// 두번째 인수는 실제 전략 수행하는 async 함수
// async 함수의 email과 password는 첫번째 인수에서 넣어준 것
module.exports = () => {
  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: false,
  }, async (email, password, done) => {
    try {
      const exUser = await User.findOne({ where: { email } });
      if (exUser) {
        const result = await bcrypt.compare(password, exUser.password);
        if (result) {
          done(null, exUser);   // 일치하는 비밀번호가 있다면, 두번째 인자에 넣어준다.
        } else {
          done(null, false, { message: '비밀번호가 일치하지 않습니다.' });
        }
      } else {
        done(null, false, { message: '가입되지 않은 회원입니다.' });
      }
    } catch (error) {
      console.error(error);
      done(error);
    }
  }));
};

// done함수와 passport.authenticate의 관계
// done에서 받은 인자가 passport('local', (authError, user, info))에 넣어준다
