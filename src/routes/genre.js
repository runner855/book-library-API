const express = require("express");

const router = express.Router();
const genreController = require("../controllers/genres");

router

  .route("/")

  .post(genreController.createGenre)
  .get(genreController.allMyGenres);

router
  .route("/:id")

  .get(genreController.getGenreById)
  .patch(genreController.updateMyGenre)
  .delete(genreController.deletedGenre);

  module.exports = router;
