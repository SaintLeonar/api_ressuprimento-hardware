'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Pagamento_Ressuprimento extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Pagamento_Ressuprimento.belongsTo(models.Pedido_Ressuprimento, {
        foreignKey: 'pedido_ressuprimento_id'
      })
    }
  }
  Pagamento_Ressuprimento.init({
    data_pagamento: DataTypes.DATE,
    data_vencimento: DataTypes.DATE,
    multa: DataTypes.DOUBLE,
    tipo_pagamento_ressuprimento: DataTypes.ENUM('Boleto', 'Transferência Bancária', 'Cartão de Crédito'),
    status_pagamento: DataTypes.ENUM('Aguardando', 'Realizado')
  }, {
    sequelize,
    modelName: 'Pagamento_Ressuprimento',
    freezeTableName: true
  });
  return Pagamento_Ressuprimento;
};