const { Reader } = require("../models");

exports.create = (req, res) => {
  Reader.create(req.body).then((reader) => {
    res.status(201).json(reader);
  });
};

exports.list = (req, res) => {
  Reader.findAll(req.body).then((reader) => {
    res.status(200).json(reader);
  });
};

exports.getReaderById = (req, res) => {
  const { id } = req.params;
  Reader.findByPk(id).then((reader) => {
    res.status(200).json(reader);
  })
}

exports.update = (req, res) => {
  const { id } = req.params;
  Reader.update(req.body, { where: { id } }).then((updatedReader) => {
    if (!updatedReader) {
      res.status(400).json({ error: "The reader cannot be found. " });
    } else {
      Reader.findByPk(id).then((reader) => {
        res.status(200).json(reader);
      });
    }
  });
};

exports.destroy = (req, res) => {
  const { id } = req.params;
  Reader.destroy({ where: { id } }).then((deletedrows) => {
    if (!deletedrows) {
      res.status(404).json({ error: "The reader could not be found." });
    } else {
      Reader.findByPk(id).then((reader) => {
        res.status(204).json(reader);
      });
    }
  });
};