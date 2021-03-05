const passport = require("passport");
const local = require("./localStrategy");
const kakao = require("./kakaoStrategy");
const { User } = require("../models");

module.exports = () => {
  // req.session 객체에 어떤 데이터를 저장할지 선택
  // arg로 user를 받아 done 함수의 두번째 인자로 user.id를 넘김 (사용자 정보 전체를 넘기면 용량 증가, 데이터 일관성 문제 발생)
  // done 함수의 첫번째 인자는 에러 발생 시 사용
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // 매요청 시 실행
  // passport.session() 미들웨어가 이 메서드를 호출
  // serializeUser에서 세션에 저장했던 아이디를 받아 데이터 베이스에서 사용자 정보를 조회
  // 조회한 정보를 req.user에 저장하므로 req.user를 통해 로그인한 사용자 정보를 가져올 수 있음
  passport.deserializeUser((id, done) => {
    User.findOne({
      where: { id },
      include: [
        { model: User, attributes: ["id", "nick"], as: "Followers" },
        { model: User, attributes: ["id", "nick"], as: "Followings" },
      ],
    })
      .then((user) => done(null, user))
      .catch((err) => done(err));
  });

  local();
  kakao();
};

// 1. 로그인 요청
// 2. passport.authenticate 메서드 호출 (route/auth.js)
// 3. 로그인 전략 수행 (localStrategy, kakaoStrategy)
// 4. 로그인 성공 시 사용자 정보 객체와 함깨 req.login 호출
// 5. req.login 메서드가 passport.serializeUser 호출
// 6. req.session에 사용자 아이디만 저장
// 7. 로그인 완료

// 로그인 이후
// 1. 모든 요청에 passport.session() 미들웨어가 passport.deserializeUser 메서드 호출
// 2. req.session에 저장된 아이디로 데이터베이스에서 사용자 조회
// 3. 조회된 사용자 정보를 req.user에 저장
// 4. 라우터에서 req.user 객체 사용 가능
