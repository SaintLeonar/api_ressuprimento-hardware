'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transportadora_Internacional extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Transportadora_Internacional.belongsToMany(models.Alfandega_Internacional, { through: 'Transportadora_Alfandega_Internacional' })
      Transportadora_Internacional.belongsToMany(models.Alfandega_Nacional, { through: 'Transportadora_Alfandega_Nacional' })
      Transportadora_Internacional.belongsTo(models.Pais, { foreignKey: 'Pais_Id' } )
    }
  }
  Transportadora_Internacional.init({
    documento: DataTypes.STRING,
    nome: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Transportadora_Internacional',
  });
  return Transportadora_Internacional;
};