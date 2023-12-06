'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Alfandega_Internacional extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Alfandega_Internacional.hasMany(models.Pedido_Ressuprimento, {
        foreignKey: 'alfandega_internacional_id'
      })
      Alfandega_Internacional.hasMany(models.Transportadora_Alfandega_Internacional, {
        foreignKey: 'alfandega_internacional_id'
      })
    }
  }
  Alfandega_Internacional.init({
    nome: DataTypes.STRING,
    endereco: DataTypes.STRING,
    pais: DataTypes.STRING,
    cidade: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Alfandega_Internacional',
    freezeTableName: true,
    tableName: 'Alfandega_Internacional'
  });
  return Alfandega_Internacional;
};