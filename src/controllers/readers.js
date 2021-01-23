const { Reader } = require("../models");

const {
  getAllItems,
  createItem,
  updateItem,
  getItemById,
  deleteItem,
} = require('./helpers');

const createReader = (req, res) => createItem(res, 'reader', req.body);

const listReaders = (_, res) => getAllItems(res, 'reader');

const readersById = (req, res) => getItemById(res, 'reader', req.params.id);

const updateReader = (req, res) => updateItem(res, 'reader', req.body, req.params.id);

const deleteReader = (req, res) => deleteItem(res, 'reader', req.params.id);

module.exports = {
  createReader,
  listReaders,
  readersById,
  updateReader,
  deleteReader,
};


