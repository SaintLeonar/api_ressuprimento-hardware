'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Item_Nota_Fiscal extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Item_Nota_Fiscal.belongsTo(models.Item_Pedido_Fornecedor, {
        foreignKey: 'item_pedido_fornecedor_id'
      })
      Item_Nota_Fiscal.belongsTo(models.Nota_Fiscal, {
        foreignKey: 'nota_fiscal_id'
      })
    }
  }
  Item_Nota_Fiscal.init({
    quantidade_nf: DataTypes.INTEGER,
    preco_nf: DataTypes.DOUBLE
  }, {
    sequelize,
    modelName: 'Item_Nota_Fiscal',
  });
  return Item_Nota_Fiscal;
};