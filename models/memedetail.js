'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MemeDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  MemeDetail.init({
    comment: DataTypes.TEXT,
    UserId: DataTypes.INTEGER,
    MemeId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'MemeDetail',
  });
  return MemeDetail;
};