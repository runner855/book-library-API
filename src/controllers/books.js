const { Book } = require("../models");

exports.create = (req, res) => {
  Book.create(req.body)
    .then((book) => {
      if (!book) {
        res.status(400).json({ error: "The book could not be found." });
      } else {
        res.status(201).json(book);
      }
    })
    .catch((error) => {
      const errorArray = error.errors.map((error) => error.message);
      res.status(400).json({ error: errorArray[0] });
    });
};

exports.list = (req, res) => {
  Book.findAll(req.body)
    .then((books) => {
      res.status(200).json(books);
    })
    .catch((error) => done(error));
};

exports.getBookById = (req, res) => {
  const { id } = req.params;
  Book.findByPk(id)
    .then((books) => {
      if (!books) {
        res.status(404).json({ error: "The book could not be found." });
      } else {
        res.status(200).json(books);
      }
    })
    .catch((error) => done(error));
};

exports.update = (req, res) => {
  const { id } = req.params;

  Book.update(req.body, { where: { id } }).then(([updatedBookRecord]) => {
    if (!updatedBookRecord) {
      res.status(404).json({ error: "The book could not be found." })
    } else {
      Book.findByPk(id).then((updatedBookRecord) => {
        res.status(200).json(updatedBookRecord);
      })
    }
  })
};

exports.destroy = (req, res) => {
  const { id } = req.params;

  Book.destroy({ where: { id } })
  .then((deletedrows) => {
    if (!deletedrows) {
      res.status(404).json({ error: "The book could not be found." });
    } else {
      Book.findByPk(id).then((book) => {
        res.status(204).json(book);
      });
    }
  });
};
