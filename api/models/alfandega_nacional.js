'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Alfandega_Nacional extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Alfandega_Nacional.belongsToMany(models.Transportadora_Internacional, { 
        through: 'Transportadora_Alfandega_Nacional' 
      })

      Alfandega_Nacional.hasMany(models.Transportadora_Local, {
          foreignKey: 'alfandega_nacional_id'
      })
      Alfandega_Nacional.hasMany(models.Pedido_Ressuprimento, {
        foreignKey: 'alfandega_nacional_id'
      })
    }
  }
  Alfandega_Nacional.init({
    nome: DataTypes.STRING,
    endereco: DataTypes.STRING,
    estado: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Alfandega_Nacional',
    freezeTableName: true,
    tableName: 'Alfandega_Nacional'
  });
  return Alfandega_Nacional;
};