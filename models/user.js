'use strict';
const bcrypt = require('bcryptjs')
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasOne(models.UserProfile)
      User.belongsToMany(models.Meme, {
        through: models.MemeDetail
      })
    }
  }

  User.init({
    userName: {
      type: DataTypes.STRING,
      unique: { msg: 'Username already exists ' },
      allowNull: false,
      validate: {
        notNull: {
          msg: "Username is required"
        },
        notEmpty: {
          msg: "Username is required"
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Password cannot be blank"
        },
        notEmpty: {
          msg: "Password cannot be blank"
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Email is required"
        },
        notEmpty: {
          msg: "Email is required"
        }
      }
    },
    isAdmin: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'User',
    hooks: {
      beforeCreate: function (user) {

        const salt = bcrypt.genSaltSync(8)
        const hash = bcrypt.hashSync(user.password, salt)
        user.password = hash
        user.userName = user.userName.toLowerCase()
        user.email = user.email.toLowerCase()
        user.isAdmin = false
      }

    }
  });
  User.beforeUpdate((user) => {
    const salt = bcrypt.genSaltSync(8)
    const hash = bcrypt.hashSync(user.password, salt)
    user.email = user.email.toLowerCase()
    user.password = hash

  })
  return User;
};