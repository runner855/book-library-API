const { Reader } = require("../models");

exports.create = (req, res) => {
    console.log("");
    Reader.create(req.body).then((reader) => res.status(201).json(reader));
};