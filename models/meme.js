'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Meme extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Meme.hasMany(models.Tag)
      Meme.belongsToMany(models.User, {
        through: models.MemeDetail
      })
    }
  }
  Meme.init({
    title: DataTypes.STRING,
    imageURL: DataTypes.STRING,
    TagId: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Meme',
  });
  return Meme;
};