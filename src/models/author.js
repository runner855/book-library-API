module.exports = (sequelize, DataTypes) => {
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

  return sequelize.define("Author", schema);
 
};
