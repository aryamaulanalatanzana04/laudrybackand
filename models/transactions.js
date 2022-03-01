'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class transactions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.members,{
        foreignKey: "member_id", as: "member"
      })
      this.belongsTo(models.users,{
        foreignKey: "user_id", as: "user"
      })
      this.hasMany(models.transaction_details,{
        foreignKey: "transaction_id", as: "transactionDetail"
      })
    }
  };
  transactions.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    member_id: DataTypes.INTEGER,
    date: DataTypes.DATE,
    due_date: DataTypes.DATE,
    payment_date: DataTypes.DATE,
    status: DataTypes.INTEGER,
    paid: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'transactions',
    tableName: 'transactions'
  });
  return transactions;
};