const passport = require('passport');
const local = require('./localStrategy');
const kakao = require('./kakaoStrategy');
const User = require('../models/user');

// serializeUser는 로그인 시에 실행
// 역할: 사용자 정보 객체에서 아이디만 추려 세션에 저장.
// req.session 객체에 어떤 데이터를 저장할 지 정하는 데이터
// 매개변수로 user를 받고나서, 
// done 첫번째 인수 에러 발생시, 두번째 인수 user.id를 넘긴다
module.exports = () => {
  passport.serializeUser((user, done) => {
    console.log('serialize');
    done(null, user.id);
  });

  // deserializeUser는 각 요청마다 실행
  // 역할: 세션에 저장한 아이디를 통해 사용자 정보 객체를 불러옴.
  // passport.session 미들웨어가 이 메서드를 호출
  // seriallizeUser의 done의 두 번째 인수로 넣었던 데이터가 
  // deserializeUser의 매개변수가 된다.
  // done 함수를 통해서, req.user를 통해 로그인한 사용자의 정보를 가져올 수 있다.
  passport.deserializeUser((id, done) => {
    console.log('deserialize');
    User.findOne({
      where: { id },
      include: [{
        model: User,
        attributes: ['id', 'nick'], // 실수로 비밀번호를 조회하는 것을 방지하기 위함.
        as: 'Followers',
      }, {
        model: User,
        attributes: ['id', 'nick'], // 실수로 비밀번호를 조회하는 것을 방지하기 위함.
        as: 'Followings',
      }],
    })
      .then(user => {
        console.log('user', user);
        done(null, user);
       })
      .catch(err => done(err));
  });

  // deserializeUser 캐싱하기
  // 라우터 실행되기 전에 deserializeUser가 먼저 실행됨.
  // 서비스 규모가 커질수록 많은 요청에 DB에 큰 부담
  // 사용자 정보가 빈번히 바뀌는게 아니라면, 캐싱해두는 것이 좋음.
  // 다만, 캐싱이 유지되는 동안 팔로잉, 팔로워 정보가 갱신되지 않음.
  // 캐싱 시간은 서비스 정책에 따라 조절해야
  // 실제 서비스에서는 메모리에 캐싱하기보다는 레디스 같은 데이터베이스에 사용자 정보를 캐싱함.

  local();
  kakao();
};
