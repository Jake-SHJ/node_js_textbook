const mongoose = require("mongoose");

const { Schema } = mongoose;
const favoriteSchema = new Schema({
  placeId: {
    type: String,
    unique: true,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  location: { type: [Number], index: "2dsphere" }, // 경도, 위도의 배열 / 2dsphere는 위치 정보 저장의 의미
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Favorite", favoriteSchema);
