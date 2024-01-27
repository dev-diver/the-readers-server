const passport = require('passport');
const KakaoStrategy = require('passport-kakao').Strategy;

const User = require('../models/user');
require('dotenv').config();

console.log(process.env.KAKAO_ID);

module.exports = () => {
  passport.use(new KakaoStrategy({
    clientID: process.env.KAKAO_ID,     // clientID는 카카오에서 발급해주는 ID + 노출X되게 .env에 넣어놓음.
    callbackURL: '/auth/kakao/callback',    // 카카오로부터 인증 결과를 받을 라우터 주소
  }, async (accessToken, refreshToken, profile, done) => {
    console.log('kakao profile', profile);
    try {
      const exUser = await User.findOne({
        where: { snsId: profile.id, provider: 'kakao' },
      });                                   // 이미 카카오를 통해 회원 가입한 사용자가 있는지 조회
      if (exUser) {
        done(null, exUser);                 // 가입된 exUser 넘겨주고, 전략 종료
      } else {
        const newUser = await User.create({ // 카카오 인증 후, callbackURL에 적힌 주소로, accessToken, refreshToken, profile을 보냄.
          email: profile._json?.kakao_account?.email,   // email은 profile속성이 undefine일 수 있으므로, optional chaining 문법 사용
          nick: profile.displayName,
          snsId: profile.id,
          provider: 'kakao',
        });
        done(null, newUser);        // 사용자 생성한 뒤 done 함수 호출
      }
    } catch (error) {
      console.error(error);
      done(error);
    }
  }));
};