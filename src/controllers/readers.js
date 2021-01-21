const { Reader } = require("../models");

exports.create = (req, res) => {
  Reader.create(req.body).then((readers) => {

      res.status(201).json(readers);
    }).catch(error => { 
      const errorArray = error.errors.map( error => error.message)
      res.status(404).json({error: errorArray[0]});
    });
  };
  




exports.list = (req, res) => {
  Reader.findAll().then((readers) => {
   

     res.status(200).json(readers);
    
  });


};

exports.getReaderById = (req, res) => {
  const { id } = req.params;
  Reader.findByPk(id).catch(error => res.status(404).json({ error: "The reader could not be found"}))
  .then((readers) => { 
    
    
    if (!readers) {
      res.status(404).json({ error: "The reader could not be found."})
    } else {
    res.status(200).json(readers);
    }
  })
};




exports.update = (req, res) => {
  const { id } = req.params;
  Reader.update(req.body, { where: { id } }).then((updatedReader) => {
    if (!updatedReader || updatedReader[0] === 0) {
      res.status(404).json({ error: "The reader could not be found." });
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
        res.status(200).json(reader);
      });
    }
  });
};