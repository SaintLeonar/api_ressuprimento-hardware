'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Deposito extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Deposito.hasMany(models.Produtos, {
        foreignKey: 'deposito_id'
      })
      Deposito.hasMany(models.Pedido_Ressuprimento, {
        foreignKey: 'deposito_id'
      })
    }
  }
  Deposito.init({
    endereco: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Deposito',
    freezeTableName: true,
    tableName: 'Depositos'
  });
  return Deposito;
};