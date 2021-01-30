const { Author } = require("../models");

const createAuthor = (req, res) => {
  const newAuthor = req.body;
  Author.create(newAuthor)
    .then((newAuthorCreated) => {
      if (!newAuthorCreated) {
        res.status(400).json({ error: "The author could not be found." });
      } else {
        res.status(201).json(newAuthorCreated);
      }
    })
    .catch((error) => {
      const errorArray = error.errors.map((error) => error.message);
      res.status(400).json({ error: errorArray[0] });
    });
};

const allMyAuthors = (req, res) => {
  Author.findAll()
    .then((authors) => {
      res.status(200).json(authors);
    })
    .catch((error) => done(error));
};

const getAuthorById = (req, res) => {
  const { id } = req.params;
  Author.findByPk(id)
    .then((authors) => {
      if (!authors) {
        res.status(404).json({ error: "The author could not be found." });
      } else {
        res.status(200).json(authors);
      }
    })
    .catch((error) => done(error));
};

const updateMyAuthor = (req, res) => {
  const { id } = req.params;
  const authorDetails = req.body;

  Author.update(authorDetails, { where: { id } }).then(([updatedAuthorRecord]) => {
    if (!updatedAuthorRecord) {
      res.status(404).json({ error: "The author could not be found." })
    } else {
      Author.findByPk(id).then((updatednewAuthor) => {
        res.status(200).json(updatednewAuthor);
      })
    }
  })
};

const deletedAuthor = (req, res) => {
  const { id } = req.params;

  Author.destroy({ where: { id } })
  .then((foundAuthor) => {
    if (!foundAuthor) {
      res.status(404).json({ error: "The author could not be found." });
    } else {
      
      Author.findByPk(id).then((author) => {
        res.status(204).json(author);
      });
    }
  });
};

module.exports = {
  allMyAuthors,
  getAuthorById,
  createAuthor,
  updateMyAuthor,
  deletedAuthor,
};
