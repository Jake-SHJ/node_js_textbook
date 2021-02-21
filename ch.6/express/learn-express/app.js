var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var session = require("express-session");
var flash = require("connect-flash");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(function (req, res, next) {
  console.log(req.url, "저도 미들웨어입니다.");
  next(); // 반드시 next를 호출해야 다음 미들웨어로 넘어간다.
});
app.use(logger("dev")); // dev, short : 개발중, common, combined : 배포시
app.use(express.static(path.join(__dirname, "public")));
// 정적 파일 라우터, 파일을 찾으면 다음 미들웨어를 건너뛰고 응답으로 넘어간다. 불필요한 미들웨어 작업을 건너뛰기 위해 순서 변경
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  session({
    resave: false, // 세션 수정 사항이 생기지 않더라 세션을 다시 저장?
    saveUninitialized: false, // 세션에 저장할 내역이 없더라도 저장?
    secret: "secret code", // cookie-parser의 비밀키 역할
    cookie: {
      //세션 쿠키 설정
      httpOnly: true, // 클라이언트에서 쿠키 확인 불가
      secure: false, // https가 아닌 환경에서도 사용
    },
  })
);
app.use(flash());

app.use("/", indexRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
