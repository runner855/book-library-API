const { Book, Reader, Genre, Author } = require("../models");

const get404Error = (model) => ({ error: `The ${model} could not be found` });

const getModel = (model) => {
  const models = {
    book: Book,
    reader: Reader,
    author: Author,
    genre: Genre,
  };

  return models[model];
};

const removePassword = (obj) => {
  if (obj.hasOwnProperty("password")) {
    delete obj.password;
  }
  return obj;
};

const createItem = (res, model, item) => {
  const Model = getModel(model);

  return Model.create(item)
    .then((newItemCreated) => {
      const itemsWithoutPassword = removePassword(newItemCreated.dataValues);

      res.status(201).json(itemsWithoutPassword);
    })
    .catch((error) => {
      const errorArray = error.errors.map((error) => error.message);
      res.status(404).json({ error: errorArray[0] });
    });
};

const getAllItems = (res, model) => {
  const Model = getModel(model);

  return Model.findAll().then((allItems) => {
      const itemsWithoutPassword = allItems.map((item) =>
        removePassword(item.dataValues)
      );
      res.status(200).json(itemsWithoutPassword);
    })
    .catch((error) => {
      const errorArray = error.errors.map((error) => error.message);
      res.status(400).json({ error: errorArray[0] });
    });
};

const getAllBooks = (res, model) => {
  const Model = getModel(model);

  return Model.findAll({ include: Book }).then((items) => {
    res.status(200).json(items);
  });
};







const updateItem = (res, model, item, id) => {
  const Model = getModel(model);

  return Model.update(item, { where: { id } }).then((recordsUpdated) => {
    if (!recordsUpdated || recordsUpdated[0] === 0) {
      res.status(404).json(get404Error(model));
    } else {
      getModel(model)
        .findByPk(id)
        .then((updateItem) => {
          const itemsWithoutPassword = removePassword(updateItem.dataValues);
          res.status(200).json(itemsWithoutPassword);
        });
    }
  });
};

const getItemById = (res, model, id) => {
  const Model = getModel(model);

  return Model.findByPk(id, { includes: Genre }).then((item) => {
    if (!item) {
      res.status(404).json(get404Error(model));
    } else {
      const itemsWithoutPassword = removePassword(item.dataValues);

      res.status(200).json(itemsWithoutPassword);
    }
  });
};

const deleteItem = (res, model, id) => {
  const Model = getModel(model);

  return Model.destroy({ where: { id } }).then((foundItem) => {
    if (!foundItem) {
      res.status(404).json(get404Error(model));
    } else {
      Model.findByPk(id).then((item) => {
        res.status(200).json(item);
      });
    }
  });
};

module.exports = {
  get404Error,
  getModel,
  getAllItems,
  createItem,
  updateItem,
  getItemById,
  deleteItem,
  getAllBooks,
  
};
