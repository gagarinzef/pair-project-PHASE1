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
      
    }

    static countComment(){

      let comment;
      let result = {}
      return MemeDetail.findAll({
        attributes: ['comment', 'MemeId'],
        raw:true
      })
      .then((data)=>{
        comment = data
        comment.forEach(el=>{
          if(result[el.MemeId] === undefined){
            result[el.MemeId] = 0
          }
          result[el.MemeId]++
        })
        return result
      })
      .catch(()=>{
        return 'error'
      })
      // [sequelize.fn('count', sequelize.col('comment')), 'count']
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