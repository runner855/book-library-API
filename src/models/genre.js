
module.exports = (sequelize, DataTypes) => {
    const schema = {
      genre: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: true,
        validate: {
          notNull: {
            args: [true],
            msg: "We need a genre to be able to create one",
          },
          notEmpty: {
            args: [true],
            msg: "We need a genre to be able to create one",
          },
        },
      },
    };
  
   return sequelize.define("Genre", schema);
  };