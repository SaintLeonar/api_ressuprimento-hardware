'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Nota_Fiscal extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Nota_Fiscal.belongsTo(models.Pedido_Ressuprimento, {
        foreignKey: 'pedido_ressuprimento_id'
      })

      Nota_Fiscal.hasMany(models.Item_Nota_Fiscal, {
        foreignKey: 'nota_fiscal_id'
      })
    }
  }
  Nota_Fiscal.init({
    identificador: DataTypes.STRING,
    data_emissao: DataTypes.DATE,
    data_recebimento: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Nota_Fiscal',
    freezeTableName: true,
    tableName: 'Nota_Fiscal'
  });
  return Nota_Fiscal;
};