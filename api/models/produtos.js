'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Produtos extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Produtos.belongsTo(models.Depositos, {
        foreignKey: 'deposito_id'
      })
      // hasMany Item_Pedido_Fornecedor
    }
  }
  Produtos.init({
    sku: DataTypes.STRING,
    ean: DataTypes.STRING,
    nome: DataTypes.STRING,
    descricao: DataTypes.STRING,
    tipo_produto: DataTypes.ENUM,
    peso: DataTypes.DOUBLE,
    preco_venda: DataTypes.DOUBLE,
    preco_compra: DataTypes.DOUBLE,
    quantidade: DataTypes.INTEGER,
    estoque_seguranca: DataTypes.INTEGER,
    giro: DataTypes.INTEGER,
    inativo: DataTypes.BOOLEAN,
    sazonal: DataTypes.BOOLEAN,
    reposicao: DataTypes.BOOLEAN,
    excluido: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Produtos',
  });
  return Produtos;
};