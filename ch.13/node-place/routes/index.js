const express = require("express");
const util = require("util");
const googleMaps = require("@google/maps");

const History = require("../schemas/history");

const router = express.Router();

// 구글 지도 클라이언트 생성
const googleMapsClient = googleMaps.createClient({
  key: process.env.PLACE_API_KEY,
});

router.get("/", (req, res) => {
  res.render("index");
});

// 검색어 자동 완성 라우터
router.get("/autocomplete/:query", (req, res, next) => {
  googleMapsClient.placesQueryAutoComplete(
    {
      input: req.params.query,
      language: "ko",
    },
    (err, response) => {
      if (err) {
        return next(err);
      }
      return res.json(response.json.predictions);
    }
  );
});

// 실제 장소 검색 시 결과값 반환 라우터
router.get("/seach/:query", async (req, res, next) => {
  const googlePlaces = util.promisify(googleMapsClient.places);
  try {
    const history = new History({ query: req.params.query });
    await history.save();
    const response = await googlePlaces({
      query: req.params.query,
      language: "ko",
    });
    res.render("result", {
      title: `${req.params.query} 검색 결과`,
      results: response.json.results,
      query: req.params.query,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
