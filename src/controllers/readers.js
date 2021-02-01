const { Reader } = require("../models");

const {
  getAllItems,
  createItem,
  updateItem,
  getItemById,
  deleteItem,
} = require('./helpers');

const createReader = (req, res) => createItem(res, 'reader', req.body);

const listReaders = (req, res) => getAllItems(res, 'reader', req.body);

const getReadersById = (req, res) => getItemById(res, 'reader', req.params.id);

const updateReader = (req, res) => updateItem(res, 'reader', req.body, req.params.id);

const deleteReader = (req, res) => deleteItem(res, 'reader', req.params.id);

module.exports = {
  createReader,
  listReaders,
  getReadersById,
  updateReader,
  deleteReader,
};


