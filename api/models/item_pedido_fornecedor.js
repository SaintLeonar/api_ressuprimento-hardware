'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Item_Pedido_Fornecedor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Item_Pedido_Fornecedor.belongsTo(models.Produtos, {
        foreignKey: 'produto_id'
      })
      Item_Pedido_Fornecedor.belongsTo(models.Pedido_Ressuprimento, {
        foreignKey: 'pedido_ressuprimento_id'
      })

      Item_Pedido_Fornecedor.hasOne(models.Item_Nota_Fiscal, {
        foreignKey: 'item_pedido_fornecedor_id'
      })
    }
  }
  Item_Pedido_Fornecedor.init({
    quantidade_pedida: DataTypes.INTEGER,
    preco_acordado: DataTypes.DOUBLE
  }, {
    sequelize,
    modelName: 'Item_Pedido_Fornecedor',
  });
  return Item_Pedido_Fornecedor;
};