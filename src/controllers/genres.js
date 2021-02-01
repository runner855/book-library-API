const { Genre } = require("../models");

const createGenre = (req, res) => {
  const newGenre = req.body;
  Genre.create(newGenre)
    .then((newGenreCreated) => {
      if (!newGenreCreated) {
        res.status(400).json({ error: "The genre could not be found" });
      } else {
        res.status(201).json(newGenreCreated);
      }
    })
    .catch((error) => {
      const errorArray = error.errors.map((error) => error.message);
      res.status(400).json({ error: errorArray[0] });
    });
};

const allMyGenres = (req, res) => {
  Genre.findAll()
    .then((genres) => {
      res.status(200).json(genres);
    })
    .catch((error) => done(error));
};

const getGenreById = (req, res) => {
  const { id } = req.params;
  Genre.findByPk(id)
    .then((genres) => {
      if (!genres) {
        res.status(404).json({ error: "The genre could not be found" });
      } else {
        res.status(200).json(genres);
      }
    })
    .catch((error) => done(error));
};

const updateMyGenre = (req, res) => {
  const { id } = req.params;
  const genreDetails = req.body;

  Genre.update(genreDetails, { where: { id } }).then(([updatedGenreRecord]) => {
    if (!updatedGenreRecord) {
      res.status(404).json({ error: "The genre could not be found" })
    } else {
      Genre.findByPk(id).then((updatednewGenre) => {
        res.status(200).json(updatednewGenre);
      })
    }
  })
};

const deletedGenre = (req, res) => {
  const { id } = req.params;

  Genre.destroy({ where: { id } })
  .then((foundGenre) => {
    if (!foundGenre) {
      res.status(404).json({ error: "The genre could not be found" });
    } else {
      
      Genre.findByPk(id).then((genre) => {
        res.status(204).json(genre);
      });
    }
  });
};

module.exports = {
  allMyGenres,
  getGenreById,
  createGenre,
  updateMyGenre,
  deletedGenre,
};
