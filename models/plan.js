'use strict';
const {
  Model
} = require('sequelize');
const moment = require('moment');
module.exports = (sequelize, DataTypes) => {
  class Plan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      // Plan.hasMany(models.Feature, {
      //   as:'features',
      //   foreignKey: 'plan_id',
      //   onDelete: 'CASCADE'
      // });
      // Plan.hasMany(models.Subscription, {
      //   as:'subscribed_plan',
      //   sourceKey:'active_plan',
      //   foreignKey: 'active_plan', 
      //   onDelete: 'CASCADE',
      //   onUpdate:'CASCADE'
      // });
    }
  }
  Plan.init({
    stripe_price_id: {
      type: DataTypes.STRING,
      // indexes:[{unique:true, fields: ['stripe_price_id']}],
      allowNull: false
    },
    active_plan: {
      type: DataTypes.STRING,
      // indexes:[{unique:true, fields: ['active_plan']}],
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
     
      allowNull: false
    },
    price: {
      type: DataTypes.DOUBLE,

      allowNull: false
    },
    type:{
      type:DataTypes.INTEGER,  
      allowNull:false
    },
    plan_active:{
      type: DataTypes.INTEGER,
      defaultValue:0,
    },

    is_free:{
      type: DataTypes.INTEGER,
      defaultValue:0,
    },
    createdAt: {
      type: DataTypes.BIGINT,

      allowNull: false
    },
    updatedAt: {
      type: DataTypes.BIGINT,
     
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'Plan',
    hooks : {
      beforeCreate : (record, options) => {
        record.dataValues.createdAt = moment().valueOf();
        record.dataValues.updatedAt = moment().valueOf();
      },
      beforeUpdate : (record, options) => {
        record.dataValues.updatedAt = moment().valueOf();
      }
    }
  });
  return Plan;
};
