const express = require("express");

const router = express.Router();
const bookController = require("../controllers/books");

router

  .route("/")

  .post(bookController.createBook)
  .get(bookController.allMyBooks);

router
  .route("/:id")

  .get(bookController.getBookById)
  .patch(bookController.updateMyBook)
  .delete(bookController.deletedBook);

  module.exports = router;
