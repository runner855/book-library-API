module.exports = (connection, DataTypes) => {
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
    genre: DataTypes.STRING,
    ISBN: DataTypes.STRING,
  };

  const BookModel = connection.define("Book", schema);
  return BookModel;
};
