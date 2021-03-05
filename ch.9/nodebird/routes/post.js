const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const { Post, Hashtag, User } = require("../models");
const { isLoggedIn } = require("./middlewares");

const router = express.Router();
// upload 폴더가 없으면 폴더 생성
try {
  fs.readdir("uploads");
} catch (error) {
  console.error("uploads 폴더가 없어 uploads 폴더를 생성합니다.");
  fs.mkdirSync("uploads");
}

// upload를 미들웨어를 만드는 객체로 생성
const upload = multer({
  // storage는 저장 방식과 경로, 파일명 등을 설정
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, "uploads/");
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname);
      cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
  }),
  // limit 는 최대 이미지 파일 용량 허용치를 의미
  limits: { fileSize: 5 * 1024 * 1024 },
});

// single은 하나의 이미지를 업로드, req.file 객체를 생성
// array, fields는 여러개의 이미지를 업로드, req.files 객체를 생성
// array는 속성 하나에 이미지 여러개 업로드, field는 여러 개의 속성에 이미지를 하나씩 업로드
// none은 이미지 없이 데이터만 multipart 형식으로 전송

// 이미지 업로드를 처리, single 미들웨어 사용
router.post("/img", isLoggedIn, upload.single("img"), (req, res) => {
  console.log(req.file);
  res.json({ url: `/img/${req.file.filename}` });
});

const upload2 = multer();
// 게시글 업로드를 처리, none 미들웨어 사용
// 이미지를 업로드 했다면 이미지 주소도 req.body.url로 전송(이미지 자체가 아니라 주소만)
router.post("/", isLoggedIn, upload2.none(), async (req, res, next) => {
  try {
    const post = await Post.create({
      content: req.body.content,
      img: req.body.url,
      userId: req.user.id,
    });

    // 해시태그 추출 및 데이터베이스 저장
    // post.addHashtags 메서드로 게시글과 해시태그의 관계를 PostHashtag 테이블에 삽입
    const hashtags = req.body.content.match(/#[^\s]*/g);
    if (hashtags) {
      const result = await Promise.all(
        hashtags.map((tag) =>
          Hashtag.findOrCreate({
            where: { title: tag.slice(1).toLowerCase() },
          })
        )
      );
      await post.addHashtags(result.map((r) => r[0]));
    }
    res.redirect("/");
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// 해시태그 조회
router.get("/hashtag", async (req, res, next) => {
  const query = req.query.hashtag;
  if (!query) {
    return res.redirect("/");
  }
  try {
    const hashtag = await Hashtag.findOne({ where: { title: query } });
    let posts = [];
    if (hashtag) {
      posts = await hashtag.getPosts({ include: [{ model: User }] });
    }
    return res.render("main", {
      title: `${query} | NodeBird`,
      user: req.user,
      twits: posts,
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
});
module.exports = router;
