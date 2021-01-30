const express = require("express");

const router = express.Router();
const authorController = require("../controllers/authors");

router

  .route("/")

  .post(authorController.createAuthor)
  .get(authorController.allMyAuthors);

router
  .route("/:id")

  .get(authorController.getAuthorById)
  .patch(authorController.updateMyAuthor)
  .delete(authorController.deletedAuthor);

  module.exports = router;
