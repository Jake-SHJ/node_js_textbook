var express = require("express");
var Comment = require("../schemas/comment");

var router = express.Router();

/* GET users listing. */
router.get("/:id", async (req, res, next) => {
  try {
    const comments = await Comment.find({ commenter: req.params.id }).populate(
      "commenter"
    );
    console.log(comments);
    res.json(comments);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const comment = new Comment({
      commenter: req.body.id,
      comment: req.body.comment,
    });
    const result = await comment.save();
    console.log(result);
    res.status(201).json(result);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.patch("/:id", async (req, res, next) => {
  try {
    const result = await Comment.update(
      { _id: req.params.id },
      { comment: req.body.comment }
    );
    console.log(result);
    res.json(result);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const result = await Comment.remove({ _id: req.params.id });
    console.log(result);
    res.json(result);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;
