
module.exports = (sequelize, DataTypes) => {
  const schema = {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: [true],
          msg: "Can't be null",
        },
        notEmpty: {
          args: [true],
          msg: "Cannot be empty"
        }

        
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: [true],
          msg: "This is not a valid email",
        },
        isEmail: {
          args: [true],
          msg: "This is not a valid email",

        }
        
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,

      validate: {
        notNull: {
          args: [true],
          msg: "Can't be null"
        },
        notEmpty: {
          args: [true],
          msg: "Can't be empty"
        },
        set(value) {
          if (value.length < 8) {
            throw new Error("Your password must be at least 8 characters long");
          }
        },
      },
    },
  };

  return sequelize.define("Reader", schema);
  
};
