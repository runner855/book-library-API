const { Book, Reader } = require('../models');

const get404Error = (model) => ({ error: `The ${model} could not be found`});

const getModel = (model) => {
    const models = {
        book: Book,
        reader: Reader,
    };

    return models[model];
};

const createItem = (res, model, item) => {
    const Model = getModel(model);

    return Model.create(item).then((allItems) => {
        res.status(201).json(allItems);
    }).catch((error) => {
        const errorArray = error.errors.map((error) => error.message);
        res.status(404).json({ error: errorArray[0] });
    });
};

const getAllItems = (res, model) => {
    const Model = getModel(model);

    return Model.findAll().then((allItems) => {
        res.status(200).json(allItems);
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
                res.status(200).json(updateItem);
            });
        }
    });

};

const getItemById = (res, model, id) => {
    const Model = getModel(model);

    return Model.findByPk(id)
    .catch((error) =>
      res.status(404).json({ error: "The reader could not be found" })
    )
    .then((item) => {
        if(!item) {
            res.status(404).json(get404Error(model));
        } else {
            res.status(200).json(item);
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
};