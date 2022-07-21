'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserProfile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      UserProfile.belongsTo(models.User)
    }
  }
  UserProfile.init({
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "First Name is required"
        },
        notEmpty: {
          msg: "First Name is required"
        }
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Last Name is required"
        },
        notEmpty: {
          msg: "Last Name is required"
        }
      }
    },
    dateOfBirth: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Date of Birth is required"
        },
        notEmpty: {
          msg: "Date of Birth is required"
        }
      }
    },
    bio: DataTypes.TEXT,
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'UserProfile',
    hooks: {
      beforeCreate: function (userProfile) {
        userProfile.bio = `You haven't describe your bio yet`
      }
    }
  });
  return UserProfile;
};