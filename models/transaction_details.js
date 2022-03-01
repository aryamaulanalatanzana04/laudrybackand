'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class transaction_details extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.packages,{
        foreignKey: "package_id", as: "package"
      })
    }
  };
  transaction_details.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    package_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    transaction_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    quantity: DataTypes.DOUBLE
  }, {
    sequelize,
    modelName: 'transaction_details',
    tableName: 'transaction_details'
  });
  return transaction_details;
};