const { Book, Reader } = require("../models");

exports.create = (req, res) => {
  Book.create(req.body).then((book) => {
    res.status(201).json(book);
  });
};

exports.list = (req, res) => {
  Book.findAll(req.body).then((book) => {
    res.status(200).json(book);
  });
};

exports.update = (req, res) => {
  const { id } = req.params;
  Book.update(req.body, { where: { id } }).then((updatedBook) => {
    if (!updatedBook) {
      res.status(404).json({ error: "The book could not be found." });
    } else {
      Book.findByPk(id).then((book) => {
        res.status(204).json(book);
      });
    }
  });
};

exports.destroy = (req, res) => {
  const { id } = req.params;

  Book.destroy({ where: { id } }).then((deletedrows) => {
    if (!deletedrows) {
      res.status(404).json({ error: "The book could not be found." });
    } else {
      Book.findByPk(id).then((book) => {
        res.status(204).json(book);
      });
    }
  });
};