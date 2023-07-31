'use strict';
const {
  Model
} = require('sequelize');
const moment = require('moment');
module.exports = (sequelize, DataTypes) => {
  class Subscription extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Subscription.belongsTo(models.User, {
        foreignKey: 'user_id',
        as:'subscription',
        onDelete: 'CASCADE'
      });
      Subscription.belongsTo(models.Plan, {
        foreignKey: 'active_plan',
        targetKey:'active_plan',
        as:'subscribed_plan',
        onDelete: 'CASCADE',
        onUpdate:'CASCADE'
      });
    }
  }
  Subscription.init({
    user_id: {
      type: DataTypes.INTEGER,
      allowNull:false,
    },
   
    subscription_id: {
      type: DataTypes.STRING,
      defaultValue: ''
    },
     
    stripe_customer_id: {
      type: DataTypes.STRING,
      defaultValue: ''
    },
    plan_id: {
      type: DataTypes.STRING,
      defaultValue: ''
    },
    starts_at:{
      type: DataTypes.BIGINT,
      allowNull:false,
    },
    ends_at:{
      type: DataTypes.BIGINT,
      allowNull:false,

    },
    status:{
      type: DataTypes.STRING,
      defaultValue: '',

    },
    plan_type:{
      type: DataTypes.INTEGER,
      allowNull:false,
    },
    card_no:{
      type: DataTypes.STRING,
      defaultValue:'',
    },
    si_id:{
      type: DataTypes.STRING,
      defaultValue:'',
    },
    cancel_at:{
      type: DataTypes.STRING,
      defaultValue:'',
    },
    stripe_price_id:{
      type: DataTypes.STRING,

      defaultValue:'',
    },
    active_plan:{
      type: DataTypes.STRING,
      // indexes:[{unique:true, fields: ['active_plan']}],
      allowNull: false
    },
    current_plan:{
      type: DataTypes.STRING,

      defaultValue:''
    },
    next_plan:{
      type: DataTypes.STRING,

      defaultValue:''
    },
    showPlanChangeText:{
      type: DataTypes.INTEGER,

      defaultValue:0
    },
    latest_invoice:{
      type: DataTypes.STRING,

      defaultValue:''
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
    modelName: 'Subscription',
    timestamps:false,
    hooks : {
      beforeCreate : (record, options) => {
        record.dataValues.createdAt = moment().valueOf();
        record.dataValues.updatedAt = moment().valueOf();
      },
      // beforeUpdate : (record, options) => {
      //   record.dataValues.updatedAt = moment().valueOf();
      // }
    }
  });
  return Subscription;
};
