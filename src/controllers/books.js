const { Book } = require("../models");

const createBook = (req, res) => {
  const newBook = req.body;
  Book.create(newBook)
    .then((newBookCreated) => {
      if (!newBookCreated) {
        res.status(400).json({ error: "The book could not be found." });
      } else {
        res.status(201).json(newBookCreated);
      }
    })
    .catch((error) => {
      const errorArray = error.errors.map((error) => error.message);
      res.status(400).json({ error: errorArray[0] });
    });
};

const allMyBooks = (req, res) => {
  Book.findAll()
    .then((books) => {
      res.status(200).json(books);
    })
};

const getBookById = (req, res) => {
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

const updateMyBook = (req, res) => {
  const { id } = req.params;
  const bookDetails = req.body;

  Book.update(bookDetails, { where: { id } }).then(([recordsUpdated]) => {
    if (!recordsUpdated) {
      res.status(404).json({ error: "The book could not be found." })
    } else {
      Book.findByPk(id).then((updatednewBook) => {
        res.status(200).json(updatednewBook);
      })
    }
  })
};

const deletedBook = (req, res) => {
  const { id } = req.params;

  Book.destroy({ where: { id } })
  .then((foundBook) => {
    if (!foundBook) {
      res.status(404).json({ error: "The book could not be found." });
    } else {
      Book.findByPk(id).then((book) => {
        res.status(204).json(book);
      });
    }
  });
};

module.exports = {
  allMyBooks,
  getBookById,
  createBook,
  updateMyBook,
  deletedBook,
};
