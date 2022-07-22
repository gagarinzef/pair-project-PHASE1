'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tag extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Tag.hasMany(models.Meme)
    }
  }
  Tag.init({
    name: {
      type: DataTypes.STRING,
      unique:{
        msg: "Tag already exists"
      },
      allowNull: false,
      validate: {
        notNull: {
          msg: "Name is required"
        },
        notEmpty: {
          msg: "Name is required"
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Tag',
  });
  return Tag;
};