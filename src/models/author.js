module.exports = (connection, DataTypes) => {
  const schema = {
    name: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        notNull: {
          args: [true],
          msg: "You need to insert a valid author name",
        },
        notEmpty: {
          args: [true],
          msg: "You need to insert a valid author name",
        },
      },
    },
  };

  const AuthorModel = connection.define("Author", schema);
  return AuthorModel;
};
