'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Pedido_Ressuprimento extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Pedido_Ressuprimento.belongsTo(models.Fornecedores, {
        foreignKey: 'fornecedor_id'
      })
      Pedido_Ressuprimento.belongsTo(models.Transportadora_Internacional, {
        foreignKey: 'transportadora_internacional_id'
      })
      Pedido_Ressuprimento.belongsTo(models.Transportadora_Local, {
        foreignKey: 'transportadora_local_id'
      })
      Pedido_Ressuprimento.belongsTo(models.Alfandega_Internacional, {
        foreignKey: 'alfandega_internacional_id'
      })
      Pedido_Ressuprimento.belongsTo(models.Alfandega_Nacional, {
        foreignKey: 'alfandega_nacional_id'
      })
      Pedido_Ressuprimento.belongsTo(models.Depositos, {
        foreignKey: 'deposito_id'
      })
    }
  }
  Pedido_Ressuprimento.init({
    frete_internacional: DataTypes.DOUBLE,
    frete_local: DataTypes.DOUBLE,
    data_pedido: DataTypes.DATE,
    aceito: DataTypes.BOOLEAN,
    data_aceitacao: DataTypes.DATE,
    previsao_chegada: DataTypes.DATE,
    data_despacho: DataTypes.DATE,
    chegada_alfandega_int: DataTypes.DATE,
    liberacao_alfandega_int: DataTypes.DATE,
    chegada_alfandega_nac: DataTypes.DATE,
    liberacao_alfandega_nac: DataTypes.DATE,
    data_chegada: DataTypes.DATE,
    origem_ressuprimento: DataTypes.ENUM,
    status_pedido_ressuprimento: DataTypes.ENUM
  }, {
    sequelize,
    modelName: 'Pedido_Ressuprimento',
  });
  return Pedido_Ressuprimento;
};