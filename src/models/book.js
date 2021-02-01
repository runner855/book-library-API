module.exports = (sequelize, DataTypes) => {
  const schema = {
    title: {
      allowNull: false,

      type: DataTypes.STRING,
      validate: {
        notNull: {
          args: [true],
          msg: "You need to insert the book title",
        },
        notEmpty: {
          args: [true],
          msg: "You need to insert the book title",
        },
      },
    },
    author: {
      allowNull: false,

      type: DataTypes.STRING,
      validate: {
        notNull: {
          args: [true],
          msg: "You need to insert the book author",
        },
        notEmpty: {
          args: [true],
          msg: "You need to insert the book author",
        },
      },
    },
    ISBN: DataTypes.STRING,
  };

  return sequelize.define("Book", schema);
};
