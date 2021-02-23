var express = require("express");
var { User, Comment } = require("../models");

var router = express.Router();

router.get("/:id", async (req, res, next) => {
  try {
    await Comment.findAll({
      include: {
        model: User,
        where: { id: req.params.id },
      },
    }).then((result) => {
      console.log(result);
      res.json(result);
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    await Comment.create({
      commenter: req.body.id,
      comment: req.body.comment,
    }).then((result) => {
      console.log(result);
      res.status(201).json(result);
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.patch("/:id", async (req, res, next) => {
  try {
    await Comment.update(
      { comment: req.body.comment },
      { where: { id: req.params.id } }
    ).then((result) => {
      console.log(result);
      res.json(result);
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    await Comment.destroy({ where: { id: req.params.id } }).then((result) => {
      res.json(result);
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;
