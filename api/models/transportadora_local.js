'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transportadora_Local extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Transportadora_Local.belongsTo(models.Alfandega_Nacional, {
        foreignKey: 'Alfandega_Nacional_Id'
      })
      
      Transportadora_Local.hasMany(models.Pedido_Ressuprimento, {
        foreignKey: 'transportadora_local_id'
      })
    }
  }
  Transportadora_Local.init({
    cnpj: DataTypes.STRING,
    nome: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Transportadora_Local',
    freezeTableName: true
  });
  return Transportadora_Local;
};