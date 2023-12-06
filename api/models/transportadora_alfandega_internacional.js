'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transportadora_Alfandega_Internacional extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Transportadora_Alfandega_Internacional.belongsTo(models.Transportadora_Internacional, {
        foreignKey: 'transportadora_internacional_id'
      })
      Transportadora_Alfandega_Internacional.belongsTo(models.Alfandega_Internacional, {
        foreignKey: 'alfandega_internacional_id'
      })
    }
  }
  Transportadora_Alfandega_Internacional.init({}, 
  {
    sequelize,
    modelName: 'Transportadora_Alfandega_Internacional',
    freezeTableName: true,
    tableName: 'Transportadora_Alfandega_Internacional',
    timestamps: false
  });
  return Transportadora_Alfandega_Internacional;
};