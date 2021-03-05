// passport 가 req 객체에 isAuthenticated를 추가
// 로그인 중이면 true, 아니면 false
// 모든 로그인에 연관되는 route는 isLoggedIn과 isNotLoggedIn을 참조

exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(403).send("로그인 필요");
  }
};

exports.isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/");
  }
};
