'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transportadora_Alfandega_Nacional extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Transportadora_Alfandega_Nacional.belongsTo(models.Transportadora_Internacional, {
        foreignKey: 'transportadora_internacional_id'
      })
      Transportadora_Alfandega_Nacional.belongsTo(models.Alfandega_Nacional, {
        foreignKey: 'alfandega_nacional_id'
      })
    }
  }
  Transportadora_Alfandega_Nacional.init({}, 
  {
    sequelize,
    modelName: 'Transportadora_Alfandega_Nacional',
    freezeTableName: true,
    tableName: 'Transportadora_Alfandega_Nacional',
    timestamps: false
  });
  return Transportadora_Alfandega_Nacional;
};