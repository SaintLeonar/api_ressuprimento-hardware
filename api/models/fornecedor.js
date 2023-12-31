'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Fornecedor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Fornecedor.hasMany(models.Pedido_Ressuprimento, {
        foreignKey: 'fornecedor_id'
      })
    }
  }
  Fornecedor.init({
    registro_fornecedor: DataTypes.STRING,
    nome: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Fornecedor',
    freezeTableName: true,
    tableName: 'Fornecedores'
  });
  return Fornecedor;
};